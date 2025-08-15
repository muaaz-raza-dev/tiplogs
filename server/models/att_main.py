from beanie import Document,Link ,PydanticObjectId
from models.generals import TimeStamps
from enum import Enum
from typing import Optional
from datetime import datetime
from models.att_groups import AttendanceGroup

class Attendance_Status(str,Enum):
    present = "present"
    absent = "absent"
    late = "late"
    leave = "leave" 
    half = "half_day" 


class Attendance(Document , TimeStamps): 
    att_group : Link["AttendanceGroup"] 
    individual: PydanticObjectId 


    
    status : Attendance_Status 
    att_note:Optional[str] = None


    att_date : datetime 
    reporting_time :  str
    
    class Settings :
        name = "attendance"
        indexes = [[("individual", 1), ("att_date", 1)],"att_group","att_date"]
        
Attendance.model_rebuild()