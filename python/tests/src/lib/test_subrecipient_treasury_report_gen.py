import pytest
from unittest.mock import patch, MagicMock, ANY, call
from aws_lambda_typing.context import Context
import json
from tempfile import NamedTemporaryFile
from openpyxl import Workbook

from src.functions.subrecipient_treasury_report_gen import (
    handle,
    write_subrecipients_to_workbook,
    FIRST_BLANK_ROW_NUM,
    upload_workbook,
    WORKSHEET_NAME,
    BUCKET_NAME,
    get_most_recent_upload,
)


class TestHandleNoEventOrNoContext:
    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_no_event_provided(
        self, mock_get_logger, valid_aws_typing_context: Context
    ):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        handle(None, valid_aws_typing_context)
        mock_logger.exception.assert_called_once_with("Missing event or context")

    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_no_context_provided(self, mock_get_logger):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger
        event = {}
        context = None

        handle(event, context)

        mock_logger.exception.assert_called_once_with("Missing event or context")


class TestHandleIncompleteEventInput:
    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_no_organization_id(
        self, mock_get_logger, valid_aws_typing_context: Context
    ):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        handle(
            {"organization": {"preferences": {"current_reporting_period_id": 1}}},
            valid_aws_typing_context,
        )

        mock_logger.exception.assert_called_once_with(
            "Exception getting reporting period or organization id from event -- missing field: 'id'"
        )

    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_no_preferences(
        self, mock_get_logger, valid_aws_typing_context: Context
    ):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        handle({"organization": {"id": 1}}, valid_aws_typing_context)

        mock_logger.exception.assert_called_once_with(
            "Exception getting reporting period or organization id from event -- missing field: 'preferences'"
        )

    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_no_current_reporting_period_id(
        self, mock_get_logger, valid_aws_typing_context: Context
    ):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        handle({"organization": {"id": 1, "preferences": {}}}, valid_aws_typing_context)

        mock_logger.exception.assert_called_once_with(
            "Exception getting reporting period or organization id from event -- missing field: 'current_reporting_period_id'"
        )

    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_no_output_template_id(
        self, mock_get_logger, valid_aws_typing_context: Context
    ):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        handle(
            {
                "organization": {
                    "id": 1,
                    "preferences": {"current_reporting_period_id": 1},
                }
            },
            valid_aws_typing_context,
        )

        mock_logger.exception.assert_called_once_with(
            "Exception getting reporting period or organization id from event -- missing field: 'outputTemplateId'"
        )


class TestInvalidSubrecipientsFile:
    @patch("src.functions.subrecipient_treasury_report_gen.boto3.client")
    @patch("src.functions.subrecipient_treasury_report_gen.tempfile.NamedTemporaryFile")
    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_invalid_subrecipients_file(
        self,
        mock_get_logger,
        mock_tempfile,
        mock_boto_client,
        invalid_json_content,
        sample_subrecipients_generation_event,
    ):
        mock_s3_client = MagicMock()
        mock_boto_client.return_value = mock_s3_client
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        temp_file = NamedTemporaryFile(delete=False)
        temp_file.write(invalid_json_content.encode())
        temp_file.seek(0)
        mock_tempfile.return_value.__enter__.return_value = temp_file

        handle(sample_subrecipients_generation_event, MagicMock())

        mock_logger.exception.assert_called_once_with(
            "Subrecipients file for organization org123 and reporting period reporting123 does not contain valid JSON"
        )

    @patch("src.functions.subrecipient_treasury_report_gen.boto3.client")
    @patch("src.functions.subrecipient_treasury_report_gen.tempfile.NamedTemporaryFile")
    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_no_subrecipients_key(
        self,
        mock_get_logger,
        mock_tempfile,
        mock_boto_client,
        no_subrecipients_key_json_content,
        sample_subrecipients_generation_event,
    ):
        mock_s3_client = MagicMock()
        mock_boto_client.return_value = mock_s3_client
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        temp_file = NamedTemporaryFile(delete=False)
        temp_file.write(json.dumps(no_subrecipients_key_json_content).encode())
        temp_file.seek(0)
        mock_tempfile.return_value.__enter__.return_value = temp_file

        handle(sample_subrecipients_generation_event, MagicMock())

        mock_logger.warning.assert_called_once_with(
            "Subrecipients file for organization org123 and reporting period reporting123 does not have any subrecipients listed"
        )

    @patch("src.functions.subrecipient_treasury_report_gen.boto3.client")
    @patch("src.functions.subrecipient_treasury_report_gen.tempfile.NamedTemporaryFile")
    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_no_subrecipients_list(
        self,
        mock_get_logger,
        mock_tempfile,
        mock_boto_client,
        no_subrecipients_list_json_content,
        sample_subrecipients_generation_event,
    ):
        mock_s3_client = MagicMock()
        mock_boto_client.return_value = mock_s3_client
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        temp_file = NamedTemporaryFile(delete=False)
        temp_file.write(json.dumps(no_subrecipients_list_json_content).encode())
        temp_file.seek(0)
        mock_tempfile.return_value.__enter__.return_value = temp_file

        handle(sample_subrecipients_generation_event, MagicMock())

        mock_logger.warning.assert_called_once_with(
            "Subrecipients file for organization org123 and reporting period reporting123 does not have any subrecipients listed"
        )

    @patch("src.functions.subrecipient_treasury_report_gen.boto3.client")
    @patch("src.functions.subrecipient_treasury_report_gen.tempfile.NamedTemporaryFile")
    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_empty_subrecipients_list(
        self,
        mock_get_logger,
        mock_tempfile,
        mock_boto_client,
        empty_subrecipients_list_json_content,
        sample_subrecipients_generation_event,
    ):
        mock_s3_client = MagicMock()
        mock_boto_client.return_value = mock_s3_client
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        temp_file = NamedTemporaryFile(delete=False)
        temp_file.write(json.dumps(empty_subrecipients_list_json_content).encode())
        temp_file.seek(0)
        mock_tempfile.return_value.__enter__.return_value = temp_file

        handle(sample_subrecipients_generation_event, MagicMock())

        mock_logger.warning.assert_called_once_with(
            "Subrecipients file for organization org123 and reporting period reporting123 does not have any subrecipients listed"
        )


class TestWriteSubrecipientsToWorkbook:
    def test_write_subrecipients_to_workbook_no_uploads(
        self, subrecipients_no_uploads, empty_subrecipient_treasury_template
    ):
        mock_logger = MagicMock()

        write_subrecipients_to_workbook(
            subrecipients_no_uploads, empty_subrecipient_treasury_template, mock_logger
        )

        mock_logger.warning.assert_called_once_with(
            "Subrecipient in recent uploads file with id 1 and name Bob doesn't have any associated uploads, skipping in treasury report"
        )

    def test_write_subrecipients_to_workbook_empty_output_file_valid_subrecipients(
        self, valid_subrecipients_json_content, empty_subrecipient_treasury_template
    ):
        mock_logger = MagicMock()

        write_subrecipients_to_workbook(
            valid_subrecipients_json_content,
            empty_subrecipient_treasury_template,
            mock_logger,
        )

        edited_row = empty_subrecipient_treasury_template["Baseline"][
            FIRST_BLANK_ROW_NUM
        ]
        subrecipient_upload_data = valid_subrecipients_json_content["subrecipients"][0][
            "subrecipientUploads"
        ][0]["rawSubrecipient"]

        assert edited_row[1].value == subrecipient_upload_data["Name"]
        assert (
            edited_row[2].value == subrecipient_upload_data["Recipient_Profile_ID__c"]
        )
        assert edited_row[3].value == subrecipient_upload_data["EIN__c"]
        assert (
            edited_row[4].value
            == subrecipient_upload_data["Unique_Entity_Identifier__c"]
        )
        assert edited_row[5].value == subrecipient_upload_data["POC_Name__c"]
        assert edited_row[6].value == subrecipient_upload_data["POC_Phone_Number__c"]
        assert edited_row[7].value == subrecipient_upload_data["POC_Email_Address__c"]
        assert edited_row[8].value == subrecipient_upload_data["Zip__c"]
        assert edited_row[9].value is None  # Zip4
        assert edited_row[10].value == subrecipient_upload_data["Address__c"]
        assert edited_row[11].value is None  # Address line 2
        assert edited_row[12].value is None  # Address line 3
        assert edited_row[13].value == subrecipient_upload_data["City__c"]
        assert edited_row[14].value == subrecipient_upload_data["State_Abbreviated__c"]


class TestUploadSubrecipientWorkbook:
    @patch("src.functions.subrecipient_treasury_report_gen.upload_generated_file_to_s3")
    @patch("src.functions.subrecipient_treasury_report_gen.convert_xlsx_to_csv")
    def test_upload_workbook(
        self, mock_convert_xlsx_to_csv, mock_upload_generated_file_to_s3
    ):
        mock_s3_client = MagicMock()
        workbook = Workbook()
        workbook.create_sheet(WORKSHEET_NAME)
        user_id = "test_user"
        organization_id = "test_org"
        reporting_period_id = "test_period"
        upload_template_location_minus_filetype = f"/treasuryreports/{organization_id}/{reporting_period_id}/{user_id}/CPFSubrecipientTemplate"
        upload_template_xlsx_key = f"{upload_template_location_minus_filetype}.xlsx"
        upload_template_csv_key = f"{upload_template_location_minus_filetype}.csv"

        upload_workbook(
            workbook, mock_s3_client, user_id, organization_id, reporting_period_id
        )

        mock_convert_xlsx_to_csv.assert_called_once()

        calls = [
            call(mock_s3_client, BUCKET_NAME, upload_template_xlsx_key, ANY),
            call(mock_s3_client, BUCKET_NAME, upload_template_csv_key, ANY),
        ]
        mock_upload_generated_file_to_s3.assert_has_calls(calls, any_order=True)


class TestGetMostRecentUpload:
    def test_get_most_recent_upload(self, sample_subrecipient_uploads_with_dates):
        result = get_most_recent_upload(sample_subrecipient_uploads_with_dates)
        assert result["id"] == 2

    def test_get_most_recent_upload_with_single_entry(self):
        single_entry_subrecipient = {
            "subrecipientUploads": [{"id": 1, "updatedAt": "2023-07-01T12:00:00Z"}]
        }
        result = get_most_recent_upload(single_entry_subrecipient)
        assert result["id"] == 1

    def test_get_most_recent_upload_with_empty_list(self):
        empty_subrecipient = {"subrecipientUploads": []}
        with pytest.raises(IndexError):
            get_most_recent_upload(empty_subrecipient)
