from beanie import Document , Link
from models.generals import TimeStamps
from typing import TYPE_CHECKING,Optional
from datetime import datetime 
from models.organization import Organization
class Group(Document,TimeStamps):
    name :str 
    organization_id : Link[Organization]
    
    is_deleted:bool = False 
    deletion_date:Optional[datetime] 

