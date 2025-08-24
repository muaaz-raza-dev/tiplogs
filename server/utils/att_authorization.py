from bson import ObjectId
from models.att_module import AttendanceModule
from utils.response import Respond

async def AuthorizeAttendanceRequests(module:str,group:str,user,):
    if not ObjectId.is_valid(module) or not ObjectId.is_valid(group):
                return Respond(message="Invalid Id", status_code=402)
    att_module = await AttendanceModule.find_one(AttendanceModule.organization.id == ObjectId(user["organization"]), AttendanceModule.id == ObjectId(module))
    if not att_module:
        return Respond(message="Invalid module Id", status_code=402)
    
    is_group_exist = any(True for doc in att_module.groups_to_users if str(doc.group) == str(group))
    if not is_group_exist : 
        return Respond(message="Invalid Id", status_code=402)
    if user["role"] != "admin" and user["role"] != "admin":
        is_user_allowed   = next( 
            (True for group_to_user in att_module.groups_to_users
            if str(group_to_user.group) == str(group)
            and any(user["id"] == str(user_i) for user_i in group_to_user.users)
            ), False)
         
        if not is_user_allowed : 
            return Respond(message="Invalid Id", status_code=402)
    return 
            
    
            
