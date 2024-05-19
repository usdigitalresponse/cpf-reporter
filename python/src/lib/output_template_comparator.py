# Basic structure of output_template_comparator.py

# Returns a list of messages that contain differences between latest set of files and previous set of files.
import re
import zipfile
from typing import List

from openpyxl import load_workbook

HEADER_ROW_INDEX = 4


# TODO - typing
def compare(
    latest_zip_files: zipfile.ZipFile, previous_zip_files: zipfile.ZipFile
) -> List[str]:
    # read the files from the zip files
    # compare the files
    # return the differences
    differences = {
        "new_files": [],
        "removed_files": [],
        "new_sheets": [],
        "removed_sheets": [],
        "row_count_changed": [],
        "column_count_changed": [],
        "column_differences": [],
        "cell_value_changed": [],
    }

    # first find any files that are in the latest set that are not in the previous set
    latest_files = latest_zip_files.namelist()
    previous_files = previous_zip_files.namelist()
    # need to normalize file names without parent directories and any number suffixes
    latest_file_map = {}
    previous_file_map = {}

    suffix_regex = r"\s\(\d+\)"
    for file in latest_files:
        normalized_filename = re.sub(suffix_regex, "", file.split("/")[-1])
        latest_file_map[normalized_filename] = file
    for file in previous_files:
        normalized_filename = re.sub(suffix_regex, "", file.split("/")[-1])
        previous_file_map[normalized_filename] = file

    latest_files = set(latest_file_map.keys())
    previous_files = set(previous_file_map.keys())
    new_files = latest_files - previous_files
    for file in new_files:
        differences["new_files"].append(file)

    removed_files = previous_files - latest_files
    for file in removed_files:
        differences["removed_files"].append(file)

    # finally, compare the files that are in both sets
    common_files = latest_files & previous_files
    for file in common_files:
        latest_file = latest_zip_files.open(latest_file_map[file])
        previous_file = previous_zip_files.open(previous_file_map[file])

        latest_workbook = load_workbook(latest_file)
        previous_workbook = load_workbook(previous_file)

        latest_sheets = latest_workbook.sheetnames
        previous_sheets = previous_workbook.sheetnames

        new_sheets = set(latest_sheets) - set(previous_sheets)
        for sheet in new_sheets:
            differences["new_sheets"].append(f"New sheet in {file}: {sheet}")

        removed_sheets = set(previous_sheets) - set(latest_sheets)
        for sheet in removed_sheets:
            differences["removed_sheets"].append(f"Removed sheet in {file}: {sheet}")

        common_sheets = set(latest_sheets) & set(previous_sheets)
        for sheet in common_sheets:
            latest_sheet = latest_workbook[sheet]
            previous_sheet = previous_workbook[sheet]

            if latest_sheet.max_row != previous_sheet.max_row:
                differences["row_count_changed"].append(
                    f"Row count changed in {file} {sheet}"
                )

            if latest_sheet.max_column != previous_sheet.max_column:
                differences["column_count_changed"].append(
                    f"Column count changed in {file} {sheet} - {latest_sheet.max_column} columns in latest, {previous_sheet.max_column} columns in previous"
                )
            # read the first row as column headers of each sheet
            previous_column_headers = [
                previous_sheet.cell(row=HEADER_ROW_INDEX, column=column).value
                for column in range(1, previous_sheet.max_column + 1)
            ]
            latest_column_headers = [
                latest_sheet.cell(row=HEADER_ROW_INDEX, column=column).value
                for column in range(1, latest_sheet.max_column + 1)
            ]

            added_columns = set(latest_column_headers) - set(previous_column_headers)
            removed_columns = set(previous_column_headers) - set(latest_column_headers)
            if added_columns or removed_columns:
                differences["column_differences"].append(
                    f"added columns: {added_columns or 'None'}, removed columns: {removed_columns or 'None'}"
                )
            columns_in_both = set(latest_column_headers) & set(previous_column_headers)
            # build a dict of key column header, value two-tuple of previous and latest column values
            header_map = {
                header: (
                    previous_column_headers.index(header) + 1,
                    latest_column_headers.index(header) + 1,
                )
                for header in columns_in_both
            }

            for row in range(HEADER_ROW_INDEX, latest_sheet.max_row + 1):
                for header, (previous_column, latest_column) in header_map.items():
                    previous_value = previous_sheet.cell(
                        row=row, column=previous_column
                    ).value
                    latest_value = latest_sheet.cell(
                        row=row, column=latest_column
                    ).value
                    if previous_value != latest_value:
                        differences["cell_value_changed"].append(
                            f"{file} {sheet} - {header}:{row} -- {previous_value} to {latest_value}"
                        )
    return differences


def load_files(zip_path) -> zipfile.ZipFile:
    """
    Load XLSX files from a zip file
    Args:
        zip_path (str): Path to the zip file
    Returns:
        list: List of files in the zip file
    """

    return zipfile.ZipFile(zip_path, "r")


if __name__ == "__main__":
    """
        Main function to test comparator function
        Accepts two arguments. First argument is the "latest" template. Second argument is the previous template.
        Returns a list of changes that are in the latest template that are different from the previous template.

        Run with `poetry run python -m src.lib.output_template_comparator 2024_05_16.zip 2024_04_26.zip`

    """
    import sys

    latest_zip_path = sys.argv[1]
    previous_zip_path = sys.argv[2]

    latest_zip_file = load_files(latest_zip_path)
    previous_zip_file = load_files(previous_zip_path)
    differences = compare(latest_zip_file, previous_zip_file)

    if differences:
        import pprint

        pprint.pprint(differences)
    else:
        print("No differences found")
        print("No differences found")
