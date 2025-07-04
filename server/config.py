# config.py
from dotenv import load_dotenv
import os

# Load .env variables
load_dotenv()

# Access environment variables
PORT = int(os.getenv("PORT", 8000))
DATABASE_URL = os.getenv("DATABASE_URL")