import os
from typing import Any

import boto3
from aws_lambda_typing.context import Context

from src.lib import treasury_email_common
from src.lib.s3_helper import get_presigned_url
from src.lib.treasury_email_common import (
    SendTreasuryEmailLambdaPayload,
    EmailData,
)

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
    return treasury_email_common.handle(event, context, email_data)


class PresignedException(Exception):
    """Exception generating presigned URL"""


def email_data(payload: SendTreasuryEmailLambdaPayload) -> EmailData:
    """Generate data for email.

    1) Check to see if the s3 object exists:
    treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip
    2) If it does not, raise an exception and quit
    3) Generate a pre-signed URL with an expiration date of 1 hour
    """
    s3_client = boto3.client("s3")

    # user = payload.user
    organization = payload.organization

    presigned_url = get_presigned_url(
        s3_client=s3_client,
        bucket=os.environ["REPORTING_DATA_BUCKET_NAME"],
        key=f"treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip",
        expiration_time=60 * 60,  # 1 hour
    )
    if presigned_url is None:
        raise PresignedException("Failed to generate signed-URL or file not found")

    return EmailData(
        EMAIL_TITLE,
        EMAIL_SUBJECT,
        EMAIL_HTML.format(url=presigned_url),
        EMAIL_TEXT.format(url=presigned_url),
    )
