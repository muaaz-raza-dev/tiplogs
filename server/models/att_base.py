from beanie import Document,Link 
from models.generals import TimeStamps
from  datetime import datetime 
from typing import TYPE_CHECKING,Optional 
from models.att_module import attendance_frequency
from enum import Enum
from models.att_module import AttendanceModule
from models.user import User

class AttendanceEventStatus (str,Enum):
     upcoming = "upcoming"
     progess = "progress"
     complete = "complete"
     
class AttendanceBase(Document,TimeStamps):
    att_module:Link["AttendanceModule"]

    att_date : datetime 
    status : AttendanceEventStatus

    is_holiday:Optional[bool] = False 
    note : Optional[str] =None
    frequency:attendance_frequency

    is_deleted:Optional[bool] = False
    created_by: Link["User"]

    class Settings:
        name = "attendance_base"
        indexes = [[("att_module", 1), ("att_date", 1)]]
        

AttendanceBase.model_rebuild()