import os
from typing import Any, Optional, Tuple

import boto3
import structlog
from aws_lambda_typing.context import Context

from src.lib import treasury_email_common
from src.lib.email import send_email
from src.lib.s3_helper import get_presigned_url
from src.lib.treasury_email_common import (
    SendTreasuryEmailLambdaPayload,
    generate_email_html_given_body,
)
from src.lib.treasury_generation_common import UserObj

EMAIL_SUBJECT = "USDR CPF Treasury Report"
EMAIL_TITLE = "CPF Treasury Report"
EMAIL_HTML = """
Your treasury report can be downloaded <a href={url}>here</a>.
"""
EMAIL_TEXT = """
Hello,
Your treasury report can be downloaded here: {url}.
"""


def handle(event: SendTreasuryEmailLambdaPayload, context: Context) -> dict[str, Any]:
    """Lambda handler for emailing Treasury reports

    Given a user and organization object, send an email to the user that
    contains a pre-signed URL to the following S3 object if it exists:
    treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip
    If the object does not exist then raise an exception.
    """
    return treasury_email_common.handle(event, context, process_event)


def generate_email(
    user: UserObj | None,
    logger: structlog.stdlib.BoundLogger,
    presigned_url: str,
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    try:
        email_html = generate_email_html_given_body(
            EMAIL_TITLE, EMAIL_HTML.format(url=presigned_url)
        )
        return email_html, EMAIL_TEXT.format(url=presigned_url), EMAIL_SUBJECT
    except Exception as e:
        logger.error(f"Failed to generate treasury email: {e}")
    return None, None, None


def process_event(
    payload: SendTreasuryEmailLambdaPayload,
    logger: structlog.stdlib.BoundLogger,
):
    """
    This function is structured as followed:
    1) Check to see if the s3 object exists:
        treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip
    2) If it does not, raise an exception and quit
    3) Generate a pre-signed URL with an expiration date of 1 hour
    4) Generate an email
    5) Send email to the user
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

    email_html, email_text, subject = generate_email(user, logger, presigned_url)
    if not email_html:
        return False

    send_email(
        user.email,
        email_html,
        email_text or "",
        subject or "",
        logger,
    )
    return True
