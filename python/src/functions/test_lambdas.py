"""
A collection of functions used for lambda testing
"""
from typing import Any

from aws_lambda_typing.context import Context
from src.lib.logging import get_logger, reset_contextvars


@reset_contextvars
def pre_create_archive(event: dict[str, Any], _context: Context) -> dict[str, Any]:
    """
    Function to replicate the output of the step before the create_archive function
    """
    logger = get_logger()
    logger.info("Received new invocation event from step function")
    logger.info(event)
    return {
        "statusCode": 200,
        "Payload": {
            "organization_id": "test_org_id",
            "reporting_period_id": "test_reporting_period_id",
        }
    }
