from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.image import Image, ImageOut, ImageCreate, ImageUpdate
from app.schemas.user import User
from app.services.auth_service import AuthService
from app.services.image_service import ImageService
from app.utils.api_response import ok, created, error_response

router = APIRouter()

@router.get("/")
async def get_images(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    is_featured: Optional[bool] = None,
    is_thumbnail: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all public images with optional filtering"""
    image_service = ImageService(db)
    images = await image_service.get_images(
        skip=skip, 
        limit=limit, 
        category=category, 
        is_featured=is_featured,
        is_thumbnail=is_thumbnail,
        public_only=True
    )
    images_out = [ImageOut.from_orm(img) for img in images]

    return ok(images_out, message="Images retrieved.")

@router.get("/my-images")
async def get_my_images(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's images"""
    image_service = ImageService(db)
    images = await image_service.get_user_images(current_user.id, skip=skip, limit=limit)
    return ok(images, message="Your images retrieved.")

@router.get("/{image_id}")
async def get_image(
    image_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific image by ID"""
    image_service = ImageService(db)
    image = await image_service.get_image(image_id)
    if not image:
        return error_response(
            status=404,
            code="IMAGE_NOT_FOUND",
            description="Image not found",
            message="The requested image does not exist."
        )

    # Convert to ImageOut schema (includes is_thumbnail)
    from app.schemas.image import ImageOut
    return ok(ImageOut.from_orm(image), message="Image details retrieved.")

@router.post("/")
async def upload_image(
    file: UploadFile = File(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    category: Optional[str] = Form(None),
    tags: Optional[str] = Form(None),
    is_featured: bool = Form(False),
    is_public: bool = Form(True),
    is_hero_image: bool = Form(False),
    is_profile_picture: bool = Form(False),
    is_thumbnail: bool = Form(False),
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
        is_profile_picture=is_profile_picture,
        category_id=category_id,
        is_thumbnail=is_thumbnail
    )
    image = await image_service.create_image(image_data, file, current_user.id)
    return created(image, message="Image uploaded.")

@router.put("/{image_id}")
async def update_image(
    image_id: int,
    image_data: ImageUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update an image"""
    image_service = ImageService(db)
    image = await image_service.update_image(image_id, image_data, current_user.id)
    return ok(image, message="Image updated.")

@router.delete("/{image_id}")
async def delete_image(
    image_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete an image"""
    image_service = ImageService(db)
    await image_service.delete_image(image_id, current_user.id)
    return ok(message="Image deleted.")
