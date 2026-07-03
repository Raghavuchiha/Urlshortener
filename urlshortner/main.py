from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
from routers.url import router

# Create all database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all URL routes
app.include_router(router)


@app.get("/")
def home():
    return {
        "message": "URL Shortener Backend Running 🚀"
    }