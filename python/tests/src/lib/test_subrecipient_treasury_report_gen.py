from unittest.mock import patch, MagicMock
from aws_lambda_typing.context import Context
import structlog
import tempfile
from unittest import mock

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
    def mock_download_s3_object_invalid(
        self, s3_client, bucket_name, file_key, temp_file, invalid_json_content
    ):
        temp_file.write(invalid_json_content.encode())
        temp_file.seek(0)

    @patch("src.functions.subrecipient_treasury_report_gen.get_logger")
    def test_handle_invalid_json(
        self,
        mock_get_logger,
        invalid_subrecipients_json_content,
        sample_subrecipients_generation_event,
        valid_aws_typing_context: Context,
    ):
        mock_logger = MagicMock()
        mock_get_logger.return_value = mock_logger

        with mock.patch(
            "src.lib.s3_object_downloader.download_s3_object",
            side_effect=lambda *args: self.mock_download_s3_object_invalid(
                *args, invalid_json_content=invalid_subrecipients_json_content
            ),
        ):
            with mock.patch("boto3.client"):
                with tempfile.NamedTemporaryFile() as recent_subrecipients_file:
                    with structlog.contextvars.bound_contextvars(
                        subrecipients_filename=recent_subrecipients_file.name
                    ):
                        handle(
                            sample_subrecipients_generation_event,
                            valid_aws_typing_context,
                        )

        mock_logger.exception.assert_called_once_with(
            "Encountered an error parsing subrecipients file"
        )
