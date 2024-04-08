import functools
import logging
import sys

import structlog

shared_processors = [
    structlog.contextvars.merge_contextvars,
    structlog.processors.add_log_level,
    structlog.processors.TimeStamper(fmt="iso", key="ts"),
    structlog.processors.CallsiteParameterAdder(
        parameters=[
            structlog.processors.CallsiteParameter.FUNC_NAME,
            structlog.processors.CallsiteParameter.PATHNAME,
            structlog.processors.CallsiteParameter.LINENO,
        ]
    ),
]

processors = shared_processors + []
if sys.stderr.isatty():
    processors += [
        structlog.dev.ConsoleRenderer(),
    ]
else:
    processors += [
        structlog.processors.dict_tracebacks,
        structlog.processors.EventRenamer("msg"),
        structlog.processors.JSONRenderer(),
    ]

structlog.configure(
    processors=processors,
    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),
    cache_logger_on_first_use=True,
)


def get_logger(*args, **kwargs) -> structlog.stdlib.BoundLogger:
    return structlog.get_logger(*args, **kwargs)


def reset_contextvars(func):
    """Decorator that resets context-local log values prior to each call to the
    decorated function.

    This should be used to decorate Lambda handlers in order to ensure that subsequent
    non-cold-start invocations always start with a clean slate of context-locals.
    Effectively, it prevents values set in `structlog.contextvars.bind_contextvars()`
    from persisting across multiple invocations.
    """

    @functools.wraps(func)
    def inner(*args, **kwargs):
        structlog.contextvars.unbind_contextvars()
        return func(*args, **kwargs)

    return inner
