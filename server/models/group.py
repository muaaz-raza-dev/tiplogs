from beanie import Document , Link
from models.organization import Organization
from models.generals import TimeStamps
from datetime import datetime
class Group(Document,TimeStamps):
    name :str 
    organization_id : Link(Organization)
    
    is_deleted:bool = False 
    deletion_date:Optional[datetime] 

