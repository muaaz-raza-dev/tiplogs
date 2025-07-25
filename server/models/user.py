from typing import Optional , TYPE_CHECKING
from beanie import Document , Indexed , Link
from pydantic import EmailStr
from models.generals import TimeStamps
from models.common import UserRole
from datetime import datetime
if TYPE_CHECKING:  # type: ignore
    from models.organization import Organization

class User(Document,TimeStamps):
    full_name:str 
    email:EmailStr
    username:str=Indexed(str,unique=True)
    password:str
    phone:Optional[str] = None

    #Links
    organization : Optional[Link["Organization"]] =None # type: ignore
    role : UserRole = UserRole.user

    # Authentication / Authorizations 
    is_verified :  bool = False
    verification_hash : Optional[str]  = None 
    last_verification_attempt : Optional[datetime] = None
    verification_attempts : Optional[int]  = 0

    refresh_tokens :Optional[str] =None
    is_blocked:Optional[bool] = False 
    is_deleted:Optional[bool] = False 
    is_approved : Optional[bool] = False

    class Settings:
        name = "users"


