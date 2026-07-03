from pydantic import BaseModel
from pydantic import HttpUrl

class URLCreate(BaseModel):
    original_url: HttpUrl