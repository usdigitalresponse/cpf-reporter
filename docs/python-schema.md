# Python Schema for Excel CPF Templates

In order to validate user reporting templates, we define a schema in Python that matches the Excel template schema (tabs, columns, and field types).
This schema is defined and validated using Pydantic, a Python library for data validation (docs [here](https://docs.pydantic.dev/latest/)).

## Note on terminology
For the purposes of this guide, we will use `file` to refer to code files, and `sheet` to refer to user-uploaded Excel reporting templates.

## Versioned schema files
The source of truth for ~99% of field validations are found in the versioned schema files in `python/src/schemas` (e.g., `python/src/schemas/schema_V2024_05_24.py`). The current schema will be whatever version has the most recent date. Older schemas are kept around for backwards compatability, though validating a sheet with an older schema will result in a version warning.

There is one canonical file, `schema_versions.py`, which is responsible for validating whether the uploaded sheet is using the most recent version (aforementioned warning). This file also is responsible for determining which Pydantic types are in use for a given sheet, given the version string provided in the "Logic" tab of each sheet.

These schema files are imported in `workbook_validator.py`, which validates each sheet tab against the schema in turn, and returns a final list of all errors when validation is complete.

## Column mappings in Python schema
In order to tie each Pydantic field directly to a column, we save a column mapping on each field using a property called `json_schema_extra`. This column then is tied up to the error message in `workbook_validator.get_workbook_errors_for_row`.

For example, in a `schema.py` file:
```
    Project_Name__c: constr(strip_whitespace=True, min_length=1, max_length=100) = Field(
        ..., serialization_alias="Project Name", json_schema_extra={"column":"C"}
    )
```
There should only be _one_ field per column per tab (e.g., the "Project" tab can only ever have a `Project_Name__c` field in column C).

## Updating the schema

Any substantive updates to the schema (e.g. adding new columns, or making a previously optional field required), should necessitate a new schema.py file for backwards compatability.

1. In `python/src/schemas`, create a new versioned `schema.py` adhering to the date conventions of the other schema files. Copy the contents of the previous most recent schema into the file.
2. Add your new fields or validations into the new schema file. In the event that you add a new field in a column that was previously assigned to an existing field, make sure to update the column mappings for downstream effects as necessary.
3. In `schema_versions.py`:
    - Import the Pydantic types from your new schema file (make sure to import them as a versioned name). Add them into the type unions for the overall return types.
    - Update the `version` field validator in `schema_versions.py` to use your new version as current.
    - Update the `KeyError` section of the `getVersionFromString` method to return your new version as default.
    - Update each method that returns a tab class (e.g. `SubrecipientRow`, `Project1ARow`, etc.) by adding a case for your new version.
    - Update the `METADATA` dict header ranges to include the new columns you added, if any
4. Update `test_workbook_validator.py` to use your new version:
    - Add a sample file with valid data in `xlsm` format to `python/tests/data` (NOTE: On a Mac, the easiest way to do this that I have found is to upload the   template to Google Sheets, add valid data there, download as xlsm and paste directly into your IDE)
    - Update `conftest.py` by adding a path to your new sample data and changing `valid_file()` and `valid_workbook()` to read from it
    - Update `test_workbook_validator` by adding a new string for your new version, and using it as default in method calls
