import json
import os
import tempfile
import zipfile

import boto3
from aws_lambda_typing.context import Context
from aws_lambda_typing.events import SQSEvent
from mypy_boto3_s3.client import S3Client
from src.lib.logging import get_logger, reset_contextvars

S3_BUCKET = os.environ.get("S3_BUCKET", "test_bucket")


@reset_contextvars
def handle(event: SQSEvent, _context: Context):
    """Lambda handler for creating an archive of CSV files in S3

    Args:
        event: SQS event containing the org_id and reporting_period_id
        context: Lambda context
    """
    logger = get_logger()
    logger.info("Received new invocation event from SQS")
    logger.info(event)
    logger.info("Extracting payload")
    payload = json.loads(event["Records"][0]["body"])
    logger.info(payload)
    reporting_period_id = payload["reporting_period_id"]
    org_id = payload["org_id"]
    logger.info(
        f"Creating archive for org_id: {org_id}, reporting_period_id: {reporting_period_id}"
    )
    create_archive(org_id, reporting_period_id, boto3.client("s3"), logger)


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
            upload_key = f"{target_key}report.zip"
            # upload the zip file to the target key

            s3_client.upload_file(file.name, S3_BUCKET, upload_key)
            logger.info(f"Uploaded archive file to {upload_key}")
            logger.info(f"Uploaded archive file to {upload_key}")
