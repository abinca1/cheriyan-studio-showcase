from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.hero_slide import HeroSlide
from app.models.image import Image
from app.schemas.hero_slide import HeroSlide as HeroSlideSchema, HeroSlideCreate, HeroSlideUpdate
from app.services.auth_service import get_current_admin_user
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[HeroSlideSchema])
def get_hero_slides(
    skip: int = 0,
    limit: int = 10,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all hero slides"""
    query = db.query(HeroSlide)
    if active_only:
        query = query.filter(HeroSlide.is_active == True)
    
    slides = query.order_by(HeroSlide.sort_order, HeroSlide.created_at.desc()).offset(skip).limit(limit).all()
    return slides

@router.get("/{slide_id}", response_model=HeroSlideSchema)
def get_hero_slide(
    slide_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific hero slide"""
    slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    return slide

@router.post("/", response_model=HeroSlideSchema)
def create_hero_slide(
    slide: HeroSlideCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new hero slide (admin only)"""
    # Verify that the image exists
    image = db.query(Image).filter(Image.id == slide.image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")

    db_slide = HeroSlide(**slide.dict())
    db.add(db_slide)
    db.commit()
    db.refresh(db_slide)
    return db_slide

@router.put("/{slide_id}", response_model=HeroSlideSchema)
def update_hero_slide(
    slide_id: int,
    slide: HeroSlideUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a hero slide (admin only)"""
    db_slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")

    update_data = slide.dict(exclude_unset=True)

    # Verify image exists if image_id is being updated
    if 'image_id' in update_data:
        image = db.query(Image).filter(Image.id == update_data['image_id']).first()
        if not image:
            raise HTTPException(status_code=404, detail="Image not found")

    for field, value in update_data.items():
        setattr(db_slide, field, value)

    db.commit()
    db.refresh(db_slide)
    return db_slide

@router.delete("/{slide_id}")
def delete_hero_slide(
    slide_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a hero slide (admin only)"""
    db_slide = db.query(HeroSlide).filter(HeroSlide.id == slide_id).first()
    if not db_slide:
        raise HTTPException(status_code=404, detail="Hero slide not found")
    
    db.delete(db_slide)
    db.commit()
    return {"message": "Hero slide deleted successfully"}
