from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

class ContactDetailsBase(BaseModel):
    email: EmailStr
    phone: str
    address: str

class ContactDetailsCreate(ContactDetailsBase):
    pass

class ContactDetailsUpdate(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class ContactDetailsInDBBase(ContactDetailsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class ContactDetails(ContactDetailsInDBBase):
    pass

class ContactDetailsOut(ContactDetailsBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
