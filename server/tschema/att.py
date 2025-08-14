from pydantic import BaseModel 
from typing import Optional

class IweeklyAttendanceRequestPayload(BaseModel):
    group:str;
    module:str;
    start_date:str;
    end_date:Optional[str] = None;
