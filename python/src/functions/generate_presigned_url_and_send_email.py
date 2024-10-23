import os
from typing import Optional, Tuple

import boto3
import chevron
import structlog
from aws_lambda_typing.context import Context
from pydantic import BaseModel

from src.lib.email import send_email
from src.lib.logging import get_logger, reset_contextvars
from src.lib.s3_helper import get_presigned_url
from src.lib.treasury_generation_common import OrganizationObj, UserObj

treasury_email_html = """
<p><a href={url}><b>Click here</b></a> to download your file<br>Or, paste this link into your browser:<br><b>{url}</b><br><br>This link will remain active for 1 hour.</p>
"""

treasury_email_text = """
Click on this link {url} to download your file or, paste the link into your browser. This link will remain active for 1 hour.
"""

class SendTreasuryEmailLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj


@reset_contextvars
def handle(event: SendTreasuryEmailLambdaPayload, context: Context):
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
        presigned_url: str = "",
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    try:
        with open("src/static/email_templates/formatted_body.html") as g:
            email_body = chevron.render(
                g,
                {
                    "body_title": "Your Treasury report is ready for download",
                    "body_detail": treasury_email_html.format(url=presigned_url),
                },
            )
            with open("src/static/email_templates/base.html") as f:
                email_html = chevron.render(
                    f,
                    {
                        "tool_name": "CPF Reporter Tool",
                        "title": "Your Treasury report is ready for download",
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
                email_text = treasury_email_text.format(url=presigned_url)
                subject = "CPF: Your Treasury report is ready for download"
                return email_html, email_text, subject
    except Exception as e:
        logger.error(f"Failed to generate treasury email: {e}")
    return None, None, None


def process_event(
        payload: SendTreasuryEmailLambdaPayload,
        logger: structlog.stdlib.BoundLogger,
):
    """
    This function is structured as followed:
    1) Create link to treasury report
    2) Generate an email
    3) Send email to the user
    """
    user = payload.user
    organization = payload.organization
    
    presigned_url = f"treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip"

    email_html, email_text, subject = generate_email(
        user = user,
        presigned_url = presigned_url,
        logger = logger,
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
