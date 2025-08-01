from pydantic import BaseModel ,EmailStr 
from typing import Optional 
from models.group import Group
from typing import Literal
class PayloadRegisterIndividualManual(BaseModel):
    full_name: str
    father_name: str
    photo: str = "https://res.cloudinary.com/dz8a9sztc/image/upload/v1711541749/students_dpw9qp.png"
    contact: Optional[str] = None
    dob: str  # Assuming date is in string format
    email:Optional[EmailStr]=None 
    gender: Literal["male","female","other"] # type: ignore

    doa : str
    grno: str
    roll_no: Optional[str] = None
    group:str
    

class PayloadRegisterIndividualAuto(PayloadRegisterIndividualManual):
    organization_name: str 

class PayloadIndividualFiltersPayload (BaseModel):
    group :str 
    q : str 
    count:int


