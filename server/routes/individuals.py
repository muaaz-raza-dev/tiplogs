from fastapi import APIRouter, Depends, Response 
from type.individual import PayloadRegisterIndividualManual , PayloadRegisterIndividualAuto
from middleware.authorization import authorize_user
from models.user import UserRole, User
from models.Individual import Individual
from utils.response import Respond 
from organization import Organization

router = APIRouter(prefix="/students")

@router.post("/register/manual")
async def RegisterStudentManual(payload: PayloadRegisterIndividualManual, user: Depends(authorize_user)): # type:ignore
    user_details = await User.get(user.user_id).project({"organization": 1})
    try :         
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
            is_approved=True,
            organization=user_details.organization,  
            approved_by=user.user_id,  # Assuming the user who registers is the one approving the student
     )

        await student.save()
        return Respond(message="Student registered successfully", data={"student_id": str(student.id)})
    except Exception as e:
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
        return Respond(status_code=501, message="Internal server error", success=False)



@router.put("/edit/{sid}")
async def EditStudent(sid: str, payload: PayloadRegisterIndividualManual, user: Depends(authorize_user)): # type:ignore



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


