from fastapi import APIRouter, Depends
from tschema.att_module import MarkAttendanceBodyPayload
from middleware.authorization import authorize_user
from models.user import User
from bson import ObjectId
from tschema.att_module import ValidateAttendanceDatePayloadBody
from utils.response import Respond
from models.att_module import AttendanceModule
from models.group import Group
from models.Individual import Individual
from models.att_groups import AttendanceGroup
from pydantic import BaseModel , Field
import traceback
from models.att_base import AttendanceBase,AttendanceEventStatus
from models.att_main import Attendance
from typing import Optional
from utils.date import GetAttendanceDate
router = APIRouter(prefix="/att")

class markAttendanceIndividualProjectModel (BaseModel):
    full_name:str;
    father_name:str;
    grno :Optional[str] ;
    roll_no:Optional[str];
    id:ObjectId = Field(...,alias="_id")
    class Config :
        arbitrary_types_allowed = True
        


@router.get("/mark/meta/{module}/{group}")
async def GetMarkAttendanceMetaData(module=str, group=str, user=Depends(authorize_user)):
    try :
        if not ObjectId.is_valid(module) or not ObjectId.is_valid(group):
            return Respond(message="Invalid Id", status_code=402)
        module_doc = await AttendanceModule.find_one(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.id == ObjectId(module))
        if not module_doc:
            return Respond(message="Invalid module Id", status_code=402)
        group_doc = await Group.find_one(Group.organization.id == ObjectId(user["organization"]), Group.id == ObjectId(group))
        if not group_doc:
            return Respond(message="Invalid group Id", status_code=402)

        is_group_registered = next((True for module_group in module_doc.groups if str(
            module_group.ref.id) == group), False)

        if not is_group_registered:
            return Respond(message="Group is not registered in attendance module", status_code=402)
        if user["role"] != "admin" or user["role"] != "manager":
            is_user_permission = next(
                (True for group_to_user in module_doc.groups_to_users
                if str(group_to_user.group) == group
                and any(user["id"] == str(user_i) for user_i in group_to_user.users)
                ), False)
            if not is_user_permission:
                return Respond(message="You don't have access to this group", status_code=401)
        individuals = await Individual.find(Individual.group.id == ObjectId(group), Individual.organization.id == ObjectId(user["organization"]), Individual.is_approved == True, Individual.is_terminated == False,projection_model=markAttendanceIndividualProjectModel).to_list()
        return Respond(payload={"module": {"name": module_doc.name, "id": str(module_doc.id),"frequency":module_doc.frequency}, "group": {"name": group_doc.name, "id": str(group_doc.id)},
                "individuals":[{**i.model_dump(exclude={"id"}),"id":str(i.id)} for i in individuals],
                "total_individuals":len(individuals)}
                    )
    except Exception as e :
        traceback.print_exc()
        print(e)
        return Respond(message="Internal server errror",status_code=501) 


@router.post("/mark/data/{module}/{group}")
async def CheckAttendanceStatus(module:str,group:str,payload:ValidateAttendanceDatePayloadBody,user=Depends(authorize_user)):
        try :
            if not ObjectId.is_valid(module) or not ObjectId.is_valid(group):
                return Respond(message="Invalid Id", status_code=402)
            user_doc = await User.get(ObjectId(user["id"]))
            module_doc = await AttendanceModule.find_one(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.id == ObjectId(module))
            if not module_doc:
                return Respond(message="Invalid module Id", status_code=402)
            group_doc = await Group.find_one(Group.organization.id == ObjectId(user["organization"]), Group.id == ObjectId(group))
            if not group_doc:
                return Respond(message="Invalid group Id", status_code=402)
            
            
            att_date = GetAttendanceDate(payload.date)
            attendance_base = await AttendanceBase.find_one(AttendanceBase.att_module.id == ObjectId(module),AttendanceBase.att_date == att_date)

            
            if not attendance_base : 
                attendance_base = AttendanceBase(att_module=module_doc,att_date=att_date,created_by=user_doc,status=AttendanceEventStatus.progess,frequency=module_doc.frequency)
                await attendance_base.insert();
                attendance_group = AttendanceGroup(att_base=attendance_base,group=group_doc,attendance=[],attendance_status=AttendanceEventStatus.progess)
                await attendance_group.insert()
                return Respond(message="Start your attendance",payload={"attendance_group":str(attendance_group.id),"status":"pending","date":attendance_base.att_date.date().isoformat()})
            
            if attendance_base.is_holiday:
                return Respond(message="Admin assigned today as holiday",status_code=403,payload={"status":"complete","is_holiday":True,"attendance_group":str(attendance_group.id),"date":attendance_base.att_date.date().isoformat()})
            
            attendance_group =await AttendanceGroup.find_one(AttendanceGroup.att_base.id==attendance_base.id,AttendanceGroup.group.id==group_doc.id)

            if not attendance_group :
                attendance_group = AttendanceGroup(att_base=attendance_base,group=group_doc,attendance=[],attendance_status=AttendanceEventStatus.progess)
                await attendance_group.insert()
                return Respond(message="Start your attendance",payload={"attendance_group":str(attendance_group.id),"status":"pending","date":attendance_base.att_date.date().isoformat()})

            if attendance_group.attendance_status == "complete":
                return Respond(message="Attendance is already taken of this date",payload={"status":"complete","date":attendance_base.att_date.date().isoformat(),"attendance_group":str(attendance_group.id)},status_code=409)
            
            return Respond(message="Start your attendance",payload={"attendance_group":str(attendance_group.id),"date":attendance_base.att_date.date().isoformat(),"status":"pending"})
            
        except Exception as e : 
            traceback.print_exc()
            print(e)
            return Respond(message="Internal server error",status_code=501)
        











@router.post("/mark/{id}")
async def MarkAttendance(id:str,payload:MarkAttendanceBodyPayload,user=Depends(authorize_user)):
        try :
            if not ObjectId.is_valid(id) :
                return Respond(message="Invalid Id", status_code=402)
            att_group = await AttendanceGroup.get(ObjectId(id))
            if not att_group:
                return Respond(message="Invalid Id", status_code=402)

            if att_group.attendance_status == "complete":
                return Respond(message="Attendance is already taken ", status_code=402)
            
            att_base =await att_group.att_base.fetch()
            att_module = await att_base.att_module.fetch()
            is_group_exist = any(True for doc in att_module.groups_to_users if str(doc.group) == str(att_group.group.ref.id))
            if not is_group_exist : 
                return Respond(message="Invalid Id", status_code=402)
            
            is_user_allowed   = next(
                    (True for group_to_user in att_module.groups_to_users
                    if str(group_to_user.group) == str(att_group.group.ref.id)
                    and any(user["id"] == str(user_i) for user_i in group_to_user.users)
                    ), False)
            
            if not is_user_allowed : 
                return Respond(message="Invalid Id", status_code=402)
            
            total_individuals=await Individual.find(Individual.organization.id==ObjectId(user["organization"]),Individual.group.id==ObjectId(att_group.group.ref.id)).count()

            if not len(payload.attendance) == total_individuals :
                return Respond(message="Invalid attendance data",status_code=403)
            user_doc = await User.get(ObjectId(user["id"]))         
            
            status_counts = {"present":0,"absent":0,"late":0,"leave":0,"half":0}

            attendance_docs =[]
            for att in payload.attendance:
              attendance_docs.append(Attendance(**att.model_dump(exclude={"individual"}),individual=ObjectId(att.individual),att_group=att_group,att_date=att_base.att_date,))
              status_counts[att.status] += 1 

            await Attendance.insert_many(attendance_docs)
            

            att_group.taken_by = user_doc
            att_group.attendance_status = AttendanceEventStatus.complete
            att_group.status_counts=status_counts
            att_base.status = AttendanceEventStatus.complete
            await att_base.save()
            await att_group.save()

            return Respond(message="Attendance is registered successfully")

        except Exception as e :
            traceback.print_exc()
            return Respond(message="Internal server error",status_code=501)    
