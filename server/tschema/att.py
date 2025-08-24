from pydantic import BaseModel 
from typing import Optional

class IweeklyAttendanceRequestPayload(BaseModel):
    group:str;
    module:str;
    start_date:str;
    end_date:Optional[str] = None;

class IScheduleCustomAttendancePayload(BaseModel):
    att_date:str




class IViewAttedanceRequestPayload(BaseModel):
    att_date:str;
    group:str;
    module:str;