import os

import boto3
import pytest
from moto import mock_aws

from src.functions.generate_presigned_url_and_send_email import (
    generate_email,
    handle,
)
from src.lib.logging import get_logger
from src.lib.treasury_email_common import SendTreasuryEmailLambdaPayload
from src.lib.treasury_generation_common import OrganizationObj, PreferencesObj, UserObj


def string_compare(expected: str, actual: str) -> None:
    if expected != actual:
        with open("expected.txt", "w") as expected:
            print(expected, file=expected)
        with open("compared.txt", "w") as compared:
            print(actual, file=compared)
    assert expected == actual


def test_generate_email():
    # user isn't used
    user = None
    logger = get_logger()
    presigned_url = "https://example.com"
    email_html, email_text, subject = generate_email(user, logger, presigned_url)

    assert subject == "USDR CPF Treasury Report"

    assert presigned_url in email_text
    assert (
        email_text
        == """
Hello,
Your treasury report can be downloaded here: https://example.com.
"""
    )

    assert presigned_url in email_html
    # What the heck, just test the whole thing to be sure
    with open("tests/data/treasury_success_email.html") as the_file:
        result_email = the_file.read()
        string_compare(result_email, email_html)


@pytest.fixture
def s3_bucket_and_s3():
    with mock_aws():
        # Set a default region, because some non-test code assumes one
        boto3.setup_default_session(region_name="us-east-1")

        s3 = boto3.client("s3", region_name="us-east-1")
        bucket_name = "test-bucket"
        s3.create_bucket(Bucket=bucket_name)
        yield bucket_name, s3


def test_email_success_handler(s3_bucket_and_s3):
    s3_bucket, s3 = s3_bucket_and_s3
    event = SendTreasuryEmailLambdaPayload(
        organization=OrganizationObj(
            id=1, preferences=PreferencesObj(current_reporting_period_id=0)
        ),
        user=UserObj(id=0, email="foo@example.com"),
    )

    # Set up required environment
    environ = os.environ.copy()
    try:
        # Set up email
        client = boto3.client("ses")
        notifs_email = "notifs@example.com"
        client.verify_email_identity(EmailAddress=notifs_email)

        os.environ.update(
            {
                "REPORTING_DATA_BUCKET_NAME": s3_bucket,
                "NOTIFICATIONS_EMAIL": notifs_email,
            }
        )
        key = "treasuryreports/1/0/report.zip"
        s3.put_object(Bucket=s3_bucket, Key=key, Body=b"Zip goes here")

        # Call handler.
        result = handle(event, None)
    finally:
        os.environ.clear()
        os.environ.update(environ)

    assert result == {"body": "Success", "statusCode": 200}
