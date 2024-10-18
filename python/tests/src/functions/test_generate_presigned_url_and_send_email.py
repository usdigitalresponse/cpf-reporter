from src.functions.generate_presigned_url_and_send_email import generate_email
from src.lib.logging import get_logger


def test_generate_email():
    # user isn't used
    user = None
    logger = get_logger()
    presigned_url = "https://example.com"
    email_html, email_text, subject = generate_email(user, logger, presigned_url)

    assert subject == "USDR CPF Treasury Report"

    assert presigned_url in email_text
    assert email_text == """
Hello,
Your treasury report can be downloaded here: https://example.com.
"""

    assert presigned_url in email_html
    # What the heck, just test the whole thing to be sure
    with open("tests/data/treasury_success_email.html") as the_file:
        result_email = the_file.read()
        assert email_html == result_email
