
from src.lib.output_template_comparator import CPFFileArchive, compare_workbooks


def test_compare_workbooks_same_values(cpf_file_archive: CPFFileArchive):
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
):
    common_files, new_files, removed_files = compare_workbooks(
        cpf_file_archive_two, cpf_file_archive
    )
    assert len(common_files) == 1
    assert len(new_files) == 1
    assert len(removed_files) == 0
