import os
from typing import IO

from mypy_boto3_s3.client import S3Client
from pydantic import BaseModel

from src.lib.constants import OUTPUT_TEMPLATE_FILENAME_BY_PROJECT
from src.lib.logging import get_logger


class PreferencesObj(BaseModel):
    current_reporting_period_id: int


class OrganizationObj(BaseModel):
    id: int
    preferences: PreferencesObj


class UserObj(BaseModel):
    id: int
    email: str


def get_output_template(
    s3_client: S3Client,
    output_template_id: int,
    project: str,
    destination: IO[bytes],
):
    """Downloads an output template from S3.

    Args:
        output_template_id: ID of the output template to download
        template_name: Name of the output template
        destination: File-like object (in binary mode) where the output template will be written
    """
    logger = get_logger()
    logger.debug("downloading output template from s3")

    try:
        s3_client.download_fileobj(
            bucket=os.environ["REPORTING_DATA_BUCKET_NAME"],
            key=f"treasuryreports/output-templates/{output_template_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.xlsx",
            file=destination,
        )
    except:
        logger.exception("failed to download output template from S3")
        raise
