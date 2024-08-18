import pytest
from unittest.mock import ANY, MagicMock

from src.functions.create_archive import create_archive, CreateArchiveLambdaPayload


def test_create_archive_creates_zip():
    org_id = "1234"
    reportiong_period_id = "5678"
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
    create_archive(org_id, reportiong_period_id, s3_client, logger)

    # Assert that the file was attempted to be created
    s3_client.upload_file.assert_called_with(
        ANY, "test_bucket", "report.zip"
    )


def test_create_archive_lambda_payload():
    data = [
        {"organization_id": "1234", "reporting_period_id": "5678"},
        {"organization_id": "1234", "reporting_period_id": "5678"},
    ]
    payload = CreateArchiveLambdaPayload.model_validate({"Payload": data})
    assert payload.organization_id == "1234"
    assert payload.reporting_period_id == "5678"


def test_create_archive_lambda_payload_failed():
    data = [
        {"organization_id": "1234", "reporting_period_id": "5678"},
        {"organization_id": "1235", "reporting_period_id": "5678"},
    ]
    with pytest.raises(ValueError):
        CreateArchiveLambdaPayload.model_validate({"Payload": data})
