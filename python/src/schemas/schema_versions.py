from enum import Enum
from typing import Union, Type, Any
from pydantic import (BaseModel, Field, field_validator, ValidationInfo)
from src.schemas.schema_V2024_04_01 import (
    SubrecipientRow as V2024_04_01_SubrecipientRow, 
    CoverSheetRow as V2024_04_01_CoverSheetRow,
    Project1ARow as V2024_04_01_Project1ARow,
    Project1BRow as V2024_04_01_Project1BRow,
    Project1CRow as V2024_04_01_Project1CRow)
from src.schemas.schema_V2024_05_24 import (
    SubrecipientRow as V2024_05_24_SubrecipientRow, 
    CoverSheetRow as V2024_05_24_CoverSheetRow,
    Project1ARow as V2024_05_24_Project1ARow,
    Project1BRow as V2024_05_24_Project1BRow,
    Project1CRow as V2024_05_24_Project1CRow)
from src.schemas.project_types import ProjectType

"""
These are meant to be the canonical "type" for the various rows given whatever versions we have
so that we can have classnames to pass around as return types and input types here and in workbook_validator
When you add a new version, please import the types from its sheets and add them in here
"""
class SubrecipientRow: Type[Union[V2024_04_01_SubrecipientRow, V2024_05_24_SubrecipientRow]]
class CoverSheetRow: Type[Union[V2024_04_01_CoverSheetRow, V2024_05_24_CoverSheetRow]]
class Project1ARow: Type[Union[V2024_04_01_Project1ARow, V2024_05_24_Project1ARow]]
class Project1BRow: Type[Union[V2024_04_01_Project1BRow, V2024_05_24_Project1BRow]]
class Project1CRow: Type[Union[V2024_04_01_Project1CRow, V2024_05_24_Project1CRow]]

class Version(Enum):
    V2023_12_12 = "v:20231212"
    V2024_01_07 = "v:20240107"
    V2024_04_01 = "v:20240401"
    V2024_05_24 = "v:20240524"

class LogicSheetVersion(BaseModel):
    version: Version = Field(...)

    @field_validator(
        "version"
    )
    @classmethod
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        print("MADE IT TO VERSION VALIDATOR")
        print(v)
        if v != Version.V2024_05_24:
            raise ValueError(
                f"Using outdated version of template. Please update to {Version.V2024_05_24}."
            )
        return v


def getVersionFromString(version_string: str) -> Version:
    # Handle the edge case of a bad version with the latest schema
    # We should have already collected a user-facing error for this in
    # validate_logic_sheet
    version = None
    try:
        version = Version._value2member_map_[version_string]
    except KeyError:
        # Handle the edge case of a bad version with the latest schema
        # We should have already collected a user-facing error for this in validate_logic_sheet
        version = Version.V2024_05_24
    return version


def getSubrecipientRowClass(version_string: str) -> SubrecipientRow:
    version = getVersionFromString(version_string)
    match version:
        case Version.V2024_05_24:
            return V2024_05_24_SubrecipientRow
        case _:
            return V2024_04_01_SubrecipientRow
    
def getCoverSheetRowClass(version_string: str) -> CoverSheetRow:
    version = getVersionFromString(version_string)
    match version:
        case Version.V2024_05_24:
            return V2024_05_24_CoverSheetRow
        case _:
            return V2024_04_01_CoverSheetRow
    

def getSchemaByProject(version_string: str, project_type: ProjectType) -> Type[Union[Project1ARow, Project1BRow, Project1CRow]]:
    version = getVersionFromString(version_string)
    match project_type:
        case ProjectType._1A:
            return getProject1ARow(version)
        case ProjectType._1B:
            return getProject1BRow(version)
        case ProjectType._1C:
            return getProject1CRow(version)


def getProject1ARow(version: Version) -> Project1ARow:
    match version:
        case Version.V2024_05_24:
            return V2024_05_24_Project1ARow
        case _:
            return V2024_04_01_Project1ARow

def getProject1BRow(version: Version) -> Project1BRow:
    match version:
        case Version.V2024_05_24:
            return V2024_05_24_Project1BRow
        case _:
            return V2024_04_01_Project1BRow

def getProject1CRow(version: Version) -> Project1CRow:
    match version:
        case Version.V2024_05_24:
            return V2024_05_24_Project1CRow
        case _:
            return V2024_04_01_Project1CRow
    
    