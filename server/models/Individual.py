from beanie import Document ,Link 
from typing import Optional,Literal
from datetime import datetime
from models.generals import TimeStamps
from models.organization import Organization
from models.group import Group
from models.user import User
from pymongo import TEXT
from pydantic import EmailStr

class Individual(Document,TimeStamps):
    # basic information
    full_name:str 
    father_name:Optional[str]
    photo:str = None
    contact :Optional[str] = None
    cnic:Optional[int] =None
    dob : Optional[datetime] = None
    doa : Optional[datetime] = None
    gender : Literal["male","female","other"]
    email:Optional[EmailStr] = None
    
    # Class Identities
    grno:Optional[str] = None
    roll_no:Optional[str] = None
    organization:Link[Organization] 
    group : Optional[Link[Group]] = None
    approved_by : Optional[Link[User]] = None # type: ignore
    
    # id details 
    #* username = grno 
    password : str 

    # Attendance status 
    is_terminated : bool = False 
    is_approved : bool = False
    is_blocked : bool = False

    class Settings :
        name = "individuals" 
        indexes = ["full_name",[("full_name",TEXT)] , "grno"]

    

Individual.model_rebuild()
Group.model_rebuild()