from typing import Any, Optional, Tuple

import structlog
from aws_lambda_typing.context import Context

from src.lib import treasury_email_common
from src.lib.email import send_email
from src.lib.treasury_email_common import (
    SendTreasuryEmailLambdaPayload,
    generate_email_html_given_body,
)
from src.lib.treasury_generation_common import UserObj

EMAIL_SUBJECT = "USDR CPF Treasury Report Failure"
EMAIL_TEXT = """
We were not able to generate your treasury report.
We are looking into it.
If you have questions, please contact grants-helpdesk@usdigitalresponse.org.
"""
EMAIL_HTML = EMAIL_TEXT


def handle(event: SendTreasuryEmailLambdaPayload, context: Context) -> dict[str, Any]:
    """Lambda handler for emailing Treasury report failure."""
    return treasury_email_common.handle(event, context, process_event)


def generate_email(
    user: UserObj | None,
    logger: structlog.stdlib.BoundLogger,
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    try:
        email_html = generate_email_html_given_body(
            EMAIL_SUBJECT, EMAIL_HTML
        )
        return email_html, EMAIL_TEXT, EMAIL_SUBJECT
    except Exception as e:
        logger.error(f"Failed to generate treasury failure email: {e}")
    return None, None, None


def process_event(
    payload: SendTreasuryEmailLambdaPayload,
    logger: structlog.stdlib.BoundLogger,
):
    user = payload.user

    email_html, email_text, subject = generate_email(user, logger)
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
