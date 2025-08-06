from fastapi import APIRouter ,Response ,Cookie,Depends 
from middleware.authorization import authorize_user
from middleware.authorize_role import AuthorizeRole
from models.user import User
from tschema.att_module import CreateAttendanceModulePayloadBody
from models.att_module import AttendanceModule
from models.organization import Organization
from utils.response import Respond
from models.group import Group
from bson import ObjectId
import asyncio

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
            organization=await Organization.get(user["organization"]),
            name=payload.name ,
        )
        await att_module.insert()
        return Respond(message="Attendance module has been created successsfully")
    except Exception as e :
        print(e)
        return Respond(status_code=501,message="Internal server error")
    

    
    
