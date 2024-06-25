from enum import Enum
from typing import Type, Union

from pydantic import BaseModel, Field, ValidationInfo, field_validator

from src.schemas.project_types import ProjectType
from src.schemas.schema_V2024_04_01 import (
    METADATA_BY_SHEET as V2024_04_01_Metadata,
)
from src.schemas.schema_V2024_04_01 import (
    CoverSheetRow as V2024_04_01_CoverSheetRow,
)
from src.schemas.schema_V2024_04_01 import (
    Project1ARow as V2024_04_01_Project1ARow,
)
from src.schemas.schema_V2024_04_01 import (
    Project1BRow as V2024_04_01_Project1BRow,
)
from src.schemas.schema_V2024_04_01 import (
    Project1CRow as V2024_04_01_Project1CRow,
)
from src.schemas.schema_V2024_04_01 import (
    SubrecipientRow as V2024_04_01_SubrecipientRow,
)
from src.schemas.schema_V2024_05_24 import (
    METADATA_BY_SHEET as V2024_05_24_Metadata,
)
from src.schemas.schema_V2024_05_24 import (
    CoverSheetRow as V2024_05_24_CoverSheetRow,
)
from src.schemas.schema_V2024_05_24 import (
    Project1ARow as V2024_05_24_Project1ARow,
)
from src.schemas.schema_V2024_05_24 import (
    Project1BRow as V2024_05_24_Project1BRow,
)
from src.schemas.schema_V2024_05_24 import (
    Project1CRow as V2024_05_24_Project1CRow,
)
from src.schemas.schema_V2024_05_24 import (
    SubrecipientRow as V2024_05_24_SubrecipientRow,
)

"""These are meant to be the canonical "type" for the various rows given whatever
versions we have so that we can have classnames to pass around as return types
and input types here and in workbook_validator.

When you add a new version, please import the types from its sheets and add them
in here.
"""


class SubrecipientRow:
    Type[Union[V2024_04_01_SubrecipientRow, V2024_05_24_SubrecipientRow]]


class CoverSheetRow:
    Type[Union[V2024_04_01_CoverSheetRow, V2024_05_24_CoverSheetRow]]


class Project1ARow:
    Type[Union[V2024_04_01_Project1ARow, V2024_05_24_Project1ARow]]


class Project1BRow:
    Type[Union[V2024_04_01_Project1BRow, V2024_05_24_Project1BRow]]


class Project1CRow:
    Type[Union[V2024_04_01_Project1CRow, V2024_05_24_Project1CRow]]


class Version(Enum):
    V2023_12_12 = "v:20231212"
    V2024_01_07 = "v:20240107"
    V2024_04_01 = "v:20240401"
    V2024_05_24 = "v:20240524"

    @classmethod
    def active_version(cls):
        return cls.V2024_05_24

    @classmethod
    def compatible_older_versions(cls):
        return [cls.V2023_12_12, cls.V2024_01_07, cls.V2024_04_01]

    @classmethod
    def compatible_newer_versions(cls):
        return []


class LogicSheetVersion(BaseModel):
    version: Version = Field(...)

    @field_validator("version")
    @classmethod
    def validate_field(cls, version: Version, info: ValidationInfo, **kwargs):
        if version == Version.active_version():
            return version
        elif version in Version.compatible_older_versions():
            raise ValueError(
                f"Upload template version {version.value} is older than the latest input template {Version.active_version().value}",
            )
        elif version in Version.compatible_newer_versions():
            raise ValueError(
                f"Upload template version {version.value} is newer than the latest input template {Version.active_version().value}",
            )
        else:
            raise ValueError(
                f"Using outdated version of template. Please update to {Version.active_version().value}."
            )


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
        version = Version.active_version()
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


def getSchemaByProject(
    version_string: str, project_type: ProjectType
) -> Type[Union[Project1ARow, Project1BRow, Project1CRow]]:
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


def getSchemaMetadata(version_string: str) -> dict:
    version = getVersionFromString(version_string)
    match version:
        case Version.V2024_05_24:
            return V2024_05_24_Metadata
        case _:
            return V2024_04_01_Metadata
