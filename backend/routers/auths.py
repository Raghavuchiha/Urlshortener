from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schemas import UserCreate , UserLogin, RefreshTokenRequest
from auth import create_refresh_token, hash_password , verify_password , create_access_token , verify_token , get_current_user
from schemas import UserLogin



router = APIRouter(
    tags = ["Authentication"]
)

@router.post("/signup")
def signup(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully"
    }




@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    
    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code = 401,
            detail = "invalid email or passworsd"
        )


    if not verify_password(
        user.password,
        db_user.hashed_password
    ):
        
        raise HTTPException(

            status_code = 401,
            detail = "invalid email or password"
            
            )
    access_token = create_access_token(
    {
        "sub": db_user.email
    }

)
    refresh_token = create_refresh_token(
    {
        "sub": db_user.email
    }
)

    return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer"
  }

@router.post("/refresh")
def refresh_token(
    request: RefreshTokenRequest
):

    payload = verify_token(
        request.refresh_token
    )

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=401,
            detail="Invalid token type"
        )

    new_access_token = create_access_token(
        {
            "sub": payload["sub"]
        }
    )

    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }



@router.get("/me")
def get_profile(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }