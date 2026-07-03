from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from database import get_db
from schemas import URLCreate
from models import URL
from utils import generate_short_code

router = APIRouter(
    tags=["URL Shortener"]
)


@router.post("/shorten")
def shorten_url(
    url: URLCreate,
    db: Session = Depends(get_db)
):
    short_code = generate_short_code()

    new_url = URL(
        original_url= str(url.original_url),
        short_code=short_code
    )

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    return {
        "message": "Short URL created successfully",
        "short_url": f"http://localhost:8000/{short_code}"
    }


@router.get("/{short_code}")
def redirect_url(
    short_code: str,
    db: Session = Depends(get_db)
):
    url = db.query(URL).filter(URL.short_code == short_code).first()

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found"
        )

    return RedirectResponse(url.original_url)