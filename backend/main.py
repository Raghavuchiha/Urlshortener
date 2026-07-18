from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from routers.url import router , redirect_router
from routers.auths import router as auth_router

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5173",
    "https://urlshortener-frontend.onrender.com",
],
)

# Include all URL routes
app.include_router(router)
app.include_router(auth_router)
app.include_router(redirect_router)


@app.get("/")
def home():
    return {
        "message": "URL Shortener Backend Running 🚀"
    }