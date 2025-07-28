from fastapi import APIRouter, Depends, Response 
from bson import ObjectId
from beanie import PydanticObjectId
from tschema.classes import RegisterClassPayload
from middleware.authorization import authorize_user
from models.user import UserRole,User
from models.group import Group
from utils.response import Respond
from config import CLASSES_PER_PAGE

router = APIRouter(prefix="/groups")


@router.post("/create")
async def CreateGroup(payload:RegisterClassPayload,user=Depends(authorize_user)): # type:ignore 
    try :
        if user["role"] not in ["admin","manager"] :
            return Respond(status_code=401, message="You are not authorized to make this request",success=False)
        db_user = await User.find_one(User.id==ObjectId(user["id"]))
        if not db_user:
            return Respond(message="User not found",status_code=404)
        is_group_name = await Group.find_one(Group.name==payload.name)
        if is_group_name :
            return Respond(message="Classname with the given name already exists ")
        
        group =   Group(name=payload.name.strip(),organization=db_user.organization)
        await group.insert()

        return Respond(message="Group is registered successfully",)
    except Exception as e : 
       print(e)
       return Respond(status_code=501,message="Internal server error")




@router.put("/edit/{cid}")
async def EditGroup(cid:str,payload:RegisterClassPayload,user=Depends(authorize_user)): #type:ignore
    if user["role"] not in [UserRole.admin,UserRole.manager] :
        return Respond(status_code=401, message="You are not authorized to make this request",success=False)
    
    Class = await Group(id==cid,).find_one()
    if not Class : 
        return Respond(status_code=404,message="Invalid class id")
    Class.name= payload.name 
    await Class.save()

    return Respond(message="details have been updated")


@router.get("/")
async def GetGroups(count:int,search:str,user=Depends(authorize_user)) :
    query = {"organization":ObjectId(user.organization) ,  **({"$text": {"$search": search} }if search else {}), }
    groups = await Group.find(query).limit(CLASSES_PER_PAGE).skip(CLASSES_PER_PAGE*count).sort("-created_at").to_list()
    Respond(payload={"classes",[g.model_dump() for g in groups]})

    


