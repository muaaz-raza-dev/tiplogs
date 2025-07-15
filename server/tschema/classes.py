from pydantic import BaseModel


class RegisterClassPayload(BaseModel):
    name : str 
    