import os
from datetime import datetime
from typing import Any, Optional, Tuple

import boto3
import chevron
import structlog
from aws_lambda_typing.context import Context
from pydantic import BaseModel

from src.lib.email import send_email
from src.lib.logging import get_logger, reset_contextvars
from src.lib.s3_helper import get_last_modified_timestamp, get_presigned_url
from src.lib.treasury_generation_common import OrganizationObj, UserObj

treasury_email_html = """
Your treasury report can be downloaded <a href={url}>here</a>.
This treasury reports includes valid uploads as of {time}.
"""

treasury_email_text = """
Hello,
Your treasury report can be downloaded here: {url}.
This treasury reports includes valid uploads as of {time}.
"""


class SendTreasuryEmailLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj


@reset_contextvars
def handle(event: SendTreasuryEmailLambdaPayload, context: Context) -> dict[str, Any]:
    """Lambda handler for emailing Treasury reports

    Given a user and organization object- send an email to the user that
    contains a pre-signed URL to the following S3 object if it exists:
    treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip
    If the object does not exist then raise an exception.

    Args:
        event: S3 Lambda event of type `s3:ObjectCreated:*`
        context: Lambda context
    """
    structlog.contextvars.bind_contextvars(lambda_event={"step_function": event})
    logger = get_logger()
    logger.info("received new invocation event from step function")

    try:
        payload = SendTreasuryEmailLambdaPayload.model_validate(event)
    except Exception:
        logger.exception("Exception parsing Send Treasury Email event payload")
        return {"statusCode": 400, "body": "Bad Request"}

    try:
        process_event(payload, logger)
    except Exception:
        logger.exception("Exception processing sending treasury report email")
        return {"statusCode": 500, "body": "Internal Server Error"}

    return {"statusCode": 200, "body": "Success"}


def generate_email(
    user: UserObj,
    logger: structlog.stdlib.BoundLogger,
    timestamp: datetime,
    presigned_url: str = "",
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    try:
        with open("src/static/email_templates/formatted_body.html") as g:
            email_body = chevron.render(
                g,
                {
                    "body_title": "Hello,",
                    "body_detail": treasury_email_html.format(
                        url=presigned_url,
                        time=timestamp.strftime("%d/%m/%Y %H:%M:%S"),
                    ),
                },
            )
            with open("src/static/email_templates/base.html") as f:
                email_html = chevron.render(
                    f,
                    {
                        "tool_name": "CPF",
                        "title": "CPF Treasury Report",
                        "preheader": False,
                        "webview_available": False,
                        "base_url_safe": "",
                        "usdr_logo_url": "https://grants.usdigitalresponse.org/usdr_logo_transparent.png",
                        "presigned_url": presigned_url,
                        "notifications_url_safe": False,
                        "email_body": email_body,
                    },
                    partials_dict={
                        "email_body": email_body,
                    },
                )
                email_text = treasury_email_text.format(
                    url=presigned_url,
                    time=timestamp.strftime("%d/%m/%Y %H:%M:%S"),
                )
                subject = "USDR CPF Treasury Report"
                return email_html, email_text, subject
    except Exception as e:
        logger.error(f"Failed to generate treasury email: {e}")
    return None, None, None


def process_event(
    payload: SendTreasuryEmailLambdaPayload,
    logger: structlog.stdlib.BoundLogger,
) -> bool:
    """
    This function is structured as followed:
    1) Check to see if the s3 object exists:
        treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip
    2) If it does not, raise an exception and quit
    3) Generate a pre-signed URL with an expiration date of 1 hour
    4) Get last modified date timestamp of archive
    5) Generate an email
    6) Send email to the user
    """
    s3_client = boto3.client("s3")
    user = payload.user
    organization = payload.organization

    presigned_url = get_presigned_url(
        s3_client=s3_client,
        bucket=os.environ["REPORTING_DATA_BUCKET_NAME"],
        key=f"treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip",
        expiration_time=60 * 60,  # 1 hour
    )
    if presigned_url is None:
        raise Exception("Failed to generate signed-URL or file not found")

    timestamp = get_last_modified_timestamp(
        s3_client=s3_client,
        bucket=os.environ["REPORTING_DATA_BUCKET_NAME"],
        key=f"treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip",
    )

    email_html, email_text, subject = generate_email(
        user=user,
        presigned_url=presigned_url,
        timestamp=timestamp,
        logger=logger,
    )
    if not email_html:
        return False

    send_email(
        dest_email=user.email,
        email_html=email_html,
        email_text=email_text or "",
        subject=subject or "",
        logger=logger,
    )
    return True
