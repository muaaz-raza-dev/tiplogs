from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from config import JWT_SECRET
from utils.response import Respond
from jose.exceptions import ExpiredSignatureError ,JWTError

security = HTTPBearer()

async def authorize_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    if not token : 
        return Respond(status_code=401,message="Invalid credentials",payload={"actions":{"logout":True}})
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if not payload :
           return Respond(status_code=401,message="Invalid credentials token",payload={"actions":{"logout":True}})
        return payload  
    except ExpiredSignatureError:
        Respond(status_code=401,message="Token has expired ")
    except JWTError:
        Respond(status_code=401,message="Invalid credentials token",payload={"actions":{"logout":True}})
