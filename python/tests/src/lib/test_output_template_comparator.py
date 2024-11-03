from openpyxl import Workbook

from src.lib.output_template_comparator import (
    CPFFileArchive,
    compare_cell_values,
    compare_sheet_columns,
    compare_workbooks,
)


def test_compare_workbooks_same_values(cpf_file_archive: CPFFileArchive) -> None:
    latest_archive = cpf_file_archive
    previous_archive = cpf_file_archive
    common_files, new_files, removed_files = compare_workbooks(
        latest_archive, previous_archive
    )
    assert len(common_files) == 1
    assert len(new_files) == 0
    assert len(removed_files) == 0


def test_compare_workbooks_new_file_values(
    cpf_file_archive: CPFFileArchive, cpf_file_archive_two: CPFFileArchive
) -> None:
    common_files, new_files, removed_files = compare_workbooks(
        cpf_file_archive_two, cpf_file_archive
    )
    assert len(common_files) == 1
    assert len(new_files) == 1
    assert len(removed_files) == 0


def test_compare_sheets_same_values(template_workbook: Workbook) -> None:
    valid_project_sheet = template_workbook["Baseline"]
    added_columns, removed_columns, header_map = compare_sheet_columns(
        valid_project_sheet, valid_project_sheet
    )
    assert len(added_columns) == 0
    assert len(removed_columns) == 0
    assert len(header_map.keys()) == 71


def test_compare_sheets_different_values(
    template_workbook: Workbook, template_workbook_two: Workbook
) -> None:
    valid_project_sheet_1 = template_workbook["Baseline"]
    valid_project_sheet_2 = template_workbook_two["Baseline"]
    added_columns, removed_columns, header_map = compare_sheet_columns(
        valid_project_sheet_1, valid_project_sheet_2
    )
    assert len(added_columns) == 0
    assert len(removed_columns) == 1
    assert len(header_map.keys()) == 70


def test_compare_cells_same_values(
    template_workbook: Workbook, template_workbook_two: Workbook
) -> None:
    valid_project_sheet_1 = template_workbook["Baseline"]
    valid_project_sheet_2 = template_workbook_two["Baseline"]
    _, _, header_map = compare_sheet_columns(
        valid_project_sheet_1, valid_project_sheet_2
    )
    cell_value_differences = compare_cell_values(
        valid_project_sheet_1, valid_project_sheet_2, header_map
    )
    assert len(cell_value_differences) == 4


def test_compare_cells_diff_values(template_workbook: Workbook) -> None:
    valid_project_sheet = template_workbook["Baseline"]
    _, _, header_map = compare_sheet_columns(valid_project_sheet, valid_project_sheet)
    cell_value_differences = compare_cell_values(
        valid_project_sheet, valid_project_sheet, header_map
    )
    assert len(cell_value_differences) == 0
