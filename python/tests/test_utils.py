import os
from contextlib import contextmanager

import boto3

from src.lib.treasury_email_common import SendTreasuryEmailLambdaPayload
from src.lib.treasury_generation_common import OrganizationObj, PreferencesObj, UserObj


def long_string_compare(expected: str, actual: str) -> None:
    """If expected != actual, drop expected.txt and actual.txt in the local directory.

    This allows us to use whatever diff tools we like.  I like tkdiff.
    """
    if expected != actual:
        with open("expected.txt", "w") as expected:
            print(expected, file=expected)
        with open("actual.txt", "w") as compared:
            print(actual, file=compared)
    assert expected == actual


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
