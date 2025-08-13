from fastapi.responses import JSONResponse
from fastapi import Response
from typing import Any
from datetime import datetime ,timedelta , timezone

def Respond(payload:Any=None,success:bool=True,message:str="Okay",status_code:int=200,headers:Any=None):
    return JSONResponse(
        status_code=status_code,
        content={"success": True if  status_code >= 200 and status_code < 300 else False ,"payload":payload  , "message":message},
        headers=headers
    )

def RespondCookie(res:Response , key:str ,value:str ,expiry : int=3600 * 24 * 30 ) : 
    expires_date = datetime.now(timezone.utc) + timedelta(seconds=expiry)

    return res.set_cookie(
        key=key,
        value=value,
        httponly=True,
        expires=expires_date,
        
        max_age=  expiry,
        path="/",
        )