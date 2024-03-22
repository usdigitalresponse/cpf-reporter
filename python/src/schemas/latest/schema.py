from openpyxl import load_workbook
import json
from datetime import datetime
from pydantic import BaseModel, Field, confloat, conint, condecimal, ValidationError, validator
from enum import Enum
from typing import Optional, Any


class StateAbbreviation(Enum):
    AL = 'AL'
    AK = 'AK'
    AZ = 'AZ'
    AR = 'AR'
    CA = 'CA'
    CO = 'CO'
    CT = 'CT'
    DE = 'DE'
    FL = 'FL'
    GA = 'GA'
    HI = 'HI'
    ID = 'ID'
    IL = 'IL'
    IN = 'IN'
    IA = 'IA'
    KS = 'KS'
    KY = 'KY'
    LA = 'LA'
    ME = 'ME'
    MD = 'MD'
    MA = 'MA'
    MI = 'MI'
    MN = 'MN'
    MS = 'MS'
    MO = 'MO'
    MT = 'MT'
    NE = 'NE'
    NV = 'NV'
    NH = 'NH'
    NJ = 'NJ'
    NM = 'NM'
    NY = 'NY'
    NC = 'NC'
    ND = 'ND'
    OH = 'OH'
    OK = 'OK'
    OR = 'OR'
    PA = 'PA'
    RI = 'RI'
    SC = 'SC'
    SD = 'SD'
    TN = 'TN'
    TX = 'TX'
    UT = 'UT'
    VT = 'VT'
    VA = 'VA'
    WA = 'WA'
    WV = 'WV'
    WI = 'WI'
    WY = 'WY'

class CapitalAssetOwnershipType(str, Enum):
    PRIVATE = "1. Private"
    STATE_GOVERNMENT = "2. State Government"
    MUNICIPAL_OR_TOWNSHIP_GOVERNMENT = "3. Municipal or Township Government"
    COUNTY_GOVERNMENT = "4. County Government"
    TRIBAL_GOVERNMENT = "5. Tribal Government"
    COOPERATIVE = "6. Co-operative"
    OTHER = "7. Other"

class ProjectStatusType(str, Enum):
    NOT_STARTED = "1. Not Started"
    LESS_THAN_FIFTY_PERCENT_COMPLETE = "2. Less than 50 percent complete"
    MORE_THAN_FIFTY_PERCENT_COMPLETE = "3. More than 50 percent complete"
    COMPLETED = "4. Completed"

class YesNoType(str, Enum):
    YES = "Yes"
    NO = "No"

class TechType(str, Enum):
    FIBER = "1. Fiber"
    COAXIAL_CABLE = "2. Coaxial Cable"
    FIXED_WIRELESS = "3. Fixed Wireless"
    OTHER = "4. Other"

class ProjectInvestmentType(str, Enum):
    NEW_CONSTRUCTION = "1. New Construction"
    RENOVATION = "2. Renovation"

class BaseProjectRow(BaseModel):
    Project_Name__c: str = Field(..., serialization_alias='Project Name', max_length=100)
    Identification_Number__c: str = Field(..., serialization_alias='Identification Number', max_length=20)
    Project_Description__c: str = Field(..., serialization_alias='Project Description', max_length=3000)
    Capital_Asset_Ownership_Type__c: CapitalAssetOwnershipType = Field(..., serialization_alias='Capital Asset Owenership Type')
    Total_CPF_Funding_for_Project__c: condecimal(max_digits=13, decimal_places=2) = Field(..., serialization_alias='Total CPF Funding for Project')
    Total_from_all_funding_sources__c: condecimal(max_digits=13, decimal_places=2) = Field(..., serialization_alias='Total From all Funding Sources')
    Narrative_Description__c: Optional[str] = Field(default=None, serialization_alias='Narrative Description', max_length=3000)
    Current_Period_Obligation__c: condecimal(max_digits=12, decimal_places=2) = Field(..., serialization_alias='Current Period Obligation')
    Current_Period_Expenditure__c: condecimal(max_digits=12, decimal_places=2) = Field(..., serialization_alias='Current Period Expenditure')
    Cumulative_Obligation__c: condecimal(max_digits=12, decimal_places=2) = Field(..., serialization_alias='Cumulative Obligation')
    Cumulative_Expenditure__c: condecimal(max_digits=12, decimal_places=2) = Field(..., serialization_alias='Cumulative Expenditure')
    Cost_Overview__c: str = Field(..., serialization_alias='Cost Overview', max_length=3000)
    Project_Status__c: ProjectStatusType = Field(..., serialization_alias='Project Status')
    Projected_Con_Start_Date__c: Optional[datetime] = Field(default=None, serialization_alias='Projected Con. Start Date')
    Projected_Con_Completion__c: Optional[datetime] = Field(default=None, serialization_alias='Projected Con. Completion')
    Projected_Init_of_Operations__c: Optional[datetime] = Field(default=None, serialization_alias='Projected Init. of Operations')
    Actual_Con_Start_Date__c: Optional[datetime] = Field(default=None, serialization_alias='Actual Con. Start Date')
    Actual_Con_Completion__c: Optional[datetime] = Field(default=None, serialization_alias='Actual Con. Completion')
    Operations_initiated__c: Optional[YesNoType] = Field(default=None, serialization_alias='Operations Initiated')
    Actual_operations_date__c: Optional[datetime] = Field(default=None, serialization_alias='Actual operations date')
    Operations_explanation__c: Optional[str] = Field(default=None, serialization_alias='Operations explanation', max_length=3000)
    Other_Federal_Funding__c: YesNoType = Field(..., serialization_alias='Other Federal Funding?')
    Matching_Funds__c: YesNoType = Field(..., serialization_alias='Matching Funds?')
    Program_Information__c: Optional[str] = Field(default=None, serialization_alias='Program Information', max_length=50)
    Amount_of_Matching_Funds__c: Optional[condecimal(max_digits=12, decimal_places=2)] = Field(default=None, serialization_alias='Amount of Matching Funds')
    Target_Project_Info__c: Optional[str] = Field(default=None, serialization_alias='Target Project Info', max_length=3000)
    Davis_Bacon_Certification__c: Optional[YesNoType] = Field(default=None, serialization_alias='Davis Bacon Certification?')
    Number_of_Direct_Employees__c: Optional[conint(ge=0, le=99999999999)] = Field(default=None, serialization_alias='Number of Direct Employees')
    Number_of_Contractor_Employees__c: Optional[conint(ge=0, le=9999999999)] = Field(default=None, serialization_alias='Number of Contractor Employees')
    Number_of_3rd_Party_Employees__c: Optional[conint(ge=0, le=999999999999)] = Field(default=None, serialization_alias='Number of 3rd Party Employees')
    Any_Wages_Less_Than_Prevailing__c: Optional[YesNoType] = Field(default=None, serialization_alias='Any Wages Less Than Prevailing?')
    Wages_and_benefits__c: Optional[str] = Field(default=None, serialization_alias='Wages and benefits of workers on the project by classification', max_length=3000)
    Project_Labor_Certification__c: Optional[YesNoType] = Field(default=None, serialization_alias='Project Labor Certification?')
    Assurance_of_Adequate_Labor__c: Optional[str] = Field(default=None, serialization_alias='Assurance of Adequate Labor?', max_length=3000)
    Minimizing_Risks__c: Optional[str] = Field(default=None, serialization_alias='Minimizing Risks?', max_length=3000)
    Safe_and_Healthy_Workplace__c: Optional[str] = Field(default=None, serialization_alias='Explain Safe and Healthy Workplace', max_length=3000)
    Adequate_Wages__c: Optional[YesNoType] = Field(default=None, serialization_alias='Adequate Wages?')
    Project_Labor_Agreement__c: Optional[YesNoType] = Field(default=None, serialization_alias='Project Labor Agreement?')
    Prioritize_Local_Hires__c: Optional[YesNoType] = Field(default=None, serialization_alias='Prioritize Local Hires?')
    Community_Benefit_Agreement__c: Optional[YesNoType] = Field(default=None, serialization_alias='Community Benefit Agreement?')
    Description_of_Community_Ben_Agr__c: Optional[str] = Field(default=None, serialization_alias='Description of Community Ben. Agr.', max_length=3000)

    @validator('Projected_Con_Start_Date__c', 'Projected_Con_Completion__c',
               'Projected_Init_of_Operations__c', 'Actual_Con_Start_Date__c',
               'Actual_Con_Completion__c', 'Actual_operations_date__c', pre=True)
    def parse_mm_dd_yyyy_dates(cls, value):
        if isinstance(value, str):
            try:
                return datetime.strptime(value, '%m/%d/%Y')
            except ValueError:
                raise ValueError(f"Date {value} is not in 'mm/dd/yyyy' format.")
        return value

class Project1ARow(BaseProjectRow):
    Technology_Type_Planned__c: TechType = Field(..., serialization_alias='Technology Type (Planned)')
    Technology_Type_Actual__c: Optional[TechType] = Field(default=None, serialization_alias='Technology Type (Actual)')
    If_Other_Specify_Planned__c: Optional[str] = Field(default=None, serialization_alias='If Other, Specify (Planned)?', max_length=3000)
    If_Other_Specify_Actual__c: Optional[str] = Field(default=None, serialization_alias='If Other, Specify (Actual?)?', max_length=3000)
    Total_Miles_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='Total Miles of Fiber Deployed (Planned)')
    Total_Miles_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='Total Miles of Fiber Deployed (Actual)')
    Locations_Served_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='A) Total Number of Locations Served (Planned)')
    Locations_Served_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='A) Total Number of Locations Served (Actual)')
    X25_3_Mbps_or_below_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='B) Less than 25/3 Mbps (Planned)')
    X25_3_Mbps_and_100_20_Mbps_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='C) 25/3 Mbps and 100/20 Mbps (Planned)')
    Minimum_100_100_Mbps_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='D) Minimum 100/100 Mbps (Planned) ')
    Minimum_100_100_Mbps_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='D) Minimum 100/100 Mbps (Actual) ')
    X100_20_Mbps_to_100_100_Mbps_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='E) 100/20 Mbps to 100/100 Mbps (Planned)')
    X100_20_Mbps_to_100_100_Mbps_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='E) 100/20 Mbps to 100/100 Mbps (Actual)')
    Explanation_of_Discrepancy__c: Optional[str] = Field(default=None, serialization_alias='Explanation of Discrepancy (Location by Speed)', max_length=3000)
    Number_of_Locations_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='F) Total Number of Locations Served by Type - Residential (Planned)')
    Number_of_Locations_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='F) Total Number of Locations Served by Type - Residential (Actual)')
    Housing_Units_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='G) Total Housing Units (Planned)')
    Housing_Units_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='G) Total Housing Units (Actual)')
    Number_of_Bus_Locations_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='H) Total Number of Locations Served by Type - Business (Planned)')
    Number_of_Bus_Locations_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='H) Total Number of Locations Served by Type - Business (Actual)')
    Number_of_CAI_Planned__c: conint(ge=0, le=999999999) = Field(..., serialization_alias='I) Total Number of Locations Served by Type - Community Anchor Institution (Planned)')
    Number_of_CAI_Actual__c: Optional[conint(ge=0, le=999999999)] = Field(default=None, serialization_alias='I) Total Number of Locations Served by Type - Community Anchor Institution (Actual)')
    Explanation_Planned__c: Optional[str] = Field(default=None, serialization_alias='Explanation (Planned)', max_length=3000)
    Affordable_Connectivity_Program_ACP__c: YesNoType = Field(..., serialization_alias='Affordable Connectivity Program (ACP)?')

class AddressFields(BaseModel):
    Street_1_Planned__c: str = Field(..., serialization_alias='Street 1 (Planned)', max_length=40)
    Street_2_Planned__c: str = Field(default=None, serialization_alias='Street 2 (Planned)', max_length=40)
    Same_Address__c: YesNoType = Field(default=None, serialization_alias='Same Address')
    Street_1_Actual__c: str = Field(default=None, serialization_alias='Street 1 (Actual)', max_length=40)
    Street_2_Actual__c: str = Field(default=None, serialization_alias='Street 2 (Actual)', max_length=40)
    City_Planned__c: str = Field(..., serialization_alias='City (Planned)', max_length=40)
    City_Actual__c: str = Field(default=None, serialization_alias='City (Actual)', max_length=40)
    State_Planned__c: StateAbbreviation = Field(..., serialization_alias='State (Planned)')
    State_Actual__c: StateAbbreviation = Field(default=None, serialization_alias='State (Actual)')
    Zip_Code_Planned__c: str = Field(..., serialization_alias='Zip Code (Planned)', max_length=5)
    Zip_Code_Actual__c: str = Field(default=None, serialization_alias='Zip Code (Actual)', max_length=5)

class Project1BRow(BaseProjectRow, AddressFields):
    Laptops_Planned__c: conint(ge=0, le=9999999999) = Field(..., serialization_alias='Laptops (Planned)')
    Laptops_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Laptops (Actual)')
    Laptops_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = Field(..., serialization_alias='Laptops Expenditure (Planned)')
    Laptops_Expenditures_Actual__c: condecimal(max_digits=13, decimal_places=2) = Field(default=None, serialization_alias='Laptops Expenditure (Actual)')
    Tablets_Planned__c: conint(ge=0, le=9999999999) = Field(..., serialization_alias='Tablets (Planned)')
    Tablets_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Tablets (Actual)')
    Tablet_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = Field(..., serialization_alias='Tablets Expenditure (Planned)')
    Tablets_Expenditures_Actual__c: condecimal(max_digits=13, decimal_places=2) = Field(default=None, serialization_alias='Tablets Expenditure (Actual)')
    Desktop_Computers_Planned__c: conint(ge=0, le=9999999999) = Field(..., serialization_alias='Desktop Computers (Planned)')
    Desktop_Computers_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Desktop Computers (Actual)')
    Desktop_Computers_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = Field(..., serialization_alias='Desktop Computers Expenditure (Planned)')
    Desktop_Computers_Expenditures_Actual__c: condecimal(max_digits=13, decimal_places=2) = Field(default=None, serialization_alias='Desktop Computers Expenditure (Actual)')
    Public_WiFi_Planned__c: conint(ge=0, le=9999999999) = Field(..., serialization_alias='Public WiFi (Planned)')
    Public_WiFi_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Public WiFi (Actual)')
    Public_WiFi_Expenditures_Planned__c: condecimal(max_digits=13, decimal_places=2) = Field(..., serialization_alias='Public Wifi Expenditures (Planned)')
    Public_WiFi_Expenditures_Actual__c: condecimal(max_digits=13, decimal_places=2) = Field(default=None, serialization_alias='Public Wifi Expenditures (Actual)')
    Other_Devices_Planned__c: conint(ge=0, le=9999999999) = Field(..., serialization_alias='Other Devices (Planned)')
    Other_Devices_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Other Devices (Actual)')
    Other_Expenditures_Planned__c: condecimal(max_digits=7, decimal_places=2) = Field(..., serialization_alias='Other Expenditures (Planned)')
    Other_Expenditures_Actual__c: condecimal(max_digits=7, decimal_places=2) = Field(default=None, serialization_alias='Other Expenditures (Actual)')
    Explanation_of_Other_Expend__c: str = Field(default=None, serialization_alias='Explanation of Other Expenditures', max_length=3000)
    Number_of_Users_Planned__c: conint(ge=0, le=9999999999) = Field(..., serialization_alias='Number of Users (Planned)')
    Number_of_Users_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Number of Users (Actual)')
    Brief_Narrative_Planned__c: str = Field(..., serialization_alias='Brief Narrative (Planned)', max_length=3000)
    Brief_Narrative_Actual__c: str = Field(default=None, serialization_alias='Brief Narrative (Actual)', max_length=3000)
    Measurement_of_Effectiveness__c: YesNoType = Field(..., serialization_alias='Measurement of Effectiveness?')

class Project1CRow(BaseProjectRow, AddressFields):
    Type_of_Investment__c: str = Field(default=None, serialization_alias='Type of Investment')
    Additional_Address__c: str = Field(default=None, serialization_alias='Additional Addresses', max_length=32000)
    Classrooms_Planned__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Classrooms (Planned)')
    Classrooms_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Classrooms (Actual)')
    Computer_labs_Planned__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Computer labs (Planned)')
    Computer_labs_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Computer labs (Actual)')
    Multi_purpose_Spaces_Planned__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Multi-purpose Spaces (Planned)')
    Multi_purpose_Spaces_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Multi-purpose Spaces (Actual)')
    Telemedicine_Rooms_Planned__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Telemedicine Rooms (Planned)')
    Telemedicine_Rooms_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Telemedicine Rooms (Actual)')
    Other_Capital_Assets_Planned__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Other Capital Assets (Planned)')
    Other_Capital_Assets_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Other Capital Assets (Actual)')
    Type_and_Features__c: str = Field(default=None, serialization_alias='Type and Features', max_length=3000)
    Total_square_footage_Planned__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Total square footage (Planned)')
    Total_square_footage_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Total square footage (Actual)')
    Total_Number_of_Users_Actual__c: conint(ge=0, le=9999999999) = Field(default=None, serialization_alias='Total Number of Users (Actual)')
    Further_Explanation__c: str = Field(default=None, serialization_alias='Further Explanation', max_length=2000)
    Access_to_Public_Transit__c: YesNoType = Field(..., serialization_alias='Access to Public Transit?')


class SubrecipientRow(BaseModel):
    Name: str = Field(..., serialization_alias='Subrecipient Name', max_length=80)
    EIN__c: str = Field(..., serialization_alias='Subrecipient Tax ID Number (TIN)', min_length=9, max_length=9)
    Unique_Entity_Identifier__c: str = Field(..., serialization_alias='Unique Entity Identifier (UEI)', min_length=12, max_length=12)
    POC_Name__c: str = Field(..., serialization_alias='POC Name', max_length=100)
    POC_Phone_Number__c: str = Field(..., serialization_alias='POC Phone Number', max_length=10)
    POC_Email_Address__c: str = Field(..., serialization_alias='POC Email Address', max_length=80)
    Zip__c: str = Field(..., serialization_alias='Zip5', max_length=5)
    Zip_4__c: str = Field(default=None, serialization_alias='Zip4', max_length=4)
    Address__c: str = Field(..., serialization_alias='Address Line 1', max_length=40)
    Address_2__c: str = Field(default=None, serialization_alias='Address Line 2', max_length=40)
    Address_3__c: str = Field(default=None, serialization_alias='Address Line 3', max_length=40)
    City__c: str = Field(..., serialization_alias='City', max_length=100)
    State_Abbreviated__c: StateAbbreviation = Field(..., serialization_alias='State Abbreviated')


class Version(Enum):
    V2023_12_12 = "v:20231212"
    V2024_01_07 = "v:20240107"

class ProjectType(str, Enum):
    _1A = "1A"
    _1B = "1B"
    _1C = "1C"

SCHEMA_BY_PROJECT = {
    ProjectType._1A: Project1ARow,
    ProjectType._1B: Project1BRow,
    ProjectType._1C: Project1CRow,
}
NAME_BY_PROJECT = {
    ProjectType._1A: "1A-Broadband Infrastructure",
    ProjectType._1B: "1B-Digital Connectivity Technology",
    ProjectType._1C: "1C-Multi-Purpose Community Facility"
}

METADATA_BY_SHEET = {
    'Cover': {
        "header_range": 'A1:B1',
        "min_row": 2,
        "max_row": 2,
        "min_col": 1,
        "max_col": 2,
    },
    'Subrecipients': {
        "header_range": 'C3:O3',
        "min_row": 13,
        "max_row": None,
        "min_col": 3,
        "max_col": 16,
    },
    'Project': {
        "header_range": 'C3:DS3',
        "min_row": 13,
        "max_row": None,
        "min_col": 3,
        "max_col": 123,
    },
}

class LogicSheetVersion(BaseModel):
    version: Version = Field(...)

class CoverSheetRow(BaseModel):
    project_use_code: str = Field(..., alias='Project Use Code')
    project_use_name: str = Field(..., alias='Project Use Name')

    @validator('project_use_name')
    def validate_code_name_pair(cls, v, values, **kwargs):
        project_use_code = values.get('project_use_code')
        expected_name = NAME_BY_PROJECT.get(project_use_code)
        
        if not expected_name:
            raise ValueError(f"Project use code '{project_use_code}' is not recognized.")
        if expected_name != v:
            raise ValueError(f"Project use code '{project_use_code}' does not match '{v}'. Expected '{expected_name}'.")
        
        return v
