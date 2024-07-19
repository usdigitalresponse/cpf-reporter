from unittest.mock import patch, MagicMock
from aws_lambda_typing.context import Context

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
