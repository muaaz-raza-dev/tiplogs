from pydantic import BaseModel
from typing import Optional ,List
from models.att_module import attendance_frequency
class CreateAttendanceModulePayloadBody(BaseModel):
    name: str
    description: Optional[str] = None
    groups: List[str]
    frequency: attendance_frequency
