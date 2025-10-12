from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class SocialMediaBase(BaseModel):
    platform: str
    url: str
    icon_name: str
    display_name: str
    is_active: bool = True
    sort_order: int = 0

class SocialMediaCreate(SocialMediaBase):
    pass

class SocialMediaUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    icon_name: Optional[str] = None
    display_name: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class SocialMedia(SocialMediaBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
