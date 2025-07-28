from beanie import Document , Link 
from models.generals import TimeStamps
from pymongo.operations import IndexModel
from typing import Optional ,List
from models.organization import Organization
from datetime import datetime
from pydantic import BaseModel
class HistoryItem(BaseModel):
    updated_at: datetime
    is_active: bool

class Group(Document,TimeStamps):
    name : str 
    organization : Link[Organization]
    
    is_active : Optional[bool] = True
    history : Optional[List[HistoryItem]]  =None
    class Settings :
        name= "groups"
        indexes = ["organization",
                               IndexModel([("name", "text")])
                   ]


