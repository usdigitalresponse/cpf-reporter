import json
import tempfile

import boto3
import structlog
from aws_lambda_typing.context import Context
from aws_lambda_typing.events import S3Event
from mypy_boto3_s3.client import S3Client

from src.lib.logging import get_logger, reset_contextvars
from src.lib.workbook_validator import validate, BinaryTempFile


@reset_contextvars
def handle(event: S3Event, context: Context):
    """Lambda handler for validating workbooks uploaded to S3

    Args:
        event: S3 Lambda event of type `s3:ObjectCreated:*`
        context: Lambda context
    """
    structlog.contextvars.bind_contextvars(
        lambda_event={"s3": event["Records"][0]["s3"]}
    )
    logger = get_logger()
    logger.info("received new invocation event from S3")

    s3_client: S3Client = boto3.client("s3")
    with tempfile.NamedTemporaryFile() as file:
        with structlog.contextvars.bound_contextvars(workbook_filename=file.name):
            download_workbook(
                s3_client,
                event["Records"][0]["s3"]["bucket"]["name"],
                event["Records"][0]["s3"]["object"]["key"],
                file,
            )
            results = validate_workbook(file)

    # Save results to s3
    save_validation_results(
        s3_client,
        event["Records"][0]["s3"]["bucket"]["name"],
        f"{event["Records"][0]["s3"]["object"]["key"]}.json",
        results,
    )


def download_workbook(client: S3Client, bucket: str, key: str, destination: BinaryTempFile):
    """Downloads an S3 object to a local file.

    Args:
        client: Client facilitating download from S3
        bucket: Name of the S3 bucket containing the workbook
        key: S3 object key for the file to download
        destination: File-like object where the S3 object will be written
    """
    logger = get_logger()
    logger.debug("downloading workbook from s3")

    try:
        client.download_fileobj(bucket, key, destination)
    except:
        logger.exception("failed to download workbook from S3")
        raise


def validate_workbook(file: BinaryTempFile) -> list[str]:
    """Wrapper for workbook validation with logging.

    Args:
        file: The Excel workbook file to validate

    Returns:
        Validation results, as a list of problems detected during workbook validation
    """
    logger = get_logger()
    logger.debug("validating workbook")

    try:
        results = validate(file)
    except:
        logger.exception("unhandled exception validating workbook")
        raise

    logger.debug(
        "successfully validated workbook", count_validation_errors=len(results)
    )
    return results


def save_validation_results(client: S3Client, bucket, key: str, results: list[str]):
    """Persists workbook validation results to S3.

    Args:
        client: Client facilitating upload to S3
        results: Errors resulting from workbook validation.
    """
    logger = get_logger()

    try:
        serialized = json.dumps(results)
    except:
        logger.exception("error serializing validation results to JSON")
        raise

    encoding = "utf-8"
    try:
        data = serialized.encode(encoding)
    except:
        logger.exception(
            "error encoding JSON to binary data for upload", encoding=encoding
        )
        raise

    logger = logger.bind(
        upload={"s3": {"bucket": bucket, "key": key}, "size": len(data)}
    )
    try:
        client.put_object(
            Bucket=bucket,
            Key=key,
            Body=data,
            ContentEncoding=encoding,
            ServerSideEncryption="AES256",
        )
    except:
        logger.exception("failed to upload JSON results to S3")
        raise

    logger.info("successfully uploaded JSON results to s3")
