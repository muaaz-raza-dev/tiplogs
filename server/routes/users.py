from datetime import datetime
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional
from config import USERS_PER_PAGE
from tschema.auth import PayloadRegisterUserManual, PayloadRegisterUserAuto, PayloadApproveUser
from models.user import User
from utils.hash import Hash
from models.user import UserRole
from utils.response import Respond
from pydantic import ValidationError
from middleware.authorization import authorize_user
from models.organization import Organization
from bson import ObjectId
from beanie import PydanticObjectId

router = APIRouter(prefix="/user")


@router.post('/register/manual')
async def RegisterUserManual(userpayload: PayloadRegisterUserManual, user=Depends(authorize_user)):
    try:
        admin = await User.get(ObjectId(user["id"]))
        if admin.role != UserRole.admin:
            return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

        if not admin.is_verified or not admin.organization:
            return Respond(status_code=403, message="You are not authorized to perform this action")

        user_exists = await User.find_one(User.username == userpayload.username)

        if user_exists:
            return Respond(status_code=409, message="Username already exists .")

        if userpayload.role == "admin":
            return Respond(status_code=403, message="You cannot register additional admins", success=False)

        organization = await Organization.get(ObjectId(user["organization"]))

        hashed_password = Hash(userpayload.password)
        new_user = User(
            organization=organization,
            full_name=userpayload.full_name,
            username=userpayload.username,
            password=hashed_password,
            email=userpayload.email,
            role=userpayload.role,
            is_verified=False,
            is_approved=True
        )
        await new_user.insert()
        return Respond(message="User is regsitered successfully")
    except ValidationError as e:
        print(f"Validation Error: {e}")
        return Respond(status_code=400, message="Invalid input data", success=False)

    except Exception as e:
        print(f"Error: {e}")
        return Respond(status_code=500, message="Internal server error", success=False)


@router.get('/register/users/auto')
async def RegisterUserAuto(userPayload: PayloadRegisterUserAuto):
    org = await Organization.find_one(name=userPayload.organization_name)
    if not org:
        return Respond(status_code=404, message="Organization not found", success=False)
    try:
        hashed_password = Hash(userPayload.password)

        if org.user_auto_registration == False:
            return Respond(status_code=403, message="User auto registration is disabled for this organization", success=False)

        new_user = User(
            full_name=userPayload.full_name,
            username=userPayload.username,
            password=hashed_password,
            email=userPayload.email,
            phone=userPayload.phone,
            role=userPayload.role,
            organization=org.id,  # Link to the organization
            is_verified=False,
            is_approved=False
        )
        await new_user.insert()
        return Respond(message="User registered successfully", payload={"user_id": str(new_user.id)})
    except ValidationError as e:
        return Respond(status_code=400, message="Invalid input data", success=False, payload={"errors": e.errors()})
    except Exception as e:
        print(f"Error: {e}")
        return Respond(status_code=500, message="Internal server error", success=False)


@router.post('/register/users/auto/approve')
async def CheckUsernameAvailability(payload: PayloadApproveUser, user=Depends(authorize_user)):
    if user.role != UserRole.admin:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)
    try:

        if not payload.is_approved:
            await User.delete_one(id=payload.user_id)
            return Respond(message="User registration request has been rejected", )

        user_to_approve = await User.find_one(id=payload.user_id)
        if not user_to_approve:
            return Respond(status_code=404, message="User not found", success=False)

        user_to_approve.is_approved = payload.is_approved
        user_to_approve.role = payload.role
        await user_to_approve.save()

        return Respond(message="User has been approved successfully", payload={"user_id": str(user_to_approve.id)})
    except Exception as e:
        return Respond(status_code=400, message="Internal server error", success=False, payload={"errors": e.errors()})


@router.post('/users/block/{user_id}')
async def BlockUser(user_id: str, user=Depends(authorize_user)):
    if user.role != UserRole.admin:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

    user_to_block = await User.find_one(id=user_id)
    if not user_to_block:
        return Respond(status_code=404, message="User not found", success=False)

    user_to_block.is_blocked = True
    await user_to_block.save()

    return Respond(message="User has been blocked successfully", payload={"user_id": str(user_to_block.id)})


@router.post('/users/unblock/{user_id}')
async def UnblockUser(user_id: str, user=Depends(authorize_user)):
    if user.role != UserRole.admin:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

    user_to_unblock = await User.find_one(id=user_id)
    if not user_to_unblock:
        return Respond(status_code=404, message="User not found", success=False)

    user_to_unblock.is_blocked = False
    await user_to_unblock.save()

    return Respond(message="User has been unblocked successfully", payload={"user_id": str(user_to_unblock.id)})


class UserProjection(BaseModel):
    username: str
    id: PydanticObjectId = Field(..., alias="_id")
    full_name: str
    role: UserRole
    created_at: datetime
    photo: Optional[str] = None
    email: str
    phone: Optional[str] = None
    is_blocked: bool


@router.get("/users")
async def GetAllUsers(count: int = 1, user=Depends(authorize_user)):
    if user["role"] != UserRole.admin:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

    query = {
        "organization.$id": PydanticObjectId(user["organization"]),
        "_id": {"$ne": PydanticObjectId(user["id"])},
        "is_deleted": False,
    }
    users = await User.find(query).limit(USERS_PER_PAGE).skip(max(0, (count-1)*USERS_PER_PAGE)).sort("-created_at").project(UserProjection).to_list()

    total = await User.find(query).count()
    print([user.model_dump() for user in users])
    return Respond(message="Users retrieved successfully", payload={
        "users": [{**u.model_dump(exclude={"created_at", "id"}), "created_at": u.created_at.date().isoformat(),"id":str(u.id)} for u in users]
        , "count": count, "total": total})


@router.get("/users/{user_id}")
async def GetUserById(user_id: str, user=Depends(authorize_user)):
    if user["role"] not in [UserRole.admin, UserRole.manager]:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

    user_details = await User.find_one(id=user_id)
    if not user_details:
        return Respond(status_code=404, message="User not found", success=False)

    return Respond(message="User details retrieved successfully", payload=user_details.model_dump())
