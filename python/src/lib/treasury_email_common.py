from dataclasses import dataclass
from typing import Any, Callable, Tuple, Optional

import chevron
import structlog
from aws_lambda_typing.context import Context
from pydantic import BaseModel

from src.lib.email import send_email
from src.lib.logging import get_logger, reset_contextvars
from src.lib.treasury_generation_common import OrganizationObj, UserObj


class SendTreasuryEmailLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj


@dataclass(frozen=True)
class EmailData:
    title: str
    subject: str
    html: str
    text: str


@reset_contextvars
def handle(
    event: SendTreasuryEmailLambdaPayload,
    context: Context,
    email_data: Callable[[SendTreasuryEmailLambdaPayload], EmailData],
) -> dict[str, Any]:
    """Call process_event on SendTreasureEmailLambdaPayload after some validation.

    event: S3 Lambda event of type `s3:ObjectCreated:*`
    context: Lambda context
    process_event: function that does the work with the payload
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
        process_event(payload, email_data, logger)
    except Exception:
        logger.exception("Exception processing sending treasury report email")
        return {"statusCode": 500, "body": "Internal Server Error"}

    return {"statusCode": 200, "body": "Success"}


def _generate_email_html_given_body(title: str, body_html: str) -> str:
    with open("src/static/email_templates/formatted_body.html") as g:
        email_body = chevron.render(
            g,
            {
                "body_title": "Hello,",
                "body_detail": body_html,
            },
        )
        with open("src/static/email_templates/base.html") as f:
            email_html = chevron.render(
                f,
                {
                    "tool_name": "CPF",
                    "title": title,
                    "preheader": False,
                    "webview_available": False,
                    "base_url_safe": "",
                    "usdr_logo_url": "https://grants.usdigitalresponse.org/usdr_logo_transparent.png",
                    "notifications_url_safe": False,
                },
                partials_dict={
                    "email_body": email_body,
                },
            )
            return email_html


def generate_email(
    data: EmailData,
    logger: structlog.stdlib.BoundLogger,
) -> Tuple[Optional[str], Optional[str], Optional[str]]:
    try:
        email_html = _generate_email_html_given_body(data.title, data.html)
        return email_html, data.text, data.subject
    except Exception as e:
        logger.error(f"Failed to generate treasury email: {e}")
    return None, None, None


def process_event(
    payload: SendTreasuryEmailLambdaPayload,
    email_data: Callable[[SendTreasuryEmailLambdaPayload], EmailData],
    logger: structlog.stdlib.BoundLogger,
):
    """
    This function is structured as followed:
    - Generate data for email
    - Generate an email
    - Send email to the user
    """

    data = email_data(payload)
    email_html, email_text, subject = generate_email(data, logger)
    if not email_html:
        return False

    send_email(
        payload.user.email,
        email_html,
        email_text or "",
        subject or "",
        logger,
    )
    return True
