from pydantic import BaseModel 
from typing import Optional 
from models.group import Group
from typing import Literal
class PayloadRegisterIndividualManual(BaseModel):
    full_name: str
    father_name: str
    contact: Optional[str] = None
    dob: str 
    email:Optional[str]=None 
    gender: Literal["male","female","other"]
    cnic:str
    doa : str
    grno: str
    roll_no: Optional[str] = None
    group:str
    
class PayloadRegisterIndividualSelf(BaseModel):
    full_name: str
    father_name: str
    contact: Optional[str] = None
    dob: str 
    email:Optional[str]=None 
    gender: Literal["male","female","other"]
    cnic:str

    

class PayloadIndividualFiltersPayload (BaseModel):
    group :str 
    q : str 
    count:int


