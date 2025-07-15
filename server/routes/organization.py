from fastapi import APIRouter ,Depends 
from tschema.auth import PayloadRegisterOrganization
from models.organization import Organization
from utils.response import Respond
from pydantic import ValidationError
from middleware.authorization import authorize_user
from models.user import UserRole ,User

router = APIRouter(prefix="/org")

@router.post("/register")
async def RegisterOrganization(req:PayloadRegisterOrganization,user=Depends(authorize_user)):
    try:
    
        if not user.is_verified or user.role == UserRole.admin :
            return Respond(status_code=401,message="Verify your account first",success=False)
    
        existing = await Organization.find_one(Organization.name == req.name)
        if existing:
            return Respond(status_code=409, message="An organization with this name already exists", success=False)

        org = await Organization(**req.model_dump(),admin=user.user_id)
        org.insert()
        
        await User(id==user.user_id).update({Organization:org.id})

        return Respond(message="Organization is created successfully")
    except ValidationError as ve:
        return Respond(status_code=422, message="Validation failed", payload=ve.errors(), success=False)

    except Exception as e:
        # Log the error or return internal server response
        print(f"[Register Org Error] {e}")
        return Respond(status_code=500, message="Something went wrong", success=False)
