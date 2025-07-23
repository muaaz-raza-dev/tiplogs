from fastapi import APIRouter ,Response ,Cookie,Depends 
from fastapi.responses import RedirectResponse
from tschema.auth import PayloadRegisterAdmin,PayloadLogin,PayloadRequestVerification
from models.user import User 
from utils.hash import Hash,VerifyHash
from models.common import UserRole
from utils.response import Respond,RespondCookie
from pydantic import BaseModel ,ValidationError
from jose import jwt, JWTError, ExpiredSignatureError
from jose.exceptions import ExpiredSignatureError ,JWTError
from config import JWT_SECRET,APP_REFRESH_COOKIE_KEY,JWT_ALGORITHM,REFRESH_TOKEN_EXPIRE_DAYS ,APP_LINK
from datetime import datetime , timedelta , timezone
from middleware.authorization import authorize_user
from utils.verification_mail import SendVerificationMail
from bson import ObjectId

router = APIRouter(prefix="/auth")

@router.post("/register/admin")
async def RegisterAdmin(body:PayloadRegisterAdmin,res:Response):
    try :
        is_username = await User.find_one(User.username == body.username)

        if is_username:
            return Respond(status_code=400, message="Username already exists", success=False)

 
        hashed_password =  Hash(body.password)

        data = body.model_dump(exclude={"password", "role"})

        user = User(**data,password=hashed_password,role=UserRole.admin,is_verified=False,is_approved=True)

        await user.insert()
        accessToken = jwt.encode( 
        {"id":str(user.id),"is_verified":False,"username":user.username, "role" : user.role }
        ,JWT_SECRET,algorithm=JWT_ALGORITHM)

        refresh_token = jwt.encode(
        {"id":str(user.id), "exp": datetime.now(timezone.utc)+timedelta(days=int(REFRESH_TOKEN_EXPIRE_DAYS))}
        ,JWT_SECRET , algorithm=JWT_ALGORITHM)


        user_data = user.model_dump(include={"username", "email", "is_verified", "role"})
        user_data["id"] = str(user.id)
        
        RespondCookie(res=res,key=APP_REFRESH_COOKIE_KEY,value=refresh_token)
    
        return Respond(payload={"accessToken":accessToken,"user":user.model_dump(include=["is_verified","email","username","organization","full_name","role"])},message="Your profile is created",status_code=201,headers=res.headers)
    
    except Exception as e:
        print(f"Error : \n {e}")
        return Respond(status_code=501, message="Internal server error", success=False)
    
    except ValidationError as e:
        print(f"Validation Error : \n {e}")
        return Respond(status_code=400,payload=e.errors, message="Invalid data provided", success=False)




@router.post("/request/verification")
async def VerifyAccount(payload:PayloadRequestVerification,user=Depends(authorize_user)):
    try : 
        if not user:
            return Respond(status_code=400, message="Invalid credentials",success=False)

        # Fetch user from DB

        user_details = await User.get(ObjectId(user["id"]))

        if not user_details:
            return Respond(status_code=404, message="User not found",success=False)

        
        if user_details.is_verified:
            return Respond(status_code=200, message="Your account is already verified")

        if payload.email and user_details.email != payload.email:
            user_details.email = payload.email 

        return await SendVerificationMail(user_details)


    except Exception as e :
        print(f"Error  : \n {e}")
        return Respond(message="Internal server error", status_code=501 , success=False)
    



@router.get("/verify/account/{token}")
async def VerifyAccount(token: str):
    try:
        payload =  jwt.decode(token, JWT_SECRET, algorithms=JWT_ALGORITHM)
        user = await User.get(payload["id"])

        if not user:
            return Respond(status_code=401, message="Invalid request")

        if user.verification_hash != payload["hash"]:
            return Respond(success=False, message="Invalid Token", status_code=401)
        user.is_verified = True
        user.verification_hash = None
        await user.save()

        return RedirectResponse(url=f"{APP_LINK}/dashboard", status_code=302)

    except ExpiredSignatureError:
        payload = jwt.decode(token, JWT_SECRET, options={"verify_exp": False})
        user = await User.find_one(User.id == payload["id"])
        if user:
            user.verification_hash = None
            await user.save()
        return Respond(success=False, status_code=401, message="Your token is expired. Request again for verification")

    except Exception as e:
        print(f"Verification error: {e}")  # Log error for debugging
        return Respond(success=False, status_code=501, message="Internal server error")





class LimitedUserPayload(BaseModel):
    password: str
    id:str
    username: str

@router.post("/login")
async def Login(req:PayloadLogin,res:Response):
   
    user = await User.find_one(User.username == req.username)

    if not user : 
        return Respond(status_code=401,message="Invalid Credentials",success=False)        
    
    if not user.is_approved and user.role in [UserRole.staff, UserRole.manager]:
        return Respond(status_code=401,message="Your account is not approved yet",success=False)        
    if user.is_blocked :
        return Respond(status_code=401,message="Your account is blocked . Contact admin for approval",success=False)
    if user.is_deleted :
        return Respond(status_code=401,message="Your account no longer exists  . ",success=False)

    is_valid = VerifyHash(user.password,req.password)

    if not is_valid :
        Respond(status_code=401,message="Invalid Credentials",success=False)        

    accessToken = jwt.encode( 
    {"id":str(user.id),"is_verified":user.is_verified,"username":user.username, "role" : user.role , }
    ,JWT_SECRET,algorithm=JWT_ALGORITHM)

    refresh_token = jwt.encode(
    {"id":str(user.id), "exp": datetime.now(timezone.utc)+ timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)}
    ,JWT_SECRET , algorithm=JWT_ALGORITHM)


    RespondCookie(res=res,key=APP_REFRESH_COOKIE_KEY,value=refresh_token)

    return Respond(payload={"accessToken":accessToken,"user":user.model_dump(include=["is_verified","email","username","organization","full_name","role"])},message="Your profile is created",status_code=201,headers=res.headers)



class LimitedUsernamePayload(BaseModel):
    username:str


@router.get("/username/available/{username}")
async def AvailablityUsername(username:str):
    user = await User(username=username.strip(),projection_model=LimitedUsernamePayload).find_one()
    if not user.username :
        Respond(status_code=401,message="Username is not available",success=False)        
        return 
    
    else : 
        Respond(message="Username is available",success=True)        


@router.get("/session")
async def RenewAccessToken(RefreshToken:str|None = Cookie(default=None,alias=APP_REFRESH_COOKIE_KEY)): # type: ignore
    try:
        if not RefreshToken :
            return Respond(message="Login first to access your account",status_code=401)
        token = jwt.decode(RefreshToken,JWT_SECRET,algorithms=JWT_ALGORITHM)
    except ExpiredSignatureError:
        return Respond(status_code=401, message="Token has expired")
    except JWTError:
        return Respond(status_code=403, message="Invalid token")
    
    id = token.get("id")
    if not id :
        return Respond(status_code = 403 , message="Malformed token")
    
    user = await User.find_one({"_id":ObjectId(id)})
    if not user :
        return Respond(status_code=401,message="Invalid credentials",payload={"events":{"logout":True}})
    
    accessToken = jwt.encode( {"id":str(user.id),"is_verified":user.is_verified,"username":user.username },JWT_SECRET,algorithm=JWT_ALGORITHM)

    return Respond(payload={"accessToken":accessToken,"user":user.model_dump(include=["is_verified","email","username","organization","full_name","role"])})



@router.post("/logout")
async def LogOut(res:Response):
    res.delete_cookie(APP_REFRESH_COOKIE_KEY)
    return Respond(message="logged out successfully")


@router.get("/me")
async def UserDetails(user=Depends(authorize_user)):


    user_details = await User.find_one(id==user.id).project(
        User.id,
        User.username,
        User.email,
        User.is_verified,
        User.role
    )
    return Respond(payload={user:user_details})


  