import os
from unittest.mock import patch

from src.functions.generate_presigned_url_and_send_email import (
    handle,
    EMAIL_SUBJECT,
    EMAIL_TEXT,
    email_data,
)
from src.lib.treasury_email_common import generate_email
from src.lib.logging import get_logger
from tests.test_utils import (
    long_string_compare,
    set_up_mock_email_environment,
)


def test_generate_email():
    presigned_url = "https://example.com"

    with patch(
        "src.functions.generate_presigned_url_and_send_email._get_presigned_url"
    ) as get_presigned:
        get_presigned.side_effect = lambda payload: presigned_url

        email_html, email_text, subject = generate_email(
            email_data(None),
            get_logger(),
        )

    assert subject == EMAIL_SUBJECT

    assert presigned_url in email_text
    assert email_text == EMAIL_TEXT.format(url=presigned_url)

    assert presigned_url in email_html
    # What the heck, just test the whole thing to be sure
    with open("tests/data/treasury_success_email.html") as the_file:
        result_email = the_file.read()
        long_string_compare(result_email, email_html)


def test_email_success_handler(s3_bucket_and_s3):
    s3_bucket, s3 = s3_bucket_and_s3
    with set_up_mock_email_environment() as (event, environ):
        os.environ["REPORTING_DATA_BUCKET_NAME"] = s3_bucket
        key = "treasuryreports/1/0/report.zip"
        s3.put_object(Bucket=s3_bucket, Key=key, Body=b"Zip goes here")

        result = handle(event, None)
        assert result == {"body": "Success", "statusCode": 200}
