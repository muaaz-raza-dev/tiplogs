from fastapi import APIRouter ,Depends 
from tschema.auth import PayloadRegisterOrganization
from models.organization import Organization
from utils.response import Respond
from pydantic import ValidationError
from middleware.authorization import authorize_user
from models.user import UserRole ,User
from bson import ObjectId
from jose import jwt
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
