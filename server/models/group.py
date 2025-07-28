from beanie import Document , Link 
from models.generals import TimeStamps
from typing import Optional ,List
from models.organization import Organization
from datetime import datetime
from pydantic import BaseModel
class HistoryItem(BaseModel):
    name: str 
    updated_at: datetime
    is_activated: bool

class Group(Document,TimeStamps):
    name : str 
    organization : Link[Organization]
    
    is_activated : Optional[bool] = True
    history : Optional[List[HistoryItem]]  =None
    class Settings :
        name= "groups"
        indexes = ["organization",("name","text")]


