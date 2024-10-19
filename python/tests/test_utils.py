import os
from contextlib import contextmanager

import boto3
import pytest
from moto import mock_aws

from src.lib.treasury_email_common import SendTreasuryEmailLambdaPayload
from src.lib.treasury_generation_common import OrganizationObj, PreferencesObj, UserObj


def string_compare(expected: str, actual: str) -> None:
    if expected != actual:
        with open("expected.txt", "w") as expected:
            print(expected, file=expected)
        with open("compared.txt", "w") as compared:
            print(actual, file=compared)
    assert expected == actual


@pytest.fixture
def s3_bucket_and_s3():
    with mock_aws():
        # Set a default region, because some non-test code assumes one
        boto3.setup_default_session(region_name="us-east-1")

        s3 = boto3.client("s3", region_name="us-east-1")
        bucket_name = "test-bucket"
        s3.create_bucket(Bucket=bucket_name)
        yield bucket_name, s3


@contextmanager
def set_up_mock_email_environment():
    """Set up environment variables, call AWS, to make tests work.

    Note: This relies on the test using the s3_bucket_and_s3 fixture!

    Return event (SendTreasuryEmailLambdaPayload), and environ (os.environ).
    """
    event = SendTreasuryEmailLambdaPayload(
        organization=OrganizationObj(
            id=1, preferences=PreferencesObj(current_reporting_period_id=0)
        ),
        user=UserObj(id=0, email="foo@example.com"),
    )

    # Copy environment before changes
    environ = os.environ.copy()

    # Set up email
    client = boto3.client("ses")
    notifs_email = "notifs@example.com"
    client.verify_email_identity(EmailAddress=notifs_email)

    os.environ["NOTIFICATIONS_EMAIL"] = notifs_email

    try:
        yield event, environ
    finally:
        # Restore environment
        os.environ.clear()
        os.environ.update(environ)
