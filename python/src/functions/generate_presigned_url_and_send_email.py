import json
import os
import tempfile
from datetime import datetime
from typing import IO, Dict, List, Set, Union

import boto3
import chevron
import html2text
import structlog
from aws_lambda_typing.context import Context
from mypy_boto3_s3.client import S3Client
from openpyxl import Workbook, load_workbook
from openpyxl.worksheet.worksheet import Worksheet
from pydantic import BaseModel

from src.lib.constants import OUTPUT_TEMPLATE_FILENAME_BY_PROJECT
from src.lib.logging import get_logger, reset_contextvars
from src.lib.s3_helper import get_presigned_url
from src.lib.treasury_generation_common import (
    OrganizationObj,
    UserObj,
)
from src.lib.email import send_email


treasury_email_html = """
Hello,

Your treasury report can be downloaded <a href={url}>here</a>.
"""

treasury_email_text = """
Hello,

Your treasury report can be downloaded here: {url}.
"""

class ProjectLambdaPayload(BaseModel):
    organization: OrganizationObj
    user: UserObj


@reset_contextvars
def handle(event: ProjectLambdaPayload, context: Context):
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
        payload = ProjectLambdaPayload.model_validate(event)
    except Exception:
        logger.exception("Exception parsing Project event payload")
        return {"statusCode": 400, "body": "Bad Request"}

    try:
        process_event(payload, logger)
    except Exception:
        logger.exception("Exception processing Subrecipient file generation event")
        return {"statusCode": 500, "body": "Internal Server Error"}

    return {"statusCode": 200, "body": "Success"}


def generate_email(user: UserObj, presigned_url: str = ""):
    h = html2text.HTML2Text()
    h.ignore_links = False


    with open("base.html") as f:
        email_html = chevron.render(f, {
            "tool_name": "CPF",
            "title": "CPF Treasury Report",
            "preheader": False,
            "webview_available": False,
            "base_url_safe": "",
            "usdr_logo_url": 'https://grants.usdigitalresponse.org/usdr_logo_transparent.png',
            "presigned_url": presigned_url,
            "notifications_url_safe": False,
            "email_body": treasury_email_html.format(
                url = presigned_url
            ),
        })
        email_text = treasury_email_text.format(url=presigned_url)
        subject = "USDR CPF Treasury Report"
        return email_html, email_text, subject
    
    return None, None, None


def process_event(payload: ProjectLambdaPayload, logger):
    """
    This function is structured as followed:
    1) Check to see if the s3 object exists:
        treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip
    2) If it does not, raise an exception and quit
    3) Generate a pre-signed URL (what's the expiration date?)
    4) Generate an email
    5) Send email to the user
    """
    s3_client: S3Client = boto3.client("s3")
    user = payload.user
    organization = payload.organization
    
    presigned_url = get_presigned_url(
        s3_client = s3_client,
        bucket = os.getenv("REPORTING_DATA_BUCKET_NAME"),
        key = f"treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/report.zip",
    )
    if presigned_url is None:
        raise
    
    email_html, email_text, subject = generate_email(presigned_url)

    send_email(
        dest_email = user.email,
        email_html = email_html,
        email_text = email_text,
        subject = subject,
        logger = logger,
    )
    return True
