# config.py
from dotenv import load_dotenv
import os
from pathlib import Path
# Load .env variables
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

# Access environment variables
PORT = int(os.getenv("PORT", 8000))
DATABASE_URL = os.getenv("DATABASE_URL")

APP_REFRESH_COOKIE_KEY= os.getenv("APP_REFRESH_COOKIE_KEY")


JWT_SECRET = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM=os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS") or 30) 
VERIFICATION_ATTEMPT_LIMIT = int(os.getenv("VERIFICATION_ATTEMPT_LIMIT") )

EMAIL_ID = os.getenv("EMAIL_ID")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


APP_NAME = os.getenv("APP_NAME")
APP_SERVER_LINK = os.getenv("APP_SERVER_LINK")
APP_LINK=os.getenv("APP_LINK") 

USERS_PER_PAGE = int(os.getenv("USERS_PER_PAGE", 10)) 
CLASSES_PER_PAGE = int(os.getenv("CLASSES_PER_PAGE", 15)) 
