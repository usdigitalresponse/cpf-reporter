from typing import Any, IO, Iterable, List, Optional, Tuple

from openpyxl import load_workbook
from openpyxl.worksheet.worksheet import Worksheet
from pydantic import ValidationError
from src.schemas.latest.schema import (
    SCHEMA_BY_PROJECT,
    CoverSheetRow,
    LogicSheetVersion,
    SubrecipientRow,
)

type Errors = List[str]


def map_values_to_headers(headers: Tuple, values: Iterable[Any]):
    return dict(zip(headers, values))


def is_empty_row(row_values: Tuple):
    return all(value in (None, "") for value in row_values)


def get_headers(sheet: Worksheet, cell_range: str) -> tuple:
    return tuple(header_cell.value for header_cell in sheet[cell_range][0])


def validate(workbook: IO[bytes]) -> Errors:
    """Validates a given Excel workbook according to CPF validation rules.

    Args:
        workbook: The Excel workbook file to read and validate.
    """

    """TemporaryFile
    1. Load workbook in read-only mode
    See: https://openpyxl.readthedocs.io/en/stable/optimized.html
    If there is any trouble loading files from memory please see here: https://stackoverflow.com/questions/20635778/using-openpyxl-to-read-file-from-memory
    """
    wb = load_workbook(filename=workbook, read_only=True)

    """
    2. Validate logic sheet to make sure the sheet has an appropriate version
    """
    errors = validate_logic_sheet(wb["Logic"])
    if len(errors) > 0:
        return errors

    """
    3. Validate cover sheet and project selection. Pick the appropriate validator for the next step.
    """
    errors, project_schema = validate_cover_sheet(wb["Cover"])
    if len(errors) > 0:
        return errors

    """
    4. Ensure all project rows are validated with the schema
    """
    project_errors = validate_project_sheet(wb["Project"], project_schema)

    """
    5. Ensure all subrecipient rows are validated with the schema
    """
    subrecipient_errors = validate_subrecipient_sheet(wb["Subrecipients"])

    # Close the workbook after reading
    wb.close()

    return project_errors + subrecipient_errors


# Accepts a workbook from openpyxl
def validate_logic_sheet(logic_sheet: Worksheet) -> Errors:
    errors = []
    try:
        # Cell B1 contains the version
        LogicSheetVersion(**{"version": logic_sheet["B1"].value})
    except ValidationError as e:
        errors.append(f"Logic Sheet: Invalid {e}")
    return errors


def validate_cover_sheet(
    cover_sheet: Worksheet,
) -> Tuple[Errors, Optional[Any]]:
    errors = []
    project_schema = None
    cover_header = get_headers(cover_sheet, "A1:B1")
    cover_row = map(lambda cell: cell.value, cover_sheet[2])
    row_dict = map_values_to_headers(cover_header, cover_row)
    try:
        CoverSheetRow(**row_dict)
    except ValidationError as e:
        errors.append(f"Cover Sheet: Invalid {e}")
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
            errors.append(f"Project Sheet: Row Num {current_row} Error: {e}")
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
            errors.append(f"Subrecipients Sheet: Row Num {current_row} Error: {e}")

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
