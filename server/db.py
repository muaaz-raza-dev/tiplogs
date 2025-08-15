from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from config import DATABASE_URL
from models.user import User
from models.organization import Organization
from models.group import Group
from models.Individual import Individual
from models.individual_group_history import IndividualGroupHistory
from models.att_module import AttendanceModule
from models.att_groups import AttendanceGroup
from models.att_base import AttendanceBase
from models.att_main import Attendance



async def init():
    # Create Motor client
    client = AsyncIOMotorClient(DATABASE_URL)

    # Initialize beanie with the Sample document class and a database
    await init_beanie(database=client["tiplogs"], document_models=[User, Organization, Group, Individual,IndividualGroupHistory,AttendanceModule,AttendanceGroup,AttendanceBase,Attendance])
    print("Database initialized successfully")
