from datetime import datetime
from openpyxl import load_workbook, Workbook
from openpyxl.worksheet.worksheet import Worksheet
from typing import IO, List, Union, Dict
from urllib.parse import unquote_plus
import csv
import json
import tempfile
from typing import Any, Optional, Set

import boto3
import structlog
from aws_lambda_typing.context import Context
from aws_lambda_typing.events import S3Event
from mypy_boto3_s3.client import S3Client

from src.lib.logging import get_logger, reset_contextvars
from src.schemas.schema_versions import (
    Version,
    getSchemaByProject,
    Project1ARow,
    Project1BRow,
    Project1CRow,
)
from src.schemas.project_types import ProjectType
from src.lib.workbook_validator import validate_project_sheet

OUTPUT_STARTING_ROW = 8
OUTPUT_TEMPLATE = {
    ProjectType._1A: "CPF1ABroadbandInfrastructureTemplate",
    ProjectType._1B: "CPF1BDigitalConnectivityTechTemplate",
    ProjectType._1C: "CPF1CMultiPurposeCommunityTemplate",
}
VERSION = Version.active_version()
PROJECT_SHEET = "Project"


@reset_contextvars
def handle(event: S3Event, context: Context):
    """Lambda handler for generating Treasury Reports

    This function creates/outputs 3 files (all with the same name but different
    extensions):
    - XLSX file which contains the output for internal use
    - CSV version of the XLSX file for treasury use
    - JSON Metadata which maps the {project_id}_{agency_id} to the row in the
        XLSX file to track duplicate entries.

    This function is structured as followed:
    1) Load the metadata
    2) Download the existing output XLSX file. If it doesn't exist, download
        the template file.
    3) Open files in the outdatedUploadsByExpenditureCategory parameter. These
        files contain projects that we want to remove from the output file.
        Then remove those files from the output file while simulateneously
        updating the metadata (when you delete a row in the XLSX, the metadata
        needs to be updated).
    4) Open files in the uploadsByExpenditureCategory parameter. These files
        contain projects that we want to add to the output file. There is some
        complicated logic to handle cases where there are duplicate project
        entries from the SAME agency. When that happens, we want to use the
        latest entry, denoted by the UploadObject's createdAt data. OR if there
        is already an entry in the output file, overwrite it since presumably
        the new worksheet has the updated data.
    5) Save the XLSX sheet, convert it to CSV and upload it, save metadata to
        s3.

    Args:
        event: S3 Lambda event of type `s3:ObjectCreated:*`
        context: Lambda context
    """
    structlog.contextvars.bind_contextvars(lambda_event={"step_function": event})
    logger = get_logger()
    logger.info("received new invocation event from step function")

    s3_client: S3Client = boto3.client("s3")

    project_code = event["Project"]
    if project_code == "1A":
        project_use_code = ProjectType._1A
    elif project_code == "1B":
        project_use_code = ProjectType._1B
    elif project_code == "1C":
        project_use_code = ProjectType._1C
    ProjectRowSchema = getSchemaByProject(VERSION, project_use_code)

    organization: Dict[str, Any] = event["Records"][0]["organization"]
    organization_id = organization.get("id")
    current_reporting_period_id = organization.get("preferences").get(
        "current_reporting_period_id"
    )
    user: Dict[str, Any] = event["Records"][0]["user"]

    uploadsByExpenditureCategory = event.get("uploadsByExpenditureCategory", {})
    file_info_list = uploadsByExpenditureCategory.get(project_use_code, {})
    outdatedUploadsByExpenditureCategory = event.get(
        "outdatedUploadsByExpenditureCategory", {}
    )
    outdated_file_info_list = outdatedUploadsByExpenditureCategory.get(
        project_use_code, {}
    )

    # If the treasury report file exists, download it and store the data
    # If it doesn't exist, download the output template

    ### 1) Load the metadata
    existing_project_agency_id_to_row_number = get_existing_output_metadata(
        s3_client=s3_client,
        organization=organization,
        user=user,
        project_use_code=project_use_code,
    )
    project_agency_id_to_row_map = set(existing_project_agency_id_to_row_number.keys())

    ### 2) Download the existing output XLSX file. If it doesn't exist, download
    #    the template file.
    output_file = tempfile.NamedTemporaryFile()
    if existing_project_agency_id_to_row_number:
        download_file(
            s3_client,
            f"treasuryreports/{organization_id}/{current_reporting_period_id}/{user.id}",
            f"{OUTPUT_TEMPLATE[project_use_code]}.xlsx",
            output_file,
        )
        highest_row_num = max(existing_project_agency_id_to_row_number.values())
    else:
        download_file(
            s3_client,
            event["Records"][0]["s3"]["bucket"]["name"],
            f"{OUTPUT_TEMPLATE[project_use_code]}.xlsx",
            output_file,
        )
        highest_row_num = OUTPUT_STARTING_ROW - 1

    workbook = load_workbook(filename=output_file, read_only=True)
    sheet = workbook["Baseline"]

    ### 3) Open files in the outdatedUploadsByExpenditureCategory parameter.
    # If outdated file info list is provided, grab the project id agency id to remove
    project_agency_ids_to_remove = get_outdated_projects_to_remove(
        s3_client=s3_client,
        outdated_file_info_list=outdated_file_info_list,
        ProjectRowSchema=ProjectRowSchema,
    )

    # Delete rows corresponding to project_agency_ids_to_remove in the existing output file
    # Also update project_agency_id_to_row_map with the new row numbers
    highest_row_num = update_project_agency_ids_to_row_map(
        project_agency_id_to_row_map=project_agency_id_to_row_map,
        project_agency_ids_to_remove=project_agency_ids_to_remove,
        sheet=sheet,
        highest_row_num=highest_row_num,
    )

    ### 4) Open files in the uploadsByExpenditureCategory parameter.
    # Get project data to add to the output
    project_id_agency_id_to_upload_date: Dict[str, datetime] = {}
    for agency_id, file_info in file_info_list.items():
        with tempfile.NamedTemporaryFile() as file:
            # Download projects from S3
            objectKey = file_info.get("objectKey")
            bucket = objectKey.split("/")[0]
            filename = file_info.get("filename")
            created_at = file_info.get("createdAt")
            download_file(
                s3_client,
                bucket,
                filename,
                file,
            )
            # Load workbook
            wb = load_workbook(filename=file, read_only=True)
            # Get and combine project rows
            highest_row_num = combine_project_rows(
                project_workbook=wb,
                output_sheet=sheet,
                project_use_code=project_use_code,
                highest_row_num=highest_row_num,
                ProjectRowSchema=ProjectRowSchema,
                project_id_agency_id_to_upload_date=project_id_agency_id_to_upload_date,
                project_id_agency_id_to_row_num=project_agency_id_to_row_map,
                created_at=created_at,
                agency_id=agency_id,
            )

    ### 5) Save data
    # Output XLSX file
    with tempfile.NamedTemporaryFile("w") as new_output_file:
        workbook.save(new_output_file.name)
        upload_generated_file_to_s3(
            s3_client,
            f"treasuryreports/{organization_id}/{current_reporting_period_id}/{user.id}",
            f"{OUTPUT_TEMPLATE[project_use_code]}.xlsx",
            new_output_file,
        )
    # Output CSV file for treasury
    with tempfile.NamedTemporaryFile("w") as csv_file:
        convert_xlsx_to_csv(csv_file, workbook, highest_row_num)
        upload_generated_file_to_s3(
            s3_client,
            f"treasuryreports/{organization_id}/{current_reporting_period_id}/{user.id}",
            f"{OUTPUT_TEMPLATE[project_use_code]}.csv",
            csv_file,
        )
    # Store project_id_agency_id to row number in a json file
    with tempfile.NamedTemporaryFile("w") as json_file:
        json_file = json.dump(project_agency_id_to_row_map)
        upload_generated_file_to_s3(
            s3_client,
            f"treasuryreports/{organization_id}/{current_reporting_period_id}/{user.id}",
            f"{OUTPUT_TEMPLATE[project_use_code]}.json",
            json_file,
        )
    output_file.close()


def get_existing_output_metadata(
    s3_client,
    organization: Dict[str, Any],
    user: Dict[str, Any],
    project_use_code: str,
):
    existing_project_agency_id_to_row_number = {}
    with tempfile.NamedTemporaryFile() as existing_file:
        try:
            download_file(
                s3_client,
                f"treasuryreports/{organization.get("id")}/{organization.get("preferences").get("current_reporting_period_id")}/{user.id}",
                f"{OUTPUT_TEMPLATE[project_use_code]}.json",
                existing_file,
            )
        except Exception:
            existing_file = None
        if existing_file:
            existing_project_agency_id_to_row_number = json.load(existing_file)

    return existing_project_agency_id_to_row_number


def get_projects_to_remove(
    workbook: Workbook,
    ProjectRowSchema: Union[Project1ARow, Project1BRow, Project1CRow],
    agency_id: str,
):
    """
    Get the set of '{project_id}_{agency_id}' ids to remove from the
    existing output file.
    """
    project_agency_ids_to_remove = set()
    # Get projects
    _, projects = validate_project_sheet(
        workbook[PROJECT_SHEET], ProjectRowSchema, VERSION
    )
    # Store projects to remove
    for project in projects:
        project_agency_ids_to_remove.add(
            f"{project.Identification_Number__c}_{agency_id}"
        )
    return project_agency_ids_to_remove


def get_outdated_projects_to_remove(
    s3_client,
    outdated_file_info_list: Dict[str, Any],
    ProjectRowSchema: Union[Project1ARow, Project1BRow, Project1CRow],
):
    """
    Open the files in the outdated_file_info_list and get the projects to
    remove.
    """
    project_agency_ids_to_remove = set()
    for agency_id, file_info in outdated_file_info_list.items():
        with tempfile.NamedTemporaryFile() as file:
            # Download projects from S3
            objectKey = file_info.get("objectKey")
            bucket = objectKey.split("/")[0]
            filename = file_info.get("filename")
            download_file(
                s3_client,
                bucket,
                filename,
                file,
            )
            # Load workbook
            outdated_wb = load_workbook(filename=file, read_only=True)
            project_agency_ids_to_remove = project_agency_ids_to_remove.union(
                get_projects_to_remove(
                    workbook=outdated_wb,
                    ProjectRowSchema=ProjectRowSchema,
                    agency_id=agency_id,
                )
            )
    return project_agency_ids_to_remove


def update_project_agency_ids_to_row_map(
    project_agency_id_to_row_map: Dict[str, int],
    project_agency_ids_to_remove: Set[str],
    highest_row_num: int,
    sheet: Worksheet,
):
    """
    Delete rows corresponding to project_agency_ids_to_remove in the existing
    output file. Also update project_agency_id_to_row_map with the new row
    numbers.
    """
    if project_agency_ids_to_remove:
        rows_to_remove = []
        for project_agency_id in project_agency_ids_to_remove:
            row_num = project_agency_id_to_row_map.get(project_agency_id, None)
            if row_num:
                rows_to_remove.append(row_num)
                project_agency_id_to_row_map.pop(project_agency_id)
        rows_to_remove.sort(reverse=True)

        for row_num in rows_to_remove:
            if sheet:
                sheet.delete_rows(row_num)
            highest_row_num = highest_row_num - 1
            for k, v in project_agency_id_to_row_map.items():
                if v > row_num:
                    project_agency_id_to_row_map[k] = v - 1
    return highest_row_num


def insert_project_row(
    project_use_code: str,
    sheet: Worksheet,
    row_num: int,
    row: Union[Project1ARow, Project1BRow, Project1CRow],
):
    """
    Append project to the xlsx file

    sheet is Optional only for tests
    """
    row_schema = row.model_json_schema()["properties"]
    row_dict = dict(row)

    row_with_output_cols = {}
    for prop in row_dict.keys():
        prop_meta = row_schema.get(prop)
        if not prop_meta:
            raise Exception("Property not found. Cannot generate report")
        if prop_meta[f"treasury_report_col_{project_use_code}"]:
            row_with_output_cols[
                prop_meta[f"treasury_report_col_{project_use_code}"]
            ] = row_dict[prop]

    for col in row_with_output_cols.keys():
        if sheet:
            sheet[f"{col}{row_num}"] = str(row_with_output_cols[col])


def combine_project_rows(
    project_workbook: Workbook,
    output_sheet: Worksheet,
    project_use_code: str,
    highest_row_num: int,
    ProjectRowSchema: Union[Project1ARow, Project1BRow, Project1CRow],
    project_id_agency_id_to_upload_date: Dict[str, datetime],
    project_id_agency_id_to_row_num: Dict[str, int],
    created_at: datetime,
    agency_id: str,
):
    """
    Combine projects together and check for conflicts.
    If there is a conflict, choose the most recent project based on created_at time.
    """
    # Get projects
    result = validate_project_sheet(
        project_workbook[PROJECT_SHEET], ProjectRowSchema, VERSION
    )
    projects: List[Union[Project1ARow, Project1BRow, Project1CRow]] = result[1]
    # Get project rows from workbook
    for project in projects:
        # Make sure to attach the date of the `UploadObject.createdAt` to the row somehow
        # to choose the most recent project record in case of conflicts
        project_agency_id = f"{project.Identification_Number__c}_{agency_id}"
        existing_date = project_id_agency_id_to_upload_date.get(project_agency_id)
        if existing_date and existing_date > created_at:
            continue
        else:
            project_id_agency_id_to_upload_date[project_agency_id] = created_at
            existing_project_row = project_id_agency_id_to_row_num.get(
                project_agency_id
            )
            if existing_project_row:
                row_to_insert = existing_project_row
            else:
                highest_row_num = highest_row_num + 1
                project_id_agency_id_to_row_num[project_agency_id] = highest_row_num
                row_to_insert = highest_row_num
            insert_project_row(
                project_use_code=project_use_code,
                sheet=output_sheet,
                row_num=row_to_insert,
                row=project,
            )
    return highest_row_num


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


def download_file(client: S3Client, bucket: str, key: str, destination: IO[bytes]):
    """Downloads an S3 object to a local file.

    Args:
        client: Client facilitating download from S3
        bucket: Name of the S3 bucket containing the workbook
        key: S3 object key for the file to download
        destination: File-like object (in binary mode) where the S3 object will be written
    """
    logger = get_logger()
    logger.debug("downloading workbook from s3")

    try:
        client.download_fileobj(bucket, unquote_plus(key), destination)
    except:
        logger.exception("failed to download workbook from S3")
        raise


def upload_generated_file_to_s3(client: S3Client, bucket, key: str, file: IO[bytes]):
    """Persists workbook validation results to S3.

    Args:
        client: Client facilitating upload to S3
        results: Errors resulting from workbook validation.
    """
    logger = get_logger()

    logger = logger.bind(upload={"s3": {"bucket": bucket, "key": key}})
    try:
        file.seek(0)
        client.put_object(
            Body=file,
            Bucket=bucket,
            Key=unquote_plus(key),
            ServerSideEncryption="AES256",
        )
    except:
        logger.exception("failed to upload treasury report to S3")
        raise

    logger.info("successfully uploaded treasury report results to s3")
