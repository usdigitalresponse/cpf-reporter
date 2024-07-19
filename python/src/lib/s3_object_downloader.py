from src.lib.logging import get_logger
from mypy_boto3_s3.client import S3Client
from typing import IO
from urllib.parse import unquote_plus


def download_s3_object(client: S3Client, bucket: str, key: str, destination: IO[bytes]):
    """Downloads an S3 object to a local file.

    Args:
        client: Client facilitating download from S3
        bucket: Name of the S3 bucket containing the file
        key: S3 object key for the file to download
        destination: File-like object (in binary mode) where the S3 object will be written
    """
    logger = get_logger()
    logger.debug("downloading file from s3")

    try:
        client.download_fileobj(bucket, unquote_plus(key), destination)
    except:
        logger.exception("failed to download file from S3")
        raise
