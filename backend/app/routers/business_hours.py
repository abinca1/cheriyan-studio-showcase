from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.business_hours import BusinessHours, BusinessHoursCreate, BusinessHoursUpdate, BusinessHoursOut
from app.schemas.user import User
from app.services.auth_service import AuthService
from app.utils.api_response import ok, created

router = APIRouter()

@router.get("/", response_model=List[BusinessHoursOut])
async def get_business_hours(
    db: Session = Depends(get_db)
):
    """Get all business hours"""
    from app.models.business_hours import BusinessHours as BusinessHoursModel
    
    business_hours = db.query(BusinessHoursModel).all()
    return ok(business_hours, message="Business hours retrieved.")

@router.get("/{day_of_week}", response_model=BusinessHoursOut)
async def get_business_hours_by_day(
    day_of_week: str,
    db: Session = Depends(get_db)
):
    """Get business hours for a specific day"""
    from app.models.business_hours import BusinessHours as BusinessHoursModel
    
    business_hours = db.query(BusinessHoursModel).filter(
        BusinessHoursModel.day_of_week == day_of_week
    ).first()
    
    if not business_hours:
        raise HTTPException(status_code=404, detail="Business hours not found for this day")
    
    return ok(business_hours, message="Business hours retrieved.")

@router.post("/", response_model=BusinessHoursOut)
async def create_business_hours(
    business_hours_data: BusinessHoursCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Create new business hours (Admin only)"""
    from app.models.business_hours import BusinessHours as BusinessHoursModel
    
    # Check if business hours for this day already exist
    existing = db.query(BusinessHoursModel).filter(
        BusinessHoursModel.day_of_week == business_hours_data.day_of_week
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=400, 
            detail="Business hours for this day already exist. Use PUT to update."
        )
    
    business_hours = BusinessHoursModel(**business_hours_data.dict())
    db.add(business_hours)
    db.commit()
    db.refresh(business_hours)
    
    return created(business_hours, message="Business hours created.")

@router.put("/{day_of_week}", response_model=BusinessHoursOut)
async def update_business_hours(
    day_of_week: str,
    business_hours_data: BusinessHoursUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update business hours for a specific day (Admin only)"""
    from app.models.business_hours import BusinessHours as BusinessHoursModel
    
    business_hours = db.query(BusinessHoursModel).filter(
        BusinessHoursModel.day_of_week == day_of_week
    ).first()
    
    if not business_hours:
        raise HTTPException(status_code=404, detail="Business hours not found for this day")
    
    update_data = business_hours_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(business_hours, field, value)
    
    db.commit()
    db.refresh(business_hours)
    
    return ok(business_hours, message="Business hours updated.")

@router.delete("/{day_of_week}")
async def delete_business_hours(
    day_of_week: str,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete business hours for a specific day (Admin only)"""
    from app.models.business_hours import BusinessHours as BusinessHoursModel
    
    business_hours = db.query(BusinessHoursModel).filter(
        BusinessHoursModel.day_of_week == day_of_week
    ).first()
    
    if not business_hours:
        raise HTTPException(status_code=404, detail="Business hours not found for this day")
    
    db.delete(business_hours)
    db.commit()
    
    return ok(message="Business hours deleted.")
