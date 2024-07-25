from unittest.mock import patch, MagicMock
from aws_lambda_typing.context import Context
import json
from tempfile import NamedTemporaryFile

from src.functions.subrecipient_treasury_report_gen import handle


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

        mock_logger.exception.assert_called_once_with(
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

        mock_logger.exception.assert_called_once_with(
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

        mock_logger.exception.assert_called_once_with(
            "Subrecipients file for organization org123 and reporting period reporting123 does not have any subrecipients listed"
        )
