from typing import BinaryIO

import pytest
from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet

from src.lib.workbook_validator import (
    ErrorLevel,
    get_project_use_code,
    is_empty_row,
    validate,
    validate_cover_sheet,
    validate_logic_sheet,
    validate_project_sheet,
    validate_subrecipient_sheet,
    validate_workbook,
    validate_workbook_sheets,
)
from src.schemas.schema_versions import getSchemaByProject, Version

SAMPLE_EXPENDITURE_CATEGORY_GROUP = "1A"
V2024_05_24_VERSION_STRING = Version.V2024_05_24.value


class TestValidateWorkbookWithOldSchema:
    def test_valid_workbook_old_schema(self, valid_workbook_old_schema: Workbook):
        errors, version_string = validate_logic_sheet(
            valid_workbook_old_schema["Logic"]
        )
        assert len(errors) == 1
        assert "Using outdated version of template." in errors[0].message
    
    def test_valid_workbook_old_compatible_schema(self, valid_workbook_old_compatible_schema: Workbook):
        errors, version_string = validate_logic_sheet(
            valid_workbook_old_compatible_schema["Logic"]
        )
        assert len(errors) == 1
        assert "is older than the latest input template" in errors[0].message
        assert "Using outdated version of template." not in errors[0].message


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
        assert project_use_code == SAMPLE_EXPENDITURE_CATEGORY_GROUP

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
        assert errors[0].severity == ErrorLevel.WARN.name
        assert errors[1].tab == "Project"


class TestWorkbookSheets:
    def test_valid_set_of_sheets(self, valid_workbook: Workbook):
        errors = validate_workbook_sheets(valid_workbook)
        assert errors == []

    def test_missing_sheets(self, valid_workbook: Workbook):
        valid_workbook.remove(valid_workbook["Cover"])
        errors = validate_workbook_sheets(valid_workbook)
        assert errors != []
        assert len(errors) == 1
        assert errors[0].message == "Workbook is missing expected sheet: Cover"
        assert errors[0].tab == "N/A"
        assert errors[0].severity == ErrorLevel.ERR.name


class TestValidateCoverSheet:
    def test_valid_cover_sheet(self, valid_coversheet: Worksheet):
        errors, schema, project_use_code = validate_cover_sheet(
            valid_coversheet, V2024_05_24_VERSION_STRING
        )
        assert errors == []
        assert project_use_code == SAMPLE_EXPENDITURE_CATEGORY_GROUP
        assert schema == getSchemaByProject(
            V2024_05_24_VERSION_STRING, SAMPLE_EXPENDITURE_CATEGORY_GROUP
        )

    def test_invalid_cover_sheet_missing_code(
        self, invalid_cover_sheet_missing_code: Worksheet
    ):
        errors, schema, project_use_code = validate_cover_sheet(
            invalid_cover_sheet_missing_code, V2024_05_24_VERSION_STRING
        )
        assert errors != []
        error = errors[0]
        assert "EC code must be set" in error.message
        assert error.col == "A"
        assert error.row == "2"
        assert error.tab == "Cover"
        assert error.severity == ErrorLevel.ERR.name
        assert schema is None
        assert project_use_code is None

    def test_invalid_cover_sheet_empty_code(
        self, invalid_cover_sheet_empty_code: Worksheet
    ):
        errors, schema, project_use_code = validate_cover_sheet(
            invalid_cover_sheet_empty_code, V2024_05_24_VERSION_STRING
        )
        assert errors != []
        error = errors[0]
        assert "EC code must be set" in error.message
        assert error.col == "A"
        assert error.row == "2"
        assert error.tab == "Cover"
        assert error.severity == ErrorLevel.ERR.name
        assert schema is None
        assert project_use_code is None

    def test_invalid_cover_sheet_empty_desc(
        self, invalid_cover_sheet_empty_desc: Worksheet
    ):
        errors, schema, project_use_code = validate_cover_sheet(
            invalid_cover_sheet_empty_desc, V2024_05_24_VERSION_STRING
        )
        assert errors != []
        error = errors[0]
        assert "Value is required for detailed_expenditure_category" in error.message
        assert error.col == "B"
        assert error.row == "2"
        assert error.tab == "Cover"
        assert error.severity == ErrorLevel.ERR.name
        assert schema is None
        assert project_use_code is None


class TestValidateproject_sheet:
    def test_valid_project_sheet(self, valid_project_sheet: Worksheet):
        errors, projects = validate_project_sheet(
            valid_project_sheet,
            getSchemaByProject(
                V2024_05_24_VERSION_STRING, SAMPLE_EXPENDITURE_CATEGORY_GROUP
            ),
            V2024_05_24_VERSION_STRING,
        )
        assert errors == []
        assert len(projects) == 1
        assert projects[0].row_num == 13
        assert projects[0].Subrecipient_UEI__c == "123412341234"
        assert projects[0].Subrecipient_TIN__c == "123123123"

    def test_invalid_project_sheet(self, invalid_project_sheet: Worksheet):
        errors, _ = validate_project_sheet(
            invalid_project_sheet,
            getSchemaByProject(
                V2024_05_24_VERSION_STRING, SAMPLE_EXPENDITURE_CATEGORY_GROUP
            ),
            V2024_05_24_VERSION_STRING,
        )
        assert errors != []
        error = errors[0]
        assert error.row == "13"
        assert error.col == "D"
        assert (
            "Identification_Number__c should have at most 20 characters"
            in error.message
        )
        assert error.severity == ErrorLevel.ERR.name

    def test_invalid_project_sheet_missing_field(
        self, invalid_project_sheet_missing_field: Worksheet
    ):
        errors, _ = validate_project_sheet(
            invalid_project_sheet_missing_field,
            getSchemaByProject(
                V2024_05_24_VERSION_STRING, SAMPLE_EXPENDITURE_CATEGORY_GROUP
            ),
            V2024_05_24_VERSION_STRING,
        )
        assert errors != []
        error = errors[0]
        assert error.row == "13"
        assert error.col == "D"
        assert "Value is required for Identification_Number__c" in error.message
        assert error.severity == ErrorLevel.ERR.name

    def test_invalid_project_sheet_empty_field(
        self, invalid_project_sheet_empty_field: Worksheet
    ):
        errors, _ = validate_project_sheet(
            invalid_project_sheet_empty_field,
            getSchemaByProject(
                V2024_05_24_VERSION_STRING, SAMPLE_EXPENDITURE_CATEGORY_GROUP
            ),
            V2024_05_24_VERSION_STRING,
        )
        assert errors != []
        error = errors[0]
        assert error.row == "13"
        assert error.col == "D"
        assert "Value is required for Identification_Number__c" in error.message
        assert error.severity == ErrorLevel.ERR.name


class TestValidateSubrecipientSheet:
    def test_valid_subrecipient_sheet(self, valid_subrecipientsheet: Worksheet):
        errors, subrecipients = validate_subrecipient_sheet(
            valid_subrecipientsheet, V2024_05_24_VERSION_STRING
        )
        assert errors == []
        assert len(subrecipients) == 1
        assert subrecipients[0].EIN__c == "123123123"
        assert subrecipients[0].Unique_Entity_Identifier__c == "123412341234"

    def test_invalid_subrecipient_sheet(self, invalid_subrecipient_sheet: Worksheet):
        errors, _ = validate_subrecipient_sheet(
            invalid_subrecipient_sheet, V2024_05_24_VERSION_STRING
        )
        assert errors != []
        error = errors[0]
        assert "EIN__c should have at least 9 characters" in error.message
        assert error.row == "13"
        assert error.col == "E"
        assert error.severity == ErrorLevel.ERR.name

    def test_valid_subrecipient_sheet_blank_optional_fields(
        self, valid_subrecipient_sheet_blank_optional_fields: Worksheet
    ):
        errors, _ = validate_subrecipient_sheet(
            valid_subrecipient_sheet_blank_optional_fields, V2024_05_24_VERSION_STRING
        )
        assert errors == []


class TestValidateMatchingSubrecipientSheet:
    def test_invalid_project_sheet_unmatching_subrecipient_tin_field(
        self, invalid_project_sheet_unmatching_subrecipient_tin_field: Worksheet
    ):
        errors, _ = validate_workbook(
            invalid_project_sheet_unmatching_subrecipient_tin_field
        )
        assert errors != []
        error = errors[0]
        assert "You must submit a subrecipient" in error.message
        assert error.row == 13
        assert error.col == "E, F"
        assert error.severity == ErrorLevel.ERR.name

    def test_invalid_project_sheet_unmatching_subrecipient_uei_field(
        self, invalid_project_sheet_unmatching_subrecipient_uei_field: Worksheet
    ):
        errors, _ = validate_workbook(
            invalid_project_sheet_unmatching_subrecipient_uei_field
        )
        assert errors != []
        error = errors[0]
        assert "You must submit a subrecipient" in error.message
        assert error.row == 13
        assert error.col == "E, F"
        assert error.severity == ErrorLevel.ERR.name

    def test_invalid_project_sheet_unmatching_subrecipient_tin_uei_field(
        self, invalid_project_sheet_unmatching_subrecipient_tin_uei_field: Worksheet
    ):
        errors, _ = validate_workbook(
            invalid_project_sheet_unmatching_subrecipient_tin_uei_field
        )
        assert errors != []
        error = errors[0]
        assert "You must submit a subrecipient" in error.message
        assert error.row == 13
        assert error.col == "E, F"
        assert error.severity == ErrorLevel.ERR.name


class TestGetProjectUseCode:
    def test_get_project_use_code(self, valid_coversheet: Worksheet):
        expenditure_category_group = get_project_use_code(
            valid_coversheet, V2024_05_24_VERSION_STRING
        )
        assert expenditure_category_group == SAMPLE_EXPENDITURE_CATEGORY_GROUP

    def test_get_project_use_code_raises_error(self, invalid_cover_sheet: Worksheet):
        with pytest.raises(ValueError):
            get_project_use_code(invalid_cover_sheet, V2024_05_24_VERSION_STRING)
