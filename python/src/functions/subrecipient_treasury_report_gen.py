import tempfile
from typing import IO, Any, Dict

import boto3
import structlog
import json
from aws_lambda_typing.context import Context
from mypy_boto3_s3.client import S3Client

from src.lib.logging import reset_contextvars, get_logger
from src.lib.s3_object_downloader import download_s3_object

BUCKET_NAME = "cpf-reporter"


@reset_contextvars
def handle(event: Dict[str, Any], context: Context):
    """Lambda handler for generating subrecipients file for treasury report

    Args:
        event: Step function that passes the following parameters:
        {
            organization: <all fields in organization object>,
            user: <id and email fields of the user object>,
            outputTemplateId: <id for the output template to use>
        }
        context: Lambda context
    """
    structlog.contextvars.bind_contextvars(
        lambda_event={"subrecipient_step_function": event}
    )
    logger = get_logger()
    logger.info("received new invocation event from step function")
    if not event or not context:
        logger.exception("Missing event or context")
        return

    organization_id = ...
    reporting_period_id = ...
    output_template_id = ...

    try:
        reporting_period_id = event["organization"]["preferences"][
            "current_reporting_period_id"
        ]
        organization_id = event["organization"]["id"]
        output_template_id = event["outputTemplateId"]
    except KeyError as e:
        logger.exception(
            f"Exception getting reporting period or organization id from event -- missing field: {e}"
        )
        return

    # For format, remove when using
    print(output_template_id)

    subrecipients_file_key = f"/{organization_id}/{reporting_period_id}/subrecipients"

    s3_client: S3Client = boto3.client("s3")

    recent_subrecipients = ...
    with tempfile.NamedTemporaryFile() as recent_subrecipients_file:
        with structlog.contextvars.bound_contextvars(
            subrecipients_filename=recent_subrecipients_file.name
        ):
            download_s3_object(
                s3_client,
                BUCKET_NAME,
                subrecipients_file_key,
                recent_subrecipients_file,
            )

    recent_subrecipients_file.seek(0)
    try:
        recent_subrecipients = json.load(recent_subrecipients_file)
    except json.JSONDecodeError:
        logger.exception(
            f"Subrecipients file for organization {organization_id} and reporting period {reporting_period_id} does not contain valid JSON"
        )
        return

    if no_subrecipients_in_file(recent_subrecipients=recent_subrecipients):
        logger.exception(
            f"Subrecipients file for organization {organization_id} and reporting period {reporting_period_id} does not have any subrecipients listed"
        )
        return

    logger.info("The 'subrecipients' list is not empty.")

    subrecipient_template = generate_subrecipient_template(
        recent_subrecipients_file=recent_subrecipients_file
    )
    print(subrecipient_template)

    # Save subrecipient_template to S3


def no_subrecipients_in_file(recent_subrecipients):
    return (
        "subrecipients" not in recent_subrecipients
        or not isinstance(recent_subrecipients["subrecipients"], list)
        or len(recent_subrecipients["subrecipients"]) == 0
    )


def generate_subrecipient_template(recent_subrecipients_file: IO[bytes]):
    print(recent_subrecipients_file)
    return None
