from pydantic import ValidationError

from src.lib.workbook_validator import validate


def handle(event, context):
    """Lambda handler for validating workbooks uploaded to S3

    Args:
        event (dict): S3 Lambda event of type `s3:ObjectCreated:*`
        context (any): Lambda context
    """
    # download the workbook from s3 to /tmp and pass it to the validate() function
    results = validate()
    # save results to s3


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
