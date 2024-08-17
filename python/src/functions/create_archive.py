import os
import tempfile
import json
from typing import Any
import zipfile

import boto3
from aws_lambda_typing.context import Context
from mypy_boto3_s3.client import S3Client
from pydantic import BaseModel, field_validator

from src.lib.logging import get_logger, reset_contextvars

S3_BUCKET = os.environ.get("REPORTING_DATA_BUCKET_NAME", "test_bucket")


class ClientLambdaPayload(BaseModel):
    organization_id: str
    reporting_period_id: str


class CreateArchiveLambdaPayload(BaseModel):
    """
    Model to wrap the validation for the create archive lambda.

    The function is called from a parallel step function, so we expect a list of payloads.
    We want to check that all payloads have the only one organization_id and reporting_period_id
    """
    payloads: list[ClientLambdaPayload]

    @field_validator("payloads")
    @classmethod
    def validate_payloads(cls, payloads: list[ClientLambdaPayload]) -> list[ClientLambdaPayload]:
        if len({p.organization_id for p in payloads}) != 1:
            raise ValueError("All payloads must have the same organization_id")
        if len({p.reporting_period_id for p in payloads}) != 1:
            raise ValueError("All payloads must have the same organization_id")
        return payloads

    @property
    def organization_id(self) -> str:
        return self.payloads[0].organization_id

    @property
    def reporting_period_id(self) -> str:
        return self.payloads[0].reporting_period_id


@reset_contextvars
def handle(event: dict[str, Any], _context: Context):
    """Lambda handler for creating an archive of CSV files in S3

    Args:
        event: Comes from Step Function. Is a list of payloads with organization ids and reporting period ids
        context: Lambda context
    """
    logger = get_logger()
    logger.info("Received new invocation event from step function")
    logger.info(json.dumps(event))
    logger.info("Extracting payload")
    payloads = event["Payload"]

    try:
        payload = CreateArchiveLambdaPayload.model_validate(event)
    except Exception:
        logger.exception("Exception parsing Create Archive event payload")
        return {"statusCode": 400, "body": "Bad Request - payload validation failed"}

    organization_id = payload.organization_id
    reporting_period_id = payload.reporting_period_id

    logger.info(
        f"Creating archive for organization_id: {organization_id}, reporting_period_id: {reporting_period_id}"
    )

    try:
        create_archive(organization_id, reporting_period_id, boto3.client("s3"), logger)
    except Exception:
        logger.exception("Exception creating archive")
        return {"statusCode": 500, "body": "Internal Server Error - unable to create archive"}

    return {
        "statusCode": 200,
        "Payload": {
            "organization_id": organization_id,
            "reporting_period_id": reporting_period_id,
        },
    }


def create_archive(
    org_id: str, reporting_period_id: str, s3_client: S3Client, logger=None
):
    """Create a zip archive of CSV files in S3"""

    if logger is None:
        logger = get_logger()

    target_key = f"treasuryreports/{org_id}/{reporting_period_id}/"
    logger.info(f"Creating archive for {target_key}")
    # find all file names in the target key with the CSV suffix
    paginator = s3_client.get_paginator("list_objects_v2")
    response_iterator = paginator.paginate(Bucket=S3_BUCKET, Prefix=target_key)
    target_files = []
    for response in response_iterator:
        for obj in response.get("Contents", []):
            if obj["Key"].endswith(".csv"):
                file_name = obj["Key"]
                logger.info(f"Found CSV file: {file_name}")
                target_files.append(file_name)
    if not target_files:
        logger.info("No CSV files found in the target key")
        return

    # create a zip file with all the CSV files
    with tempfile.NamedTemporaryFile() as file:
        with zipfile.ZipFile(file, "w") as zipf:
            for target_file in target_files:
                obj = s3_client.get_object(Bucket=S3_BUCKET, Key=target_file)
                zipf.writestr(target_file, obj["Body"].read())

            zipf.close()
            file.flush()
            logger.info(f"Created archive file: {file.name}")
            upload_key = "report.zip"
            # upload the zip file to the target key

            s3_client.upload_file(file.name, S3_BUCKET, upload_key)
            logger.info(f"Uploaded archive file to {upload_key}")
            logger.info(f"Uploaded archive file to {upload_key}")
