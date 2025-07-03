from beanie import Document,Link 
from models.att_module import attendance_module
from models.generals import TimeStamps
from models.user import User
from typing import List
from enum import Enum
from datetime import datetime
from models.Individual import Individual

# * Attendance data od custom frequency designed for each class 

class AttendanceEventStatus (str,Enum):
     upcoming = "upcoming"
     progess = "progress"
     complete = "complete"

class AttendanceCustomBase(Document,TimeStamps):
    att_module_id:Link(attendance_module)

    status : AttendanceEventStatus 
    att_date : datetime
    created_by: Link(User) 


    att_complete_time : datetime

    is_deleted:bool = False

    class Settings:
        indexes = [[("att_module_id", 1), ("att_date", 1)]]

    



