from aws_lambda_typing import context as context_, events
from pydantic import ValidationError

from src.lib.workbook_validator import validate


def handle(event: events.S3Event, context: context_):
    """Lambda handler for validating workbooks uploaded to S3

    Args:
        event: S3 Lambda event of type `s3:ObjectCreated:*`
        context: Lambda context
    """
    # Download workbook from s3 to a temporary file
    workbook_path = download_workbook(
        event["Records"][0]["s3"]["bucket"], event["Records"][0]["s3"]["object"]["key"]
    )
    # Validate contents of the downloaded workbook
    results = validate(workbook_path)
    # Save results to s3
    save_validation_results(results)


def download_workbook(bucket: str, key: str) -> str:
    """Downloads an S3 object to a local temporary file.

    Args:
        bucket (str): Name of the S3 bucket containing the workbook
        key (str): S3 object key for the file to download

    Returns:
        str: Local path to the downloaded workbook tempfile
    """
    pass


def save_validation_results(results: list[ValidationError]):
    """Persists workbook validation results to S3.

    Args:
        results (list[ValidationError]): Errors resulting from a workbook validation.
    """
    pass
