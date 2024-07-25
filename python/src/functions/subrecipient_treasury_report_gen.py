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

    subrecipients_file_key = f"{organization_id}/{reporting_period_id}/subrecipients"

    s3_client: S3Client = boto3.client("s3")

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

    subrecipients_json = ...
    try:
        # Parse recent_subrecipients_file to JSON
        logger.info("Parsing recent subrecipients to JSON")
        recent_subrecipients_file.seek(0)
        subrecipients_json = json.loads(recent_subrecipients_file)
    except ValueError:
        logger.exception("Encountered an error parsing subrecipients file")
        return

    print(subrecipients_json)

    subrecipient_template = generate_subrecipient_template(
        recent_subrecipients_file=recent_subrecipients_file
    )
    print(subrecipient_template)

    # Save subrecipient_template to S3


def generate_subrecipient_template(recent_subrecipients_file: IO[bytes]):
    print(recent_subrecipients_file)
    return None
