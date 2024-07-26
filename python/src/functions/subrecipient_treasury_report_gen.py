import tempfile
from typing import Any, Dict

import boto3
import structlog
import json
from aws_lambda_typing.context import Context
from mypy_boto3_s3.client import S3Client

from src.lib.logging import reset_contextvars, get_logger
from src.lib.s3_helper import download_s3_object, check_key_exists

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
    user_id = ...

    try:
        reporting_period_id = event["organization"]["preferences"][
            "current_reporting_period_id"
        ]
        organization_id = event["organization"]["id"]
        output_template_id = event["outputTemplateId"]
        user_id = event["user"]["id"]
    except KeyError as e:
        logger.exception(
            f"Exception getting reporting period or organization id from event -- missing field: {e}"
        )
        return

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

    output_file = tempfile.NamedTemporaryFile()
    upload_template_location_minus_filetype = f"/treasuryreports/{organization_id}/{reporting_period_id}/{user_id}/CPFSubrecipientTemplate"
    upload_template_xlsx_key = f"{upload_template_location_minus_filetype}.xlsx"
    # upload_template_csv_key = f"/{upload_template_location_minus_filetype}.csv"
    download_subrecipient_template_to_output_file(
        s3_client, output_file, output_template_id, upload_template_xlsx_key
    )

    subrecipient_template = generate_subrecipient_template(
        recent_subrecipients=recent_subrecipients, output_file=output_file
    )
    # Save subrecipient_template to S3
    print(subrecipient_template)

    output_file.close()
    recent_subrecipients_file.close()


def download_subrecipient_template_to_output_file(
    s3_client, output_file, output_template_id, upload_template_xlsx_key
):
    output_template_key = f"/treasuryreports/output-templates/{output_template_id}/CPFSubrecipientTemplate.xlsx"
    if check_key_exists(
        client=s3_client, bucket=BUCKET_NAME, key=upload_template_xlsx_key
    ):
        download_s3_object(
            s3_client, BUCKET_NAME, upload_template_xlsx_key, output_file
        )
    else:
        download_s3_object(s3_client, BUCKET_NAME, output_template_key, output_file)


def no_subrecipients_in_file(recent_subrecipients):
    return (
        "subrecipients" not in recent_subrecipients
        or not isinstance(recent_subrecipients["subrecipients"], list)
        or len(recent_subrecipients["subrecipients"]) == 0
    )


def generate_subrecipient_template(recent_subrecipients, output_file):
    # Load outputfile with openpyxl
    # Go through recent_subrecipients, cast each one to a SubrecipientRow and add them to the output file
    print(recent_subrecipients, output_file)
    return None
