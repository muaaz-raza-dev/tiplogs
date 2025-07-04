from pydantic import BaseModel
from   models.user import UserRole

class PayloadRegisterOrganization(BaseModel):
    name:str 


class PayloadRegisterAdmin(BaseModel):
    full_name:str 
    username:str 
    password:str
    role : UserRole.admin 
    email:str

class PayloadLogin(BaseModel):
    username:str
    password:str
    