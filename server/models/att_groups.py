from beanie import Document,Link ,Field
from models.att_module import attendance_frequency
from models.generals import TimeStamps
from typing import TYPE_CHECKING,List
from enum import Enum
from typing import TYPE_CHECKING,Optional
from datetime import datetime
from models.Individual import Individual 
from pydantic import BaseModel
if TYPE_CHECKING:  # type: ignore
    from models.group import Group  
    from models.user import User
    from models.att_daily_base import AttendanceDailyBase
    from models.att_custom_base import AttendanceCustomBase

class Attendance_Status(str,Enum):
    present = "present"
    absent = "absent"
    late = "late"
    leave = "leave" # It is absent but won't count as absent in the record

class AttendanceRecord (BaseModel):
    individual:Link["Individual"]
    status: Attendance_Status 

    att_taken_at :  datetime = Field(default_factory=datetime.utcnow) 

    reporting_time : datetime
    leave_reason: Optional[str] | None = None

class AttendanceGroups(Document , TimeStamps): 
    att_base_id : Link["AttendanceDailyBase"|"AttendanceCustomBase"] 
    type : attendance_frequency 

    group_id : Link["Group"] 
    taken_by: Link["User"] 
    
    attendance : List[AttendanceRecord] 
    
    class Settings :
        indexes = [[("att_base_id", 1), ("group_id", 1)],
                   "group_id","att_base_id"
                   ]
