from fastapi.responses import JSONResponse
from typing import Any

def Response(payload:Any,success:bool=True,message:str="Okay",status_code:int=200):
    return JSONResponse(
        status_code=status_code,
        content={"success":success,"payload":payload  , "message":message}
    )