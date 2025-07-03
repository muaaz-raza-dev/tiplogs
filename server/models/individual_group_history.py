from typing import List, Optional
from beanie import Document, Link
from pydantic import BaseModel, Field
from datetime import datetime

from models.generals import TimeStamps
from models.individual import Individual
from models.group import Group


class GroupHistory(BaseModel):
    admission_date: datetime
    exit_date: Optional[datetime] = None  # In case they're still enrolled
    promotion_reason: str = "just cleared"
    group: Link[Group]


class IndividualGroupHistory(Document, TimeStamps):
    individual_id: Link[Individual]
    doa: Optional[datetime] = None
    history: List[GroupHistory] = Field(default_factory=list)
