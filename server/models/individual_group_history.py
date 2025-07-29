from typing import List, Optional
from beanie import Document, Link
from pydantic import BaseModel, Field
from datetime import datetime
from models.generals import TimeStamps
from models.group import Group
from models.Individual import Individual

class GroupHistory(BaseModel):
    admission_date: datetime
    exit_date: Optional[datetime] = None  # In case they're still enrolled
    promotion_reason:Optional[str] = None
    group: Link[Group]


class IndividualGroupHistory(Document, TimeStamps):
    individual: Link[Individual]
    history: List[GroupHistory] = Field(default_factory=list)
    class Settings :
        name = "individualGroupHistory"
        

IndividualGroupHistory.model_rebuild()

