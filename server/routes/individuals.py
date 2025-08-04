from pydantic import BaseModel ; import traceback
from utils.hash import Hash
from pydantic import Field
from typing import Optional
from fastapi import APIRouter, Depends
from tschema.individual import PayloadRegisterIndividualManual, PayloadRegisterIndividualSelf, PayloadIndividualFiltersPayload,VerificationSelfRegistrationRequestPayload,FetchSelfRegistrationRequestsPayload
from middleware.authorization import authorize_user
from jose import JWTError, jwt, ExpiredSignatureError
from config import JWT_SECRET, JWT_ALGORITHM
from models.user import User
from datetime import datetime, timezone
from models.Individual import Individual
from utils.response import Respond
from models.organization import Organization
from bson import ObjectId, DBRef
from models.group import Group
from models.individual_group_history import IndividualGroupHistory, GroupHistory
from utils.hash import Hash
from beanie.operators import Or
from beanie.odm.operators.find.evaluation import Text
from utils.populate import PopulateDocs


router = APIRouter(prefix="/individuals")


@router.post("/register/manual")
async def RegisterStudentManual(payload: PayloadRegisterIndividualManual, user=Depends(authorize_user)):  # type:ignore
    user_details = await User.get(user["id"])
    try:
        if not ObjectId.is_valid(payload.group):
            return Respond(message="Invalid Group id", status_code=400)
        is_grno_exist = await Individual.find_one(Individual.grno == payload.grno, Individual.organization.id == ObjectId(user["organization"]))
        if is_grno_exist:
            return Respond(message="GRNO is already registered", status_code=403)

        if not str(payload.grno).isdigit() or int(payload.grno) <= 0:
            return Respond(message="Invalid GRNO selected. Choose only positive numbers.")

        group = await Group.get(ObjectId(payload.group))
        if not group:
            return Respond(message="Invalid Group selected", status_code=403)

        dob = datetime.strptime(payload.dob, "%Y-%m-%d").date()
        doa = datetime.strptime(payload.doa, "%Y-%m-%d").date()
        ind = Individual(
            full_name=payload.full_name,
            father_name=payload.father_name,
            group=group,
            cnic=int(payload.cnic),
            contact=payload.contact,
            email=payload.email,
            dob=dob,
            doa=doa,
            gender=payload.gender,
            grno=payload.grno,
            roll_no=payload.roll_no or None,
            password=Hash("12345678"),
            is_approved=True,
            organization=user_details.organization,
            approved_by=user_details,
        )
        await ind.insert()
        ind_history = IndividualGroupHistory(individual=ind, history=[GroupHistory(
            admission_date=datetime.now(timezone.utc), group=group)])

        await ind_history.insert()
        return Respond(message="Individual has registered successfully")
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Respond(status_code=501, message="Internal server error", success=False)


@router.post("/register/self/{token}")
async def RegisterStudentSelf(payload: PayloadRegisterIndividualSelf,token:str):  # type:ignore

    token_content = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

    if not token_content or "id" not in token_content or "hash" not in token_content:
        return Respond(message="Invalid token", status_code=401)

    organization_id = token_content["id"]
    hash = token_content["hash"]
    
    if not ObjectId.is_valid(organization_id):
        return Respond(message="Invalid ID in token", status_code=401)

    org = await Organization.find_one(Organization.id==ObjectId(organization_id),Organization.auto_registration_hash ==hash)
    
    if not org:
        return Respond(status_code=401, message="Invalid token", success=False)
    cnic_exists = await Individual.find_one(Individual.cnic==int(payload.cnic))
    try:
        student =  Individual(
            full_name=payload.full_name,
            father_name=payload.father_name,
            contact=payload.contact,
            dob = datetime.strptime(payload.dob, "%Y-%m-%d").date(),
            email = payload.email or None,
            cnic = int(payload.cnic) ,
            gender=payload.gender,
            organization=org,
            password=Hash("12345678"),
            is_approved=False
        )
        await student.insert()
        return Respond(message="Your request has been sent to admin. wait for thier approval")
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Respond(status_code=501, message="Internal server error", success=False)



def to_datetime(date_str, fallback):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d") if date_str else fallback
    except (ValueError, TypeError):
        return fallback
    
@router.put("/edit/{id}")
async def EditStudent(id: str, payload: PayloadRegisterIndividualManual, user=Depends(authorize_user)):  # type:ignore
    try : 
        if not ObjectId.is_valid(id) :
            return Respond(message="Invalid Individual Id" , status_code=400)
        individual = await Individual.get(id)
        if not individual:
            return Respond(status_code=404, message="Invalid individual id", success=False)
        if payload.grno != individual.grno :
            student_exist = await Individual.find({"_id":{"$ne":ObjectId(id)},"grno":payload.grno}).first_or_none()
            if student_exist :
                return Respond(message="GRNO is already assigned ",status_code=402)
            
        individual.full_name = payload.full_name or individual.full_name
        individual.father_name = payload.father_name or individual.father_name
        individual.contact = payload.contact or individual.contact
        individual.cnic = int(payload.cnic) or individual.cnic
        individual.email = payload.email or individual.email
        individual.dob = to_datetime(payload.dob, individual.dob)
        individual.doa =  to_datetime(payload.doa, individual.doa)
        individual.roll_no = payload.roll_no or individual.roll_no
        individual.grno = payload.grno or individual.grno


        await individual.save()
        return Respond(message="Student details have been updated")
           
    except Exception as e :
        print(e)
        traceback.print_exc()
        return Respond(message="Internal server error",status_code=501)


@router.post("/get")
async def GetIndiviudals(filters: PayloadIndividualFiltersPayload, user=Depends(authorize_user)):
    try:

        query_list = []
        query_list.append(Individual.organization.id ==
                          ObjectId(user["organization"]))
        query_list.append(Individual.is_approved == True)
        if filters.group:
            query_list.append(Individual.group.id == ObjectId(filters.group))
        if filters.q:
            query_list.append(
                Or(
                    # Text search on all indexed fields
                    Text(filters.q),
                    Individual.grno == filters.q   # Match GRNO
                ))
        group_info = await Group.get(ObjectId(filters.group)) if filters.group else None
        Individuals = await Individual.find(*query_list).to_list()
        populated_Individuals = await PopulateDocs(Individuals, ["group"]) if  not filters.group else Individuals

        total = await Individual.find(*query_list).count()

        payload = {"count": filters.count, "total": total, "results":
                   [{**i.model_dump(include={"full_name", "email", "contact", "grno","father_name"}), "id": str(
                       i.id), "group": group_info.name if group_info else i.group.name if i.group.name else ""  , "doa": i.doa.date().isoformat()} for i in populated_Individuals]
                   }
        return Respond(payload=payload)
    except Exception as e:
        traceback.print_exc()
        print(e)
        return Respond(message="Internal server error", status_code=501)


@router.get("/get/{id}") 
async def GetIndiviudalDetailed(id:str, user=Depends(authorize_user)):
    try :
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid Object id",status_code=402)
        
        individual = await Individual.find_one(Individual.id==ObjectId(id),Individual.organization.id == ObjectId(user["organization"]) )

        if not individual:
            return Respond(message="Invalid Object id",status_code=402)
        populatedIndividual = await PopulateDocs([individual],["group","approved_by"])


        return Respond(
            payload= {
                "personal_details" : {
                **populatedIndividual[0].model_dump(include={"full_name","father_name","contact","cnic","email","photo","gender"}),"id":str(populatedIndividual[0].id), 
                "Date of birth":populatedIndividual[0].dob.date().isoformat()
                },
                "acedemic_details":{
                    "Date of admission":populatedIndividual[0].doa.date().isoformat(),
                    "Group":{"name":populatedIndividual[0].group.name,"id":str(populatedIndividual[0].group.id)},
                    "GRNO":populatedIndividual[0].grno,
                    "Roll no":populatedIndividual[0].roll_no
                },
                "account_details" :{
                    "Username" : populatedIndividual[0].grno,
                    "Created on":populatedIndividual[0].created_at.date().isoformat(),
                    "Approved by" :{"name":populatedIndividual[0].approved_by.username, "id" :str(populatedIndividual[0].approved_by.id)}
                }
                                                })
        
    except Exception as e :
        print(e)
        traceback.print_exc()
        return Respond(message="Internal server error",status_code=501)
    




@router.get("/get/edit/{id}") 
async def GetIndividualEditData(id:str, user=Depends(authorize_user)):
    try :
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid Object id",status_code=402)
        
        individual = await Individual.find_one(Individual.id==ObjectId(id),Individual.organization.id == ObjectId(user["organization"]) )

        if not individual:
            return Respond(message="Invalid Object id",status_code=402)


        return Respond(
            payload= {
                **individual.model_dump(include={"email","contact","photo","grno","roll_no","gender","cnic","full_name","father_name","photo"}) , "dob":individual.dob.date().isoformat() or ""
                ,"doa":individual.doa.date().isoformat() or "", "group":str(individual.group.ref.id) ,
                "contact":individual.contact or "" , "cnic" :individual.cnic or "" ,  "email":individual.email or "" 
            })
        
    except Exception as e :
        print(e)
        traceback.print_exc()
        return Respond(message="Internal server error",status_code=501)
    






@router.put("/approve/registration/self/{id}")
async def ApproveSelfRegistrationRequest(id:str,payload:VerificationSelfRegistrationRequestPayload,user=Depends(authorize_user)):
    try : 
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid Id",status_code=401)
        ind = await Individual.find_one(Individual.id == ObjectId(id),Individual.organization.id == ObjectId(user["organization"]))
        if not ind :
            return Respond(message="Invalid Id",status_code=401)
        
        grno_occupied = await Individual.find_one(Individual.grno==payload.grno)
        if grno_occupied : 
            return Respond(message="GRNO is not available",status_code=403)
        
        ind.grno = payload.grno 
        group_obj = await Group.get(ObjectId(payload.group))

        if not group_obj:
            return Respond(message="Invalid Group selected", status_code=403)
        
        ind.group = group_obj
        ind.doa = datetime.strptime(payload.dob, "%Y-%m-%d").date() or None
        ind.roll_no = payload.roll_no or None
        ind.is_approved = True
        approved_by_user = await User.get(user["id"])
        ind.approved_by = approved_by_user
        ind.approved_on = datetime.now(timezone.utc)
        await ind.save()
        return Respond(message="Request is accepted successfully now")
    except Exception as e :
        traceback.print_exc()
        return Respond(message="Internal server error",status_code=501)
        




@router.put("/reject/registration/self/{id}")
async def RejectSelfRegistrationRequest(id:str,payload:VerificationSelfRegistrationRequestPayload,user=Depends(authorize_user)):
    try : 
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid Id",status_code=401)
        ind = await Individual.find_one(Individual.id == ObjectId(id),Individual.organization.id == ObjectId(user["organization"]))
        if not ind :
            return Respond(message="Invalid Id",status_code=401)
        if id.is_approved : 
            return Respond(message="The student is already approved . You cannot disapprove it right now ",status_code=401)

        approved_by_user = await User.get(user["id"])
        ind.approved_by = approved_by_user
        ind.is_approved = False
        ind.approved_on = datetime.now(timezone.utc)
        await ind.save()
        return Respond(message="Request is rejected successfully now")
    except Exception as e :
        traceback.print_exc()
        return Respond(message="Internal server error",status_code=501)
        


class IndividualProjection(BaseModel):
    id: ObjectId = Field(alias="_id")
    full_name: str
    father_name:str 
    contact :Optional[str] = None
    cnic:Optional[int] =None
    created_at:datetime
    is_approved: bool
    is_rejected: bool

    model_config = {
        "arbitrary_types_allowed": True
    }

@router.post("/self/registration/requests")
async def FetchSelfRegistrationRequests(payload:FetchSelfRegistrationRequestsPayload, user=Depends(authorize_user)):
    try :
        query = {
        "organization": DBRef("Organization", ObjectId(user["organization"])),
        "is_approved": False ,
        "is_rejected" : payload.status == "rejected"
        }
        if payload.q:
            query["$text"] = {"$search": payload.q}
        requests = await Individual.find(query,projection_model=IndividualProjection,sort=["-created_at"]).limit(20).skip(20*payload.count).to_list()
        total = await Individual.find(query).limit(20).skip(20*payload.count).count()

        return Respond(payload={
            "requests":[{**g.model_dump(exclude={"id","created_at"}),"id":str(g.id),"created_at":g.created_at.date().isoformat(),"status":"rejected" if g.is_rejected else "pending" } for g in requests],"total":total,"count":payload.count})
    except Exception as e :
        traceback.print_exc()
        # print(e)
        return Respond(message="Internal server error")

