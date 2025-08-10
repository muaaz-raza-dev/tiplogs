from beanie import Document,Link 
from pydantic import Field
from models.generals import TimeStamps
from enum import Enum
from typing import Optional,List
from datetime import datetime
from models.Individual import Individual 
from pydantic import BaseModel
from models.att_base import AttendanceEventStatus
from datetime import timezone
from models.att_base import AttendanceBase
from models.group import Group  
from models.user import User

class Attendance_Status(str,Enum):
    present = "present"
    absent = "absent"
    late = "late"
    leave = "leave" # It is absent but won't count as absent in the record

class AttendanceRecord (BaseModel):
    individual:Link["Individual"]
    status: Attendance_Status 

    att_taken_at :  datetime = Field(default_factory=lambda: datetime.now(timezone.utc)) 

    reporting_time : datetime
    att_note:Optional[str] = None

class AttendanceGroup(Document , TimeStamps): 
    att_base : Link["AttendanceBase"] 

    group : Link["Group"] 
    taken_by: Optional[Link["User"]] = None
    attendance_status : AttendanceEventStatus

    attendance : List[AttendanceRecord] 
    
    class Settings :
        name = "attendance_group"
        indexes = [[("att_base_id", 1), ("group_id", 1)],
                   "group_id","att_base_id"
                   ]
        
AttendanceGroup.model_rebuild()