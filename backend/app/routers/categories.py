from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.category import Category
from app.schemas.category import Category as CategorySchema, CategoryCreate, CategoryUpdate
from app.services.auth_service import get_current_admin_user
from app.models.user import User
from app.utils.api_response import ok, created, error_response

router = APIRouter()

@router.get("/")
def get_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all categories (public endpoint)"""
    categories = db.query(Category).filter(Category.is_active == True).offset(skip).limit(limit).all()
    return ok(categories, message="Categories retrieved successfully.")

@router.get("/{category_id}")
def get_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific category"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        return error_response(
            status=404,
            code="CATEGORY_NOT_FOUND",
            description="Category not found",
            message="The requested category does not exist."
        )
    return ok(category, message="Category details retrieved successfully.")

@router.post("/")
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Create a new category (admin only)"""
    # Check if category with same name or slug exists
    existing = db.query(Category).filter(
        (Category.name == category.name) | (Category.slug == category.slug)
    ).first()
    if existing:
        return error_response(
            status=400,
            code="CATEGORY_ALREADY_EXISTS",
            description="Category with this name or slug already exists",
            message="A category with this name or slug already exists."
        )
    
    db_category = Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return created(db_category, message="Category created successfully.")

@router.put("/{category_id}")
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update a category (admin only)"""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        return error_response(
            status=404,
            code="CATEGORY_NOT_FOUND",
            description="Category not found",
            message="The requested category does not exist."
        )

    update_data = category.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_category, field, value)

    db.commit()
    db.refresh(db_category)
    return ok(db_category, message="Category updated successfully.")

@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete a category (admin only)"""
    db_category = db.query(Category).filter(Category.id == category_id).first()
    if not db_category:
        return error_response(
            status=404,
            code="CATEGORY_NOT_FOUND",
            description="Category not found",
            message="The requested category does not exist."
        )
    
    db.delete(db_category)
    db.commit()
    return ok(message="Category deleted successfully.")
