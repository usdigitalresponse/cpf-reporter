from datetime import datetime, timedelta

from src.schemas.schema_versions import getSchemaByProject
from src.functions.generate_treasury_report import (
    combine_project_rows,
    update_project_agency_ids_to_row_map,
    get_projects_to_remove,
)
from src.schemas.schema_versions import Version
from src.schemas.project_types import ProjectType

OUTPUT_STARTING_ROW = 8
project_use_code = ProjectType._1C
VERSION = Version.active_version()
ProjectRowSchema = getSchemaByProject(VERSION, project_use_code)

FIRST_ID = "33"
SECOND_ID = "44"
V2024_05_24_VERSION_STRING = Version.V2024_05_24.value
AGENCY_ID = 999
PROJECT_AGENCY_ID = f"{FIRST_ID}_{AGENCY_ID}"
PROJECT_AGENCY_ID_2 = f"{SECOND_ID}_{AGENCY_ID}"


class TestGenerateOutput1C:
    def test_get_projects_to_remove(self, valid_workbook_1C):
        project_agency_ids_to_remove = get_projects_to_remove(
            workbook=valid_workbook_1C,
            ProjectRowSchema=ProjectRowSchema,
            agency_id=AGENCY_ID,
        )
        assert len(project_agency_ids_to_remove) == 1
        assert PROJECT_AGENCY_ID in project_agency_ids_to_remove

    def test_update_project_agency_ids_to_row_map_1(self):
        project_agency_id_to_row_map = {
            f"1_{AGENCY_ID}": 13,
            f"2_{AGENCY_ID}": 14,
            f"3_{AGENCY_ID}": 15,
            f"4_{AGENCY_ID}": 16,
            f"5_{AGENCY_ID}": 17,
        }
        project_agency_ids_to_remove = set([f"1_{AGENCY_ID}"])
        highest_row_num = max(project_agency_id_to_row_map.values())
        update_project_agency_ids_to_row_map(
            project_agency_id_to_row_map=project_agency_id_to_row_map,
            project_agency_ids_to_remove=project_agency_ids_to_remove,
            sheet=None,
            highest_row_num=highest_row_num,
        )
        assert len(project_agency_id_to_row_map.keys()) == 4
        assert project_agency_id_to_row_map.get(f"1_{AGENCY_ID}") is None
        assert project_agency_id_to_row_map.get(f"2_{AGENCY_ID}") == 13
        assert project_agency_id_to_row_map.get(f"3_{AGENCY_ID}") == 14
        assert project_agency_id_to_row_map.get(f"4_{AGENCY_ID}") == 15
        assert project_agency_id_to_row_map.get(f"5_{AGENCY_ID}") == 16

    def test_update_project_agency_ids_to_row_map_2(self):
        project_agency_id_to_row_map = {
            f"1_{AGENCY_ID}": 13,
            f"2_{AGENCY_ID}": 14,
            f"3_{AGENCY_ID}": 15,
            f"4_{AGENCY_ID}": 16,
            f"5_{AGENCY_ID}": 17,
        }
        project_agency_ids_to_remove = set([f"6_{AGENCY_ID}"])
        highest_row_num = max(project_agency_id_to_row_map.values())
        update_project_agency_ids_to_row_map(
            project_agency_id_to_row_map=project_agency_id_to_row_map,
            project_agency_ids_to_remove=project_agency_ids_to_remove,
            sheet=None,
            highest_row_num=highest_row_num,
        )
        assert len(project_agency_id_to_row_map.keys()) == 5
        assert project_agency_id_to_row_map.get(f"1_{AGENCY_ID}") == 13
        assert project_agency_id_to_row_map.get(f"2_{AGENCY_ID}") == 14
        assert project_agency_id_to_row_map.get(f"3_{AGENCY_ID}") == 15
        assert project_agency_id_to_row_map.get(f"4_{AGENCY_ID}") == 16
        assert project_agency_id_to_row_map.get(f"5_{AGENCY_ID}") == 17

    def test_update_project_agency_ids_to_row_map_3(self):
        project_agency_id_to_row_map = {
            f"1_{AGENCY_ID}": 13,
            f"2_{AGENCY_ID}": 14,
            f"3_{AGENCY_ID}": 15,
            f"4_{AGENCY_ID}": 16,
            f"5_{AGENCY_ID}": 17,
        }
        project_agency_ids_to_remove = set([f"3_{AGENCY_ID}"])
        highest_row_num = max(project_agency_id_to_row_map.values())
        update_project_agency_ids_to_row_map(
            project_agency_id_to_row_map=project_agency_id_to_row_map,
            project_agency_ids_to_remove=project_agency_ids_to_remove,
            sheet=None,
            highest_row_num=highest_row_num,
        )
        assert len(project_agency_id_to_row_map.keys()) == 4
        assert project_agency_id_to_row_map.get(f"1_{AGENCY_ID}") == 13
        assert project_agency_id_to_row_map.get(f"2_{AGENCY_ID}") == 14
        assert project_agency_id_to_row_map.get(f"3_{AGENCY_ID}") is None
        assert project_agency_id_to_row_map.get(f"4_{AGENCY_ID}") == 15
        assert project_agency_id_to_row_map.get(f"5_{AGENCY_ID}") == 16

    def test_update_project_agency_ids_to_row_map_4(self):
        project_agency_id_to_row_map = {
            f"1_{AGENCY_ID}": 13,
            f"2_{AGENCY_ID}": 14,
            f"3_{AGENCY_ID}": 15,
            f"4_{AGENCY_ID}": 16,
            f"5_{AGENCY_ID}": 17,
        }
        project_agency_ids_to_remove = set([f"5_{AGENCY_ID}"])
        highest_row_num = max(project_agency_id_to_row_map.values())
        update_project_agency_ids_to_row_map(
            project_agency_id_to_row_map=project_agency_id_to_row_map,
            project_agency_ids_to_remove=project_agency_ids_to_remove,
            sheet=None,
            highest_row_num=highest_row_num,
        )
        assert len(project_agency_id_to_row_map.keys()) == 4
        assert project_agency_id_to_row_map.get(f"1_{AGENCY_ID}") == 13
        assert project_agency_id_to_row_map.get(f"2_{AGENCY_ID}") == 14
        assert project_agency_id_to_row_map.get(f"3_{AGENCY_ID}") == 15
        assert project_agency_id_to_row_map.get(f"4_{AGENCY_ID}") == 16
        assert project_agency_id_to_row_map.get(f"5_{AGENCY_ID}") is None

    def test_update_project_agency_ids_to_row_map_5(self):
        project_agency_id_to_row_map = {
            f"1_{AGENCY_ID}": 13,
            f"2_{AGENCY_ID}": 14,
            f"3_{AGENCY_ID}": 15,
            f"4_{AGENCY_ID}": 16,
            f"5_{AGENCY_ID}": 17,
        }
        project_agency_ids_to_remove = set([f"2_{AGENCY_ID}", f"4_{AGENCY_ID}"])
        highest_row_num = max(project_agency_id_to_row_map.values())
        update_project_agency_ids_to_row_map(
            project_agency_id_to_row_map=project_agency_id_to_row_map,
            project_agency_ids_to_remove=project_agency_ids_to_remove,
            sheet=None,
            highest_row_num=highest_row_num,
        )
        assert len(project_agency_id_to_row_map.keys()) == 3
        assert project_agency_id_to_row_map.get(f"1_{AGENCY_ID}") == 13
        assert project_agency_id_to_row_map.get(f"2_{AGENCY_ID}") is None
        assert project_agency_id_to_row_map.get(f"3_{AGENCY_ID}") == 14
        assert project_agency_id_to_row_map.get(f"4_{AGENCY_ID}") is None
        assert project_agency_id_to_row_map.get(f"5_{AGENCY_ID}") == 15

    def test_update_project_agency_ids_to_row_map_6(self):
        project_agency_id_to_row_map = {
            f"1_{AGENCY_ID}": 13,
            f"2_{AGENCY_ID}": 14,
            f"3_{AGENCY_ID}": 15,
            f"4_{AGENCY_ID}": 16,
            f"5_{AGENCY_ID}": 17,
        }
        project_agency_ids_to_remove = set([f"2_{AGENCY_ID}", f"1_{AGENCY_ID}"])
        highest_row_num = max(project_agency_id_to_row_map.values())
        update_project_agency_ids_to_row_map(
            project_agency_id_to_row_map=project_agency_id_to_row_map,
            project_agency_ids_to_remove=project_agency_ids_to_remove,
            sheet=None,
            highest_row_num=highest_row_num,
        )
        assert len(project_agency_id_to_row_map.keys()) == 3
        assert project_agency_id_to_row_map.get(f"1_{AGENCY_ID}") is None
        assert project_agency_id_to_row_map.get(f"2_{AGENCY_ID}") is None
        assert project_agency_id_to_row_map.get(f"3_{AGENCY_ID}") == 13
        assert project_agency_id_to_row_map.get(f"4_{AGENCY_ID}") == 14
        assert project_agency_id_to_row_map.get(f"5_{AGENCY_ID}") == 15

    def test_combine_project_rows(self, valid_workbook_1C):
        project_id_agency_id_to_upload_date = {}
        project_id_agency_id_to_row_num = {}
        createdAt = datetime.now()
        new_highest_row_num = combine_project_rows(
            project_workbook=valid_workbook_1C,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=12,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt,
            agency_id=AGENCY_ID,
        )
        assert project_id_agency_id_to_upload_date.get(PROJECT_AGENCY_ID) == createdAt
        assert project_id_agency_id_to_row_num.get(PROJECT_AGENCY_ID) == 13
        assert new_highest_row_num == 13

    def test_combine_project_rows_with_conflicts_1(
        self, valid_workbook_1C, valid_workbook_1C_with_conflict
    ):
        """Choose the project with the later created at date"""
        project_id_agency_id_to_upload_date = {}
        project_id_agency_id_to_row_num = {}
        createdAt1 = datetime.now()
        highest_row_num = combine_project_rows(
            project_workbook=valid_workbook_1C,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=12,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt1,
            agency_id=AGENCY_ID,
        )

        createdAt2 = datetime.now()
        new_highest_row_num = combine_project_rows(
            project_workbook=valid_workbook_1C_with_conflict,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=highest_row_num,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt2,
            agency_id=AGENCY_ID,
        )
        assert project_id_agency_id_to_upload_date.get(PROJECT_AGENCY_ID) == createdAt2
        assert project_id_agency_id_to_row_num.get(PROJECT_AGENCY_ID) == 13
        assert new_highest_row_num == 13

    def test_combine_project_rows_with_conflicts_2(
        self, valid_workbook_1C, valid_workbook_1C_with_conflict
    ):
        """Choose the project with the later created at date"""
        project_id_agency_id_to_upload_date = {}
        project_id_agency_id_to_row_num = {}
        createdAt1 = datetime.now()
        highest_row_num = combine_project_rows(
            project_workbook=valid_workbook_1C,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=12,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt1,
            agency_id=AGENCY_ID,
        )

        createdAt2 = datetime.now() - timedelta(days=1)
        new_highest_row_num = combine_project_rows(
            project_workbook=valid_workbook_1C_with_conflict,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=highest_row_num,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt2,
            agency_id=AGENCY_ID,
        )
        assert project_id_agency_id_to_upload_date.get(PROJECT_AGENCY_ID) == createdAt1
        assert project_id_agency_id_to_row_num.get(PROJECT_AGENCY_ID) == 13
        assert new_highest_row_num == 13

    def test_combine_project_rows_multiple(
        self, valid_workbook_1C, valid_second_workbook_1C_sheet
    ):
        """Choose the project with the later created at date"""
        project_id_agency_id_to_upload_date = {}
        project_id_agency_id_to_row_num = {}
        createdAt1 = datetime.now()
        highest_row_num = combine_project_rows(
            project_workbook=valid_workbook_1C,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=12,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt1,
            agency_id=AGENCY_ID,
        )

        createdAt2 = datetime.now()
        new_highest_row_num = combine_project_rows(
            project_workbook=valid_second_workbook_1C_sheet,
            output_sheet=None,
            project_use_code=project_use_code,
            highest_row_num=highest_row_num,
            ProjectRowSchema=ProjectRowSchema,
            project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
            project_id_agency_id_to_row_num=project_id_agency_id_to_row_num,
            created_at=createdAt2,
            agency_id=AGENCY_ID,
        )
        assert project_id_agency_id_to_upload_date.get(PROJECT_AGENCY_ID) == createdAt1
        assert (
            project_id_agency_id_to_upload_date.get(PROJECT_AGENCY_ID_2) == createdAt2
        )
        assert project_id_agency_id_to_row_num.get(PROJECT_AGENCY_ID) == 13
        assert project_id_agency_id_to_row_num.get(PROJECT_AGENCY_ID_2) == 14
        assert new_highest_row_num == 14
