from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class HeroSlideBase(BaseModel):
    title: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0
    image_id: int

class HeroSlideCreate(HeroSlideBase):
    pass

class HeroSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    image_id: Optional[int] = None

class HeroSlide(HeroSlideBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
