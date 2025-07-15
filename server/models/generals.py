from datetime import datetime, timezone
from pydantic import Field
from beanie import before_event, Replace

class TimeStamps:
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @before_event(Replace)
    def update_timestamp(self):
        self.updated_at = datetime.now(timezone.utc)