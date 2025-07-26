
from typing import Literal
from pydantic import BaseModel

class FetchAllUsersPayload(BaseModel):
    input:str = ""
    count: int = 0
    role : Literal["all","user","manager"] = "all"
    status : Literal["all","active","blocked"] = "all"
