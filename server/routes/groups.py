from fastapi import APIRouter, Depends
from bson import ObjectId,DBRef
from tschema.classes import RegisterClassPayload
from middleware.authorization import authorize_user
from models.user import User
from models.group import Group
from utils.response import Respond
import traceback
from config import CLASSES_PER_PAGE
from models.organization import Organization 
from models.Individual import Individual
from pydantic import Field ,BaseModel
router = APIRouter(prefix="/groups")


@router.post("/create")
async def CreateGroup(payload:RegisterClassPayload,user=Depends(authorize_user)): # type:ignore 
    try :
        if user["role"] not in ["admin","manager"] :
            return Respond(status_code=401, message="You are not authorized to make this request",success=False)
        db_user = await User.find_one(User.id==ObjectId(user["id"]))
        if not db_user:
            return Respond(message="User not found",status_code=404)
        is_group_name = await Group.find_one(Group.name==payload.name)
        if is_group_name :
            return Respond(message="Classname with the given name already exists ",status_code=400)
        
        group =   Group(name=payload.name.strip(),organization=db_user.organization)
        await group.insert()

        return Respond(message="Group is registered successfully",payload={"group":{"id":str(group.id),**group.model_dump(exclude={"created_at","updated_at","organization","id","history"})}})
    except Exception as e : 
       print(e)
       return Respond(status_code=501,message="Internal server error")




@router.put("/edit/{cid}")
async def EditGroup(cid:str,payload:RegisterClassPayload,user=Depends(authorize_user)): #type:ignore
    try : 
        if not ObjectId.is_valid(cid):
            return Respond(message="Invalid object id",status_code=400)
        
        if user["role"] not in ["admin","manager"] :
            return Respond(status_code=401, message="You are not authorized to make this request",success=False)
        
        group = await Group.find_one(Group.id==ObjectId(cid),Group.organization== DBRef("Organization", ObjectId(user["organization"])))

        if not group : 
            return Respond(status_code=404,message="Invalid group id")
        
        group.name= payload.name 
        await group.save()

                
        return Respond(message="details have been updated",payload={"group":{"id":str(group.id),**group.model_dump(exclude={"created_at","updated_at","organization","id","history"})}})
    except Exception as e :
        return Respond(message="Internal server error",status_code=501)


@router.post("/")
async def GetGroups(count:int=0,q:str="",user=Depends(authorize_user)) :
    try : 
        query = {"organization": DBRef("Organization", ObjectId(user["organization"])) ,  **({"$text": {"$search": q} }if q else {}), }
        groups = await Group.find(query).limit(CLASSES_PER_PAGE).skip(CLASSES_PER_PAGE*count).sort("-created_at").to_list()
        total = await Group.find(query).count()


        pipeline = [
            {
                "$match": {
                    "organization.$id": ObjectId(user["organization"]),
                    "is_approved":True
                }
            },
            {
                "$group": {
                    "_id": "$group.$id",
                    "count": {"$sum": 1}
                }
            }
        ]

        collection = Individual.get_pymongo_collection()
        cursor = collection.aggregate(pipeline)
        results = await cursor.to_list(None)
        group_counts = {str(r["_id"]): r["count"] for r in results}

        enriched_groups = []
        for g in groups:
            enriched_groups.append({
                **g.model_dump(exclude={"created_at", "updated_at", "id", "organization","history"}),
                "id":str(g.id),
                "individuals": group_counts.get(str(g.id), 0)
            })


        return Respond(payload={
        "groups": enriched_groups,
        "filters": q == "",
        "total": total ,
        "count":count
    })
    except Exception as e : 
        traceback.print_exc()
        print(e)
        return Respond(message="Internal server error",status_code=501)


@router.post("/history/{id}")
async def GetGroups(id:str , user=Depends(authorize_user)):
    try :
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid object id",status_code=422)
        group = await Group.find_one(Group.id == ObjectId(id),Group.organization.id == ObjectId(user["organization"]))
        
        if not group : 
            return Respond(message="Invalid group id",status_code=404)
        
        return Respond(payload={"history":group.history,"created_at":group.created_at.date().isoformat(),})
    except Exception as e : 
        return Respond(message="Internal server error",status_code=501)




    


@router.get("/meta/registration")
async def GetMetaRegistrationData(user=Depends(authorize_user)):
    try : 
        payload = {}
        organization = await Organization.get(ObjectId(user["organization"]))
        if organization.GRNO_auto_assign : 
                ind = await Individual.find(Individual.organization==user["organization"],sort=[("created_at", -1)]).first_or_none()
                if ind and ind.grno:
                    payload["grno"] = int(ind.grno) + 1
                else :
                    payload["grno"] =1

        groups = await Group.find(Group.organization.id==ObjectId(user["organization"]),Group.is_active==True).to_list();
        payload = {**payload,"groups":[{"id":str(g.id),"name":g.name} for g in groups]}
        return Respond(payload=payload)
    except Exception as e : 
        print(e)
        return Respond(message="Internal server error",status_code=501)



@router.get("/pair")
async def GetGroupMaps(user=Depends(authorize_user)):
    try : 
        groups = await Group.find(Group.organization.id == ObjectId(user["organization"])).to_list()
        pairs = [{"id":str(g.id),"name":g.name} for g in groups]
        return Respond(payload=pairs)
    except Exception as e :
        print(e)
        return Respond(message="Internal server error",status_code=501)
    


class GroupIndividualsDetailsModel (BaseModel) :
    id:str= Field(alias="_id")
    full_name:str 
    father_name:str 
    grno:str 
    roll_no:str 


@router.get("/individuals/{id}")
async def GetGroupIndividualList(id:str,user=Depends(authorize_user)):
  try :  
        if not ObjectId.is_valid(id):
            return Respond(message="Invalid group ID", status_code=400)
        group = await Group.find_one(Group.id==ObjectId(id),Group.organization.id == ObjectId(user["organization"]))
        if not group:
            return Respond(message="Invalid group ID", status_code=400)
        
        individuals = await Individual.find(Individual.organization.id==ObjectId(user["organization"]),Individual.group.id==ObjectId(id),sort="-created_at",projection_model=GroupIndividualsDetailsModel).to_list()


        return Respond(payload={"group":{**group.model_dump(include={"name"}),"id":str(group.id),"created_at":group.id.date().to},
                                "individuals":[{**ind.model_dump(exclude={"id"}),"id":str(ind.id)} for ind in  individuals]})

  except Exception as e : 
      return Respond(message="Internal server error",status_code=501)
