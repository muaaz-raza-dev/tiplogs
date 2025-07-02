from datetime import datetime
from typing import Optional
from enum import Enum
from beanie import Document , Indexed , Link
from pydantic import EmailStr
from models.organization import Organization
from models.generals import TimeStamps

class UserRole(str, Enum):
    admin = "admin"
    staff = "staff"
    manager = "manager"

class User(Document,TimeStamps):
    full_name:str 
    email:Optional[EmailStr]
    username:Indexed(str,unique=True)
    password:str
    phone:Optional[str] 

    #Links
    organization_id : Link(Organization)
    role : UserRole = UserRole.staff

    # Authentication / Authorizations 
    refresh_tokens : str 
    registered_by:Link(User)
    is_blocked:bool
    is_deleted:bool 
