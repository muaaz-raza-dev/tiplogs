from fastapi import APIRouter
from types.auth import PayloadRegisterAdmin,PayloadLogin,PayloadRegisterOrganization
from models.organization import Organization
from models.user import User 
from utils.hash import Hash,VerifyHash
from models.user import UserRole
from utils.response import Response
from pydantic import BaseModel

router = APIRouter(prefix="/auth")

@router.post("/register/admin")
async def RegisterAdmin(req:PayloadRegisterAdmin):
    hashed_password =  Hash(req.user.password)
    user = User(**req.model_dump(),password=hashed_password,role=UserRole)
    await user.insert()

@router.post("/register/organization")
async def RegisterOrganization(req:PayloadRegisterOrganization):
    org = await Organization(**req.model_dump())
    org.insert()
    


class LimitedUserPayload(BaseModel):
    password: str
    username: str

@router.post("/login")
async def Login(req:PayloadLogin):
    user = User.find(User.username == req.username,projection_model=LimitedUserPayload).first_or_none()

    if not user : 
        Response(status_code=401,message="Invalid Credentials",success=False)        
    
    is_valid = VerifyHash(user.password,req.password)

    if not is_valid :
        Response(status_code=401,message="Invalid Credentials",success=False)        

    



