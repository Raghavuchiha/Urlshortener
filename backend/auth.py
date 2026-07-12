from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/login"
)
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7



pwd_context = CryptContext(
    schemes = ["bcrypt"],
    deprecated = "auto"
)


def hash_password(password:str):

    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str):

    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def create_token(
    data: dict,
    expires_delta: timedelta,
    token_type: str
):
    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + expires_delta

    to_encode.update(
        {
            "exp": expire,
            "type": token_type
        }
    )

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt


def create_access_token(data: dict):

    return create_token(
        data=data,
        expires_delta=timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        ),
        token_type="access"
    )


def create_refresh_token(data: dict):

    return create_token(
        data=data,
        expires_delta=timedelta(
            days=REFRESH_TOKEN_EXPIRE_DAYS
        ),
        token_type="refresh"
    )


def verify_token(token: str):

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except JWTError:

        return None
    

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    payload = verify_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=401,
            detail="Access token required"
        )

    email = payload.get("sub")

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user
    