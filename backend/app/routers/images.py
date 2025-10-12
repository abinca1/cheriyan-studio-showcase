from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.image import Image, ImageCreate, ImageUpdate
from app.schemas.user import User
from app.services.auth_service import AuthService
from app.services.image_service import ImageService

router = APIRouter()

@router.get("/", response_model=List[Image])
async def get_images(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    is_featured: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all public images with optional filtering"""
    image_service = ImageService(db)
    return await image_service.get_images(
        skip=skip, 
        limit=limit, 
        category=category, 
        is_featured=is_featured,
        public_only=True
    )

@router.get("/my-images", response_model=List[Image])
async def get_my_images(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's images"""
    image_service = ImageService(db)
    return await image_service.get_user_images(current_user.id, skip=skip, limit=limit)

@router.get("/{image_id}", response_model=Image)
async def get_image(
    image_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific image by ID"""
    image_service = ImageService(db)
    return await image_service.get_image(image_id)

@router.post("/", response_model=Image)
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    is_public: bool = Form(True),
    is_hero_image: bool = Form(False),
    category_id: Optional[int] = Form(None),
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Upload a new image"""
    image_service = ImageService(db)
    image_data = ImageCreate(
        title=title,
        description=description,
        category=category,
        tags=tags,
        is_featured=is_featured,
        is_public=is_public,
        is_hero_image=is_hero_image,
        category_id=category_id
    )
    return await image_service.create_image(image_data, file, current_user.id)

@router.put("/{image_id}", response_model=Image)
async def update_image(
    image_id: int,
    image_data: ImageUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update an image"""
    image_service = ImageService(db)
    return await image_service.update_image(image_id, image_data, current_user.id)

@router.delete("/{image_id}")
async def delete_image(
    image_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an image"""
    image_service = ImageService(db)
    await image_service.delete_image(image_id, current_user.id)
    return {"message": "Image deleted successfully"}
