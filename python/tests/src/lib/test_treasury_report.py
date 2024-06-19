from datetime import datetime, timedelta
from typing import Dict

import tempfile
from openpyxl import Workbook
from openpyxl.worksheet.worksheet import Worksheet
from src.lib.workbook_validator import validate_project_sheet
from src.schemas.schema_versions import getSchemaByProject
from src.functions.generate_treasury_report import (
    combine_project_rows,
    populate_output_report,
    convert_xlsx_to_csv,
)
from src.schemas.schema_versions import Project1CRow
from src.schemas.schema_versions import Version
from src.schemas.project_types import ProjectType

OUTPUT_STARTING_ROW = 8
PROJECT_USE_CODE = ProjectType._1C
VERSION = Version.V2024_05_24
ProjectRowSchema = getSchemaByProject(VERSION, PROJECT_USE_CODE)

FIRST_ID = "33"
SECOND_ID = "44"
V2024_05_24_VERSION_STRING = "v:20240524"


class TestGenerateOutput1C:
    def test_combine_project_rows(self, valid_project_sheet_1C):
        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []

        project_jsons = [dict(project) for project in projects]
        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt,
        )
        assert project_id_to_upload_date.get(FIRST_ID) == createdAt
        assert project_id_to_data.get(FIRST_ID) is not None
        assert project_id_to_data.get(FIRST_ID).Project_Name__c == "project 1c test"

    def test_combine_project_rows_with_conflicts_1(
        self, valid_project_sheet_1C, valid_project_sheet_1C_with_conflict
    ):
        """Choose the project with the later created at date"""
        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt1 = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt1,
        )

        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C_with_conflict,
            ProjectRowSchema,
            V2024_05_24_VERSION_STRING,
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        createdAt2 = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt2,
        )
        assert project_id_to_upload_date.get(FIRST_ID) == createdAt2
        assert project_id_to_data.get(FIRST_ID) is not None
        assert (
            project_id_to_data.get(FIRST_ID).Project_Name__c
            == "updated project 1c test"
        )

    def test_combine_project_rows_with_conflicts_2(
        self, valid_project_sheet_1C, valid_project_sheet_1C_with_conflict
    ):
        """Choose the project with the later created at date"""
        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt1 = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt1,
        )

        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C_with_conflict,
            ProjectRowSchema,
            V2024_05_24_VERSION_STRING,
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        createdAt2 = datetime.now() - timedelta(days=1)
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt2,
        )
        assert project_id_to_upload_date.get(FIRST_ID) == createdAt1
        assert project_id_to_data.get(FIRST_ID) is not None
        assert project_id_to_data.get(FIRST_ID).Project_Name__c == "project 1c test"

    def test_combine_project_rows_multiple(
        self, valid_project_sheet_1C, valid_second_project_sheet
    ):
        """Choose the project with the later created at date"""
        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt1 = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt1,
        )

        project_errors, projects = validate_project_sheet(
            valid_second_project_sheet, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        createdAt2 = datetime.now() - timedelta(days=1)
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt2,
        )
        print(project_id_to_upload_date)
        print(project_id_to_data)
        assert project_id_to_upload_date.get(FIRST_ID) == createdAt1
        assert project_id_to_data.get(FIRST_ID) is not None
        assert project_id_to_data.get(FIRST_ID).Project_Name__c == "project 1c test"
        assert project_id_to_upload_date.get(SECOND_ID) == createdAt2
        assert project_id_to_data.get(SECOND_ID) is not None
        assert project_id_to_data.get(SECOND_ID).Project_Name__c == "test 2"

    def test_populate_output_report(
        self, valid_project_sheet_1C: Worksheet, output_template: Workbook
    ):
        """Populate the output report with one project"""
        _, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        project_jsons = [dict(project) for project in projects]
        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt,
        )
        populate_output_report(
            workbook=output_template, project_id_to_data=project_id_to_data
        )
        sheet = output_template["Baseline"]
        assert sheet["B8"].value == project_id_to_data[FIRST_ID].Project_Name__c
        assert (
            sheet["C8"].value == project_id_to_data[FIRST_ID].Identification_Number__c
        )

    def test_populate_output_report_multiple(
        self, valid_project_sheet_1C, valid_second_project_sheet, output_template
    ):
        """Populate the output report with multiple projects from different sheets"""
        project_errors, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt1 = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt1,
        )

        project_errors, projects = validate_project_sheet(
            valid_second_project_sheet, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        createdAt2 = datetime.now() - timedelta(days=1)
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt2,
        )
        populate_output_report(
            workbook=output_template, project_id_to_data=project_id_to_data
        )
        sheet = output_template["Baseline"]
        assert sheet["B8"].value == project_id_to_data[FIRST_ID].Project_Name__c
        assert (
            sheet["C8"].value == project_id_to_data[FIRST_ID].Identification_Number__c
        )
        assert sheet["B9"].value == project_id_to_data[SECOND_ID].Project_Name__c
        assert (
            sheet["C9"].value == project_id_to_data[SECOND_ID].Identification_Number__c
        )

    def test_convert_xlsx_to_csv(
        self, valid_project_sheet_1C, valid_second_project_sheet, output_template
    ):
        """Populate the output report with one project"""
        _, projects = validate_project_sheet(
            valid_project_sheet_1C, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        project_jsons = [dict(project) for project in projects]
        project_id_to_data: Dict[str, Project1CRow] = {}
        project_id_to_upload_date = {}
        createdAt = datetime.now()
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt,
        )
        project_errors, projects = validate_project_sheet(
            valid_second_project_sheet, ProjectRowSchema, V2024_05_24_VERSION_STRING
        )
        assert project_errors == []
        project_jsons = [dict(project) for project in projects]

        createdAt2 = datetime.now() - timedelta(days=1)
        combine_project_rows(
            projects=project_jsons,
            project_id_to_upload_date=project_id_to_upload_date,
            project_id_to_data=project_id_to_data,
            createdAt=createdAt2,
        )
        num_rows = populate_output_report(
            workbook=output_template, project_id_to_data=project_id_to_data
        )
        with tempfile.NamedTemporaryFile("w+") as csv_file:
            convert_xlsx_to_csv(csv_file, output_template, num_rows)
