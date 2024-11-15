"""
To build this, zip it using zip scripts/function.zip scripts/sample_lambda.py
"""


def lambda_handler(event, context):
    print(event)
    return {k: f"{v}_sample" for k, v in event["input"].items()}
