from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.contact_details import ContactDetails, ContactDetailsCreate, ContactDetailsUpdate, ContactDetailsOut
from app.schemas.user import User
from app.services.auth_service import AuthService
from app.utils.api_response import ok, created, error_response

router = APIRouter()

@router.get("/", response_model=List[ContactDetailsOut])
async def get_contact_details(
    db: Session = Depends(get_db)
):
    """Get all contact details"""
    from app.models.contact_details import ContactDetails as ContactDetailsModel
    
    contact_details = db.query(ContactDetailsModel).all()
    return ok(contact_details, message="Contact details retrieved.")

@router.get("/{contact_id}", response_model=ContactDetailsOut)
async def get_contact_detail(
    contact_id: int,
    db: Session = Depends(get_db)
):
    """Get specific contact detail by ID"""
    from app.models.contact_details import ContactDetails as ContactDetailsModel
    
    contact_detail = db.query(ContactDetailsModel).filter(
        ContactDetailsModel.id == contact_id
    ).first()
    
    if not contact_detail:
        return error_response(
            status=404,
            code="CONTACT_DETAIL_NOT_FOUND",
            description="Contact detail not found",
            message="The requested contact detail does not exist."
        )
    
    return ok(contact_detail, message="Contact detail retrieved.")

@router.post("/", response_model=ContactDetailsOut)
async def create_contact_details(
    contact_data: ContactDetailsCreate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Create new contact details (Admin only)"""
    from app.models.contact_details import ContactDetails as ContactDetailsModel
    
    # Check if contact details already exist
    existing = db.query(ContactDetailsModel).first()
    if existing:
        return error_response(
            status=400,
            code="CONTACT_DETAILS_ALREADY_EXIST",
            description="Contact details already exist",
            message="Contact details already exist. Use PUT to update."
        )
    
    contact_details = ContactDetailsModel(**contact_data.dict())
    db.add(contact_details)
    db.commit()
    db.refresh(contact_details)
    
    return created(contact_details, message="Contact details created.")

@router.put("/{contact_id}", response_model=ContactDetailsOut)
async def update_contact_details(
    contact_id: int,
    contact_data: ContactDetailsUpdate,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Update contact details (Admin only)"""
    from app.models.contact_details import ContactDetails as ContactDetailsModel
    
    contact_details = db.query(ContactDetailsModel).filter(
        ContactDetailsModel.id == contact_id
    ).first()
    
    if not contact_details:
        return error_response(
            status=404,
            code="CONTACT_DETAILS_NOT_FOUND",
            description="Contact details not found",
            message="The requested contact details do not exist."
        )
    
    update_data = contact_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(contact_details, field, value)
    
    db.commit()
    db.refresh(contact_details)
    
    return ok(contact_details, message="Contact details updated.")

@router.delete("/{contact_id}")
async def delete_contact_details(
    contact_id: int,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Delete contact details (Admin only)"""
    from app.models.contact_details import ContactDetails as ContactDetailsModel
    
    contact_details = db.query(ContactDetailsModel).filter(
        ContactDetailsModel.id == contact_id
    ).first()
    
    if not contact_details:
        return error_response(
            status=404,
            code="CONTACT_DETAILS_NOT_FOUND",
            description="Contact details not found",
            message="The requested contact details do not exist."
        )
    
    db.delete(contact_details)
    db.commit()
    
    return ok(message="Contact details deleted.")
