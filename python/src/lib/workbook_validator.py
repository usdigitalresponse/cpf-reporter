from openpyxl import load_workbook
from pydantic import ValidationError

def map_values_to_headers(headers, values):
    return dict(zip(headers, values))

def is_empty_row(row_values):
    return all(value in (None, "") for value in row_values)

def get_headers(sheet, cell_range: str) -> tuple:
    return tuple(header_cell.value for header_cell in sheet[cell_range][0])

"""
TODO: Break this function apart into smaller chunks for easier testing
"""
def validate():
    errors = []
    """
    1. Load workbook in read-only mode
    See: https://openpyxl.readthedocs.io/en/stable/optimized.html
    """
    wb = load_workbook(filename='CPF Template Approved.xlsm', read_only=True)

    """
    2. Validate logic sheet to make sure the sheet has an appropriate version
    """
    logic = wb['Logic']
    try:
        # Cell B1 contains the version
        LogicSheetVersion(**{ "version": logic['B1'].value })
    except ValidationError as e:
        errors.append(f'Logic Sheet: Invalid {e}')
        return errors


    """
    3. Validate cover sheet and project selection. Pick the appropriate validator for the next step.
    """
    project_schema = None
    cover = wb['Cover']
    cover_header = get_headers(cover, 'A1:B1')
    for cover_row in cover.iter_rows(min_row=2, max_row=2, max_col=2, values_only=True):
        row_dict = map_values_to_headers(cover_header, cover_row)
        try:
            CoverSheetRow(**row_dict)
        except ValidationError as e:
            errors.append(f"Cover Sheet: Invalid {e}")
            return errors

        # This does not need to be a silent failure. This would be a critical error.
        project_schema = SCHEMA_BY_PROJECT[row_dict['Project Use Code']]

    """
    4. Ensure all project rows are validated with the schema
    """
    project = wb['Project']
    project_headers = get_headers(project, 'C3:DS3')
    current_row = 12
    for project_row in project.iter_rows(min_row=13, min_col= 3, max_col=123, values_only=True):
        current_row += 1
        if is_empty_row(project_row):
            continue
        # print(project_row)
        row_dict = map_values_to_headers(project_headers, project_row)
        # print(row_dict['Capital_Asset_Ownership_Type__c'])
        try:
            project_schema(**row_dict)
        except ValidationError as e:
            errors.append(f"Project Sheet: Row Num {current_row} Error: {e}")


    """
    5. Ensure all subrecipient rows are validated with the schema
    """
    subrecipient = wb['Subrecipients']
    subrecipient_headers = get_headers(subrecipient, 'C3:O3')
    current_row = 12
    for subrecipient_row in subrecipient.iter_rows(min_row=13, min_col=3, max_col=16, values_only=True):
        current_row += 1
        if is_empty_row(project_row):
            continue
        row_dict = map_values_to_headers(subrecipient_headers, subrecipient_row)
        try:
            SubrecipientRow(**row_dict)
        except ValidationError as e:
            errors.append(f"Subrecipients Sheet: Row Num {current_row} Error: {e}")


    # Close the workbook after reading
    wb.close()

    # TODO: Save this into a JSON within the same S3 directory
    return errors