from aws_lambda_typing import context as context_
from aws_lambda_typing import events

"""
To build this, zip it using zip scripts/function.zip scripts/sample_lambda.py
"""


def lambda_handler(
    event: events.SQSEvent, _context: context_.Context
) -> dict[str, str]:
    print(event)
    return {k: f"{v}_sample" for k, v in event.items()}
