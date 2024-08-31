import os
import boto3
from botocore.exceptions import ClientError

CHARSET = "UTF-8"


def send_email(dest_email: str, email_html: str, email_text: str, subject: str, logger):
    # Email user
    email_client = boto3.client("ses")

    # Try to send the email.
    try:
        #Provide the contents of the email.
        response = email_client.send_email(
            Destination={
                "ToAddresses": [
                    dest_email,
                ],
            },
            Message={
                "Body": {
                    "Html": {
                        "Charset": CHARSET,
                        "Data": email_html,
                    },
                    "Text": {
                        "Charset": CHARSET,
                        "Data": email_text,
                    },
                },
                "Subject": {
                    "Charset": CHARSET,
                    "Data": subject,
                },
            },
            Source=os.getenv("NOTIFICATIONS_EMAIL"),
        )
    # Display an error if something goes wrong.	
    except ClientError as e:
        logger.info(e.response["Error"]["Message"])
        return False
    else:
        logger.info("Email sent! Message ID:"),
        logger.info(response["MessageId"])
    return True
