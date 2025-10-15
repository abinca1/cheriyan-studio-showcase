from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.schemas.auth import Token, LoginRequest, RefreshTokenRequest, PasswordChangeRequest
from app.schemas.user import User, UserCreate
from app.services.auth_service import AuthService
from app.utils.api_response import ok, created, error_response

router = APIRouter()

@router.post("/register")
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    auth_service = AuthService(db)
    user = await auth_service.register_user(user_data)
    # Return sanitized schema and a readable message
    return created(User.from_orm(user), message=f"User account created for {user.username}.")

@router.post("/login")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    """Login user and return access and refresh tokens"""
    auth_service = AuthService(db)
    token = await auth_service.login_user(form_data.username, form_data.password)
    return ok(token, message="Authentication successful.")

@router.post("/refresh")
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    auth_service = AuthService(db)
    token = await auth_service.refresh_access_token(refresh_data.refresh_token)
    return ok(token, message="Access token refreshed.")

@router.post("/logout")
async def logout(
    refresh_data: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Logout user by revoking refresh token"""
    auth_service = AuthService(db)
    await auth_service.logout_user(refresh_data.refresh_token)
    return ok(message="Signed out and refresh token revoked.")

@router.get("/me")
async def get_current_user(
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user information"""
    return ok(current_user, message="Authenticated user profile retrieved.")

@router.post("/change-password")
async def change_password(
    password_data: PasswordChangeRequest,
    current_user: User = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    """Change user password"""
    auth_service = AuthService(db)
    await auth_service.change_password(
        current_user.id, 
        password_data.current_password, 
        password_data.new_password
    )
    return ok(message="Password updated.")
