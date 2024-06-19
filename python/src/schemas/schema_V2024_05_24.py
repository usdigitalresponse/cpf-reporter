from datetime import datetime
from enum import Enum
from typing import Any, Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    ValidationInfo,
    condecimal,
    conint,
    constr,
    field_validator,
)

from src.schemas.project_types import NAME_BY_PROJECT


class StateAbbreviation(Enum):
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

    def __str__(self):
        return self.value


class CapitalAssetOwnershipType(str, Enum):
    PRIVATE = "1. Private"
    STATE_GOVERNMENT = "2. State Government"
    MUNICIPAL_OR_TOWNSHIP_GOVERNMENT = "3. Municipal or Township Government"
    COUNTY_GOVERNMENT = "4. County Government"
    TRIBAL_GOVERNMENT = "5. Tribal Government"
    COOPERATIVE = "6. Co-operative"
    OTHER = "7. Other"

    def __str__(self):
        return self.value


class ProjectStatusType(str, Enum):
    NOT_STARTED = "1. Not Started"
    LESS_THAN_FIFTY_PERCENT_COMPLETE = "2. Less than 50 percent complete"
    MORE_THAN_FIFTY_PERCENT_COMPLETE = "3. More than 50 percent complete"
    COMPLETED = "4. Completed"

    def __str__(self):
        return self.value


class YesNoType(str, Enum):
    YES = "Yes"
    NO = "No"

    def __str__(self):
        return self.value


class TechType(str, Enum):
    FIBER = "1. Fiber"
    COAXIAL_CABLE = "2. Coaxial Cable"
    FIXED_WIRELESS = "3. Fixed Wireless"
    OTHER = "4. Other"

    def __str__(self):
        return self.value


class ProjectInvestmentType(str, Enum):
    NEW_CONSTRUCTION = "1. New Construction"
    RENOVATION = "2. Renovation"

    def __str__(self):
        return self.value


class BaseProjectRow(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True, loc_by_alias=False)

    row_num: conint(ge=1) = Field(
        default=1,
        serialization_alias="Row Number",
        json_schema_extra={"column": None, "output_column_1A": None, "output_column_1B": None, "output_column_1C": None},
    )
    Project_Name__c: constr(strip_whitespace=True, min_length=1, max_length=100) = (
        Field(
            ...,
            serialization_alias="Project Name",
            json_schema_extra={"column": "C", "output_column_1A": "B", "output_column_1B": "B", "output_column_1C": "B"},
        )
    )
    Identification_Number__c: constr(
        strip_whitespace=True, min_length=1, max_length=20
    ) = Field(
        ...,
        serialization_alias="Identification Number",
        json_schema_extra={"column": "D", "output_column_1A": "C", "output_column_1B": "C", "output_column_1C": "C"},
    )
    Subrecipient_UEI__c: constr(strip_whitespace=True, min_length=12, max_length=12) = (
        Field(
            ...,
            serialization_alias="Subrecipient UEI",
            json_schema_extra={"column": "E", "output_column_1A": "D", "output_column_1B": "D", "output_column_1C": "D"},
        )
    )
    Subrecipient_TIN__c: constr(strip_whitespace=True, min_length=9, max_length=9) = (
        Field(
            ...,
            serialization_alias="Subrecipient TIN",
            json_schema_extra={"column": "F", "output_column_1A": "E", "output_column_1B": "E", "output_column_1C": "E"},
        )
    )
    Project_Description__c: constr(
        strip_whitespace=True, min_length=1, max_length=3000
    ) = Field(
        ...,
        serialization_alias="Project Description",
        json_schema_extra={"column": "G", "output_column_1A": "F", "output_column_1B": "F", "output_column_1C": "F"},
    )
    Capital_Asset_Ownership_Type__c: CapitalAssetOwnershipType = Field(
        ...,
        serialization_alias="Capital Asset Owenership Type",
        json_schema_extra={"column": "H", "output_column_1A": "G", "output_column_1B": "G", "output_column_1C": "G"},
    )
    Total_CPF_Funding_for_Project__c: condecimal(max_digits=13, decimal_places=2) = (
        Field(
            ...,
            serialization_alias="Total CPF Funding for Project",
            json_schema_extra={"column": "I", "output_column_1A": "H", "output_column_1B": "H", "output_column_1C": "H"},
        )
    )
    Total_from_all_funding_sources__c: condecimal(max_digits=13, decimal_places=2) = (
        Field(
            ...,
            serialization_alias="Total From all Funding Sources",
            json_schema_extra={"column": "J", "output_column_1A": "I", "output_column_1B": "I", "output_column_1C": "I"},
        )
    )
    Narrative_Description__c: Optional[str] = Field(
        default=None,
        serialization_alias="Narrative Description",
        max_length=3000,
        json_schema_extra={"column": "K", "output_column_1A": "J", "output_column_1B": "J", "output_column_1C": "J"},
    )
    Current_Period_Obligation__c: condecimal(max_digits=12, decimal_places=2) = Field(
        ...,
        serialization_alias="Current Period Obligation",
        json_schema_extra={"column": "L", "output_column_1A": "K", "output_column_1B": "K", "output_column_1C": "K"},
    )
    Current_Period_Expenditure__c: condecimal(max_digits=12, decimal_places=2) = Field(
        ...,
        serialization_alias="Current Period Expenditure",
        json_schema_extra={"column": "M", "output_column_1A": "L", "output_column_1B": "L", "output_column_1C": "L"},
    )
    Cumulative_Obligation__c: condecimal(max_digits=12, decimal_places=2) = Field(
        ...,
        serialization_alias="Cumulative Obligation",
        json_schema_extra={"column": "N", "output_column_1A": "M", "output_column_1B": "M", "output_column_1C": "M"},
    )
    Cumulative_Expenditure__c: condecimal(max_digits=12, decimal_places=2) = Field(
        ...,
        serialization_alias="Cumulative Expenditure",
        json_schema_extra={"column": "O", "output_column_1A": "N", "output_column_1B": "N", "output_column_1C": "N"},
    )
    Cost_Overview__c: constr(strip_whitespace=True, min_length=1, max_length=3000) = (
        Field(
            ...,
            serialization_alias="Cost Overview",
            json_schema_extra={"column": "P", "output_column_1A": "O", "output_column_1B": "U", "output_column_1C": "U"},
        )
    )
    Project_Status__c: ProjectStatusType = Field(
        ...,
        serialization_alias="Project Status",
        json_schema_extra={"column": "Q", "output_column_1A": "P", "output_column_1B": "V", "output_column_1C": "V"},
    )
    Projected_Con_Start_Date__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Projected Con. Start Date",
        json_schema_extra={"column": "R", "output_column_1A": "Q", "output_column_1B": "W", "output_column_1C": "W"},
    )
    Projected_Con_Completion__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Projected Con. Completion",
        json_schema_extra={"column": "S", "output_column_1A": "R", "output_column_1B": "X", "output_column_1C": "X"},
    )
    Projected_Init_of_Operations__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Projected Init. of Operations",
        json_schema_extra={"column": "T", "output_column_1A": "S", "output_column_1B": "Y", "output_column_1C": "Y"},
    )
    Actual_Con_Start_Date__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Actual Con. Start Date",
        json_schema_extra={"column": "U", "output_column_1A": "T", "output_column_1B": "Z", "output_column_1C": "Z"},
    )
    Actual_Con_Completion__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Actual Con. Completion",
        json_schema_extra={"column": "V", "output_column_1A": "U", "output_column_1B": "AA", "output_column_1C": "AA"},
    )
    Operations_initiated__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Operations Initiated",
        json_schema_extra={"column": "W", "output_column_1A": "V", "output_column_1B": "AB", "output_column_1C": "AB"},
    )
    Actual_operations_date__c: Optional[datetime] = Field(
        default=None,
        serialization_alias="Actual operations date",
        json_schema_extra={"column": "X", "output_column_1A": "W", "output_column_1B": "AC", "output_column_1C": "AC"},
    )
    Operations_explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Operations explanation",
        max_length=3000,
        json_schema_extra={"column": "Y", "output_column_1A": "X", "output_column_1B": "AD", "output_column_1C": "AD"},
    )
    Other_Federal_Funding__c: YesNoType = Field(
        ...,
        serialization_alias="Other Federal Funding?",
        json_schema_extra={"column": "Z", "output_column_1A": "Y", "output_column_1B": "AE", "output_column_1C": "AF"},
    )
    Matching_Funds__c: YesNoType = Field(
        ...,
        serialization_alias="Matching Funds?",
        json_schema_extra={"column": "AA", "output_column_1A": "Z", "output_column_1B": "AF", "output_column_1C": "AE"},
    )
    Program_Information__c: Optional[str] = Field(
        default=None,
        serialization_alias="Program Information",
        max_length=50,
        json_schema_extra={"column": "AB", "output_column_1A": "AA", "output_column_1B": "AG", "output_column_1C": "AG"},
    )
    Amount_of_Matching_Funds__c: Optional[
        condecimal(max_digits=12, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Amount of Matching Funds",
        json_schema_extra={"column": "AC", "output_column_1A": "AB", "output_column_1B": "AH", "output_column_1C": "AH"},
    )
    Target_Project_Info__c: Optional[str] = Field(
        default=None,
        serialization_alias="Target Project Info",
        max_length=3000,
        json_schema_extra={"column": "AD", "output_column_1A": "AC", "output_column_1B": "AI", "output_column_1C": "AI"},
    )
    Davis_Bacon_Certification__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Davis Bacon Certification?",
        json_schema_extra={"column": "AE", "output_column_1A": "AD", "output_column_1B": "AJ", "output_column_1C": "AJ"},
    )
    Number_of_Direct_Employees__c: Optional[conint(ge=0, le=99999999999)] = Field(
        default=None,
        serialization_alias="Number of Direct Employees",
        json_schema_extra={"column": "AF", "output_column_1A": "AE", "output_column_1B": "AK", "output_column_1C": "AK"},
    )
    Number_of_Contractor_Employees__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Number of Contractor Employees",
        json_schema_extra={"column": "AG", "output_column_1A": "AF", "output_column_1B": "AL", "output_column_1C": "AL"},
    )
    Number_of_3rd_Party_Employees__c: Optional[conint(ge=0, le=999999999999)] = Field(
        default=None,
        serialization_alias="Number of 3rd Party Employees",
        json_schema_extra={"column": "AH", "output_column_1A": "AG", "output_column_1B": "AM", "output_column_1C": "AM"},
    )
    Any_Wages_Less_Than_Prevailing__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Any Wages Less Than Prevailing?",
        json_schema_extra={"column": "AI", "output_column_1A": "AH", "output_column_1B": "AN", "output_column_1C": "AN"},
    )
    Wages_and_benefits__c: Optional[str] = Field(
        default=None,
        serialization_alias="Wages and benefits of workers on the project by classification",
        max_length=3000,
        json_schema_extra={"column": "AJ", "output_column_1A": "AI", "output_column_1B": "AO", "output_column_1C": "AO"},
    )
    Project_Labor_Certification__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Project Labor Certification?",
        json_schema_extra={"column": "AK", "output_column_1A": "AJ", "output_column_1B": "AP", "output_column_1C": "AP"},
    )
    Assurance_of_Adequate_Labor__c: Optional[str] = Field(
        default=None,
        serialization_alias="Assurance of Adequate Labor?",
        max_length=3000,
        json_schema_extra={"column": "AL", "output_column_1A": "AK", "output_column_1B": "AQ", "output_column_1C": "AQ"},
    )
    Minimizing_Risks__c: Optional[str] = Field(
        default=None,
        serialization_alias="Minimizing Risks?",
        max_length=3000,
        json_schema_extra={"column": "AM", "output_column_1A": "AL", "output_column_1B": "AR", "output_column_1C": "AR"},
    )
    Safe_and_Healthy_Workplace__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explain Safe and Healthy Workplace",
        max_length=3000,
        json_schema_extra={"column": "AN", "output_column_1A": "AM", "output_column_1B": "AS", "output_column_1C": "AS"},
    )
    Adequate_Wages__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Adequate Wages?",
        json_schema_extra={"column": "AO", "output_column_1A": "AN", "output_column_1B": "AT", "output_column_1C": "AT"},
    )
    Project_Labor_Agreement__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Project Labor Agreement?",
        json_schema_extra={"column": "AP", "output_column_1A": "AO", "output_column_1B": "AU", "output_column_1C": "AU"},
    )
    Prioritize_Local_Hires__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Prioritize Local Hires?",
        json_schema_extra={"column": "AQ", "output_column_1A": "AP", "output_column_1B": "AV", "output_column_1C": "AV"},
    )
    Community_Benefit_Agreement__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Community Benefit Agreement?",
        json_schema_extra={"column": "AR", "output_column_1A": "AQ", "output_column_1B": "AW", "output_column_1C": "AW"},
    )
    Description_of_Community_Ben_Agr__c: Optional[str] = Field(
        default=None,
        serialization_alias="Description of Community Ben. Agr.",
        max_length=3000,
        json_schema_extra={"column": "AS", "output_column_1A": "AR", "output_column_1B": "AX", "output_column_1C": "AX"},
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
    def parse_mm_dd_yyyy_dates(cls, v):
        if isinstance(v, str):
            try:
                return datetime.strptime(v, "%m/%d/%Y")
            except ValueError:
                raise ValueError(f"Date {v} is not in 'mm/dd/yyyy' format.")
        return v

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
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        if isinstance(v, str) and v.strip == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class Project1ARow(BaseProjectRow):
    Technology_Type_Planned__c: TechType = Field(
        ...,
        serialization_alias="Technology Type (Planned)",
        json_schema_extra={"column": "AT", "output_column_1A": "AT"},
    )
    Technology_Type_Actual__c: Optional[TechType] = Field(
        default=None,
        serialization_alias="Technology Type (Actual)",
        json_schema_extra={"column": "AU", "output_column_1A": "AU"},
    )
    If_Other_Specify_Planned__c: Optional[str] = Field(
        default=None,
        serialization_alias="If Other, Specify (Planned)?",
        max_length=3000,
        json_schema_extra={"column": "AV", "output_column_1A": "AV"},
    )
    If_Other_Specify_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="If Other, Specify (Actual?)?",
        max_length=3000,
        json_schema_extra={"column": "AW", "output_column_1A": "AW"},
    )
    Total_Miles_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="Total Miles of Fiber Deployed (Planned)",
        json_schema_extra={"column": "AX", "output_column_1A": "AX"},
    )
    Total_Miles_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="Total Miles of Fiber Deployed (Actual)",
        json_schema_extra={"column": "AY", "output_column_1A": "AY"},
    )
    Locations_Served_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="A) Total Number of Locations Served (Planned)",
        json_schema_extra={"column": "AZ", "output_column_1A": "AZ"},
    )
    Locations_Served_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="A) Total Number of Locations Served (Actual)",
        json_schema_extra={"column": "BA", "output_column_1A": "BA"},
    )
    X25_3_Mbps_or_below_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="B) Less than 25/3 Mbps (Planned)",
        json_schema_extra={"column": "BB", "output_column_1A": "BB"},
    )
    X25_3_Mbps_and_100_20_Mbps_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="C) 25/3 Mbps and 100/20 Mbps (Planned)",
        json_schema_extra={"column": "BC", "output_column_1A": "BC"},
    )
    Minimum_100_100_Mbps_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="D) Minimum 100/100 Mbps (Planned) ",
        json_schema_extra={"column": "BD", "output_column_1A": "BD"},
    )
    Minimum_100_100_Mbps_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="D) Minimum 100/100 Mbps (Actual) ",
        json_schema_extra={"column": "BE", "output_column_1A": "BE"},
    )
    X100_20_Mbps_to_100_100_Mbps_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="E) 100/20 Mbps to 100/100 Mbps (Planned)",
        json_schema_extra={"column": "BF", "output_column_1A": "BF"},
    )
    X100_20_Mbps_to_100_100_Mbps_Actual__c: Optional[conint(ge=0, le=999999999)] = (
        Field(
            default=None,
            serialization_alias="E) 100/20 Mbps to 100/100 Mbps (Actual)",
            json_schema_extra={"column": "BG", "output_column_1A": "BG"},
        )
    )
    Explanation_of_Discrepancy__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explanation of Discrepancy (Location by Speed)",
        max_length=3000,
        json_schema_extra={"column": "BH", "output_column_1A": "BH"},
    )
    Number_of_Locations_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="F) Total Number of Locations Served by Type - Residential (Planned)",
        json_schema_extra={"column": "BI", "output_column_1A": "BJ"},
    )
    Number_of_Locations_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="F) Total Number of Locations Served by Type - Residential (Actual)",
        json_schema_extra={"column": "BJ", "output_column_1A": "BK"},
    )
    Housing_Units_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="G) Total Housing Units (Planned)",
        json_schema_extra={"column": "BK", "output_column_1A": "BL"},
    )
    Housing_Units_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="G) Total Housing Units (Actual)",
        json_schema_extra={"column": "BL", "output_column_1A": "BM"},
    )
    Number_of_Bus_Locations_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="H) Total Number of Locations Served by Type - Business (Planned)",
        json_schema_extra={"column": "BM", "output_column_1A": "BN"},
    )
    Number_of_Bus_Locations_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="H) Total Number of Locations Served by Type - Business (Actual)",
        json_schema_extra={"column": "BN", "output_column_1A": "BO"},
    )
    Number_of_CAI_Planned__c: conint(ge=0, le=999999999) = Field(
        ...,
        serialization_alias="I) Total Number of Locations Served by Type - Community Anchor Institution (Planned)",
        json_schema_extra={"column": "BO", "output_column_1A": "BP"},
    )
    Number_of_CAI_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(
        default=None,
        serialization_alias="I) Total Number of Locations Served by Type - Community Anchor Institution (Actual)",
        json_schema_extra={"column": "BP", "output_column_1A": "BQ"},
    )
    Explanation_Planned__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explanation (Planned)",
        max_length=3000,
        json_schema_extra={"column": "BQ", "output_column_1A": "BI"},
    )
    Affordable_Connectivity_Program_ACP__c: YesNoType = Field(
        ...,
        serialization_alias="Affordable Connectivity Program (ACP)?",
        json_schema_extra={"column": "BR", "output_column_1A": "BR"},
    )
    Is_this_a_middle_mile_Project__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Is this a middle mile Project?",
        json_schema_extra={"column": "DV", "output_column_1A": "AS"},
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
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        if isinstance(v, str) and v.strip == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class AddressFields(BaseModel):
    Street_1_Planned__c: constr(strip_whitespace=True, min_length=1, max_length=40) = (
        Field(
            ...,
            serialization_alias="Street 1 (Planned)",
            json_schema_extra={"column": "BS", "output_column_1B": "AY", "output_column_1C": "AY"},
        )
    )
    Street_2_Planned__c: Optional[str] = Field(
        default=None,
        serialization_alias="Street 2 (Planned)",
        max_length=40,
        json_schema_extra={"column": "BT", "output_column_1B": "AZ", "output_column_1C": "AZ"},
    )
    Same_Address__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Same Address",
        json_schema_extra={"column": "BU", "output_column_1B": "BI", "output_column_1C": "BI"},
    )
    Street_1_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Street 1 (Actual)",
        max_length=40,
        json_schema_extra={"column": "BV", "output_column_1B": "BA", "output_column_1C": "BA"},
    )
    Street_2_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Street 2 (Actual)",
        max_length=40,
        json_schema_extra={"column": "BW", "output_column_1B": "BB", "output_column_1C": "BB"},
    )
    City_Planned__c: constr(strip_whitespace=True, min_length=1, max_length=40) = Field(
        ...,
        serialization_alias="City (Planned)",
        json_schema_extra={"column": "BX", "output_column_1B": "BC", "output_column_1C": "BC"},
    )
    City_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="City (Actual)",
        max_length=40,
        json_schema_extra={"column": "BY", "output_column_1B": "BD", "output_column_1C": "BD"},
    )
    State_Planned__c: StateAbbreviation = Field(
        ...,
        serialization_alias="State (Planned)",
        json_schema_extra={"column": "BZ", "output_column_1B": "BE", "output_column_1C": "BE"},
    )
    State_Actual__c: Optional[StateAbbreviation] = Field(
        default=None,
        serialization_alias="State (Actual)",
        json_schema_extra={"column": "CA", "output_column_1B": "BF", "output_column_1C": "BF"},
    )
    Zip_Code_Planned__c: constr(strip_whitespace=True, min_length=1, max_length=5) = (
        Field(
            ...,
            serialization_alias="Zip Code (Planned)",
            json_schema_extra={"column": "CB", "output_column_1B": "BG", "output_column_1C": "BG"},
        )
    )
    Zip_Code_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Zip Code (Actual)",
        max_length=5,
        json_schema_extra={"column": "CC", "output_column_1B": "BH", "output_column_1C": "BH"},
    )

    @field_validator(
        "Street_1_Planned__c",
        "City_Planned__c",
        "Zip_Code_Planned__c",
    )
    @classmethod
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        if isinstance(v, str) and v.strip == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class Project1BRow(BaseProjectRow, AddressFields):
    Laptops_Planned__c: conint(ge=0, le=9999999999) = Field(
        ..., serialization_alias="Laptops (Planned)", json_schema_extra={"column": "CD", "output_column_1B": "BJ"}
    )
    Laptops_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Laptops (Actual)",
        json_schema_extra={"column": "CE", "output_column_1B": "BK"},
    )
    Laptops_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = (
        Field(
            ...,
            serialization_alias="Laptops Expenditure (Planned)",
            json_schema_extra={"column": "CF", "output_column_1B": "BL"},
        )
    )
    Laptops_Expenditures_Actual__c: Optional[
        condecimal(max_digits=13, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Laptops Expenditure (Actual)",
        json_schema_extra={"column": "CG", "output_column_1B": "BM"},
    )
    Tablets_Planned__c: conint(ge=0, le=9999999999) = Field(
        ..., serialization_alias="Tablets (Planned)", json_schema_extra={"column": "CH", "output_column_1B": "BN"}
    )
    Tablets_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Tablets (Actual)",
        json_schema_extra={"column": "CI", "output_column_1B": "BO"},
    )
    Tablet_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = Field(
        ...,
        serialization_alias="Tablets Expenditure (Planned)",
        json_schema_extra={"column": "CJ", "output_column_1B": "BP"},
    )
    Tablets_Expenditures_Actual__c: Optional[
        condecimal(max_digits=13, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Tablets Expenditure (Actual)",
        json_schema_extra={"column": "CK", "output_column_1B": "BQ"},
    )
    Desktop_Computers_Planned__c: conint(ge=0, le=9999999999) = Field(
        ...,
        serialization_alias="Desktop Computers (Planned)",
        json_schema_extra={"column": "CL", "output_column_1B": "BR"},
    )
    Desktop_Computers_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Desktop Computers (Actual)",
        json_schema_extra={"column": "CM", "output_column_1B": "BS"},
    )
    Desktop_Computers_Expenditures_Planned__c: condecimal(
        max_digits=13, decimal_places=2
    ) = Field(
        ...,
        serialization_alias="Desktop Computers Expenditure (Planned)",
        json_schema_extra={"column": "CN", "output_column_1B": "BT"},
    )
    Desktop_Computers_Expenditures_Actual__c: Optional[
        condecimal(max_digits=13, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Desktop Computers Expenditure (Actual)",
        json_schema_extra={"column": "CO", "output_column_1B": "BU"},
    )
    Public_WiFi_Planned__c: conint(ge=0, le=9999999999) = Field(
        ...,
        serialization_alias="Public WiFi (Planned)",
        json_schema_extra={"column": "CP", "output_column_1B": "BV"},
    )
    Public_WiFi_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Public WiFi (Actual)",
        json_schema_extra={"column": "CQ", "output_column_1B": "BW"},
    )
    Public_WiFi_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = (
        Field(
            ...,
            serialization_alias="Public Wifi Expenditures (Planned)",
            json_schema_extra={"column": "CR", "output_column_1B": "BX"},
        )
    )
    Public_WiFi_Expenditures_Actual__c: Optional[
        condecimal(max_digits=13, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Public Wifi Expenditures (Actual)",
        json_schema_extra={"column": "CS", "output_column_1B": "BY"},
    )
    Other_Devices_Planned__c: conint(ge=0, le=9999999999) = Field(
        ...,
        serialization_alias="Other Devices (Planned)",
        json_schema_extra={"column": "CT", "output_column_1B": "BZ"},
    )
    Other_Devices_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Other Devices (Actual)",
        json_schema_extra={"column": "CU", "output_column_1B": "CA"},
    )
    Other_Expenditures_Planned__c: condecimal(max_digits=7, decimal_places=2) = Field(
        ...,
        serialization_alias="Other Expenditures (Planned)",
        json_schema_extra={"column": "CV", "output_column_1B": "CB"},
    )
    Other_Expenditures_Actual__c: Optional[
        condecimal(max_digits=7, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Other Expenditures (Actual)",
        json_schema_extra={"column": "CW", "output_column_1B": "CC"},
    )
    Explanation_of_Other_Expend__c: Optional[str] = Field(
        default=None,
        serialization_alias="Explanation of Other Expenditures",
        max_length=3000,
        json_schema_extra={"column": "CX", "output_column_1B": "CD"},
    )
    Number_of_Users_Planned__c: conint(ge=0, le=9999999999) = Field(
        ...,
        serialization_alias="Number of Users (Planned)",
        json_schema_extra={"column": "CY", "output_column_1B": "CE"},
    )
    Number_of_Users_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Number of Users (Actual)",
        json_schema_extra={"column": "CZ", "output_column_1B": "CF"},
    )
    Brief_Narrative_Planned__c: constr(
        strip_whitespace=True, min_length=1, max_length=3000
    ) = Field(
        ...,
        serialization_alias="Brief Narrative (Planned)",
        json_schema_extra={"column": "DA", "output_column_1B": "CG"},
    )
    Brief_Narrative_Actual__c: Optional[str] = Field(
        default=None,
        serialization_alias="Brief Narrative (Actual)",
        max_length=3000,
        json_schema_extra={"column": "DB", "output_column_1B": "CH"},
    )
    Measurement_of_Effectiveness__c: YesNoType = Field(
        ...,
        serialization_alias="Measurement of Effectiveness?",
        json_schema_extra={"column": "DC", "output_column_1B": "CI"},
    )
    # Columns below exist on Project1CRow as well as Project1BRow, so they jump in column defs
    Current_Program_Income_Earned__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Current Period Program Income Earned",
        json_schema_extra={"column": "DW", "output_column_1B": "O"},
    )
    Current_Program_Income_Expended__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Current Period Program Income Expended",
        json_schema_extra={"column": "DX", "output_column_1B": "P"},
    )
    Cumulative_Program_Income_Earned__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Earned",
        json_schema_extra={"column": "DY", "output_column_1B": "Q"},
    )
    Cumulative_Program_Income_Expended__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Expended",
        json_schema_extra={"column": "DZ", "output_column_1B": "R"},
    )
    Program_Income_2_CFR__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Program Income Pursuant",
        json_schema_extra={"column": "EA", "output_column_1B": "S"},
    )
    Program_Income_2_CFR_Explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Program Income Pursuant Explanation",
        max_length=3000,
        json_schema_extra={"column": "EB", "output_column_1B": "T"},
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
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        if isinstance(v, str) and v.strip == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class Project1CRow(BaseProjectRow, AddressFields):
    Type_of_Investment__c: Optional[str] = Field(
        default=None,
        serialization_alias="Type of Investment",
        json_schema_extra={"column": "DD", "output_column_1C": "BJ"},
    )
    Additional_Address__c: Optional[str] = Field(
        default=None,
        serialization_alias="Additional Addresses",
        max_length=32000,
        json_schema_extra={"column": "DE", "output_column_1C": "BK"},
    )
    Classrooms_Planned__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Classrooms (Planned)",
        json_schema_extra={"column": "DF", "output_column_1C": "BL"},
    )
    Classrooms_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Classrooms (Actual)",
        json_schema_extra={"column": "DG", "output_column_1C": "BM"},
    )
    Computer_labs_Planned__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Computer labs (Planned)",
        json_schema_extra={"column": "DH", "output_column_1C": "BN"},
    )
    Computer_labs_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Computer labs (Actual)",
        json_schema_extra={"column": "DI", "output_column_1C": "BO"},
    )
    Multi_purpose_Spaces_Planned__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Multi-purpose Spaces (Planned)",
        json_schema_extra={"column": "DJ", "output_column_1C": "BP"},
    )
    Multi_purpose_Spaces_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Multi-purpose Spaces (Actual)",
        json_schema_extra={"column": "DK", "output_column_1C": "BQ"},
    )
    Telemedicine_Rooms_Planned__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Telemedicine Rooms (Planned)",
        json_schema_extra={"column": "DL", "output_column_1C": "BR"},
    )
    Telemedicine_Rooms_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Telemedicine Rooms (Actual)",
        json_schema_extra={"column": "DM", "output_column_1C": "BS"},
    )
    Other_Capital_Assets_Planned__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Other Capital Assets (Planned)",
        json_schema_extra={"column": "DN", "output_column_1C": "BT"},
    )
    Other_Capital_Assets_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Other Capital Assets (Actual)",
        json_schema_extra={"column": "DO", "output_column_1C": "BU"},
    )
    Type_and_Features__c: Optional[str] = Field(
        default=None,
        serialization_alias="Type and Features",
        max_length=3000,
        json_schema_extra={"column": "DP", "output_column_1C": "BV"},
    )
    Total_square_footage_Planned__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Total square footage (Planned)",
        json_schema_extra={"column": "DQ", "output_column_1C": "BW"},
    )
    Total_square_footage_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Total square footage (Actual)",
        json_schema_extra={"column": "DR", "output_column_1C": "BX"},
    )
    Total_Number_of_Users_Actual__c: Optional[conint(ge=0, le=9999999999)] = Field(
        default=None,
        serialization_alias="Total Number of Users (Actual)",
        json_schema_extra={"column": "DS", "output_column_1C": "BY"},
    )
    Further_Explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Further Explanation",
        max_length=2000,
        json_schema_extra={"column": "DT", "output_column_1C": "BZ"},
    )
    Access_to_Public_Transit__c: YesNoType = Field(
        ...,
        serialization_alias="Access to Public Transit?",
        json_schema_extra={"column": "DU", "output_column_1C": "CA"},
    )
    # Columns below exist on Project1BRow as well as Project1CRow
    Current_Program_Income_Earned__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Current Period Program Income Earned",
        json_schema_extra={"column": "DW", "output_column_1C": "O"},
    )
    Current_Program_Income_Expended__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Current Period Program Income Expended",
        json_schema_extra={"column": "DX", "output_column_1C": "P"},
    )
    Cumulative_Program_Income_Earned__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Earned",
        json_schema_extra={"column": "DY", "output_column_1C": "Q"},
    )
    Cumulative_Program_Income_Expended__c: Optional[
        condecimal(max_digits=15, decimal_places=2)
    ] = Field(
        default=None,
        serialization_alias="Cumulative Program Income Expended",
        json_schema_extra={"column": "DZ", "output_column_1C": "R"},
    )
    Program_Income_2_CFR__c: Optional[YesNoType] = Field(
        default=None,
        serialization_alias="Program Income Pursuant",
        json_schema_extra={"column": "EA", "output_column_1C": "S"},
    )
    Program_Income_2_CFR_Explanation__c: Optional[str] = Field(
        default=None,
        serialization_alias="Program Income Pursuant Explanation",
        max_length=3000,
        json_schema_extra={"column": "EB", "output_column_1C": "T"},
    )

    @field_validator("Access_to_Public_Transit__c")
    @classmethod
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        if isinstance(v, str) and v.strip == "":
            raise ValueError(f"Value is required for {info.field_name}")
        return v


class SubrecipientRow(BaseModel):
    model_config = ConfigDict(coerce_numbers_to_str=True, loc_by_alias=False)

    Name: constr(strip_whitespace=True, min_length=1, max_length=80) = Field(
        ...,
        serialization_alias="Subrecipient Name",
        json_schema_extra={"column": "C", "output_column": "B"},
    )
    Recipient_Profile_ID__c: Optional[
        constr(strip_whitespace=True, min_length=1, max_length=100)
    ] = Field(
        default=None,
        serialization_alias="Recipient ID",
        json_schema_extra={"column": "D", "output_column": "C"},
    )
    EIN__c: constr(strip_whitespace=True, min_length=9, max_length=9) = Field(
        ...,
        serialization_alias="Subrecipient Tax ID Number (TIN)",
        json_schema_extra={"column": "E", "output_column": "D"},
    )
    Unique_Entity_Identifier__c: constr(
        strip_whitespace=True, min_length=12, max_length=12
    ) = Field(
        ...,
        serialization_alias="Unique Entity Identifier (UEI)",
        json_schema_extra={"column": "F", "output_column": "E"},
    )
    POC_Name__c: constr(strip_whitespace=True, min_length=1, max_length=100) = Field(
        ...,
        serialization_alias="POC Name",
        json_schema_extra={"column": "G", "output_column": "F"},
    )
    POC_Phone_Number__c: constr(strip_whitespace=True, min_length=1, max_length=10) = (
        Field(
            ...,
            serialization_alias="POC Phone Number",
            json_schema_extra={"column": "H", "output_column": "G"},
        )
    )
    POC_Email_Address__c: constr(strip_whitespace=True, min_length=1, max_length=80) = (
        Field(
            ...,
            serialization_alias="POC Email Address",
            json_schema_extra={"column": "I", "output_column": "H"},
        )
    )
    Zip__c: constr(strip_whitespace=True, min_length=1, max_length=5) = Field(
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
    Address__c: constr(strip_whitespace=True, min_length=1, max_length=40) = Field(
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
    City__c: constr(strip_whitespace=True, min_length=1, max_length=100) = Field(
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
    def validate_field(cls, v: Any, info: ValidationInfo, **kwargs):
        if isinstance(v, str) and v.strip == "":
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

    expenditure_category_group: constr(strip_whitespace=True, min_length=1) = Field(
        ..., alias="Expenditure Category Group", json_schema_extra={"column": "A"}
    )
    detailed_expenditure_category: constr(strip_whitespace=True, min_length=1) = Field(
        ..., alias="Detailed Expenditure Category", json_schema_extra={"column": "B"}
    )

    @field_validator("expenditure_category_group")
    @classmethod
    def validate_code(cls, v: Any, info: ValidationInfo, **kwargs):
        if v is None or v.strip() == "":
            raise ValueError("EC code must be set")
        return v

    @field_validator("detailed_expenditure_category")
    @classmethod
    def validate_code_name_pair(cls, v: Any, info: ValidationInfo, **kwargs):
        expenditure_category_group = info.data.get("expenditure_category_group")
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
