import traceback
from fastapi import APIRouter, Depends
from tschema.individual import PayloadRegisterIndividualManual , PayloadRegisterIndividualAuto
from middleware.authorization import authorize_user
from models.user import  User
from datetime import datetime ,timezone
from models.Individual import Individual
from utils.response import Respond 
from models.organization import Organization
from bson import ObjectId
from models.group import Group
from models.individual_group_history import IndividualGroupHistory ,GroupHistory
from utils.hash import Hash
router = APIRouter(prefix="/individuals")

@router.post("/register/manual")
async def RegisterStudentManual(payload: PayloadRegisterIndividualManual, user= Depends(authorize_user)): # type:ignore
    user_details = await User.get(user["id"])
    try :     
        if not ObjectId.is_valid(payload.group):
            return Respond(message="Invalid Group id",status_code=400)
        
        is_grno_exist = await Individual.find_one(Individual.grno==payload.grno,Individual.organization.id==ObjectId(user["organization"]))
        if is_grno_exist :
            return Respond(message="GRNO is already registered",status_code=403)
        
        
        group = await Group.get(ObjectId(payload.group))
        if not group:
            return Respond(message="Invalid Group selected",status_code=403)
        
        dob = datetime.strptime(payload.dob, "%Y-%m-%d").date()
        doa = datetime.strptime(payload.doa, "%Y-%m-%d").date()
        ind = Individual(
            full_name=payload.full_name,
            father_name=payload.father_name,
            photo=payload.photo,
            group = group,
            contact=payload.contact,
            email = payload.email,
            dob=dob,
            doa=doa,
            gender=payload.gender,
            grno=payload.grno,
            roll_no=payload.roll_no or None ,
            password=Hash("12345678"),  
            is_approved=True,
            organization=user_details.organization,  
            approved_by=user_details, 
     )
        await ind.insert()
        ind_history =  IndividualGroupHistory(individual=ind,history=[GroupHistory(admission_date=datetime.now(timezone.utc),group=group)])
        
        await ind_history.insert()
        return Respond(message="Individual has registered successfully")
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Respond(status_code=501, message="Internal server error", success=False)

@router.post("/register/auto")
async def RegisterStudentAuto(payload: PayloadRegisterIndividualAuto,): # type:ignore 
    org = await Organization.find_one(name=payload.organization_name) 
    if not org:
        return Respond(status_code=404, message="Organization name is incorrect", success=False)

    try:
            student = await Individual(
            name=payload.name,
            f_name=payload.f_name,
            photo=payload.photo,
            contact=payload.contact,
            dob=payload.dob,
            gender=payload.gender,
            grno=payload.grno,
            roll_no=payload.roll_no or None ,
            password=payload.password or payload.grno,  # Assuming grno is used as the password
            organization = org.id  ,
            is_approved=False        
            )
            await student.save()
            return Respond(message="Your request has been sent to admin. wait for thier approval", data={"student_id": str(student.id)})
    except Exception as e:
        print(e)
        return Respond(status_code=501, message="Internal server error", success=False)



@router.put("/edit/{sid}")
async def EditStudent(sid: str, payload: PayloadRegisterIndividualManual, user= Depends(authorize_user)): # type:ignore



    student = await Individual.get(sid)
    if not student:
        return Respond(status_code=404, message="Invalid student id", success=False)

    student.name = payload.name or student.name
    student.f_name = payload.f_name or student.f_name
    student.photo = payload.photo or student.photo 
    student.contact = payload.contact or student.contact
    student.dob = payload.dob or student.dob
    student.roll_no = payload.roll_no or student.roll_no
    student.password = payload.password or student.password  # Assuming password can be updated
    student.approved_by = user.user_id  # Update the approver to the current user

    await student.save()
    return Respond(message="Student details have been updated", data={"student_id": str(student.id)})


