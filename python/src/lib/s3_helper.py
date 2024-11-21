import tempfile
from typing import IO, Optional, Union
from urllib.parse import unquote_plus

from botocore.exceptions import ClientError
from mypy_boto3_s3.client import S3Client

from src.lib.logging import get_logger


def download_s3_object(
    client: S3Client, bucket: str, key: str, destination: IO[bytes]
) -> None:
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


def upload_generated_file_to_s3(
    client: S3Client,
    bucket: str,
    key: str,
    file: Union[IO[bytes], "tempfile._TemporaryFileWrapper[str]"],
) -> None:
    """Persists file to S3.

    Args:
        client: Client facilitating upload to S3
        bucket: bucket file should go in
        key: S3 key for file
        file: file to upload
    """
    logger = get_logger()

    logger = logger.bind(upload={"s3": {"bucket": bucket, "key": key}})
    try:
        file.seek(0)
        client.put_object(
            Body=file,
            Bucket=bucket,
            Key=unquote_plus(key),
            ServerSideEncryption="AES256",
        )
    except:
        logger.exception(f"failed to upload file to S3, bucket {bucket} and key {key}")
        raise

    logger.info("successfully uploaded file to s3")


def get_presigned_url(
    s3_client: S3Client,
    bucket: str,
    key: str,
    expiration_time: int = 60 * 60,  #  1 hour
) -> Optional[str]:
    logger = get_logger()
    try:
        # Check file exists
        _resp = s3_client.head_object(
            Bucket=bucket,
            Key=key,
        )
    except ClientError:
        logger.exception(f"Unable to retrieve head object for key: {key}")
        return None

    response = None
    try:
        response = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": bucket,
                "Key": key,
            },
            ExpiresIn=expiration_time,
        )
    except ClientError:
        logger.exception(f"Unable to retrieve presigned URL for key: {key}")

    return response
