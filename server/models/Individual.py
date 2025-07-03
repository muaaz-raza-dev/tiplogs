from beanie import Document , Indexed 
from typing import Optional,List,Literal
from datetime import datetime
from models.generals import TimeStamps
from models.group import Group

 

class Individual(Document,TimeStamps):
    # basic information
    name:str 
    f_name:Optional[str]
    photo:str = "https://res.cloudinary.com/dz8a9sztc/image/upload/v1711541749/students_dpw9qp.png"
    contact :Optional[List(str)]
    dob : Optional[datetime]
    gender : Literal["male","female","other"]
    
    # Class Identities
    grno:Indexed(str,unique = True)
    roll_no:Optional[str]  
    current_group : Link(Group)
    
    # id details 
    #* username = grno 
    password : str 
    refresh_token : str

    # Attendance status 
    is_terminated : bool = False 
    

