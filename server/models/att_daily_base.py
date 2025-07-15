from beanie import Document,Link 
from models.generals import TimeStamps
from  datetime import datetime 
from typing import TYPE_CHECKING,Optional 
from models.att_custom_base import AttendanceEventStatus
if TYPE_CHECKING:  # type: ignore
    from models.att_module import attendance_module
class AttendanceDailyBase(Document,TimeStamps):
    att_module_id:Link["attendance_module"]

    att_date : datetime 
    status : AttendanceEventStatus
    att_complete_time : datetime | None = None 

    is_holiday:bool = False 
    holiday_note : Optional[str] 

    note : Optional[str] #for extra classes

    is_deleted:bool = False

    class Settings:
        indexes = [[("att_module_id", 1), ("att_date", 1)]]

