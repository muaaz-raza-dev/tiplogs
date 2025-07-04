from beanie import init_beanie, Document
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from config import DATABASE_URL
class Sample(Document):
    name: str

async def init():
    # Create Motor client
    client = AsyncIOMotorClient(DATABASE_URL)

    # Initialize beanie with the Sample document class and a database
    await init_beanie(database=client["test"], document_models=[Sample])
    
    sample = Sample(name="Muaaz")
    await sample.insert()

