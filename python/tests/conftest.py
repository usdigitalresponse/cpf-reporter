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
def valid_projectsheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Project"]


@pytest.fixture
def valid_subrecipientsheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Subrecipients"]
