import os

import boto3

from src.functions import send_failure_email
from src.functions.send_failure_email import (
    generate_email,
    handle,
)
from src.lib.logging import get_logger
from src.lib.treasury_email_common import SendTreasuryEmailLambdaPayload
from src.lib.treasury_generation_common import OrganizationObj, PreferencesObj, UserObj
from tests.test_utils import string_compare, s3_bucket_and_s3


def test_generate_email():
    # user isn't used
    user = None
    logger = get_logger()
    email_html, email_text, subject = generate_email(user, logger)

    assert subject == send_failure_email.EMAIL_SUBJECT

    assert (
        email_text == send_failure_email.EMAIL_TEXT
    )

    assert "We were not able to generate your treasury report." in email_html

    # TODO: What the heck, just test the whole thing to be sure
    # with open("tests/data/treasury_failure_email.html") as the_file:
    #     result_email = the_file.read()
    #     string_compare(result_email, email_html)


def test_email_failure_handler(s3_bucket_and_s3):
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
                "NOTIFICATIONS_EMAIL": notifs_email,
            }
        )

        # Call handler.
        result = handle(event, None)
    finally:
        os.environ.clear()
        os.environ.update(environ)

    assert result == {"body": "Success", "statusCode": 200}
