from enum import Enum

from src.schemas.project_types import ProjectType


class OutputTemplateFilename(Enum):
    CPF1ABroadbandInfrastructureTemplate = "CPF1ABroadbandInfrastructureTemplate"
    CPF1BDigitalConnectivityTechTemplate = "CPF1BDigitalConnectivityTechTemplate"
    CPF1CMultiPurposeCommunityTemplate = "CPF1CMultiPurposeCommunityTemplate"
    CPFSubrecipientTemplate = "CPFSubrecipientTemplate"

    def __str__(self) -> str:
        return self.value


OUTPUT_TEMPLATE_FILENAME_BY_PROJECT = {
    ProjectType._1A: OutputTemplateFilename.CPF1ABroadbandInfrastructureTemplate,
    ProjectType._1B: OutputTemplateFilename.CPF1BDigitalConnectivityTechTemplate,
    ProjectType._1C: OutputTemplateFilename.CPF1CMultiPurposeCommunityTemplate,
    "Subrecipient": OutputTemplateFilename.CPFSubrecipientTemplate,
}
