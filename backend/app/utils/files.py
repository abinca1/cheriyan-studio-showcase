import os
import aiofiles
from typing import Optional
from fastapi import HTTPException, status, UploadFile

from app.core.config import settings

async def save_upload_file(file: UploadFile, filename: str) -> str:
    """Save uploaded file to the upload directory"""
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    file_path = os.path.join(settings.UPLOAD_DIR, filename)
    
    try:
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving file: {str(e)}"
        )
    
    # Return path without 'app/' prefix for serving
    # Remove 'app/' from the beginning of the path if it exists
    relative_path = file_path
    if file_path.startswith('app/'):
        relative_path = file_path[4:]  # Remove 'app/' prefix
    
    return relative_path

def delete_file(file_path: str) -> bool:
    """Delete a file from the filesystem"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        raise Exception(f"Error deleting file: {str(e)}")

def validate_file(file: UploadFile) -> bool:
    """Validate uploaded file"""
    # Check file size
    if file.size and file.size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds maximum allowed size of {settings.MAX_FILE_SIZE} bytes"
        )
    
    # Check file extension
    if file.filename:
        file_extension = os.path.splitext(file.filename)[1].lower()
        if file_extension not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed types: {', '.join(settings.ALLOWED_EXTENSIONS)}"
            )
    
    return True

def get_file_info(file_path: str) -> Optional[dict]:
    """Get file information"""
    if not os.path.exists(file_path):
        return None
    
    stat = os.stat(file_path)
    return {
        "size": stat.st_size,
        "created": stat.st_ctime,
        "modified": stat.st_mtime
    }
