from datetime import datetime
from enum import Enum
from typing import Any, Optional, Union

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    ValidationInfo,
    field_serializer,
    field_validator,
)

from src.schemas.custom_types import (
    CustomDecimal_7Digits,
    CustomDecimal_12Digits,
    CustomDecimal_13Digits,
    CustomDecimal_15Digits,
    CustomInt_GE0_LELARGE,
    CustomInt_GE0_LELARGE2,
    CustomInt_GE0_LELARGE3,
    CustomInt_GE0_LELARGE4,
    CustomInt_GE1,
    CustomStr_MIN1,
    CustomStr_MIN1_MAX5,
    CustomStr_MIN1_MAX10,
    CustomStr_MIN1_MAX20,
    CustomStr_MIN1_MAX40,
    CustomStr_MIN1_MAX80,
    CustomStr_MIN1_MAX100,
    CustomStr_MIN1_MAX3000,
    CustomStr_MIN9_MAX9,
    CustomStr_MIN12_MAX12,
)
from src.schemas.project_types import NAME_BY_PROJECT, ProjectType


class StateAbbreviation(str, Enum):
    AL = "AL"
    AK = "AK"
    AZ = "AZ"
    AR = "AR"
    CA = "CA"
    CO = "CO"
    CT = "CT"
    DE = "DE"
    FL = "FL"
    GA = "GA"
    HI = "HI"
    ID = "ID"
    IL = "IL"
    IN = "IN"
    IA = "IA"
    KS = "KS"
    KY = "KY"
    LA = "LA"
    ME = "ME"
    MD = "MD"
    MA = "MA"
    MI = "MI"
    MN = "MN"
    MS = "MS"
    MO = "MO"
    MT = "MT"
    NE = "NE"
    NV = "NV"
    NH = "NH"
    NJ = "NJ"
    NM = "NM"
    NY = "NY"
    NC = "NC"
    ND = "ND"
    OH = "OH"
    OK = "OK"
    OR = "OR"
    PA = "PA"
    RI = "RI"
    SC = "SC"
    SD = "SD"
    TN = "TN"
    TX = "TX"
    UT = "UT"
    VT = "VT"
    VA = "VA"
    WA = "WA"
    WV = "WV"
    WI = "WI"
    WY = "WY"

    def __str__(self) -> str:
        return self.value


class CapitalAssetOwnershipType(str, Enum):
    PRIVATE = "1. Private"
    STATE_GOVERNMENT = "2. State Government"
    MUNICIPAL_OR_TOWNSHIP_GOVERNMENT = "3. Municipal or Township Government"
    COUNTY_GOVERNMENT = "4. County Government"
    TRIBAL_GOVERNMENT = "5. Tribal Government"
    COOPERATIVE = "6. Co-operative"
    OTHER = "7. Other"

    def __str__(self) -> str:
        return self.value


class ProjectStatusType(str, Enum):
    NOT_STARTED = "1. Not Started"
    LESS_THAN_FIFTY_PERCENT_COMPLETE = "2. Less than 50 percent complete"
    MORE_THAN_FIFTY_PERCENT_COMPLETE = "3. More than 50 percent complete"
    COMPLETED = "4. Completed"

    def __str__(self) -> str:
        return self.value


class YesNoType(str, Enum):
    YES = "Yes"
    NO = "No"

    def __str__(self) -> str:
        return self.value


class TechType(str, Enum):
    FIBER = "1. Fiber"
    COAXIAL_CABLE = "2. Coaxial Cable"
    FIXED_WIRELESS = "3. Fixed Wireless"
    OTHER = "4. Other"

    def __str__(self) -> str:
        return self.value


class ProjectInvestmentType(str, Enum):
    NEW_CONSTRUCTION = "1. New Construction"
    RENOVATION = "2. Renovation"

    def __str__(self) -> str:
        return self.value


class BaseProjectRow(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True, loc_by_alias=False)

    row_num: CustomInt_GE1 = Field(
        default=1,
        serialization_alias="Row Number",
        json_schema_extra={
            "column": None,
            "treasury_report_col_1A": None,
            "treasury_report_col_1B": None,
            "treasury_report_col_1C": None,
        },
    )
    Project_Name__c: CustomStr_MIN1_MAX100 = Field(
        ...,
        serialization_alias="Project Name",
        json_schema_extra={
            "column": "C",
            "treasury_report_col_1A": "B",
            "treasury_report_col_1B": "B",
            "treasury_report_col_1C": "B",
        },
    )
    Identification_Number__c: CustomStr_MIN1_MAX20 = Field(
        ...,
        serialization_alias="Identification Number",
        json_schema_extra={
            "column": "D",
            "treasury_report_col_1A": "C",
            "treasury_report_col_1B": "C",
            "treasury_report_col_1C": "C",
        },
    )
    Subrecipient_UEI__c: CustomStr_MIN12_MAX12 = Field(
        ...,
        serialization_alias="Subrecipient UEI",
        json_schema_extra={
            "column": "E",
            "treasury_report_col_1A": "D",
            "treasury_report_col_1B": "D",
            "treasury_report_col_1C": "D",
        },
    )
    Subrecipient_TIN__c: CustomStr_MIN9_MAX9 = Field(
        ...,
        serialization_alias="Subrecipient TIN",
        json_schema_extra={
            "column": "F",
            "treasury_report_col_1A": "E",
            "treasury_report_col_1B": "E",
            "treasury_report_col_1C": "E",
        },
    )
    Project_Description__c: CustomStr_MIN1_MAX3000 = Field(
        ...,
        serialization_alias="Project Description",
        json_schema_extra={
            "column": "G",
            "treasury_report_col_1A": "F",
            "treasury_report_col_1B": "F",
            "treasury_report_col_1C": "F",
        },
    )
    Capital_Asset_Ownership_Type__c: CapitalAssetOwnershipType = Field(
        ...,
        serialization_alias="Capital Asset Owenership Type",
        json_schema_extra={
            "column": "H",
            "treasury_report_col_1A": "G",
            "treasury_report_col_1B": "G",
            "treasury_report_col_1C": "G",
        },
    )
    Total_CPF_Funding_for_Project__c: CustomDecimal_13Digits = Field(
        ...,
        serialization_alias="Total CPF Funding for Project",
        json_schema_extra={
            "column": "I",
            "treasury_report_col_1A": "H",
            "treasury_report_col_1B": "H",
            "treasury_report_col_1C": "H",
        },
    )
    Total_from_all_funding_sources__c: CustomDecimal_13Digits = Field(
        ...,
        serialization_alias="Total From all Funding Sources",
        json_schema_extra={
            "column": "J",
            "treasury_report_col_1A": "I",
            "treasury_report_col_1B": "I",
            "treasury_report_col_1C": "I",
        },
    )
    Narrative_Description__c: Optional[str] = Field(
        default=None,
        serialization_alias="Narrative Description",
        max_length=3000,
        json_schema_extra={
            "column": "K",
            "treasury_report_col_1A": "J",
            "treasury_report_col_1B": "J",
            "treasury_report_col_1C": "J",
        },
    )
    Current_Period_Obligation__c: CustomDecimal_12Digits = Field(
        ...,
        serialization_alias="Current Period Obligation",
        json_schema_extra={
            "column": "L",
            "treasury_report_col_1A": "K",
            "treasury_report_col_1B": "K",
            "treasury_report_col_1C": "K",
        },
    )
    Current_Period_Expenditure__c: CustomDecimal_12Digits = Field(
        ...,
        serialization_alias="Current Period Expenditure",
        json_schema_extra={
            "column": "M",
            "treasury_report_col_1A": "L",
            "treasury_report_col_1B": "L",
            "treasury_report_col_1C": "L",
        },
    )
    Cumulative_Obligation__c: CustomDecimal_12Digits = Field(
        ...,
        serialization_alias="Cumulative Obligation",
        json_schema_extra={
            "column": "N",
            "treasury_report_col_1A": "M",
            "treasury_report_col_1B": "M",
            "treasury_report_col_1C": "M",
        },
    )
    Cumulative_Expenditure__c: CustomDecimal_12Digits = Field(
        ...,
        serialization_alias="Cumulative Expenditure",
        json_schema_extra={
            "column": "O",
            "treasury_report_col_1A": "N",
            "treasury_report_col_1B": "N",
            "treasury_report_col_1C": "N",
        },
    )
    Cost_Overview__c: CustomStr_MIN1_MAX3000 = Field(
        ...,
        serialization_alias="Cost Overview",
        json_schema_extra={
            "column": "P",
            "treasury_report_col_1A": "O",
            "treasury_report_col_1B": "U",
            "treasury_report_col_1C": "U",
        },
    )
    Project_Status__c: ProjectStatusType = Field(
        ...,
        serialization_alias="Project Status",
        json_schema_extra={
            "column": "Q",
            "treasury_report_col_1A": "P",
            "treasury_report_col_1B": "V",
            "treasury_report_col_1C": "V",
        },
    )
    Projected_Con_Start_Date__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Projected Con. Start Date",
        json_schema_extra={
            "column": "R",
            "treasury_report_col_1A": "Q",
            "treasury_report_col_1B": "W",
            "treasury_report_col_1C": "W",
        },
    )
    Projected_Con_Completion__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Projected Con. Completion",
        json_schema_extra={
            "column": "S",
            "treasury_report_col_1A": "R",
            "treasury_report_col_1B": "X",
            "treasury_report_col_1C": "X",
        },
    )
    Projected_Init_of_Operations__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Projected Init. of Operations",
        json_schema_extra={
            "column": "T",
            "treasury_report_col_1A": "S",
            "treasury_report_col_1B": "Y",
            "treasury_report_col_1C": "Y",
        },
    )
    Actual_Con_Start_Date__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Actual Con. Start Date",
        json_schema_extra={
            "column": "U",
            "treasury_report_col_1A": "T",
            "treasury_report_col_1B": "Z",
            "treasury_report_col_1C": "Z",
        },
    )
    Actual_Con_Completion__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Actual Con. Completion",
        json_schema_extra={
            "column": "V",
            "treasury_report_col_1A": "U",
            "treasury_report_col_1B": "AA",
            "treasury_report_col_1C": "AA",
        },
    )
    Operations_initiated__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Operations Initiated",
        json_schema_extra={
            "column": "W",
            "treasury_report_col_1A": "V",
            "treasury_report_col_1B": "AB",
            "treasury_report_col_1C": "AB",
        },
    )
    Actual_operations_date__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Actual operations date",
        json_schema_extra={
            "column": "X",
            "treasury_report_col_1A": "W",
            "treasury_report_col_1B": "AC",
            "treasury_report_col_1C": "AC",
        },
    )
    Operations_explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Operations explanation",
        max_length=3000,
        json_schema_extra={
            "column": "Y",
            "treasury_report_col_1A": "X",
            "treasury_report_col_1B": "AD",
            "treasury_report_col_1C": "AD",
        },
    )
    Other_Federal_Funding__c: YesNoType = Field(
        ...,
        serialization_alias="Other Federal Funding?",
        json_schema_extra={
            "column": "Z",
            "treasury_report_col_1A": "Y",
            "treasury_report_col_1B": "AE",
            "treasury_report_col_1C": "AF",
        },
    )
    Matching_Funds__c: YesNoType = Field(
        ...,
        serialization_alias="Matching Funds?",
        json_schema_extra={
            "column": "AA",
            "treasury_report_col_1A": "Z",
            "treasury_report_col_1B": "AF",
            "treasury_report_col_1C": "AE",
        },
    )
    Program_Information__c: Optional[str] = Field(
        default=None,
        serialization_alias="Program Information",
        max_length=50,
        json_schema_extra={
            "column": "AB",
            "treasury_report_col_1A": "AA",
            "treasury_report_col_1B": "AG",
            "treasury_report_col_1C": "AG",
        },
    )
    Amount_of_Matching_Funds__c: Optional[CustomDecimal_12Digits] = Field(
        default=None,
        serialization_alias="Amount of Matching Funds",
        json_schema_extra={
            "column": "AC",
            "treasury_report_col_1A": "AB",
            "treasury_report_col_1B": "AH",
            "treasury_report_col_1C": "AH",
        },
    )
    Target_Project_Info__c: Optional[str] = Field(
        default=None,
        serialization_alias="Target Project Info",
        max_length=3000,
        json_schema_extra={
            "column": "AD",
            "treasury_report_col_1A": "AC",
            "treasury_report_col_1B": "AI",
            "treasury_report_col_1C": "AI",
        },
    )
    Davis_Bacon_Certification__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Davis Bacon Certification?",
        json_schema_extra={
            "column": "AE",
            "treasury_report_col_1A": "AD",
            "treasury_report_col_1B": "AJ",
            "treasury_report_col_1C": "AJ",
        },
    )
    Number_of_Direct_Employees__c: Optional[CustomInt_GE0_LELARGE3] = Field(
        default=None,
        serialization_alias="Number of Direct Employees",
        json_schema_extra={
            "column": "AF",
            "treasury_report_col_1A": "AE",
            "treasury_report_col_1B": "AK",
            "treasury_report_col_1C": "AK",
        },
    )
    Number_of_Contractor_Employees__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Number of Contractor Employees",
        json_schema_extra={
            "column": "AG",
            "treasury_report_col_1A": "AF",
            "treasury_report_col_1B": "AL",
            "treasury_report_col_1C": "AL",
        },
    )
    Number_of_3rd_Party_Employees__c: Optional[CustomInt_GE0_LELARGE4] = Field(
        default=None,
        serialization_alias="Number of 3rd Party Employees",
        json_schema_extra={
            "column": "AH",
            "treasury_report_col_1A": "AG",
            "treasury_report_col_1B": "AM",
            "treasury_report_col_1C": "AM",
        },
    )
    Any_Wages_Less_Than_Prevailing__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Any Wages Less Than Prevailing?",
        json_schema_extra={
            "column": "AI",
            "treasury_report_col_1A": "AH",
            "treasury_report_col_1B": "AN",
            "treasury_report_col_1C": "AN",
        },
    )
    Wages_and_benefits__c: Optional[str] = Field(
        default=None,
        serialization_alias="Wages and benefits of workers on the project by classification",
        max_length=3000,
        json_schema_extra={
            "column": "AJ",
            "treasury_report_col_1A": "AI",
            "treasury_report_col_1B": "AO",
            "treasury_report_col_1C": "AO",
        },
    )
    Project_Labor_Certification__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Project Labor Certification?",
        json_schema_extra={
            "column": "AK",
            "treasury_report_col_1A": "AJ",
            "treasury_report_col_1B": "AP",
            "treasury_report_col_1C": "AP",
        },
    )
    Assurance_of_Adequate_Labor__c: Optional[str] = Field(
        default=None,
        serialization_alias="Assurance of Adequate Labor?",
        max_length=3000,
        json_schema_extra={
            "column": "AL",
            "treasury_report_col_1A": "AK",
            "treasury_report_col_1B": "AQ",
            "treasury_report_col_1C": "AQ",
        },
    )
    Minimizing_Risks__c: Optional[str] = Field(
        default=None,
        serialization_alias="Minimizing Risks?",
        max_length=3000,
        json_schema_extra={
            "column": "AM",
            "treasury_report_col_1A": "AL",
            "treasury_report_col_1B": "AR",
            "treasury_report_col_1C": "AR",
        },
    )
    Safe_and_Healthy_Workplace__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explain Safe and Healthy Workplace",
        max_length=3000,
        json_schema_extra={
            "column": "AN",
            "treasury_report_col_1A": "AM",
            "treasury_report_col_1B": "AS",
            "treasury_report_col_1C": "AS",
        },
    )
    Adequate_Wages__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Adequate Wages?",
        json_schema_extra={
            "column": "AO",
            "treasury_report_col_1A": "AN",
            "treasury_report_col_1B": "AT",
            "treasury_report_col_1C": "AT",
        },
    )
    Project_Labor_Agreement__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Project Labor Agreement?",
        json_schema_extra={
            "column": "AP",
            "treasury_report_col_1A": "AO",
            "treasury_report_col_1B": "AU",
            "treasury_report_col_1C": "AU",
        },
    )
    Prioritize_Local_Hires__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Prioritize Local Hires?",
        json_schema_extra={
            "column": "AQ",
            "treasury_report_col_1A": "AP",
            "treasury_report_col_1B": "AV",
            "treasury_report_col_1C": "AV",
        },
    )
    Community_Benefit_Agreement__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Community Benefit Agreement?",
        json_schema_extra={
            "column": "AR",
            "treasury_report_col_1A": "AQ",
            "treasury_report_col_1B": "AW",
            "treasury_report_col_1C": "AW",
        },
    )
    Description_of_Community_Ben_Agr__c: Optional[str] = Field(
        default=None,
        serialization_alias="Description of Community Ben. Agr.",
        max_length=3000,
        json_schema_extra={
            "column": "AS",
            "treasury_report_col_1A": "AR",
            "treasury_report_col_1B": "AX",
            "treasury_report_col_1C": "AX",
        },
    )

    @field_validator(
        "Projected_Con_Start_Date__c",
        "Projected_Con_Completion__c",
        "Projected_Init_of_Operations__c",
        "Actual_Con_Start_Date__c",
        "Actual_Con_Completion__c",
        "Actual_operations_date__c",
    )
    @classmethod
    def parse_mm_dd_yyyy_dates(cls, v: Union[datetime, str]) -> datetime:
        if isinstance(v, str):
            try:
                return datetime.strptime(v, "%m/%d/%Y")
            except ValueError:
                raise ValueError(f"Date {v} is not in 'mm/dd/yyyy' format.")
        return v

    @field_serializer(
        "Projected_Con_Start_Date__c",
        "Projected_Con_Completion__c",
        "Projected_Init_of_Operations__c",
        "Actual_Con_Start_Date__c",
        "Actual_Con_Completion__c",
        "Actual_operations_date__c",
    )
    def serialize_mm_dd_yyyy_dates(self, value: datetime) -> str:
        if value:
            return value.strftime("%m/%d/%Y")
        else:
            return ""

    @field_validator(
        "Project_Name__c",
        "Identification_Number__c",
        "Project_Description__c",
        "Capital_Asset_Ownership_Type__c",
        "Total_CPF_Funding_for_Project__c",
        "Total_from_all_funding_sources__c",
        "Current_Period_Obligation__c",
        "Current_Period_Expenditure__c",
        "Cumulative_Obligation__c",
        "Cumulative_Expenditure__c",
        "Cost_Overview__c",
        "Project_Status__c",
    )
    @classmethod
    def validate_field(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if isinstance(v, str) and v.strip() == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class Project1ARow(BaseProjectRow):
    Technology_Type_Planned__c: TechType = Field(
        ...,
        serialization_alias="Technology Type (Planned)",
        json_schema_extra={"column": "AT", "treasury_report_col_1A": "AT"},
    )
    Technology_Type_Actual__c: Optional[TechType] = Field(
        default=None,
        serialization_alias="Technology Type (Actual)",
        json_schema_extra={"column": "AU", "treasury_report_col_1A": "AU"},
    )
    If_Other_Specify_Planned__c: Optional[str] = Field(
        default=None,
        serialization_alias="If Other, Specify (Planned)?",
        max_length=3000,
        json_schema_extra={"column": "AV", "treasury_report_col_1A": "AV"},
    )
    If_Other_Specify_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="If Other, Specify (Actual?)?",
        max_length=3000,
        json_schema_extra={"column": "AW", "treasury_report_col_1A": "AW"},
    )
    Total_Miles_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="Total Miles of Fiber Deployed (Planned)",
        json_schema_extra={"column": "AX", "treasury_report_col_1A": "AX"},
    )
    Total_Miles_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="Total Miles of Fiber Deployed (Actual)",
        json_schema_extra={"column": "AY", "treasury_report_col_1A": "AY"},
    )
    Locations_Served_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="A) Total Number of Locations Served (Planned)",
        json_schema_extra={"column": "AZ", "treasury_report_col_1A": "AZ"},
    )
    Locations_Served_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="A) Total Number of Locations Served (Actual)",
        json_schema_extra={"column": "BA", "treasury_report_col_1A": "BA"},
    )
    X25_3_Mbps_or_below_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="B) Less than 25/3 Mbps (Planned)",
        json_schema_extra={"column": "BB", "treasury_report_col_1A": "BB"},
    )
    X25_3_Mbps_and_100_20_Mbps_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="C) 25/3 Mbps and 100/20 Mbps (Planned)",
        json_schema_extra={"column": "BC", "treasury_report_col_1A": "BC"},
    )
    Minimum_100_100_Mbps_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="D) Minimum 100/100 Mbps (Planned) ",
        json_schema_extra={"column": "BD", "treasury_report_col_1A": "BD"},
    )
    Minimum_100_100_Mbps_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="D) Minimum 100/100 Mbps (Actual) ",
        json_schema_extra={"column": "BE", "treasury_report_col_1A": "BE"},
    )
    X100_20_Mbps_to_100_100_Mbps_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="E) 100/20 Mbps to 100/100 Mbps (Planned)",
        json_schema_extra={"column": "BF", "treasury_report_col_1A": "BF"},
    )
    X100_20_Mbps_to_100_100_Mbps_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="E) 100/20 Mbps to 100/100 Mbps (Actual)",
        json_schema_extra={"column": "BG", "treasury_report_col_1A": "BG"},
    )
    Explanation_of_Discrepancy__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explanation of Discrepancy (Location by Speed)",
        max_length=3000,
        json_schema_extra={"column": "BH", "treasury_report_col_1A": "BH"},
    )
    Number_of_Locations_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="F) Total Number of Locations Served by Type - Residential (Planned)",
        json_schema_extra={"column": "BI", "treasury_report_col_1A": "BJ"},
    )
    Number_of_Locations_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="F) Total Number of Locations Served by Type - Residential (Actual)",
        json_schema_extra={"column": "BJ", "treasury_report_col_1A": "BK"},
    )
    Housing_Units_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="G) Total Housing Units (Planned)",
        json_schema_extra={"column": "BK", "treasury_report_col_1A": "BL"},
    )
    Housing_Units_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="G) Total Housing Units (Actual)",
        json_schema_extra={"column": "BL", "treasury_report_col_1A": "BM"},
    )
    Number_of_Bus_Locations_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="H) Total Number of Locations Served by Type - Business (Planned)",
        json_schema_extra={"column": "BM", "treasury_report_col_1A": "BN"},
    )
    Number_of_Bus_Locations_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="H) Total Number of Locations Served by Type - Business (Actual)",
        json_schema_extra={"column": "BN", "treasury_report_col_1A": "BO"},
    )
    Number_of_CAI_Planned__c: CustomInt_GE0_LELARGE = Field(
        ...,
        serialization_alias="I) Total Number of Locations Served by Type - Community Anchor Institution (Planned)",
        json_schema_extra={"column": "BO", "treasury_report_col_1A": "BP"},
    )
    Number_of_CAI_Actual__c: Optional[CustomInt_GE0_LELARGE] = Field(
        default=None,
        serialization_alias="I) Total Number of Locations Served by Type - Community Anchor Institution (Actual)",
        json_schema_extra={"column": "BP", "treasury_report_col_1A": "BQ"},
    )
    Explanation_Planned__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explanation (Planned)",
        max_length=3000,
        json_schema_extra={"column": "BQ", "treasury_report_col_1A": "BI"},
    )
    Affordable_Connectivity_Program_ACP__c: YesNoType = Field(
        ...,
        serialization_alias="Affordable Connectivity Program (ACP)?",
        json_schema_extra={"column": "BR", "treasury_report_col_1A": "BR"},
    )
    Is_this_a_middle_mile_Project__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Is this a middle mile Project?",
        json_schema_extra={"column": "DV", "treasury_report_col_1A": "AS"},
    )

    @field_validator(
        "Technology_Type_Planned__c",
        "Total_Miles_Planned__c",
        "Locations_Served_Planned__c",
        "X25_3_Mbps_or_below_Planned__c",
        "X25_3_Mbps_and_100_20_Mbps_Planned__c",
        "Minimum_100_100_Mbps_Planned__c",
        "X100_20_Mbps_to_100_100_Mbps_Planned__c",
        "Number_of_Locations_Planned__c",
        "Housing_Units_Planned__c",
        "Number_of_Bus_Locations_Planned__c",
        "Number_of_CAI_Planned__c",
        "Affordable_Connectivity_Program_ACP__c",
    )
    @classmethod
    def validate_field(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if isinstance(v, str) and v.strip() == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class AddressFields(BaseModel):
    Street_1_Planned__c: CustomStr_MIN1_MAX40 = Field(
        ...,
        serialization_alias="Street 1 (Planned)",
        json_schema_extra={
            "column": "BS",
            "treasury_report_col_1B": "AY",
            "treasury_report_col_1C": "AY",
        },
    )
    Street_2_Planned__c: Optional[str] = Field(
        default=None,
        serialization_alias="Street 2 (Planned)",
        max_length=40,
        json_schema_extra={
            "column": "BT",
            "treasury_report_col_1B": "AZ",
            "treasury_report_col_1C": "AZ",
        },
    )
    Same_Address__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Same Address",
        json_schema_extra={
            "column": "BU",
            "treasury_report_col_1B": "BI",
            "treasury_report_col_1C": "BI",
        },
    )
    Street_1_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Street 1 (Actual)",
        max_length=40,
        json_schema_extra={
            "column": "BV",
            "treasury_report_col_1B": "BA",
            "treasury_report_col_1C": "BA",
        },
    )
    Street_2_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Street 2 (Actual)",
        max_length=40,
        json_schema_extra={
            "column": "BW",
            "treasury_report_col_1B": "BB",
            "treasury_report_col_1C": "BB",
        },
    )
    City_Planned__c: CustomStr_MIN1_MAX40 = Field(
        ...,
        serialization_alias="City (Planned)",
        json_schema_extra={
            "column": "BX",
            "treasury_report_col_1B": "BC",
            "treasury_report_col_1C": "BC",
        },
    )
    City_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="City (Actual)",
        max_length=40,
        json_schema_extra={
            "column": "BY",
            "treasury_report_col_1B": "BD",
            "treasury_report_col_1C": "BD",
        },
    )
    State_Planned__c: StateAbbreviation = Field(
        ...,
        serialization_alias="State (Planned)",
        json_schema_extra={
            "column": "BZ",
            "treasury_report_col_1B": "BE",
            "treasury_report_col_1C": "BE",
        },
    )
    State_Actual__c: Optional[StateAbbreviation] = Field(
        default=None,
        serialization_alias="State (Actual)",
        json_schema_extra={
            "column": "CA",
            "treasury_report_col_1B": "BF",
            "treasury_report_col_1C": "BF",
        },
    )
    Zip_Code_Planned__c: CustomStr_MIN1_MAX5 = Field(
        ...,
        serialization_alias="Zip Code (Planned)",
        json_schema_extra={
            "column": "CB",
            "treasury_report_col_1B": "BG",
            "treasury_report_col_1C": "BG",
        },
    )
    Zip_Code_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Zip Code (Actual)",
        max_length=5,
        json_schema_extra={
            "column": "CC",
            "treasury_report_col_1B": "BH",
            "treasury_report_col_1C": "BH",
        },
    )

    @field_validator(
        "Street_1_Planned__c",
        "City_Planned__c",
        "Zip_Code_Planned__c",
    )
    @classmethod
    def validate_field(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if isinstance(v, str) and v.strip() == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class Project1BRow(BaseProjectRow, AddressFields):
    Laptops_Planned__c: CustomInt_GE0_LELARGE2 = Field(
        ...,
        serialization_alias="Laptops (Planned)",
        json_schema_extra={"column": "CD", "treasury_report_col_1B": "BJ"},
    )
    Laptops_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Laptops (Actual)",
        json_schema_extra={"column": "CE", "treasury_report_col_1B": "BK"},
    )
    Laptops_Expenditures_Planned__c: CustomDecimal_13Digits = Field(
        ...,
        serialization_alias="Laptops Expenditure (Planned)",
        json_schema_extra={"column": "CF", "treasury_report_col_1B": "BL"},
    )
    Laptops_Expenditures_Actual__c: Optional[CustomDecimal_13Digits] = Field(
        default=None,
        serialization_alias="Laptops Expenditure (Actual)",
        json_schema_extra={"column": "CG", "treasury_report_col_1B": "BM"},
    )
    Tablets_Planned__c: CustomInt_GE0_LELARGE2 = Field(
        ...,
        serialization_alias="Tablets (Planned)",
        json_schema_extra={"column": "CH", "treasury_report_col_1B": "BN"},
    )
    Tablets_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Tablets (Actual)",
        json_schema_extra={"column": "CI", "treasury_report_col_1B": "BO"},
    )
    Tablet_Expenditures_Planned__c: CustomDecimal_13Digits = Field(
        ...,
        serialization_alias="Tablets Expenditure (Planned)",
        json_schema_extra={"column": "CJ", "treasury_report_col_1B": "BP"},
    )
    Tablets_Expenditures_Actual__c: Optional[CustomDecimal_13Digits] = Field(
        default=None,
        serialization_alias="Tablets Expenditure (Actual)",
        json_schema_extra={"column": "CK", "treasury_report_col_1B": "BQ"},
    )
    Desktop_Computers_Planned__c: CustomInt_GE0_LELARGE2 = Field(
        ...,
        serialization_alias="Desktop Computers (Planned)",
        json_schema_extra={"column": "CL", "treasury_report_col_1B": "BR"},
    )
    Desktop_Computers_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Desktop Computers (Actual)",
        json_schema_extra={"column": "CM", "treasury_report_col_1B": "BS"},
    )
    Desktop_Computers_Expenditures_Planned__c: CustomDecimal_13Digits = Field(
        ...,
        serialization_alias="Desktop Computers Expenditure (Planned)",
        json_schema_extra={"column": "CN", "treasury_report_col_1B": "BT"},
    )
    Desktop_Computers_Expenditures_Actual__c: Optional[CustomDecimal_13Digits] = Field(
        default=None,
        serialization_alias="Desktop Computers Expenditure (Actual)",
        json_schema_extra={"column": "CO", "treasury_report_col_1B": "BU"},
    )
    Public_WiFi_Planned__c: CustomInt_GE0_LELARGE2 = Field(
        ...,
        serialization_alias="Public WiFi (Planned)",
        json_schema_extra={"column": "CP", "treasury_report_col_1B": "BV"},
    )
    Public_WiFi_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Public WiFi (Actual)",
        json_schema_extra={"column": "CQ", "treasury_report_col_1B": "BW"},
    )
    Public_WiFi_Expenditures_Planned__c: CustomDecimal_13Digits = Field(
        ...,
        serialization_alias="Public Wifi Expenditures (Planned)",
        json_schema_extra={"column": "CR", "treasury_report_col_1B": "BX"},
    )
    Public_WiFi_Expenditures_Actual__c: Optional[CustomDecimal_13Digits] = Field(
        default=None,
        serialization_alias="Public Wifi Expenditures (Actual)",
        json_schema_extra={"column": "CS", "treasury_report_col_1B": "BY"},
    )
    Other_Devices_Planned__c: CustomInt_GE0_LELARGE2 = Field(
        ...,
        serialization_alias="Other Devices (Planned)",
        json_schema_extra={"column": "CT", "treasury_report_col_1B": "BZ"},
    )
    Other_Devices_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Other Devices (Actual)",
        json_schema_extra={"column": "CU", "treasury_report_col_1B": "CA"},
    )
    Other_Expenditures_Planned__c: CustomDecimal_7Digits = Field(
        ...,
        serialization_alias="Other Expenditures (Planned)",
        json_schema_extra={"column": "CV", "treasury_report_col_1B": "CB"},
    )
    Other_Expenditures_Actual__c: Optional[CustomDecimal_7Digits] = Field(
        default=None,
        serialization_alias="Other Expenditures (Actual)",
        json_schema_extra={"column": "CW", "treasury_report_col_1B": "CC"},
    )
    Explanation_of_Other_Expend__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explanation of Other Expenditures",
        max_length=3000,
        json_schema_extra={"column": "CX", "treasury_report_col_1B": "CD"},
    )
    Number_of_Users_Planned__c: CustomInt_GE0_LELARGE2 = Field(
        ...,
        serialization_alias="Number of Users (Planned)",
        json_schema_extra={"column": "CY", "treasury_report_col_1B": "CE"},
    )
    Number_of_Users_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Number of Users (Actual)",
        json_schema_extra={"column": "CZ", "treasury_report_col_1B": "CF"},
    )
    Brief_Narrative_Planned__c: CustomStr_MIN1_MAX3000 = Field(
        ...,
        serialization_alias="Brief Narrative (Planned)",
        json_schema_extra={"column": "DA", "treasury_report_col_1B": "CG"},
    )
    Brief_Narrative_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Brief Narrative (Actual)",
        max_length=3000,
        json_schema_extra={"column": "DB", "treasury_report_col_1B": "CH"},
    )
    Measurement_of_Effectiveness__c: YesNoType = Field(
        ...,
        serialization_alias="Measurement of Effectiveness?",
        json_schema_extra={"column": "DC", "treasury_report_col_1B": "CI"},
    )
    # Columns below exist on Project1CRow as well as Project1BRow, so they jump in column defs
    Current_Program_Income_Earned__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Current Period Program Income Earned",
        json_schema_extra={"column": "DW", "treasury_report_col_1B": "O"},
    )
    Current_Program_Income_Expended__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Current Period Program Income Expended",
        json_schema_extra={"column": "DX", "treasury_report_col_1B": "P"},
    )
    Cumulative_Program_Income_Earned__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Earned",
        json_schema_extra={"column": "DY", "treasury_report_col_1B": "Q"},
    )
    Cumulative_Program_Income_Expended__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Expended",
        json_schema_extra={"column": "DZ", "treasury_report_col_1B": "R"},
    )
    Program_Income_2_CFR__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Program Income Pursuant",
        json_schema_extra={"column": "EA", "treasury_report_col_1B": "S"},
    )
    Program_Income_2_CFR_Explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Program Income Pursuant Explanation",
        max_length=3000,
        json_schema_extra={"column": "EB", "treasury_report_col_1B": "T"},
    )

    @field_validator(
        "Laptops_Planned__c",
        "Laptops_Expenditures_Planned__c",
        "Tablets_Planned__c",
        "Tablet_Expenditures_Planned__c",
        "Desktop_Computers_Planned__c",
        "Desktop_Computers_Expenditures_Planned__c",
        "Public_WiFi_Planned__c",
        "Public_WiFi_Expenditures_Planned__c",
        "Other_Devices_Planned__c",
        "Other_Expenditures_Planned__c",
        "Number_of_Users_Planned__c",
        "Brief_Narrative_Planned__c",
        "Measurement_of_Effectiveness__c",
    )
    @classmethod
    def validate_field(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if isinstance(v, str) and v.strip() == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class Project1CRow(BaseProjectRow, AddressFields):
    Type_of_Investment__c: Optional[str] = Field(
        default=None,
        serialization_alias="Type of Investment",
        json_schema_extra={"column": "DD", "treasury_report_col_1C": "BJ"},
    )
    Additional_Address__c: Optional[str] = Field(
        default=None,
        serialization_alias="Additional Addresses",
        max_length=32000,
        json_schema_extra={"column": "DE", "treasury_report_col_1C": "BK"},
    )
    Classrooms_Planned__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Classrooms (Planned)",
        json_schema_extra={"column": "DF", "treasury_report_col_1C": "BL"},
    )
    Classrooms_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Classrooms (Actual)",
        json_schema_extra={"column": "DG", "treasury_report_col_1C": "BM"},
    )
    Computer_labs_Planned__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Computer labs (Planned)",
        json_schema_extra={"column": "DH", "treasury_report_col_1C": "BN"},
    )
    Computer_labs_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Computer labs (Actual)",
        json_schema_extra={"column": "DI", "treasury_report_col_1C": "BO"},
    )
    Multi_purpose_Spaces_Planned__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Multi-purpose Spaces (Planned)",
        json_schema_extra={"column": "DJ", "treasury_report_col_1C": "BP"},
    )
    Multi_purpose_Spaces_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Multi-purpose Spaces (Actual)",
        json_schema_extra={"column": "DK", "treasury_report_col_1C": "BQ"},
    )
    Telemedicine_Rooms_Planned__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Telemedicine Rooms (Planned)",
        json_schema_extra={"column": "DL", "treasury_report_col_1C": "BR"},
    )
    Telemedicine_Rooms_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Telemedicine Rooms (Actual)",
        json_schema_extra={"column": "DM", "treasury_report_col_1C": "BS"},
    )
    Other_Capital_Assets_Planned__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Other Capital Assets (Planned)",
        json_schema_extra={"column": "DN", "treasury_report_col_1C": "BT"},
    )
    Other_Capital_Assets_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Other Capital Assets (Actual)",
        json_schema_extra={"column": "DO", "treasury_report_col_1C": "BU"},
    )
    Type_and_Features__c: Optional[str] = Field(
        default=None,
        serialization_alias="Type and Features",
        max_length=3000,
        json_schema_extra={"column": "DP", "treasury_report_col_1C": "BV"},
    )
    Total_square_footage_Planned__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Total square footage (Planned)",
        json_schema_extra={"column": "DQ", "treasury_report_col_1C": "BW"},
    )
    Total_square_footage_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Total square footage (Actual)",
        json_schema_extra={"column": "DR", "treasury_report_col_1C": "BX"},
    )
    Total_Number_of_Users_Actual__c: Optional[CustomInt_GE0_LELARGE2] = Field(
        default=None,
        serialization_alias="Total Number of Users (Actual)",
        json_schema_extra={"column": "DS", "treasury_report_col_1C": "BY"},
    )
    Further_Explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Further Explanation",
        max_length=2000,
        json_schema_extra={"column": "DT", "treasury_report_col_1C": "BZ"},
    )
    Access_to_Public_Transit__c: YesNoType = Field(
        ...,
        serialization_alias="Access to Public Transit?",
        json_schema_extra={"column": "DU", "treasury_report_col_1C": "CA"},
    )
    # Columns below exist on Project1BRow as well as Project1CRow
    Current_Program_Income_Earned__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Current Period Program Income Earned",
        json_schema_extra={"column": "DW", "treasury_report_col_1C": "O"},
    )
    Current_Program_Income_Expended__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Current Period Program Income Expended",
        json_schema_extra={"column": "DX", "treasury_report_col_1C": "P"},
    )
    Cumulative_Program_Income_Earned__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Earned",
        json_schema_extra={"column": "DY", "treasury_report_col_1C": "Q"},
    )
    Cumulative_Program_Income_Expended__c: Optional[CustomDecimal_15Digits] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Expended",
        json_schema_extra={"column": "DZ", "treasury_report_col_1C": "R"},
    )
    Program_Income_2_CFR__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Program Income Pursuant",
        json_schema_extra={"column": "EA", "treasury_report_col_1C": "S"},
    )
    Program_Income_2_CFR_Explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Program Income Pursuant Explanation",
        max_length=3000,
        json_schema_extra={"column": "EB", "treasury_report_col_1C": "T"},
    )

    @field_validator("Access_to_Public_Transit__c")
    @classmethod
    def validate_field(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if isinstance(v, str) and v.strip() == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class SubrecipientRow(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True, loc_by_alias=False)

    Name: CustomStr_MIN1_MAX80 = Field(
        ...,
        serialization_alias="Subrecipient Name",
        json_schema_extra={"column": "C", "output_column": "B"},
    )
    Recipient_Profile_ID__c: Optional[CustomStr_MIN1_MAX100] = Field(
        default=None,
        serialization_alias="Recipient ID",
        json_schema_extra={"column": "D", "output_column": "C"},
    )
    EIN__c: CustomStr_MIN9_MAX9 = Field(
        ...,
        serialization_alias="Subrecipient Tax ID Number (TIN)",
        json_schema_extra={"column": "E", "output_column": "D"},
    )
    Unique_Entity_Identifier__c: CustomStr_MIN12_MAX12 = Field(
        ...,
        serialization_alias="Unique Entity Identifier (UEI)",
        json_schema_extra={"column": "F", "output_column": "E"},
    )
    POC_Name__c: CustomStr_MIN1_MAX100 = Field(
        ...,
        serialization_alias="POC Name",
        json_schema_extra={"column": "G", "output_column": "F"},
    )
    POC_Phone_Number__c: CustomStr_MIN1_MAX10 = Field(
        ...,
        serialization_alias="POC Phone Number",
        json_schema_extra={"column": "H", "output_column": "G"},
    )
    POC_Email_Address__c: CustomStr_MIN1_MAX80 = Field(
        ...,
        serialization_alias="POC Email Address",
        json_schema_extra={"column": "I", "output_column": "H"},
    )
    Zip__c: CustomStr_MIN1_MAX5 = Field(
        ...,
        serialization_alias="Zip5",
        json_schema_extra={"column": "J", "output_column": "I"},
    )
    Zip_4__c: Optional[str] = Field(
        default=None,
        serialization_alias="Zip4",
        max_length=4,
        json_schema_extra={"column": "K", "output_column": "J"},
    )
    Address__c: CustomStr_MIN1_MAX40 = Field(
        ...,
        serialization_alias="Address Line 1",
        json_schema_extra={"column": "L", "output_column": "K"},
    )
    Address_2__c: Optional[str] = Field(
        default=None,
        serialization_alias="Address Line 2",
        max_length=40,
        json_schema_extra={"column": "M", "output_column": "L"},
    )
    Address_3__c: Optional[str] = Field(
        default=None,
        serialization_alias="Address Line 3",
        max_length=40,
        json_schema_extra={"column": "N", "output_column": "M"},
    )
    City__c: CustomStr_MIN1_MAX100 = Field(
        ...,
        serialization_alias="City",
        json_schema_extra={"column": "O", "output_column": "N"},
    )
    State_Abbreviated__c: StateAbbreviation = Field(
        ...,
        serialization_alias="State Abbreviated",
        json_schema_extra={"column": "P", "output_column": "O"},
    )

    @field_validator(
        "Name",
        "EIN__c",
        "Unique_Entity_Identifier__c",
        "POC_Name__c",
        "POC_Phone_Number__c",
        "POC_Email_Address__c",
        "Zip__c",
        "Address__c",
        "City__c",
        "State_Abbreviated__c",
    )
    @classmethod
    def validate_field(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if isinstance(v, str) and v.strip() == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


METADATA_BY_SHEET = {
    "Cover": {
        "header_range": "A1:B1",
        "min_row": 2,
        "max_row": 2,
        "min_col": 1,
        "max_col": 2,
    },
    "Subrecipients": {
        "header_range": "C3:P3",
        "min_row": 13,
        "max_row": None,
        "min_col": 3,
        "max_col": 16,
    },
    "Project": {
        "header_range": "C3:EB3",
        "min_row": 13,
        "max_row": None,
        "min_col": 3,
        "max_col": 123,
    },
}


class CoverSheetRow(BaseModel):
    model_config = ConfigDict(loc_by_alias=False)

    expenditure_category_group: CustomStr_MIN1 = Field(
        ..., alias="Expenditure Category Group", json_schema_extra={"column": "A"}
    )
    detailed_expenditure_category: CustomStr_MIN1 = Field(
        ..., alias="Detailed Expenditure Category", json_schema_extra={"column": "B"}
    )

    @field_validator("expenditure_category_group")
    @classmethod
    def validate_code(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        if v is None or v.strip() == "":
            raise ValueError("EC code must be set")
        return v

    @field_validator("detailed_expenditure_category")
    @classmethod
    def validate_code_name_pair(
        cls, v: Any, info: ValidationInfo, **kwargs: dict[str, Any]
    ) -> Any:
        expenditure_category_group = ProjectType(
            info.data.get("expenditure_category_group")
        )
        expected_name = NAME_BY_PROJECT.get(expenditure_category_group)

        if not expected_name:
            raise ValueError(
                f"Project use code '{expenditure_category_group}' is not recognized."
            )
        if expected_name != v:
            raise ValueError(
                f"Project use code '{expenditure_category_group}' does not match '{v}'. Expected '{expected_name}'."
            )

        return v
