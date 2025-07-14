from beanie import Document , Indexed 
from typing import Optional,List,Literal
from datetime import datetime
from models.generals import TimeStamps
from models.classes import Group

 

class Individual(Document,TimeStamps):
    # basic information
    name:str 
    f_name:Optional[str]
    photo:str = "https://res.cloudinary.com/dz8a9sztc/image/upload/v1711541749/students_dpw9qp.png"
    contact :Optional[List(str)]
    dob : Optional[datetime]
    gender : Literal["male","female","other"]
    
    # Class Identities
    grno:str
    roll_no:Optional[str]  
    organization:str 
    current_group : Optional[Link(Group)]
    approved_by : Optional[Link("User")] # type: ignore
    
    # id details 
    #* username = grno 
    password : str 

    # Attendance status 
    is_terminated : bool = False 
    is_approved : bool = False
    is_blocked : bool = False
    is_deleted : bool = False

    

