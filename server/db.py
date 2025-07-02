from beanie import init_beanie, Document
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

class Sample(Document):
    name: str

async def init():
    # Create Motor client
    client = AsyncIOMotorClient(
        "mongodb://localhost:27017"
    )

    # Initialize beanie with the Sample document class and a database
    await init_beanie(database=client["test"], document_models=[Sample])
    
    sample = Sample(name="Muaaz")
    await sample.insert()

