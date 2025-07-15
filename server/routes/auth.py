from fastapi import APIRouter ,Response ,Cookie,Depends 
from fastapi_mail import MessageSchema , FastMail , MessageType
from tschema.auth import PayloadRegisterAdmin,PayloadLogin
from models.user import User 
from utils.hash import Hash,VerifyHash
from models.common import UserRole
from utils.response import Respond
from pydantic import BaseModel ,ValidationError
from jose import jwt, JWTError, ExpiredSignatureError
from jose.exceptions import ExpiredSignatureError ,JWTError
from config import JWT_SECRET,APP_REFRESH_COOKIE_KEY,JWT_ALGORITHM,ACCESS_TOKEN_EXPIRE_MINUTES,REFRESH_TOKEN_EXPIRE_DAYS , APP_SERVER_LINK ,APP_LINK
from datetime import datetime , timedelta , timezone
from middleware.authorization import authorize_user
from templates.account_verification import generate_verification_email  
import random
from utils.mail import conf


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
        {"id":str(user.id),"is_verified":False,"username":user.username, "role" : user.role , "exp":datetime.now(timezone.utc) + timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))}
        ,JWT_SECRET,algorithm=JWT_ALGORITHM)

        refresh_token = jwt.encode(
        {"id":str(user.id),"is_verified":False, "exp": datetime.now(timezone.utc)+timedelta(days=int(REFRESH_TOKEN_EXPIRE_DAYS))}
        ,JWT_SECRET , algorithm=JWT_ALGORITHM)

        res.set_cookie( key=APP_REFRESH_COOKIE_KEY ,value=refresh_token ,httponly=True,max_age= 36004*30, secure=True )    

        return Respond(message="Your profile is created" , payload={"accessToken":accessToken})
    except Exception as e:
        print(f"Error : \n {e}")
        return Respond(status_code=501, message="Internal server error", success=False)
    
    except ValidationError as e:
        print(f"Validation Error : \n {e}")
        return Respond(status_code=400,payload=e.errors, message="Invalid data provided", success=False)



@router.post("/request/verification")
async def VerifyAccount(user=Depends(authorize_user)):
    try : 
        if not user:
            return Respond(status_code=400, message="Invalid credentials",success=False)

        # Fetch user from DB
        user_details = await User.get(user.id)
        if not user_details:
            return Respond(status_code=404, message="User not found",success=False)

        if user_details.is_verified:
            return Respond(status_code=200, message="Your account is already verified")

        # Generate hash and verification token
        verification_hash = str(random.randint(100000, 999999))
        payload = {
            "id": str(user_details.id),
            "hash": verification_hash,
            "exp": datetime.now(timezone.utc)+ timedelta(minutes=15)
        }

        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        verification_link = f"{APP_SERVER_LINK}/verify/account/{token}"

        # ✅ Update user doc in Beanie
        user_details.verification_hash = verification_hash
        await user_details.save()

        # Send the email
        message = MessageSchema(
            subject="Verify your account",
            recipients=[user_details.email],
            body=generate_verification_email(
                username=user_details.username,
                verification_link=verification_link
            ),
            subtype=MessageType.html
        )
        fm = FastMail(conf)
        await fm.send_message(message)

        return Respond(message="The verification email has been sent to your email address")

    except Exception as e :
        print(f"Error  : \n {e}")
        return Respond(message="Internal server error", status_code=501 , success=False)
    

@router.get("verify/account/{token}")
async def VerifyAccount(token:str,res:Response,user=Depends(authorize_user)):
    try :
        
        token = await jwt.decode(token,JWT_SECRET,algorithms=JWT_ALGORITHM)

        if token.id != user.id :
            return Respond(success=False, status_code=401, message="Invalid Token")
        
        user_details =await User(id==user.id).find_one()

        if user_details.verification_hash != token.verification : 
            return Respond(success=False,message="Invalid Token",status_code=401)
        
        user_details.is_verified = True 
        user_details.verification_hash = None
        await user_details.save()           

        accessToken = jwt.encode({"id":user.id,"is_verified":True,"username":user.username , },JWT_SECRET,algorithm=JWT_ALGORITHM)

        refresh_token = jwt.encode(
        {"id":user.id,"is_verified":True, "exp": datetime.now(timezone.u) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)}
        ,JWT_SECRET , algorithm=JWT_ALGORITHM)

        res.set_cookie( key=APP_REFRESH_COOKIE_KEY ,value=refresh_token ,httpOnly=True,max_age= 3600*24*30, secure=True )    
        return Respond(payload={accessToken},message="Your account is verified successfully")

    except ExpiredSignatureError :
        await User(id= user.id).update({"$unset":{"verification_hash":""}})
        return Respond(success=False, status_code=401, message="Your token is expired. Request again for verification")

    except Exception as e : 
        return Respond(success = False, status_code=501, message= " Internal server error")





class LimitedUserPayload(BaseModel):
    password: str
    id:str
    username: str

@router.post("/login")
async def Login(req:PayloadLogin,res:Response):
    user = await User.find_one(User.username == req.username)

    if not user : 
        Respond(status_code=401,message="Invalid Credentials",success=False)        
        return 
    if user.is_approved == False and (user.role == UserRole.staff or user.role == UserRole.manager) : 
        return Respond(status_code=401,message="Your account is not approved yet",success=False)        
    if not user.is_blocked :
        return Respond(status_code=401,message="Your account is blocked . Contact admin for approval",success=False)
    if not user.is_deleted :
        return Respond(status_code=401,message="Your account no longer exists  . ",success=False)

    is_valid = VerifyHash(user.password,req.password)

    if not is_valid :
        Respond(status_code=401,message="Invalid Credentials",success=False)        

    accessToken = jwt.encode( 
    {"id":user.id,"is_verified":user.is_verified,"username":user.username, "role" : user.role , "exp":datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}
    ,JWT_SECRET,algorithm=JWT_ALGORITHM)

    refresh_token = jwt.encode(
    {"id":user.id,"is_verified":user.is_verified, "exp": datetime.now(timezone.utc)+ timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)}
    ,JWT_SECRET , algorithm=JWT_ALGORITHM)

    res.set_cookie( key=APP_REFRESH_COOKIE_KEY ,value=refresh_token ,httpOnly=True,max_age= 3600*24*30, secure=True )   

    return Respond(status_code=200,message="Login successful",success=True,payload={"accessToken":accessToken,})



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


@router.post("/refresh")
async def RenewAccessToken(RefreshToken:str|None = Cookie(default=None,alias=APP_REFRESH_COOKIE_KEY)): # type: ignore
    try:
        token = jwt.decode(RefreshToken,JWT_SECRET,algorithms=JWT_ALGORITHM)
    except ExpiredSignatureError:
        return Respond(status_code=401, message="Token has expired")
    except JWTError:
        return Respond(status_code=403, message="Invalid token")
    
    id = token.get("id")
    if not id :
        return Respond(status_code = 403 , message="Malformed token")
    
    user = User(id=id).find_one()
    if not user.id :
        Respond(status_code=401,message="Invalid credentials",payload={"events":{"logout":True}})
        return 
    
    accessToken = jwt.encode( 
    {"id":user.id,"is_verified":False,"username":user.username , "exp":datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)}
    ,JWT_SECRET,algorithm=JWT_ALGORITHM)

    Respond(payload={"accessToken":accessToken,})



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


  