from beanie import Document,Link 
from models.att_module import attendance_module
from models.generals import TimeStamps
from pydantic import BaseModel
from  datetime import datetime 
from typing import Optional 
from models.att_custom_base import AttendanceEventStatus

class AttendanceDailyBase(Document,TimeStamps):
    att_module_id:Link(attendance_module)

    att_date : datetime 
    status : AttendanceEventStatus
    att_complete_time : datetime | None = None 

    is_holiday:bool = False 
    holiday_note : Optional[str] 

    note : Optional[str] #for extra classes

    is_deleted:bool = False

    class Settings:
        indexes = [[("att_module_id", 1), ("att_date", 1)]]

