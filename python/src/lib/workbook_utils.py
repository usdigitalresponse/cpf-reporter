from typing import Optional
import csv
from typing import IO

"""
Util methods for dealing with the mechanics of parsing workbooks, primarily translating between xlsx and csv
"""


def escape_for_csv(text: Optional[str]):
    if not text:
        return text
    text = text.replace("\n", " -- ")
    text = text.replace("\r", " -- ")
    return text


def convert_xlsx_to_csv(csv_file: IO[bytes], file: IO[bytes], num_rows: int):
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
