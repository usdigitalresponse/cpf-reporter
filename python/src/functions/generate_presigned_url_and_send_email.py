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

treasury_email_html = """
Your treasury report can be downloaded <a href={url}>here</a>.
"""

treasury_email_text = """
Hello,
Your treasury report can be downloaded here: {url}.
"""


def handle(event: SendTreasuryEmailLambdaPayload, context: Context) -> dict[str, Any]:
    return treasury_email_common.handle(event, context, process_event)


def generate_email(
    user: UserObj,
    logger: structlog.stdlib.BoundLogger,
    presigned_url: str = "",
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    try:
        email_html = generate_email_html_given_body(
            "CPF Treasury Report", treasury_email_html.format(url=presigned_url)
        )
        email_text = treasury_email_text.format(url=presigned_url)
        subject = "USDR CPF Treasury Report"
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

    email_html, email_text, subject = generate_email(
        user=user,
        presigned_url=presigned_url,
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
