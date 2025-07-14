# config.py
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Access environment variables
PORT = int(os.getenv("PORT", 8000))
DATABASE_URL = os.getenv("DATABASE_URL")

APP_REFRESH_COOKIE_KEY= os.getenv("APP_REFRESH_COOKIE_KEY")


JWT_SECRET = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM=os.getenv("JWT_ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
REFRESH_TOKEN_EXPIRE_DAYS = os.getenv("REFRESH_TOKEN_EXPIRE_DAYS") 

EMAIL_ID = os.getenv("EMAIL_ID")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")


APP_NAME = os.getenv("APP_NAME")
APP_SERVER_LINK = os.getenv("APP_SERVER_LINK")
APP_LINK=os.getenv("APP_LINK")