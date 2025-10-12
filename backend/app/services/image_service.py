import os
import uuid
from typing import List, Optional
from fastapi import HTTPException, status, UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageUpdate
from app.utils.files import save_upload_file, delete_file, validate_file

class ImageService:
    def __init__(self, db: Session):
        self.db = db
    
    async def get_images(
        self, 
        skip: int = 0, 
        limit: int = 100, 
        category: Optional[str] = None,
        is_featured: Optional[bool] = None,
        public_only: bool = True
    ) -> List[Image]:
        query = self.db.query(Image)
        
        if public_only:
            query = query.filter(Image.is_public == True)
        
        if category:
            query = query.filter(Image.category == category)
        
        if is_featured is not None:
            query = query.filter(Image.is_featured == is_featured)
        
        return query.offset(skip).limit(limit).all()
    
    async def get_user_images(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Image]:
        return self.db.query(Image).filter(
            Image.owner_id == user_id
        ).offset(skip).limit(limit).all()
    
    async def get_image(self, image_id: int) -> Image:
        image = self.db.query(Image).filter(Image.id == image_id).first()
        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Image not found"
            )
        return image
    
    async def create_image(
        self, 
        image_data: ImageCreate, 
        file: UploadFile, 
        user_id: int
    ) -> Image:
        # Validate file
        validate_file(file)
        
        # Generate unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        
        # Save file
        file_path = await save_upload_file(file, unique_filename)

        # Get category name if category_id is provided
        category_name = image_data.category
        if image_data.category_id and not category_name:
            from app.models.category import Category
            category = self.db.query(Category).filter(Category.id == image_data.category_id).first()
            if category:
                category_name = category.name

        # Create database record
        db_image = Image(
            title=image_data.title,
            description=image_data.description,
            filename=unique_filename,
            file_path=file_path,
            file_size=file.size,
            mime_type=file.content_type,
            category=category_name,
            tags=image_data.tags,
            is_featured=image_data.is_featured,
            is_public=image_data.is_public,
            is_hero_image=image_data.is_hero_image,
            category_id=image_data.category_id,
            owner_id=user_id
        )
        
        self.db.add(db_image)
        self.db.commit()
        self.db.refresh(db_image)
        return db_image
    
    async def update_image(
        self, 
        image_id: int, 
        image_data: ImageUpdate, 
        user_id: int
    ) -> Image:
        image = await self.get_image(image_id)
        
        # Check ownership
        if image.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        
        # Update fields
        update_data = image_data.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(image, field, value)

        # Update category name if category_id changed
        if 'category_id' in update_data and update_data['category_id']:
            from app.models.category import Category
            category = self.db.query(Category).filter(Category.id == update_data['category_id']).first()
            if category:
                image.category = category.name
        elif 'category_id' in update_data and update_data['category_id'] is None:
            image.category = None

        self.db.commit()
        self.db.refresh(image)
        return image
    
    async def delete_image(self, image_id: int, user_id: int):
        image = await self.get_image(image_id)
        
        # Check ownership
        if image.owner_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        
        # Delete file from filesystem
        try:
            delete_file(image.file_path)
        except Exception as e:
            # Log error but don't fail the deletion
            print(f"Error deleting file {image.file_path}: {e}")
        
        # Delete from database
        self.db.delete(image)
        self.db.commit()
