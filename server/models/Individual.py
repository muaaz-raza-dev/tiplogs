from beanie import Document ,Link 
from typing import Optional,Literal
from datetime import datetime
from models.generals import TimeStamps
from models.organization import Organization
from models.group import Group
from models.user import User
from pymongo import TEXT


class Individual(Document,TimeStamps):
    # basic information
    full_name:str 
    father_name:Optional[str]
    photo:str = "https://res.cloudinary.com/dz8a9sztc/image/upload/v1711541749/students_dpw9qp.png"
    contact :Optional[str]
    cnic:Optional[str] =None
    dob : Optional[datetime]
    doa : Optional[datetime]
    gender : Literal["male","female","other"]
    
    
    # Class Identities
    grno:Optional[str]
    roll_no:Optional[str]  
    organization:Link[Organization] 
    group : Link[Group]
    approved_by : Optional[Link[User]] # type: ignore
    
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