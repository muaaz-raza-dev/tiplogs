from fastapi import APIRouter,  Depends,HTTPException,Response,Query
from models.att_main import Attendance
from fastapi.responses import JSONResponse
from utils.att_authorization import AuthorizeAttendanceRequests
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
from tschema.att import IweeklyAttendanceRequestPayload,IScheduleCustomAttendancePayload,IViewAttedanceRequestPayload
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
            modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.users == ObjectId(user["id"])).to_list()
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
                        "status_counts":att_group.status_counts.model_dump(),"id":str(att_group.id)
                        }})
                    else:
                        response_payload.append({"att_date":date_str,"is_base_exists":True,"is_taken":False,"att_group":{"att_base":str(att_base.id)}})
                else:
                    response_payload.append({"att_date":date_str,"is_base_exists":True,"is_taken":False,"att_group":{"att_base":str(att_base.id)}})
        print(response_payload)
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
        
        att_bases = await AttendanceBase.find(AttendanceBase.att_module.id==ObjectId(module),AttendanceBase.status == "upcoming",sort="att_date").to_list()
        
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
            
            att_base =( await AttendanceBase.find_one(AttendanceBase.att_module.id==module.id,AttendanceBase.id == ObjectId(base)) )if base else None
            att_base_check = await AttendanceBase.find_one(AttendanceBase.att_module.id==module.id,AttendanceBase.att_date == GetAttendanceDate(payload.att_date))

            if att_base_check:
                return Respond(message="An attendance with the given date already exists for the selected module",status_code=402)
            
            att_date = GetAttendanceDate(payload.att_date)

            if att_date.date() < datetime.now().date():
                return Respond(message="Your given date is in the past",status_code=402)
            user =await User.get(user["id"])
            if not att_base:
                att_base = AttendanceBase(att_date=att_date,att_module=module.id,frequency=attendance_frequency.custom,status=AttendanceEventStatus.upcoming,created_by=user)
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




        
        
        


    

@router.delete("/schedule/custom/{base}/delete")
async def DeleteCustomScheduledAttendance(base:str,user=Depends(authorize_user)):
    try :
        response = AuthorizeRole(role_to_allow=["manager","admin"],user_role=user["role"])
        if isinstance(response,Response):
                return response 
        if not ObjectId.is_valid(base) :
            return Respond(status_code=400,message="Invalid attendance module ID")

        att_base = await AttendanceBase.find_one(AttendanceBase.id == ObjectId(base))
        if not att_base:
            return Respond(message="Invalid Attendance module is selected",status_code=403)
        att_module = await att_base.att_module.fetch()
        if str(att_module.organization.ref.id) != user["organization"]:
            return Respond(message="Invalid Attendance document is selected",status_code=403)
        await att_base.delete()
        return Respond(message="Scheduled Attendance is deleted succesfully")
      
    except HTTPException:
        raise  
    except PyMongoError as e:
            return Respond(status_code=500,message=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        return Respond(status_code=500,message=f"An unexpected error occurred: {str(e)}")



@router.post("/view/detailed")
async def ViewEachAttendance(request_payload:IViewAttedanceRequestPayload,user=Depends(authorize_user)):
    try :

        report = await AuthorizeAttendanceRequests(request_payload.module,request_payload.group,user)
        if isinstance(report,JSONResponse) : # must be error 
            return report
        
        payload = {"attendances":[],"overview":{},"attendance_meta":{},"is_attendance":False,"is_taken":False}
        att_date = GetAttendanceDate(request_payload.att_date)
        att_base = await AttendanceBase.find_one(AttendanceBase.att_module.id==ObjectId(request_payload.module),AttendanceBase.att_date == att_date)
        if not att_base :
            return Respond(payload=payload,message="No attendance is taken on this date");
        att_group = await AttendanceGroup.find_one(AttendanceGroup.group.id==ObjectId(request_payload.group), AttendanceGroup.att_base.id == att_base.id,)
        if not att_group:
            payload["is_attendance"] = True
            return Respond(payload=payload,message="No attendance is taken of this group on this date");

        attendance_taken_by =await att_group.taken_by.fetch()
        payload["attendance_meta"] = {
            "att_group_id":str(att_group.id),
            "att_base_id":str(att_base.id),
            "created_at":att_group.created_at.date().isoformat(),
            "updated_at":att_group.updated_at.date().isoformat(),
            "taken_by":{
                "full_name":attendance_taken_by.full_name,
                "username":attendance_taken_by.username,
                "id":str(attendance_taken_by.id),
            }
        }
        attendances = await Attendance.find(Attendance.att_group.id==att_group.id).to_list()
        individual_ids = {att.individual for att in attendances}
        Individuals = await Individual.find(In(Individual.id,individual_ids)).to_list()
        individual_details ={str(ind.id):{"full_name":ind.full_name,"father_name":ind.father_name,"grno":ind.grno,"roll_no":ind.roll_no,"id":str(ind.id)} for ind in Individuals}
        
        individual_id_details_map = individual_details if individual_details else {}
        payload["attendances"] = [{
            "id":str(att.id),   
            "status":att.status,
            "att_note":att.att_note,
            "reporting_time":att.reporting_time,
            "individual":individual_id_details_map[str(att.individual)]
        } if att else {} for att in attendances ]
        payload["overview"] = {**att_group.status_counts.model_dump(),"total":len(attendances)}
        payload["is_attendance"] = True
        payload["is_taken"] = True
        return Respond(payload=payload)
         
    except HTTPException:
        raise  
    except PyMongoError as e:
            return Respond(status_code=500,message=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        return Respond(status_code=500,message=f"An unexpected error occurred: {str(e)}")
    


@router.delete("/delete/day/{id}")
async def DeleteDayAttendance(id:str,user=Depends(authorize_user)):
    try:
        if not ObjectId.is_valid(id) :
            return Respond(status_code=400,message="Invalid attendance id")
        
        att_group = await AttendanceGroup.find_one(AttendanceGroup.id==ObjectId(id));

        if not att_group:
            return Respond(message="Invalid attendance id",status_code=400)
        
        att_base = await att_group.att_base.fetch();
        att_module = await att_base.att_module.fetch();

        if str(att_module.organization.ref.id) != user["organization"]:
            return Respond(message="Invalid credentials",status_code=401);
    
        if(str(att_group.taken_by.ref.id) != user["id"] and (not (user["role"] in ("admin" ,"manager")))) :
            return Respond(message="Invalid credentials",status_code=401);
        
        await Attendance.find(Attendance.att_group.id == att_group.id).delete();
        await att_group.delete();
        return Respond(message="deleted successfully")
        
    except HTTPException:
        raise  
    except PyMongoError as e:
            return Respond(status_code=500,message=f"Database error: {str(e)}")
    except Exception as e:
        traceback.print_exc()
        return Respond(status_code=500,message=f"An unexpected error occurred: {str(e)}")
