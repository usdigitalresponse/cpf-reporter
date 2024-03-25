import pytest

from src.lib.workbook_validator import is_empty_row


class TestIsEmptyRow:
    @pytest.mark.parametrize(
        ("row_data",),
        [
            ((None for _ in range(9)),),
            (("" for _ in range(10)),),
            ((None if i % 2 == 0 else "" for i in range(11)),),
        ],
    )
    def test_empty_row_data(self, row_data):
        assert is_empty_row(row_data) is True

    @pytest.mark.parametrize(
        ("row_data",),
        [
            (range(10),),
            ((i if i % 2 == 0 else str(i) if i % 3 == 0 else None for i in range(20)),),
        ],
    )
    def test_non_empty_row_data(self, row_data):
        assert is_empty_row(row_data) is False
