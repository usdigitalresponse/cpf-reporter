import zipfile
from typing import BinaryIO

import openpyxl
import pytest
from src.lib.output_template_comparator import CPFFileArchive

_SAMPLE_VALID_XLSM = "tests/data/sample_valid.xlsm"
_SAMPLE_VALID_XLSM_V2024_05_24 = "tests/data/sample_valid_V2024_05_24.xlsm"
_SAMPLE_TEMPLATE = "tests/data/sample_template.xlsx"
_SAMPLE_TEMPLATE_2 = "tests/data/sample_template_2.xlsx"
_SAMPLE_TEMPLATE_1A = "tests/data/treasury/sample_1A_input_pass.xlsm"
_SAMPLE_TEMPLATE_1B = "tests/data/treasury/sample_1B_input_pass.xlsm"
_SAMPLE_TEMPLATE_1C = "tests/data/treasury/sample_1C_input_pass.xlsm"
_SAMPLE_TREASURY_OUTPUT_1A_XLSM = "tests/data/treasury/sample_1A_output.xlsx"
_SAMPLE_TREASURY_OUTPUT_1B_XLSM = "tests/data/treasury/sample_1B_output.xlsx"
_SAMPLE_TREASURY_OUTPUT_1C_XLSM = "tests/data/treasury/sample_1C_output.xlsx"


@pytest.fixture
def valid_file() -> BinaryIO:
    file_path = _SAMPLE_VALID_XLSM_V2024_05_24
    return open(file_path, "rb")


@pytest.fixture
def valid_workbook() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_VALID_XLSM_V2024_05_24)


@pytest.fixture
def valid_workbook_old_schema() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_VALID_XLSM)


@pytest.fixture
def valid_workbook_old_compatible_schema() -> openpyxl.Workbook:
    workbook = openpyxl.load_workbook(_SAMPLE_VALID_XLSM)
    workbook["Logic"]["B1"] = "v:20240401"
    return workbook


@pytest.fixture
def valid_coversheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Cover"]


@pytest.fixture
def valid_project_sheet(valid_workbook) -> openpyxl.worksheet.worksheet.Worksheet:
    return valid_workbook["Project"]


@pytest.fixture
def valid_workbook_1A() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_1A)


@pytest.fixture
def valid_project_sheet_1A() -> openpyxl.worksheet.worksheet.Worksheet:
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_1A)["Project"]


@pytest.fixture
def valid_workbook_1A_with_conflict() -> openpyxl.worksheet.worksheet.Worksheet:
    workbook = openpyxl.load_workbook(_SAMPLE_TEMPLATE_1A)
    valid_project_sheet_1A = workbook["Project"]
    valid_project_sheet_1A["C13"] = "updated project 1a test"
    return workbook


@pytest.fixture
def valid_second_workbook_1A_sheet() -> openpyxl.worksheet.worksheet.Worksheet:
    workbook = openpyxl.load_workbook(_SAMPLE_TEMPLATE_1A)
    valid_project_sheet_1A = workbook["Project"]
    valid_project_sheet_1A["C13"] = "test 2"
    valid_project_sheet_1A["D13"] = "44"
    valid_project_sheet_1A["E13"] = "345634563457"
    valid_project_sheet_1A["F13"] = "345345346"
    return workbook


@pytest.fixture
def valid_workbook_1B() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_1B)


@pytest.fixture
def valid_project_sheet_1B() -> openpyxl.worksheet.worksheet.Worksheet:
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_1B)["Project"]


@pytest.fixture
def valid_workbook_1B_with_conflict() -> openpyxl.worksheet.worksheet.Worksheet:
    workbook = openpyxl.load_workbook(_SAMPLE_TEMPLATE_1B)
    valid_project_sheet_1B = workbook["Project"]
    valid_project_sheet_1B["C13"] = "updated project 1B test"
    return workbook


@pytest.fixture
def valid_second_workbook_1B_sheet() -> openpyxl.worksheet.worksheet.Worksheet:
    workbook = openpyxl.load_workbook(_SAMPLE_TEMPLATE_1B)
    valid_project_sheet_1B = workbook["Project"]
    valid_project_sheet_1B["C13"] = "test 2"
    valid_project_sheet_1B["D13"] = "44"
    valid_project_sheet_1B["E13"] = "345634563457"
    valid_project_sheet_1B["F13"] = "345345346"
    return workbook


@pytest.fixture
def valid_workbook_1C() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_1C)


@pytest.fixture
def valid_project_sheet_1C() -> openpyxl.worksheet.worksheet.Worksheet:
    return openpyxl.load_workbook(_SAMPLE_TEMPLATE_1C)["Project"]


@pytest.fixture
def valid_workbook_1C_with_conflict() -> openpyxl.worksheet.worksheet.Worksheet:
    workbook = openpyxl.load_workbook(_SAMPLE_TEMPLATE_1C)
    valid_project_sheet_1C = workbook["Project"]
    valid_project_sheet_1C["C13"] = "updated project 1c test"
    return workbook


@pytest.fixture
def valid_second_workbook_1C_sheet() -> openpyxl.worksheet.worksheet.Worksheet:
    workbook = openpyxl.load_workbook(_SAMPLE_TEMPLATE_1C)
    valid_project_sheet_1C = workbook["Project"]
    valid_project_sheet_1C["C13"] = "test 2"
    valid_project_sheet_1C["D13"] = "44"
    valid_project_sheet_1C["E13"] = "345634563457"
    valid_project_sheet_1C["F13"] = "345345346"
    return workbook


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
def invalid_cover_sheet_empty_desc(valid_coversheet):
    valid_coversheet["B2"] = "  "
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
def invalid_project_sheet_empty_field(valid_project_sheet):
    valid_project_sheet["D13"] = "    "
    return valid_project_sheet


@pytest.fixture
def invalid_project_sheet_unmatching_subrecipient_tin_field(valid_workbook):
    valid_workbook["Subrecipients"]["E13"] = "123123124"
    return valid_workbook


@pytest.fixture
def invalid_project_sheet_unmatching_subrecipient_uei_field(valid_workbook):
    valid_workbook["Subrecipients"]["F13"] = "123412341235"
    return valid_workbook


@pytest.fixture
def invalid_project_sheet_unmatching_subrecipient_tin_uei_field(valid_workbook):
    valid_workbook["Subrecipients"]["E13"] = "123123124"
    valid_workbook["Subrecipients"]["F13"] = "123412341235"
    return valid_workbook


@pytest.fixture
def invalid_subrecipient_sheet(valid_subrecipientsheet):
    valid_subrecipientsheet["E13"] = "INVALID"
    return valid_subrecipientsheet


@pytest.fixture
def valid_subrecipient_sheet_blank_optional_fields(valid_subrecipientsheet):
    valid_subrecipientsheet["K13"] = None
    valid_subrecipientsheet["M13"] = None
    valid_subrecipientsheet["N13"] = None
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


@pytest.fixture
def output_1A_template() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_TREASURY_OUTPUT_1A_XLSM)


@pytest.fixture
def output_1B_template() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_TREASURY_OUTPUT_1B_XLSM)


@pytest.fixture
def output_1C_template() -> openpyxl.Workbook:
    return openpyxl.load_workbook(_SAMPLE_TREASURY_OUTPUT_1C_XLSM)
