from src.lib.logging import reset_contextvars, get_logger
from aws_lambda_typing.context import Context
from typing import Any, Dict

@reset_contextvars
def handle(event: Dict[str, Any], context: Context):
    """Lambda handler for generating subrecipients file for treasury report

    Args:
        event: Step function that passes the following parameters:
        {
            organization: <all fields in organization object>,
            user: <id and email fields of the user object>,
        }
        context: Lambda context
    """
    logger = get_logger()
    # TODO take a closer look at the below when implementing function
    if (event is None or context is None):
        logger.exception("Missing event or context")
        return
