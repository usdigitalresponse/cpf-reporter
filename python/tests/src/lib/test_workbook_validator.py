import pytest
from openpyxl.worksheet.worksheet import Worksheet

from src.lib.workbook_validator import (
    SCHEMA_BY_PROJECT,
    is_empty_row,
    validate,
    validate_cover_sheet,
    validate_project_sheet,
    validate_subrecipient_sheet,
)


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


class TestValidateWorkbook:
    def test_valid_full_workbook(self, valid_file: bytes):
        errors = validate(valid_file)
        assert errors == []


class TestValidateCoverSheet:
    def test_valid_cover_sheet(self, valid_coversheet: Worksheet):
        errors, schema = validate_cover_sheet(valid_coversheet)
        assert errors == []
        assert schema == SCHEMA_BY_PROJECT["1A"]

    def test_invalid_cover_sheet(self, invalid_cover_sheet: Worksheet):
        errors, schema = validate_cover_sheet(invalid_cover_sheet)
        assert errors != []
        assert schema is None


class TestValidateproject_sheet:
    def test_valid_project_sheet(self, valid_project_sheet: Worksheet):
        errors = validate_project_sheet(valid_project_sheet, SCHEMA_BY_PROJECT["1A"])
        assert errors == []

    def test_invalid_project_sheet(self, invalid_project_sheet: Worksheet):
        errors = validate_project_sheet(invalid_project_sheet, SCHEMA_BY_PROJECT["1A"])
        assert errors != []


class TestValidateSubrecipientSheet:
    def test_valid_subrecipient_sheet(self, valid_subrecipientsheet: Worksheet):
        errors = validate_subrecipient_sheet(valid_subrecipientsheet)
        assert errors == []

    def test_invalid_subrecipient_sheet(self, invalid_subrecipient_sheet: Worksheet):
        errors = validate_subrecipient_sheet(invalid_subrecipient_sheet)
        assert errors != []
