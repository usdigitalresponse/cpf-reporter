from typing_extensions import Annotated
from pydantic import BaseModel, Field, StringConstraints, PlainSerializer
from decimal import Decimal


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

CustomInt_GE1 = Annotated[int, Field(ge=1)]
CustomInt_GE0_LELARGE = Annotated[int, Field(ge=0, le=999999999)]
CustomInt_GE0_LELARGE2 = Annotated[int, Field(ge=0, le=9999999999)]
CustomInt_GE0_LELARGE3 = Annotated[int, Field(ge=0, le=99999999999)]
CustomInt_GE0_LELARGE4 = Annotated[int, Field(ge=0, le=999999999999)]

CustomStr_MIN1 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
    ),
]

CustomStr_MIN1_MAX100 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=100,
    ),
]

CustomStr_MIN1_MAX10 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=10,
    ),
]

CustomStr_MIN1_MAX20 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=20,
    ),
]

CustomStr_MIN12_MAX12 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=12,
        max_length=12,
    ),
]

CustomStr_MIN9_MAX9 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=9,
        max_length=9,
    ),
]

CustomStr_MIN1_MAX3000 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=3000,
    ),
]

CustomStr_MIN1_MAX5 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=5,
    ),
]

CustomStr_MIN1_MAX40 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=40,
    ),
]

CustomStr_MIN1_MAX80 = Annotated[
    str,
    StringConstraints(
        strip_whitespace=True,
        min_length=1,
        max_length=80,
    ),
]
