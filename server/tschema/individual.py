from pydantic import BaseModel 
from typing import TYPE_CHECKING,Optional 
from typing import Literal
class PayloadRegisterIndividualManual(BaseModel):
    name: str
    f_name: Optional[str] = None
    photo: Optional[str] = "https://res.cloudinary.com/dz8a9sztc/image/upload/v1711541749/students_dpw9qp.png"
    contact: Optional[list[str]] = None
    dob: Optional[str] = None  # Assuming date is in string format
    gender: Literal["male","female","other"] # type: ignore
    grno: str
    roll_no: Optional[str] = None
    password: Optional[str] = None  # Assuming password can be optional

class PayloadRegisterIndividualAuto(PayloadRegisterIndividualManual):
    organization_name: str 