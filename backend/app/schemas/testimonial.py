from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class TestimonialBase(BaseModel):
    name: str
    title: Optional[str] = None
    company: Optional[str] = None
    content: str
    rating: int = 5
    image_url: Optional[str] = None
    is_featured: bool = False
    is_active: bool = True
    sort_order: int = 0

class TestimonialCreate(TestimonialBase):
    pass

class TestimonialUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    company: Optional[str] = None
    content: Optional[str] = None
    rating: Optional[int] = None
    image_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None

class Testimonial(TestimonialBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
