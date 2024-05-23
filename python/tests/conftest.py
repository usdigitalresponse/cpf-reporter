import zipfile
from typing import BinaryIO

import openpyxl
import pytest
from src.lib.output_template_comparator import CPFFileArchive

_SAMPLE_VALID_XLSM = "tests/data/sample_valid.xlsm"
_SAMPLE_TEMPLATE = "tests/data/sample_template.xlsx"
_SAMPLE_TEMPLATE_2 = "tests/data/sample_template_2.xlsx"


@pytest.fixture
def valid_file() -> BinaryIO:
    file_path = _SAMPLE_VALID_XLSM
    return open(file_path, "rb")


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
def invalid_cover_sheet_missing_code(valid_coversheet):
    valid_coversheet["A2"] = None
    return valid_coversheet


@pytest.fixture
def invalid_cover_sheet_empty_code(valid_coversheet):
    valid_coversheet["A2"] = "  "
    return valid_coversheet


@pytest.fixture
def invalid_project_sheet(valid_project_sheet):
    valid_project_sheet["D13"] = "X" * 21
    return valid_project_sheet


@pytest.fixture
def invalid_project_sheet_missing_field(valid_project_sheet):
    valid_project_sheet["D13"] = None
    return valid_project_sheet


@pytest.fixture
def invalid_subrecipient_sheet(valid_subrecipientsheet):
    valid_subrecipientsheet["D13"] = "INVALID"
    return valid_subrecipientsheet


@pytest.fixture
def valid_subrecipient_sheet_blank_optional_fields(valid_subrecipientsheet):
    valid_subrecipientsheet["J13"] = None
    valid_subrecipientsheet["L13"] = None
    valid_subrecipientsheet["M13"] = None
    return valid_subrecipientsheet


@pytest.fixture
def sample_template():
    return open(_SAMPLE_TEMPLATE, "rb")


@pytest.fixture
def template_workbook():
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE)


@pytest.fixture
def template_workbook_two():
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_2)


@pytest.fixture
def cpf_file_archive(sample_template):
    cpf_archive_file = zipfile.ZipFile("test.zip", "w")
    cpf_archive_file.writestr("2024-05-19/TestFile.xlsx", sample_template.read())
    return CPFFileArchive(cpf_archive_file)


@pytest.fixture
def cpf_file_archive_two(sample_template):
    cpf_archive_file = zipfile.ZipFile("test.zip", "w")
    cpf_archive_file.writestr("2024-05-19/TestFile.xlsx", sample_template.read())
    cpf_archive_file.writestr("2024-05-19/TestFile2.xlsx", sample_template.read())
    return CPFFileArchive(cpf_archive_file)
