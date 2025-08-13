import traceback;
from fastapi import APIRouter ,Response ,Depends 
from middleware.authorization import authorize_user
from middleware.authorize_role import AuthorizeRole
from tschema.att_module import CreateAttendanceModulePayloadBody,EditAttendanceModulePayloadBody,AddGroupToAttendanceModulePayloadBody
from models.att_module import AttendanceModule
from models.organization import Organization
from utils.response import Respond
from models.group import Group
from bson import ObjectId
from models.att_module import Group_to_User
import asyncio
from models.user import User
router = APIRouter(prefix="/att/module")

@router.post("/create")
async def CreateAttendanceModule(payload :CreateAttendanceModulePayloadBody,user=Depends(authorize_user)):
    try :
        res = AuthorizeRole(user_role=user["role"],role_to_allow="admin")
        if isinstance(res,Response):
            return res 
        
        groups_instances = await asyncio.gather( *[Group.find_one(Group.id==ObjectId(group),Group.organization.id==ObjectId(user["organization"])) for group in payload.groups]) 
        if any(group is None for group in groups_instances):
            return Respond(status_code=400, message="One or more groups not found")
        att_module = AttendanceModule(
            description=payload.description or None,
            frequency=payload.frequency ,
            groups=groups_instances,
            groups_to_users=[{"group":group.id,"users":[]} for group in groups_instances ],
            organization=await Organization.get(user["organization"]),
            name=payload.name ,
        )
        await att_module.insert()
        return Respond(message="Attendance module has been created successsfully")
    except Exception as e :
        print(e)
        return Respond(status_code=501,message="Internal server error")
    

@router.get("/")
async def GetModules(user=Depends(authorize_user)):
    try :
        res = AuthorizeRole(user_role=user["role"],role_to_allow="admin")
        if isinstance(res,Response):
            return res ;
        modules = await AttendanceModule.find(AttendanceModule.organization.id==ObjectId(user["organization"]),sort="-created_at").to_list()
        return Respond(payload=[{**module.model_dump(include={"name","description","frequency"}),"id":str(module.id)} for module in modules])
    except Exception as e :
        print(e)
        return Respond(status_code=501,message="Internal server error")
    
    

@router.put("/edit/{id}")
async def CreateAttendanceModule(id:str , payload :EditAttendanceModulePayloadBody,user=Depends(authorize_user)):
    try :
        res = AuthorizeRole(user_role=user["role"],role_to_allow="admin")
        if isinstance(res,Response):
            return res 
        if not ObjectId.is_valid(id):
            return Respond(status_code=401,message="Invalid Group Id")

        att_module =await AttendanceModule.get(ObjectId(id))
        if not att_module : 
            return Respond(status_code=401,message="Invalid Group Id")
        att_module.name = payload.name
        att_module.description = payload.description
        await att_module.save()
        return Respond(message="Attendance module has been updated successsfully")
    except Exception as e :
        print(e)
        return Respond(status_code=501,message="Internal server error")


@router.get("/groups/users/{id}")
async def GetModuleGroupUsers(id:str ,user=Depends(authorize_user)):
    try :
        res = AuthorizeRole(user_role=user["role"],role_to_allow="admin")
        if isinstance(res,Response):
            return res 
        if not ObjectId.is_valid(id):
            return Respond(status_code=401,message="Invalid Group Id")
        module = await AttendanceModule.find_one(AttendanceModule.id==ObjectId(id),AttendanceModule.organization.id==ObjectId(user["organization"]))
        if not module:
            return Respond(status_code=401,message="Invalid Module Id")
        
    
        unique_user_ids = {  str(user_id)  for doc in module.groups_to_users for user_id in doc.users }
        fetched_users = await asyncio.gather(*[User.get(uid) for uid in unique_user_ids])
        users_pairs = { str(user.id): user for user in fetched_users if user is not None}

        payload = [ {  "group":str(doc.group), "users": [{**users_pairs[str(user)].model_dump(include={"full_name", "username"}),"id": str(user)}for user in doc.users if str(user) in users_pairs]} for doc in module.groups_to_users]
        return Respond(payload={"groups_to_users":payload,"module":{"name":module.name , "description":module.description , "created_at":module.created_at.date().isoformat()}})
    except Exception as e :
        print(e)
        return Respond(status_code=501,message="Internal server error")

@router.put("/assign/group/user/{id}")
async def GetModuleGroupUsers(id:str,payload:AddGroupToAttendanceModulePayloadBody,user=Depends(authorize_user)):
    try :
        res = AuthorizeRole(user_role=user["role"],role_to_allow="admin")
        if isinstance(res,Response):
                return res 
        if not ObjectId.is_valid(id):
            return Respond(status_code=401,message="Invalid Module Id")
        module = await AttendanceModule.get(ObjectId(id))
        if not module :
            return Respond(status_code=401,message="Invalid Module Id")
        group = await Group.find_one(Group.organization.id==ObjectId(user["organization"]),Group.id==ObjectId(payload.group))
        if not group : 
            return Respond(status_code=401,message="Invalid group selected")
        
        group_to_user  = []
        is_new_group = True
        unique_users_list = set() 
        for each_module in module.groups_to_users : 

            for users_module in each_module.users:
                unique_users_list.add(users_module)

            if str(each_module.group) == payload.group :
                is_new_group = False
                group_to_user.append(Group_to_User(group=each_module.group,users=[ObjectId(user) for user in payload.users] ))
                continue;
            group_to_user.append(Group_to_User(group=each_module.group,users=each_module.users))
            
        if is_new_group :
            group_to_user.append(Group_to_User(group=ObjectId(payload.group),users=[ObjectId(user) for user in payload.users] ))
            module.groups.append(group)

        module.groups_to_users = group_to_user
        module.users = unique_users_list
        await module.save()
        return Respond(message="New group is added successfully")
    except Exception as e :
        traceback.print_exc()
        print(e)
        return Respond(message="Internal server error",status_code=501)


