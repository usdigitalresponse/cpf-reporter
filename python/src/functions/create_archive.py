import os
import tempfile
from typing import Any
import zipfile

import boto3
from aws_lambda_typing.context import Context
from mypy_boto3_s3.client import S3Client
from src.lib.logging import get_logger, reset_contextvars

S3_BUCKET = os.environ.get("S3_BUCKET", "test_bucket")


@reset_contextvars
def handle(event: dict[str, Any], _context: Context):
    """Lambda handler for creating an archive of CSV files in S3

    Args:
        event: Comes from Step Function. Is a list of payloads with organization ids and reporting period ids
        context: Lambda context
    """
    logger = get_logger()
    logger.info("Received new invocation event from step function")
    logger.info(event)
    logger.info("Extracting payload")
    payloads = event["Payload"]

    # all payloads should have the same org_id and reporting_period_ids
    organization_ids = {p["organization_id"] for p in payloads if p["organization_id"]}
    reporting_period_ids = {p["reporting_period_id"] for p in payloads if p["reporting_period_id"]}

    if len(organization_ids) != 1:
        raise ValueError("All payloads must have the same organization_id")
    if len(reporting_period_ids) != 1:
        raise ValueError("All payloads must have the same reporting_period_id")

    organization_id = organization_ids.pop()
    reporting_period_id = reporting_period_ids.pop()
    logger.info(
        f"Creating archive for organization_id: {organization_id}, reporting_period_id: {reporting_period_id}"
    )
    create_archive(organization_id, reporting_period_id, boto3.client("s3"), logger)
    return {
        "statusCode": 200,
        "Payload": {
            "organization_id": organization_id,
            "reporting_period_id": reporting_period_id,
        },
    }


def create_archive(
    org_id: str, reportiong_period_id: str, s3_client: S3Client, logger=None
):
    """Create a zip archive of CSV files in S3"""

    if logger is None:
        logger = get_logger()

    target_key = f"treasuryreports/{org_id}/{reportiong_period_id}/"
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
