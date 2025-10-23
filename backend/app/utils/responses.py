"""
Standardized API response utilities
"""

from typing import Any, Optional, Dict, List
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel


class APIResponse(BaseModel):
    """Standard API response model"""
    success: bool
    message: str
    data: Optional[Any] = None
    errors: Optional[List[str]] = None
    meta: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """Standard error response model"""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Dict[str, Any]] = None


def success_response(
    data: Any = None,
    message: str = "Operation completed successfully",
    meta: Optional[Dict[str, Any]] = None
) -> APIResponse:
    """Create a standardized success response"""
    return APIResponse(
        success=True,
        message=message,
        data=data,
        meta=meta
    )


def error_response(
    message: str,
    status_code: int = status.HTTP_400_BAD_REQUEST,
    error_code: Optional[str] = None,
    details: Optional[Dict[str, Any]] = None
) -> HTTPException:
    """Create a standardized error response"""
    error_data = ErrorResponse(
        message=message,
        error_code=error_code,
        details=details
    )
    
    raise HTTPException(
        status_code=status_code,
        detail=error_data.dict()
    )


def validation_error_response(
    message: str = "Validation failed",
    errors: List[str] = None
) -> HTTPException:
    """Create a validation error response"""
    return error_response(
        message=message,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_code="VALIDATION_ERROR",
        details={"validation_errors": errors or []}
    )


def not_found_response(
    resource: str = "Resource"
) -> HTTPException:
    """Create a not found error response"""
    return error_response(
        message=f"{resource} not found",
        status_code=status.HTTP_404_NOT_FOUND,
        error_code="NOT_FOUND"
    )


def unauthorized_response(
    message: str = "Authentication required"
) -> HTTPException:
    """Create an unauthorized error response"""
    return error_response(
        message=message,
        status_code=status.HTTP_401_UNAUTHORIZED,
        error_code="UNAUTHORIZED"
    )


def forbidden_response(
    message: str = "Access denied"
) -> HTTPException:
    """Create a forbidden error response"""
    return error_response(
        message=message,
        status_code=status.HTTP_403_FORBIDDEN,
        error_code="FORBIDDEN"
    )


def server_error_response(
    message: str = "Internal server error occurred"
) -> HTTPException:
    """Create a server error response"""
    return error_response(
        message=message,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code="INTERNAL_ERROR"
    )


def file_upload_error_response(
    message: str = "File upload failed"
) -> HTTPException:
    """Create a file upload error response"""
    return error_response(
        message=message,
        status_code=status.HTTP_400_BAD_REQUEST,
        error_code="FILE_UPLOAD_ERROR"
    )
