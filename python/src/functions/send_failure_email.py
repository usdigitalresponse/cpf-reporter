from typing import Any

from aws_lambda_typing.context import Context

from src.lib import treasury_email_common
from src.lib.treasury_email_common import (
    SendTreasuryEmailLambdaPayload,
    EmailData,
)

EMAIL_SUBJECT = "USDR CPF Treasury Report Failure"
EMAIL_TITLE = "CPF Treasury Report"
EMAIL_TEXT = """
We were not able to generate your treasury report.
We are looking into it.
If you have questions, please contact grants-helpdesk@usdigitalresponse.org.
"""
EMAIL_HTML = EMAIL_TEXT


def handle(event: SendTreasuryEmailLambdaPayload, context: Context) -> dict[str, Any]:
    """Lambda handler for emailing Treasury report failure."""
    return treasury_email_common.handle(event, context, email_data)


def email_data(payload: SendTreasuryEmailLambdaPayload | None) -> EmailData:
    """Generate data for email."""
    return EmailData(
        EMAIL_TITLE,
        EMAIL_SUBJECT,
        EMAIL_HTML,
        EMAIL_TEXT,
    )
