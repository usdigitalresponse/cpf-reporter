from unittest.mock import ANY, MagicMock

import pytest
from pydantic import ValidationError

from src.functions.create_archive import CreateArchiveLambdaPayload, create_archive


def test_create_archive_creates_zip():
    org_id = 1234
    reporting_period_id = 5678
    s3_client = MagicMock()
    logger = MagicMock()

    # Mock the response from S3
    s3_client.get_paginator.return_value.paginate.return_value = [
        {
            "Contents": [
                {"Key": "treasuryreports/1234/5678/file1.csv"},
                {"Key": "treasuryreports/1234/5678/file2.csv"},
            ]
        }
    ]
    s3_client.get_object.return_value = {
        "Body": MagicMock(read=lambda: b"file_content")
    }

    # Call the function
    create_archive(org_id, reporting_period_id, s3_client, logger)

    # Assert that the file was attempted to be created
    s3_client.upload_file.assert_called_with(
        ANY,
        "test_bucket",
        "treasuryreports/1234/5678/report.zip",
        ExtraArgs={"ServerSideEncryption": "AES256"},
    )


def test_create_archive_lambda_payload():
    organizationObj = {
        "organization": {
            "id": 1234,
            "preferences": {"current_reporting_period_id": 5678},
        }
    }
    try:
        CreateArchiveLambdaPayload.model_validate(organizationObj)
    except ValidationError:
        pytest.fail(
            "CreateArchiveLambdaPayload.model_validate raised ValidationError unexpectedly"
        )


def test_create_archive_lambda_payload_failed():
    organizationObj = {
        # "id": "1234", Missing a required field
        "preferences": {"current_reporting_period_id": 5678},
    }
    with pytest.raises(ValidationError):
        CreateArchiveLambdaPayload.model_validate(organizationObj)
