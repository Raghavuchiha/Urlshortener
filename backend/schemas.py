from pydantic import BaseModel
from pydantic import HttpUrl

class URLCreate(BaseModel):
    original_url: HttpUrl

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None