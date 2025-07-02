from beanie import Document 
from datetime import datetime
from pydantic import Field

class TimeStamps():
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @before_event(Replace)
    def update_timestamp(self):
        self.updated_at = datetime.utcnow()