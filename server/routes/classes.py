from fastapi import APIRouter, Depends, Response 
from type.classes import RegisterClassPayload
from middleware.authorization import authorize_user
from models.user import UserRole,User
from models.classes import Classes
from utils.response import Respond
router = APIRouter(prefix="/classes")


@router.post("/register")
async def RegisterClasses(payload:RegisterClassPayload,user:Depends(authorize_user)): # type:ignore 
    if user.role not in [UserRole.admin,UserRole.manager] :
        return Respond(status_code=401, message="You are not authorized to make this request",success=False)
    try :

        user = await User.find_one(id==user.user_id).project({"organization":1})
        Class =  await Classes(name=payload.name,organization_id=user.organization)
        Class.save()

        Respond(message="Class is registered successfully")
    except Exception as e : 
        Respond(status_code=501,message="Internal server error")




@router.put("/edit/{cid}")
async def EditClass(cid:str,payload:RegisterClassPayload,user:Depends(authorize_user)): #type:ignore
    if user.role not in [UserRole.admin,UserRole.manager] :
        return Respond(status_code=401, message="You are not authorized to make this request",success=False)
    
    Class = await Classes(id==cid,).find_one()
    if not Class : 
        return Respond(status_code=404,message="Invalid class id")
    Class.name= payload.name 
    await Class.save()

    return Respond(message="details have been updated")

