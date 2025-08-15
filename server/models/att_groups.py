from beanie import Document,Link 
from pydantic import Field
from models.generals import TimeStamps
from enum import Enum
from typing import Optional,List
from bson import ObjectId
from datetime import datetime
from models.Individual import Individual 
from pydantic import BaseModel
from models.att_base import AttendanceEventStatus
from datetime import timezone
from models.att_base import AttendanceBase
from models.group import Group  
from models.user import User
from pydantic import BaseModel

class StatusCounts(BaseModel):
    present: int
    absent: int
    leave: int
    late: int
    half: int


class AttendanceGroup(Document , TimeStamps): 
    att_base : Link["AttendanceBase"] 
    group : Link["Group"] 
    taken_by: Optional[Link["User"]] = None

    attendance_status : AttendanceEventStatus
    
    status_counts:Optional[StatusCounts] =None
    
    class Settings :
        name = "attendance_group"
        indexes = [[("att_base", 1), ("group", 1)],"group","att_base"]
        
AttendanceGroup.model_rebuild()