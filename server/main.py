from fastapi import FastAPI
from routes.auth import router as Authrouter
from routes.users import router as Userrouter
from routes.organization import router as Organizationrouter

app = FastAPI()

app.include_router(Authrouter,prefix="/api")
app.include_router(Userrouter,prefix="/api")
app.include_router(Organizationrouter,prefix="/api")

@app.get("/")
def intro():
    return "Hello World"

