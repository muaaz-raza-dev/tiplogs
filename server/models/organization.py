from beanie import Document , Indexed ,Link
from models.user import User 
from enum import Enum
from datetime import datetime
from models.generals import TimeStamps
class Plans (str,Enum):
    basic="basic"
    premium="premium"

class Organization (Document,TimeStamps) :
    name : Indexed(str,unique=True)
    admin : Link(User)
    individuals_name:str = "students"
    plan : Plans = Plans.basic
