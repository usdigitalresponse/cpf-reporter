import os
from enum import Enum
from typing import IO

from botocore.exceptions import ClientError
from mypy_boto3_s3.client import S3Client
from pydantic import BaseModel

from src.lib.constants import OUTPUT_TEMPLATE_FILENAME_BY_PROJECT
from src.lib.logging import get_logger
from src.lib.s3_helper import download_s3_object


class PreferencesObj(BaseModel):
    current_reporting_period_id: int


class OrganizationObj(BaseModel):
    id: int
    preferences: PreferencesObj


class UserObj(BaseModel):
    id: int
    email: str


class OutputFileType(Enum):
    XLSX = "xlsx"
    CSV = "csv"
    JSON = "json"


def get_generated_output_file_key(
    file_type: OutputFileType, project: str, organization: OrganizationObj
) -> str:
    return f"treasuryreports/{organization.id}/{organization.preferences.current_reporting_period_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.{file_type.value}"


def get_output_template(
    s3_client: S3Client,
    output_template_id: int,
    project: str,
    destination: IO[bytes],
) -> None:
    """Downloads an empty output template from S3.

    Args:
        output_template_id: ID of the output template to download
        template_name: Name of the output template
        destination: File-like object (in binary mode) where the output template will be written
    """
    logger = get_logger()
    logger.debug("downloading output template from s3")

    try:
        download_s3_object(
            client=s3_client,
            bucket=os.environ["REPORTING_DATA_BUCKET_NAME"],
            key=f"treasuryreports/output-templates/{output_template_id}/{OUTPUT_TEMPLATE_FILENAME_BY_PROJECT[project]}.xlsx",
            destination=destination,
        )
    except ClientError as e:
        error = e.response.get("Error") or {}
        if error.get("Code") == "404":
            logger.exception(
                f"Cannot find any output template with ID: {output_template_id} and project: {project}"
            )
        logger.exception("failed to download output template from S3")
        raise
