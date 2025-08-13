from  beanie import Document,Link 
from pydantic import Field
from enum import Enum
from models.generals import TimeStamps
from pydantic import  BaseModel 
from bson import ObjectId
from datetime import datetime     
from typing import TYPE_CHECKING,Optional,List
from models.organization import Organization
from models.user import User
from models.group import Group

class attendance_frequency (str,Enum): 
    daily = "daily" 
    custom = "custom"

class Group_to_User (BaseModel):
    group : ObjectId
    users :  List[ObjectId]
    class Config :
        arbitrary_types_allowed=True


class AttendanceModule(Document,TimeStamps):
    name:str = Field(..., min_length=3)
    description:Optional[str] = None 

    groups: List[Link[Group]]
    users:Optional[List[ObjectId]] =None
    
    frequency: attendance_frequency 

    organization : Link[Organization] 

    # Assign User to take attendance
    groups_to_users : Optional[List[Group_to_User]] = Field(default_factory=list)

    is_active:bool = True 
    end_date : Optional[datetime] = None

    class Settings:
        name = "attendance_modules"
        indexes = ["name","organization"]
    model_config = {
        "arbitrary_types_allowed": True
    }

