from fastapi import FastAPI
from routes.auth import router as Authrouter
from routes.users import router as Userrouter
from routes.organization import router as Organizationrouter 
from routes.groups import router as GroupRouter
from routes.individuals import router as Individualrouter
from routes.att_module import router as AttendanceModuleRouter
from db import init 
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from routes.general import router as GeneralRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init() 
    yield

app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(Authrouter,prefix="/api")
app.include_router(Userrouter,prefix="/api")
app.include_router(Organizationrouter,prefix="/api")
app.include_router(Individualrouter,prefix="/api")
app.include_router(GroupRouter,prefix="/api")
app.include_router(GeneralRouter,prefix="/api")
app.include_router(AttendanceModuleRouter,prefix="/api")




@app.get("/")
def intro():
    return "Hello World"

