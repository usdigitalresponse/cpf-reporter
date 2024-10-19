from typing import Any, Callable

import chevron
import structlog
from aws_lambda_typing.context import Context
from pydantic import BaseModel
from structlog import BoundLogger

from src.lib.logging import reset_contextvars, get_logger

from src.lib.treasury_generation_common import OrganizationObj, UserObj


class SendTreasuryEmailLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj


def generate_email_html_given_body(title: str, body_html: str) -> str:
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


@reset_contextvars
def handle(event: SendTreasuryEmailLambdaPayload, context: Context,
           process_event: Callable[[SendTreasuryEmailLambdaPayload, BoundLogger], bool]) -> dict[str, Any]:
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
