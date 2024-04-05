import openpyxl
import pytest

_SAMPLE_VALID_XLSM = "tests/data/sample_valid.xlsm"


@pytest.fixture
def valid_file() -> bytes:
    file_path = _SAMPLE_VALID_XLSM
    with open(file_path, "rb") as f:
        return f.read()


@pytest.fixture
def valid_workbook() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_VALID_XLSM)


@pytest.fixture
def valid_coversheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Cover"]


@pytest.fixture
def valid_project_sheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Project"]


@pytest.fixture
def valid_subrecipientsheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Subrecipients"]


@pytest.fixture
def invalid_cover_sheet(valid_coversheet):
    valid_coversheet["A2"] = "INVALID"
    return valid_coversheet


@pytest.fixture
def invalid_project_sheet(valid_project_sheet):
    valid_project_sheet["D13"] = "X" * 21
    return valid_project_sheet


@pytest.fixture
def invalid_subrecipient_sheet(valid_subrecipientsheet):
    valid_subrecipientsheet["D13"] = "INVALID"
    return valid_subrecipientsheet
