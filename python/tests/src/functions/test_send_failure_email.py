from src.functions import send_failure_email
from src.functions.send_failure_email import (
    handle,
    email_data,
)
from src.lib.logging import get_logger
from src.lib.treasury_email_common import generate_email
from tests.test_utils import set_up_mock_email_environment


def test_generate_email():
    email_html, email_text, subject = generate_email(email_data(None), get_logger())

    assert subject == send_failure_email.EMAIL_SUBJECT

    assert email_text == send_failure_email.EMAIL_TEXT

    assert "We were not able to generate your treasury report." in email_html

    # TODO: What the heck, just test the whole thing to be sure
    # with open("tests/data/treasury_failure_email.html") as the_file:
    #     result_email = the_file.read()
    #     string_compare(result_email, email_html)


def test_email_failure_handler(s3_bucket_and_s3):
    with set_up_mock_email_environment() as (event, environ):
        result = handle(event, None)
        assert result == {"body": "Success", "statusCode": 200}
