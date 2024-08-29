import csv
from tempfile import _TemporaryFileWrapper
from typing import IO, Optional, Union

from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet

"""
Util methods for dealing with the mechanics of parsing workbooks, primarily translating between xlsx and csv
"""


def escape_for_csv(text: Optional[str]):
    if not text:
        return text
    text = text.replace("\n", " -- ")
    text = text.replace("\r", " -- ")
    return text


def convert_xlsx_to_csv(
    csv_file: Union[IO[bytes], _TemporaryFileWrapper],
    file: Union[IO[bytes], Workbook],
    num_rows: int,
):
    """
    Convert xlsx file to csv.
    """
    sheet = file["Baseline"]
    csv_file_handle = csv.writer(csv_file, delimiter=",")

    row_num = 1
    for eachrow in sheet.rows:
        if row_num > num_rows:
            break
        csv_file_handle.writerow([escape_for_csv(cell.value) for cell in eachrow])
        row_num = row_num + 1

    return csv_file


"""
Helper that, given a `worksheet`, will find the last populated row in that sheet.
Takes in a `column` param of the column in which to look for populated rows,
as well as a `start_row` of the row number to start looking for populated cells
"""


def find_last_populated_row(worksheet: Worksheet, start_row: int, column: str):
    last_populated_row = start_row

    for row in range(start_row, worksheet.max_row + 1):
        cell_value = worksheet[f"{column}{row}"].value
        if cell_value is None:
            break
        last_populated_row = row

    return last_populated_row
