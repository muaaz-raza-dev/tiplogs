from beanie import Document , Indexed ,Link 
from enum import Enum
from models.user import User
from models.generals import TimeStamps
class Plans (str,Enum):
    basic="basic"
    premium="premium"

class Organization (Document,TimeStamps) :
    name : Indexed(str,unique=True)  # type: ignore

    individuals_name:str = "students"
    
    plan : Plans = Plans.basic
    
    admin:Link(User) # type: ignore

    user_auto_registration:bool = False  # Default is False, meaning manual registration is required 
    individual_auto_registration:bool = False
