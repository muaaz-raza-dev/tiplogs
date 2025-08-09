import random
from config import JWT_ALGORITHM, JWT_SECRET,APP_SERVER_LINK, VERIFICATION_ATTEMPT_LIMIT
from datetime import datetime, timedelta, timezone
from fastapi_mail import FastMail, MessageSchema, MessageType
from fastapi_mail.errors import ConnectionErrors
from templates.account_verification import generate_verification_email
from utils.response import Respond
from jose import jwt
from models.user import User, UserRole
from utils.mail import conf
from smtplib import SMTPException

async def SendVerificationMail(user_details : User):
    try : 
        if user_details.verification_attempts >= VERIFICATION_ATTEMPT_LIMIT:
            return Respond(message=f"The limit of verification attempt has reached ,Contact {"admin "if user_details.role != UserRole.admin else "contact@tiplogs.com"} to verify your account", status_code=403)

        verification_hash = str(random.randint(100000, 999999))

        payload = {
            "id": str(user_details.id),
            "hash": verification_hash,
            "exp": datetime.now(timezone.utc) + timedelta(minutes=45)
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        verification_link = f"{APP_SERVER_LINK}/api/auth/verify/account/{token}"


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
        print("Email has been sent")

        user_details.verification_attempts += 1
        user_details.last_verification_attempt = datetime.now(timezone.utc)
        user_details.verification_hash = verification_hash

        await user_details.save()

        return Respond(message="The verification email has been sent to your email address",payload={"verification_attempts":user_details.verification_attempts})

    except SMTPException as e :
          return Respond(
            message="email address is invalid.",
            status_code=400,
            payload={"error": str(e)}
        )
    except ConnectionErrors as e:
        return Respond(
            message="Failed to connect to the email server.",
            status_code=500,
            payload={"error": str(e)}
        )
    except Exception as e:
        return Respond(
            message="An unexpected error occurred while sending the .",
            status_code=500,
            payload={"error": str(e)}
        )