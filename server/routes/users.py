from fastapi import APIRouter ,Depends
from type.auth import PayloadRegisterUserManual,PayloadRegisterUserAuto,PayloadApproveUser
from models.user import User 
from utils.hash import Hash
from models.user import UserRole
from utils.response import Respond
from pydantic import ValidationError
from middleware.authorization import authorize_user
from models.organization import Organization

router = APIRouter(prefix="/user")

@router.post('/register/users/manual')
async def RegisterUserManual(user:Depends(authorize_user),userpayload:PayloadRegisterUserManual): # type: ignore
    try :

        if user.role != UserRole.admin and user.role != UserRole.manager:
            return Respond(status_code=403, message="You are not authorized to perform this action", success=False)
        hashed_password = Hash(userpayload.password)
        new_user = User(
        full_name=userpayload.full_name,
        username=userpayload.username,
        password=hashed_password,
        email=userpayload.email,
        phone=userpayload.phone,
        role=userpayload.role,
        is_verified=False,
        is_approved=True
        )
        await new_user.insert()
    except ValidationError :
        return Respond(status_code=400, message="Invalid input data", success=False)
    except Exception as e:
        print(f"Error: {e}")
        return Respond(status_code=500, message="Internal server error", success=False)


@router.get('/register/users/auto')
async def RegisterUserAuto(userPayload:PayloadRegisterUserAuto):
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
async def CheckUsernameAvailability(payload:PayloadApproveUser,user=Depends(authorize_user)):
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


@router.get("/users")
async def GetAllUsers(user=Depends(authorize_user)):
    if user.role not in [UserRole.admin, UserRole.manager]:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

    users = await User(is_deleted=False).find_all().project({"username":1,"full_name":1,"photo":1,"email":1,"phone":1,"is_blocked":1}).to_list()
    return Respond(message="Users retrieved successfully", payload=[u.dict() for u in users])

@router.get("/users/{user_id}")
async def GetUserById(user_id: str, user=Depends(authorize_user)):
    if user.role not in [UserRole.admin, UserRole.manager]:
        return Respond(status_code=403, message="You are not authorized to perform this action", success=False)

    user_details = await User.find_one(id=user_id)
    if not user_details:
        return Respond(status_code=404, message="User not found", success=False)

    return Respond(message="User details retrieved successfully", payload=user_details.model_dump())  