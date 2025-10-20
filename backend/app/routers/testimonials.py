from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import Testimonial as TestimonialSchema, TestimonialCreate, TestimonialUpdate
from app.services.auth_service import get_current_admin_user
from app.models.user import User
from app.utils.api_response import ok, created, error_response

router = APIRouter()

@router.get("/")
def get_testimonials(
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """Get all testimonials"""
    query = db.query(Testimonial)
    if active_only:
        query = query.filter(Testimonial.is_active == True)
    
    testimonials = query.order_by(Testimonial.sort_order, Testimonial.created_at.desc()).offset(skip).limit(limit).all()
    return ok(testimonials, message="Testimonials retrieved.")

@router.get("/featured")
def get_featured_testimonials(
    limit: int = 6,
    db: Session = Depends(get_db)
):
    """Get featured testimonials for homepage"""
    testimonials = db.query(Testimonial).filter(
        Testimonial.is_active == True,
        Testimonial.is_featured == True
    ).order_by(Testimonial.sort_order, Testimonial.created_at.desc()).limit(limit).all()
    return ok(testimonials, message="Featured testimonials retrieved.")

@router.get("/{testimonial_id}")
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific testimonial"""
    testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not testimonial:
        return error_response(
            status=404,
            code="TESTIMONIAL_NOT_FOUND",
            description="Testimonial not found",
            message="The requested testimonial does not exist."
        )
    return ok(testimonial, message="Testimonial details retrieved.")

@router.post("/")
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new testimonial (admin only)"""
    db_testimonial = Testimonial(**testimonial.dict())
    db.add(db_testimonial)
    db.commit()
    db.refresh(db_testimonial)
    return created(db_testimonial, message="Testimonial created.")

@router.put("/{testimonial_id}")
def update_testimonial(
    testimonial_id: int,
    testimonial: TestimonialUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a testimonial (admin only)"""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        return error_response(
            status=404,
            code="TESTIMONIAL_NOT_FOUND",
            description="Testimonial not found",
            message="The requested testimonial does not exist."
        )

    update_data = testimonial.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_testimonial, field, value)

    db.commit()
    db.refresh(db_testimonial)
    return ok(db_testimonial, message="Testimonial updated.")

@router.delete("/{testimonial_id}")
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a testimonial (admin only)"""
    db_testimonial = db.query(Testimonial).filter(Testimonial.id == testimonial_id).first()
    if not db_testimonial:
        return error_response(
            status=404,
            code="TESTIMONIAL_NOT_FOUND",
            description="Testimonial not found",
            message="The requested testimonial does not exist."
        )
    
    db.delete(db_testimonial)
    db.commit()
    return ok(message="Testimonial deleted.")
