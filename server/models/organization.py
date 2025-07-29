from beanie import Document , Indexed ,Link 
from enum import Enum
from models.generals import TimeStamps
from models.user import User
from typing import TYPE_CHECKING,Optional 
if TYPE_CHECKING:  # type: ignore
    from models.user import User
class Plans (str,Enum):
    basic="basic"
    premium="premium"

class Organization (Document,TimeStamps) :
    name : str  # type: ignore

    individuals_name:str = "students"
    
    plan : Plans = Plans.basic
    
    admin:Link["User"] # type: ignore

    user_auto_registration:bool = False  # Default is False, meaning manual registration is required 
    GRNO_auto_assign:bool = True

Organization.model_rebuild()
User.model_rebuild()