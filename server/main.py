from fastapi import FastAPI
from routes.auth import router as Authrouter
from routes.users import router as Userrouter
from routes.organization import router as Organizationrouter 
from routes.groups import router as Classrouter
from routes.individuals import router as Individualrouter
from db import init 
from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init() 
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(Authrouter,prefix="/api")
app.include_router(Userrouter,prefix="/api")
app.include_router(Organizationrouter,prefix="/api")
app.include_router(Classrouter,prefix="/api")
app.include_router(Individualrouter,prefix="/api")




@app.get("/")
def intro():
    return "Hello World"

