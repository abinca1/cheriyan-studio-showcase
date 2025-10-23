from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.models.social_media import SocialMedia
from app.schemas.social_media import SocialMedia as SocialMediaSchema, SocialMediaCreate, SocialMediaUpdate
from app.services.auth_service import get_current_admin_user
from app.models.user import User
from app.utils.api_response import ok, created, error_response

router = APIRouter()

@router.get("/")
def get_social_media_links(
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all social media links"""
    query = db.query(SocialMedia)
    if active_only:
        query = query.filter(SocialMedia.is_active == True)
    
    links = query.order_by(SocialMedia.sort_order).all()
    return ok(links, message="Social media links retrieved.")

@router.get("/{social_media_id}")
def get_social_media_link(
    social_media_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific social media link"""
    social_media = db.query(SocialMedia).filter(SocialMedia.id == social_media_id).first()
    if not social_media:
        return error_response(
            status=404,
            code="SOCIAL_MEDIA_LINK_NOT_FOUND",
            description="Social media link not found",
            message="The requested social media link does not exist."
        )
    return ok(social_media, message="Social media link details retrieved.")

@router.post("/")
def create_social_media_link(
    social_media: SocialMediaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new social media link (admin only)"""
    db_social_media = SocialMedia(**social_media.dict())
    db.add(db_social_media)
    db.commit()
    db.refresh(db_social_media)
    return created(db_social_media, message="Social media link created.")

@router.put("/{social_media_id}")
def update_social_media_link(
    social_media_id: int,
    social_media_update: SocialMediaUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a social media link (admin only)"""
    db_social_media = db.query(SocialMedia).filter(SocialMedia.id == social_media_id).first()
    if not db_social_media:
        return error_response(
            status=404,
            code="SOCIAL_MEDIA_LINK_NOT_FOUND",
            description="Social media link not found",
            message="The requested social media link does not exist."
        )
    
    update_data = social_media_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_social_media, field, value)
    
    db.commit()
    db.refresh(db_social_media)
    return ok(db_social_media, message="Social media link updated.")

@router.delete("/{social_media_id}")
def delete_social_media_link(
    social_media_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a social media link (admin only)"""
    db_social_media = db.query(SocialMedia).filter(SocialMedia.id == social_media_id).first()
    if not db_social_media:
        return error_response(
            status=404,
            code="SOCIAL_MEDIA_LINK_NOT_FOUND",
            description="Social media link not found",
            message="The requested social media link does not exist."
        )
    
    db.delete(db_social_media)
    db.commit()
    return ok(message="Social media link deleted.")
