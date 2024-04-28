from typing import IO, Any, Iterable, List, Optional, Tuple

from openpyxl import Workbook, load_workbook
from openpyxl.worksheet.worksheet import Worksheet
from pydantic import ValidationError
from src.lib.logging import get_logger
from src.schemas.latest.schema import (SCHEMA_BY_PROJECT, BaseModel,
                                       CoverSheetRow, LogicSheetVersion,
                                       SubrecipientRow)

type Errors = List[WorkbookError]

LOGIC_SHEET = "Logic"
COVER_SHEET = "Cover"
PROJECT_SHEET = "Project"
SUBRECIPIENTS_SHEET = "Subrecipients"

_logger = get_logger(__name__)


class WorkbookError:
    message: str
    row: str
    col: str
    tab: str
    field_name: str

    def __init__(self, message: str, row: str, col: str, tab: str, field_name: str):
        self.message = message
        self.row = row
        self.col = col
        self.tab = tab
        self.field_name = field_name


def map_values_to_headers(headers: Tuple, values: Iterable[Any]):
    return dict(zip(headers, values))


def is_empty_row(row_values: Tuple):
    return all(value in (None, "") for value in row_values)


def get_headers(sheet: Worksheet, cell_range: str) -> tuple:
    return tuple(header_cell.value for header_cell in sheet[cell_range][0])


def get_project_use_code(cover_sheet: Worksheet) -> str:
    cover_header = get_headers(cover_sheet, "A1:B1")
    cover_row = map(lambda cell: cell.value, cover_sheet[2])
    row_dict = map_values_to_headers(cover_header, cover_row)
    return row_dict["Project Use Code"]


"""
This function converts a list of ValidationError records for a single row into a list of WorkbookError records. 
Since each row has many different fields-- there can be multiple errors in a single row.
It maps the thrown error to the impacted column in the spreadsheet.
It does so by first getting the error's location (the loc property), which is the field name,
and then grabbing that field off of the relevant model class passed in.
On the model class, the field definition has a property of json_schema_extra,
defined in schema.py on a per-field basis, that contains the column for that particular field.
"""


def get_workbook_errors_for_row(
    SheetModelClass: BaseModel, e: ValidationError, row_num: int, sheet_name: str
) -> List[WorkbookError]:
    workbook_errors: List[WorkbookError] = []
    for error in e.errors():
        """
            Sample structure of the variable `e` here-
            https://docs.pydantic.dev/latest/api/pydantic_core/#pydantic_core.ErrorDetails
            {
            'type': 'string_type',
            'loc': ('Identification_Number__c',),
            'msg': 'Input should be a valid string',
            'input': None,
            'url': 'https://errors.pydantic.dev/2.6/v/string_type'
            }
        """
        erroring_field_name = error["loc"][0]
        erroring_field = SheetModelClass.__fields__[erroring_field_name]
        if erroring_field and erroring_field.json_schema_extra:
            erroring_column = erroring_field.json_schema_extra["column"]
        else:
            erroring_column = "Unknown"
        message = f'Error in field {erroring_field_name}-{error["msg"]}'
        workbook_errors.append(
            WorkbookError(
                message, f"{row_num}", erroring_column, sheet_name, erroring_field_name
            )
        )
    return workbook_errors


def validate(workbook: IO[bytes]) -> Tuple[Errors, Optional[str]]:
    """Validates a given Excel workbook according to CPF validation rules.

    Args:
        workbook: The Excel workbook file to read and validate.
    """

    """TemporaryFile
    1. Load workbook in read-only mode
    See: https://openpyxl.readthedocs.io/en/stable/optimized.html
    If there is any trouble loading files from memory please see here: https://stackoverflow.com/questions/20635778/using-openpyxl-to-read-file-from-memory
    """
    try:
        wb = load_workbook(filename=workbook, read_only=True)
        return validate_workbook(wb)
    except Exception as e:
        _logger.error(f"Unexpected Validation Error: {e}")
        return [
            WorkbookError(
                "Unable to validate workbook. Please reach out to grants-helpdesk@usdigitalresponse.org"
            )
        ]

    finally:
        workbook.close()


def validate_workbook(workbook: Workbook) -> Tuple[Errors, Optional[str]]:
    """Validates a given Excel workbook according to CPF validation rules.

    Args:
        workbook: The Excel workbook to validate.
    """

    """
    1. Validate logic sheet to make sure the sheet has an appropriate version
    """
    errors: Errors = []
    errors += validate_logic_sheet(workbook[LOGIC_SHEET])

    """
    2. Validate cover sheet and project selection. Pick the appropriate validator for the next step.
    """
    cover_errors, project_schema = validate_cover_sheet(workbook[COVER_SHEET])
    errors += cover_errors

    project_use_code = get_project_use_code(workbook[COVER_SHEET])

    """
    3. Ensure all project rows are validated with the schema
    """
    if project_schema:
        errors += validate_project_sheet(workbook[PROJECT_SHEET], project_schema)

    """
    4. Ensure all subrecipient rows are validated with the schema
    """
    errors += validate_subrecipient_sheet(workbook[SUBRECIPIENTS_SHEET])

    return (errors, project_use_code)


# Accepts a workbook from openpyxl
def validate_logic_sheet(logic_sheet: Worksheet) -> Errors:
    errors = []
    try:
        # Cell B1 contains the version
        LogicSheetVersion(**{"version": logic_sheet["B1"].value})
    except ValidationError as e:
        errors.append(
            WorkbookError(
                f"{LOGIC_SHEET} Sheet: Invalid {e}", "1", "B", LOGIC_SHEET, "version"
            )
        )
    return errors


def validate_cover_sheet(
    cover_sheet: Worksheet,
) -> Tuple[Errors, Optional[Any]]:
    errors = []
    project_schema = None
    cover_header = get_headers(cover_sheet, "A1:B1")
    row_num = 2
    cover_row = map(lambda cell: cell.value, cover_sheet[row_num])
    row_dict = map_values_to_headers(cover_header, cover_row)
    try:
        CoverSheetRow(**row_dict)
    except ValidationError as e:
        errors += get_workbook_errors_for_row(CoverSheetRow, e, row_num, COVER_SHEET)
        return (errors, None)

        # This does not need to be a silent failure. This would be a critical error.
    project_schema = SCHEMA_BY_PROJECT[row_dict["Project Use Code"]]
    return (errors, project_schema)


def validate_project_sheet(project_sheet: Worksheet, project_schema) -> Errors:
    errors = []
    project_headers = get_headers(project_sheet, "C3:DS3")
    current_row = 12
    for project_row in project_sheet.iter_rows(
        min_row=13, min_col=3, max_col=123, values_only=True
    ):
        current_row += 1
        if is_empty_row(project_row):
            continue
        row_dict = map_values_to_headers(project_headers, project_row)
        try:
            project_schema(**row_dict)
        except ValidationError as e:
            errors += get_workbook_errors_for_row(
                project_schema, e, current_row, PROJECT_SHEET
            )
    return errors


def validate_subrecipient_sheet(subrecipient_sheet: Worksheet) -> Errors:
    errors = []
    subrecipient_headers = get_headers(subrecipient_sheet, "C3:O3")
    current_row = 12
    for subrecipient_row in subrecipient_sheet.iter_rows(
        min_row=13, min_col=3, max_col=16, values_only=True
    ):
        current_row += 1
        if is_empty_row(subrecipient_row):
            continue
        row_dict = map_values_to_headers(subrecipient_headers, subrecipient_row)
        try:
            SubrecipientRow(**row_dict)
        except ValidationError as e:
            errors += get_workbook_errors_for_row(
                SubrecipientRow, e, current_row, SUBRECIPIENTS_SHEET
            )
    return errors


if __name__ == "__main__":
    """
        Main function to test validate function
        Run with `poetry run python -m src.lib.workbook_validator upload.xlsm`
    """
    import sys

    file_path = sys.argv[1]
    with open(file_path, "rb") as f:
        errors = validate(f)
        if errors:
            print("Errors found:")
            for error in errors:
                print(error)
        else:
            print("No errors found")
