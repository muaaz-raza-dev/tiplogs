from fastapi import APIRouter,  Depends,HTTPException,Response,Query
from typing import Optional;
from models.user import User
from models.att_module import attendance_frequency
from models.att_base import AttendanceBase ,AttendanceEventStatus
from datetime import datetime,timedelta
from pymongo.errors import PyMongoError
from middleware.authorization import authorize_user 
from middleware.authorize_role import AuthorizeRole
from beanie.operators import In
from models.att_module import AttendanceModule
from utils.response import Respond
from models.group import Group
from bson import ObjectId
import traceback
import asyncio
from models.att_groups import AttendanceGroup
from models.Individual import Individual
from tschema.att import IweeklyAttendanceRequestPayload,IScheduleCustomAttendancePayload
from utils.date import GetAttendanceDate

router = APIRouter(prefix="/attendance")


@router.get("/user/modules")
async def GetUserModules(user=Depends(authorize_user)):
    try:
        payload = {"modules": [], }
        if user["role"] == "admin" or user["role"] == "manager":
            modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"])).to_list()
            payload["modules"] = [
                {**module.model_dump(include={"frequency", "name", "description"}), "id": str(module.id)} for module in modules]
        else:
            modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"]),    AttendanceModule.users == ObjectId(user["id"])).to_list()
            payload["modules"] = [
                {**module.model_dump(include={"frequency", "name", "description"}), "id": str(module.id)} for module in modules]
        return Respond(payload=payload)
    except Exception as e:
        traceback.print_exc()
        return Respond(message="Internal server error", status_code=501)


@router.get("/user/groups/{module}")
async def GetUserModules(module: str, user=Depends(authorize_user)):
    try:
        payload = {"groups": []}
        if user["role"] == "admin" or user["role"] == "manager":
            module = await AttendanceModule.find_one(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.id == ObjectId(module))
            payload["groups"] = await asyncio.gather(*(group.fetch() for group in module.groups))
        else :
            module = await AttendanceModule.find_one(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.id == ObjectId(module))
            group_ids = set()
            for group_to_user in module.groups_to_users:
                if next(str(user_) == user["id"] for user_ in group_to_user.users):
                    group_ids.add(group_to_user.group)

            groups = await Group.find(In(Group.id, list(group_ids))).to_list()
            payload["groups"] = groups

        group_totals = await asyncio.gather(*(Individual.find(Individual.organization.id == ObjectId(user["organization"]), Individual.is_approved == True, Individual.group.id == ObjectId(group.ref.id)).count() for group in module.groups))

        return Respond(payload={"groups":[{**group.model_dump(include={"name"}), "id": str(group.id),"total":group_totals[i]} for i,group in enumerate(payload["groups"])]})
    except Exception as e:
        traceback.print_exc()
        return Respond(message="Internal server error", status_code=501)

@router.get("/user/module-groups/pairs")
async def GetUserModuleGroupPairs(user=Depends(authorize_user)):
        try :
            payload = {"groups":{},"modules":[]}
            groups = await Group.find(Group.organization.id == ObjectId(user["organization"])).to_list()
            group_pairs = {str(group.id):{"name":group.name,"id":str(group.id)} for group in groups}

            if user["role"] == "admin" or user["role"] == "manager":
                modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"])).to_list()
                payload["modules"] = [{**module.model_dump(include={"name","frequency"}),"id":str(module.id)} for module in modules]
                for module in modules :
                    payload["groups"][str(module.id)] = [group_pairs[str(group.ref.id)] for group in module.groups]

            else :
                modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.users == ObjectId(user["id"])).to_list();
                payload["modules"] = [{**module.model_dump(include={"name","frequency"}),"id":str(module.id)} for module in modules]
                for module in modules:
                    for group_to_user in module.groups_to_users:
                        if next(str(user_) == user["id"] for user_ in group_to_user.users):
                            if not str(module.id) in payload["groups"]:
                                payload["groups"][str(module.id)] = [] 
                            payload["groups"][str(module.id)].append(group_pairs[str(group_to_user.group)])
                            


            return Respond(payload=payload)
        except Exception :
            traceback.print_exc()
            return Respond(message="Internal server error",status_code=501)    



@router.post("/user/week/record")
async def GetUserGroupModuleWeekRecord(
    payload:IweeklyAttendanceRequestPayload,
    user=Depends(authorize_user)
):
    try:
        module_id =payload.module 
        group = payload.group
        start_date = payload.start_date
        response_payload = []
    #   * Validations
        if not ObjectId.is_valid(module_id):
            return Respond(status_code=400,message="Invalid module ID")
        if not ObjectId.is_valid(group):
            return Respond(status_code=400,message="Invalid group ID")

        module = await AttendanceModule.find_one(AttendanceModule.id==ObjectId(module_id),AttendanceModule.organization.id==ObjectId(user["organization"]))
        if not module :
            return Respond(status_code=400,message="Invalid IDs")
        group = await Group.find_one(Group.id==ObjectId(group),Group.organization.id==ObjectId(user["organization"]))

        if not group:
            return Respond(status_code=400,message="Invalid IDs")
        
        start_date_d = GetAttendanceDate(start_date)
        end_date_d = start_date_d - timedelta(days=6)
        today = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)

        if start_date_d > today :
            return Respond(status_code=400,message="Invalid dates selected")
        att_bases = await AttendanceBase.find(AttendanceBase.att_module.id==ObjectId(module_id),AttendanceBase.att_date <= start_date_d ,AttendanceBase.att_date >= end_date_d  ).to_list()

        att_groups = await asyncio.gather(*(AttendanceGroup.find_one(AttendanceGroup.att_base.id== ObjectId(att_base.id),AttendanceGroup.group.id==group.id) for att_base in att_bases))

        att_groups = [g for g in att_groups if g is not None]

        dates = [(start_date_d - timedelta(days=i)).date() for i in range(7)]
        for date in dates :
            date_str = date.strftime("%Y-%m-%d") 
            att_base = next((att_base for att_base in att_bases if att_base.att_date.date() == date),False)
            if not att_base:
                response_payload.append({"att_date":date_str,"is_taken":False,"is_base_exists":False,})
            else :
                att_group = next((att_group for att_group in att_groups if str(att_group.att_base.ref.id) == str(att_base.id)),None)
                if att_group :
                    if att_group.attendance_status == AttendanceEventStatus.complete :
                        response_payload.append({"att_date":date_str,"is_base_exists":True,"is_taken":True,"att_group":{"att_base":str(att_base.id),
                        "attendance_status":att_base.status,"created_at":att_base.created_at.date().isoformat(),
                        "status_counts":att_group.status_counts.model_dump()
                        }})
                    else:
                        response_payload.append({"att_date":date_str,"is_base_exists":True,"is_taken":False,"att_group":{"att_base":str(att_base.id)}})
                else:
                    response_payload.append({"att_date":date_str,"is_base_exists":True,"is_taken":False,"att_group":{"att_base":str(att_base.id)}})

        return Respond(payload=response_payload)

    except HTTPException:
        raise  
    except PyMongoError as e:
        return Respond(status_code=500,message=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        return Respond(status_code=500,message=f"An unexpected error occurred: {str(e)}")


@router.get("/scheduled/custom/{module}")
async def GetUserGroupModuleWeekRecord(
    module:str,
    user=Depends(authorize_user)
):
    try:
        response = AuthorizeRole(role_to_allow=["manager","admin"],user_role=user["role"])
        if isinstance(response,Response):
            return response 
        
        if not ObjectId.is_valid(module):
            return Respond(status_code=400,message="Invalid module ID")
        
        att_bases = await AttendanceBase.find(AttendanceBase.att_module.id==ObjectId(module),AttendanceBase.status == "upcoming",sort="-att_date").to_list()
        
        return Respond(payload={"docs":[{"id":str(att.id),"att_date":att.att_date.date().isoformat(),"created_at":att.created_at.date().isoformat()} for att in att_bases],"total":len(att_bases)})
    
    except HTTPException:
        raise  
    except PyMongoError as e:
        return Respond(status_code=500,message=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        return Respond(status_code=500,message=f"An unexpected error occurred: {str(e)}")


@router.post("/schedule/custom/{module}")
async def ScheduleAttendance(payload:IScheduleCustomAttendancePayload,module:str, base: Optional[str] = Query(None),user=Depends(authorize_user)):
        try :
            response = AuthorizeRole(role_to_allow=["manager","admin"],user_role=user["role"])
            if isinstance(response,Response):
                return response 
            
            if not ObjectId.is_valid(module) :
                return Respond(status_code=400,message="Invalid attendance module ID")
            
            if base and not ObjectId.is_valid(base):
                return Respond(status_code=400,message="Invalid attendance base ID")

            module = await AttendanceModule.get(ObjectId(module))
            if not module or str(module.organization.ref.id) != user["organization"]:
                return Respond(message="Invalid payload is provided",status_code=402)
            
            att_base =( await AttendanceBase.find_one(AttendanceBase.att_module.id==ObjectId(module),AttendanceBase.id == ObjectId(base)) )if base else None
            att_date = GetAttendanceDate(payload.att_date)

            if att_date < datetime.now():
                return Respond(message="Your given date is in the past",status_code=402)
            user =await User.get(user["id"])
            if not att_base:
                att_base = AttendanceBase(att_date=att_date,att_module=ObjectId(module),frequency=attendance_frequency.custom,status=AttendanceEventStatus.upcoming,created_by=user)
                await att_base.insert()
                return Respond(payload={"id":str(att_base.id),"att_date":att_base.att_date.date().isoformat(),"created_at":att_base.created_at.date().isoformat()})
            
            att_base.att_date = att_date
            att_base.created_by = user
            await att_base.save()
            return Respond(payload={"id":str(att_base.id),"att_date":att_base.att_date.date().isoformat(),"created_at":att_base.created_at.date().isoformat()})
        
        except HTTPException:
            raise  
        except PyMongoError as e:
            return Respond(status_code=500,message=f"Database error: {str(e)}")
        except Exception as e:
            traceback.print_exc()
            return Respond(status_code=500,message=f"An unexpected error occurred: {str(e)}")




        
        
        


    

