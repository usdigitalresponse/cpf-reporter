import os
from typing import Optional, Tuple

import boto3
import structlog

from aws_lambda_typing.context import Context

from src.lib.email import send_email
from src.lib.logging import reset_contextvars
from src.lib.s3_helper import get_presigned_url
from src.lib.treasury_email_common import SendTreasuryEmailLambdaPayload, handle_email
from src.lib import treasury_email_common
from src.lib.treasury_generation_common import UserObj

treasury_email_text = """
We were not able to generate your treasury report.
We are looking into it.
If you have questions, please contact grants-helpdesk@usdigitalresponse.org.
"""

treasury_email_html = treasury_email_text


@reset_contextvars
def handle(event: SendTreasuryEmailLambdaPayload, context: Context):
    handle_email(event, context, process_event)


def generate_email(
        user: UserObj,
        logger: structlog.stdlib.BoundLogger,
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    body_detail = treasury_email_html
    return treasury_email_common.generate_email(user, logger, body_detail, {})


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
        raise Exception('Failed to generate signed-URL or file not found')

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
