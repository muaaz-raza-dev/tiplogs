from pydantic import BaseModel
from typing import Optional ,List
from models.att_module import attendance_frequency
class CreateAttendanceModulePayloadBody(BaseModel):
    name: str
    description: Optional[str] = None
    groups: List[str]
    frequency: attendance_frequency


class EditAttendanceModulePayloadBody(BaseModel):
    name: str
    description: Optional[str] = None

class AddGroupToAttendanceModulePayloadBody(BaseModel):
    group:str;
    users:List[str]

class ValidateAttendanceDatePayloadBody(BaseModel):
    date:str  # Date should be in this format => YYYY-MM-DD