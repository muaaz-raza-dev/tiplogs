from typing import TYPE_CHECKING,Optional ,TYPE_CHECKING
from beanie import Document , Indexed , Link
from pydantic import EmailStr
from models.generals import TimeStamps
from models.common import UserRole
if TYPE_CHECKING: # type: ignore
    from models.organization import Organization  # Avoid circular import
    from models.user import User  # For self-reference (User → registered_by: Link[User])

class User(Document,TimeStamps):
    full_name:str 
    email:EmailStr
    username:str=Indexed(str,unique=True)
    password:str
    phone:Optional[str] = None

    #Links
    organization : Optional[Link["Organization"]] =None # type: ignore
    role : UserRole = UserRole.staff

    # Authentication / Authorizations 
    is_verified :  bool = False
    verification_hash : Optional[str]  =None
    refresh_tokens :Optional[str] =None
    registered_by:Optional[Link["User"]] = None # type: ignore
    is_blocked:Optional[bool] = False 
    is_deleted:Optional[bool] = False 
    is_approved : Optional[bool] = False

    class Settings:
        name = "users"

from models.organization import Organization
User.model_rebuild() 
