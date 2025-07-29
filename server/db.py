from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from config import DATABASE_URL
from models.user import User
from models.organization import Organization
from models.group import Group
from models.Individual import Individual
from models.individual_group_history import IndividualGroupHistory



async def init():
    # Create Motor client
    client = AsyncIOMotorClient(DATABASE_URL)

    # Initialize beanie with the Sample document class and a database
    await init_beanie(database=client["tiplogs"], document_models=[User, Organization, Group, Individual,IndividualGroupHistory])
    print("Database initialized successfully")
