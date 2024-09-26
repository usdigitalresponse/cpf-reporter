from decimal import Decimal

from pydantic import Field, PlainSerializer
from typing_extensions import Annotated

CustomDecimal_16Digits = Annotated[
    Decimal, Field(
        max_digits=16,
        decimal_places=2
    ), PlainSerializer(
        lambda x: f"{float(x):.2f}",
        return_type=str,
    ),
]

CustomDecimal_15Digits = Annotated[
    Decimal, Field(
        max_digits=15,
        decimal_places=2
    ), PlainSerializer(
        lambda x: f"{float(x):.2f}",
        return_type=str,
    ),
]

CustomDecimal_13Digits = Annotated[
    Decimal, Field(
        max_digits=13,
        decimal_places=2
    ), PlainSerializer(
        lambda x: f"{float(x):.2f}",
        return_type=str,
    ),
]

CustomDecimal_12Digits = Annotated[
    Decimal, Field(
        max_digits=12,
        decimal_places=2
    ), PlainSerializer(
        lambda x: f"{float(x):.2f}",
        return_type=str,
    ),
]

CustomDecimal_7Digits = Annotated[
    Decimal, Field(
        max_digits=7,
        decimal_places=2
    ), PlainSerializer(
        lambda x: f"{float(x):.2f}",
        return_type=str,
    ),
]
