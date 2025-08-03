import traceback
import random
from fastapi import APIRouter ,Depends 
from tschema.auth import PayloadRegisterOrganization
from models.organization import Organization
from utils.response import Respond
from pydantic import ValidationError
from middleware.authorization import authorize_user
from models.user import UserRole ,User
from bson import ObjectId
from pydantic import BaseModel
from jose import JWTError, jwt, ExpiredSignatureError
from config import JWT_SECRET, JWT_ALGORITHM
router = APIRouter(prefix="/org")

@router.post("/register")
async def RegisterOrganization(req:PayloadRegisterOrganization,user=Depends(authorize_user)):
    try:
        user_doc = await User.get(ObjectId(user["id"]))

        if not user_doc.is_verified :
            return Respond(status_code=401,message="Verify your account first",success=False)
        if user_doc.role != UserRole.admin  :
            return Respond(status_code=401,message="Your are not authorized to perform this task",success=False)

        is_exists = await Organization.find_one(Organization.admin.id == ObjectId(user_doc.id))


        
        if is_exists:
            return Respond(status_code=409, message="You already have an organization", success=False)

        org = Organization(**req.model_dump(exclude=["admin"]),admin=user_doc)
        await org.insert()
        
        user_doc.organization = org
        await user_doc.save()


        accessToken = jwt.encode(
            {"id": str(user_doc.id), "is_verified": user_doc.is_verified, "username": user_doc.username, "organization": str(org.id), "role": user_doc.role},
            JWT_SECRET,
            algorithm=JWT_ALGORITHM
        )
        return Respond(message="Organization is created successfully",payload={"organization": {
    **org.model_dump(include={"name", "plan", "individuals_name"}),
    "id": str(org.id)
},"accessToken":accessToken},status_code=201)
    
    except ValidationError as ve:
        return Respond(status_code=422, message="Validation failed", payload=ve.errors(), success=False)

    except Exception as e:
        # Log the error or return internal server response 
        
        print(f"[Register Org Error] {e}")
        return Respond(status_code=500, message="Something went wrong", success=False)



@router.get("/individual/registration/auto/status") 
async def GetIndividualRegistrationStatus(user=Depends(authorize_user)):
    try :
        organization = await Organization.get(ObjectId(user["organization"]))
        if not organization :
            return Respond(message="Invalid credentials",status_code=401)
        token = ""
        if organization.individual_auto_registration :
            token = jwt.encode({"id":str(organization.id),"hash":organization.auto_registration_hash},JWT_SECRET,algorithm=JWT_ALGORITHM) 

        return Respond(payload={"status":organization.individual_auto_registration,"token":token})
    except Exception as e :
        print(e)
        return Respond(message="Internal server error",status_code=501)

class ItoggleAutoRegistrationStatusBody(BaseModel):
    status:bool

@router.put("/individual/registration/auto/status") 
async def ToggleAutoRegistrationStatus(payload:ItoggleAutoRegistrationStatusBody,user= Depends(authorize_user)):
    try :
        organization = await Organization.get(ObjectId(user["organization"]))
        if not organization :
            return Respond(message="Invalid credentials",status_code=401)
        
        hash = organization.auto_registration_hash 

        if payload.status :
            hash =  str(random.randint(100000, 999999))
            organization.auto_registration_hash = hash
        else :
            organization.auto_registration_hash = None
            
        organization.individual_auto_registration = payload.status
        await organization.save()

        token = jwt.encode({"id":str(organization.id),"hash":organization.auto_registration_hash},JWT_SECRET,algorithm=JWT_ALGORITHM) 

        return Respond(payload={"status":organization.individual_auto_registration,"token":token})
    except Exception as e :
        traceback.print_exc()
        print(e)
        return Respond(message="Internal server error",status_code=501)


@router.get("/verify/registration/auto/{token}")
async def ToggleAutoRegistrationStatus(token: str):
    try:
        token_content = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

        if not token_content or "id" not in token_content or "hash" not in token_content:
            return Respond(message="Invalid token", status_code=401)

        id = token_content["id"]
        hash = token_content["hash"]

        if not ObjectId.is_valid(id):
            return Respond(message="Invalid ID in token", status_code=401)

        organization = await Organization.find_one(
            Organization.id == ObjectId(id),
            Organization.auto_registration_hash == hash
        )

        if not organization:
            return Respond(message="Invalid credentials", status_code=401)

        return Respond(payload={
            "organization": {
                "name": organization.name,
                "id": str(organization.id)
            }
        })

    except ExpiredSignatureError:
        return Respond(message="Token expired", status_code=401)
    except JWTError:
        return Respond(message="Invalid token", status_code=401)
    except Exception as e:
        traceback.print_exc()
        return Respond(message="Internal server error", status_code=501)
