from typing import BinaryIO

import pytest
from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet
from src.lib.workbook_validator import (
    SCHEMA_BY_PROJECT,
    get_project_use_code,
    is_empty_row,
    validate,
    validate_cover_sheet,
    validate_project_sheet,
    validate_subrecipient_sheet,
    validate_workbook,
)

SAMPLE_PROJECT_USE_CODE = "1A"

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
    def test_valid_full_workbook(self, valid_file: BinaryIO):
        result = validate(valid_file)
        errors = result[0]
        project_use_code = result[1]
        assert errors == []
        assert project_use_code == SAMPLE_PROJECT_USE_CODE

    def test_multiple_invalid_sheets(self, valid_workbook: Workbook):
        """
        Tests that an error in the first sheet doesn't prevent
        the second sheet from being validated.

        """
        invalid_cover_sheet = valid_workbook["Logic"]
        invalid_cover_sheet["B1"] = "INVALID"
        invalid_project_sheet = valid_workbook["Project"]
        invalid_project_sheet["D13"] = "X" * 21
        result = validate_workbook(valid_workbook)
        errors = result[0]
        assert errors != []
        assert len(errors) == 2
        assert errors[0].tab == "Logic"
        assert errors[1].tab == "Project"


class TestValidateCoverSheet:
    def test_valid_cover_sheet(self, valid_coversheet: Worksheet):
        errors, schema = validate_cover_sheet(valid_coversheet)
        assert errors == []
        assert schema == SCHEMA_BY_PROJECT[SAMPLE_PROJECT_USE_CODE]

    def test_invalid_cover_sheet(self, invalid_cover_sheet: Worksheet):
        errors, schema = validate_cover_sheet(invalid_cover_sheet)
        assert errors != []
        error = errors[0]
        print(error.message)
        assert "Project use code 'INVALID' is not recognized." in error.message
        assert error.col == "B"
        assert error.row == "2"
        assert error.tab == "Cover"
        assert schema is None


class TestValidateproject_sheet:
    def test_valid_project_sheet(self, valid_project_sheet: Worksheet):
        errors = validate_project_sheet(valid_project_sheet, SCHEMA_BY_PROJECT[SAMPLE_PROJECT_USE_CODE])
        assert errors == []

    def test_invalid_project_sheet(self, invalid_project_sheet: Worksheet):
        errors = validate_project_sheet(invalid_project_sheet, SCHEMA_BY_PROJECT[SAMPLE_PROJECT_USE_CODE])
        assert errors != []
        error = errors[0]
        assert error.row == "13"
        assert error.col == "D"
        assert "Error in field Identification_Number__c-String should have at most 20 characters" in error.message

class TestValidateSubrecipientSheet:
    def test_valid_subrecipient_sheet(self, valid_subrecipientsheet: Worksheet):
        errors = validate_subrecipient_sheet(valid_subrecipientsheet)
        assert errors == []

    def test_invalid_subrecipient_sheet(self, invalid_subrecipient_sheet: Worksheet):
        errors = validate_subrecipient_sheet(invalid_subrecipient_sheet)
        assert errors != []
        error = errors[0]
        assert "String should have at least 9 characters" in error.message
        assert error.row == "13"
        assert error.col == "D"

class TestGetProjectUseCode:
    def test_get_project_use_code(self, valid_coversheet: Worksheet):
        project_use_code = get_project_use_code(valid_coversheet)
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
        assert project_use_code == SAMPLE_PROJECT_USE_CODE
