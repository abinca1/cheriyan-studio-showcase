from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ImageBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_featured: bool = False
    is_public: bool = True
    is_hero_image: bool = False
    is_profile_picture: bool = False
    category_id: Optional[int] = None
    is_thumbnail: bool = False

class ImageCreate(ImageBase):
    pass

class ImageUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None
    is_public: Optional[bool] = None
    is_hero_image: Optional[bool] = None
    is_profile_picture: Optional[bool] = None
    category_id: Optional[int] = None
    is_thumbnail: Optional[bool] = None

class ImageInDBBase(ImageBase):
    id: int
    filename: str
    file_path: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Image(ImageInDBBase):
    pass

class ImageWithOwner(ImageInDBBase):
    owner: Optional[dict] = None

class ImageWithCategory(ImageInDBBase):
    category_obj: Optional[dict] = None

class ImageOut(ImageBase):
    id: int
    filename: str
    file_path: str
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    is_thumbnail: bool = False
    is_profile_picture: bool = False

    class Config:
        orm_mode = True