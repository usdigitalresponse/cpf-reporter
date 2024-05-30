from enum import Enum

class ProjectType(str, Enum):
    _1A = "1A"
    _1B = "1B"
    _1C = "1C"

    @classmethod
    def from_project_name(cls, project_name: str) -> "ProjectType":
        for project_type in cls:
            if project_type.value == project_name:
                return project_type
        raise ValueError(f"Project name '{project_name}' is not a recognized project type.")
    
NAME_BY_PROJECT = {
    ProjectType._1A: "1A-Broadband Infrastructure",
    ProjectType._1B: "1B-Digital Connectivity Technology",
    ProjectType._1C: "1C-Multi-Purpose Community Facility",
}