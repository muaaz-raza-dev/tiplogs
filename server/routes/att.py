from fastapi import APIRouter, Response, Depends
from middleware.authorization import authorize_user
from beanie.operators import In
from middleware.authorize_role import AuthorizeRole
from tschema.att_module import CreateAttendanceModulePayloadBody, EditAttendanceModulePayloadBody, AddGroupToAttendanceModulePayloadBody
from models.att_module import AttendanceModule
from models.organization import Organization
from utils.response import Respond
from models.group import Group
from bson import ObjectId
from models.att_module import Group_to_User
import traceback
import asyncio
from models.user import User
from models.Individual import Individual
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
        payload = {"groups":{},"modules":[]}
        groups = await Group.find(Group.organization.id == ObjectId(user["organization"])).to_list()
        group_pairs = {str(group.id):{"name":group.name,"id":str(group.id)} for group in groups}

        if user["role"] == "admin" or user["role"] == "manager":
            modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"])).to_list()
            payload["modules"] = [{**module.model_dump(include={"name","frequency"}),"id":str(id)} for module in modules]
            for module in modules :
                payload["groups"][str(module.id)] = [group_pairs[str(group.ref.id)] for group in module.groups]

        else :
            modules = await AttendanceModule.find(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.users == ObjectId(user["id"])).to_list();
            payload["modules"] = [{**module.model_dump(include={"name","frequency"}),"id":str(id)} for module in modules]
            for module in modules:
                for group_to_user in module.groups_to_users:
                    if next(str(user_) == user["id"] for user_ in group_to_user.users):
                        if not str(module.id) in payload["groups"]:
                            payload["groups"][str(module.id)] = [] 
                        payload["groups"][str(module.id)].append(group_pairs[str(group_to_user.group)])
                        


        return Respond(payload=payload)
    


