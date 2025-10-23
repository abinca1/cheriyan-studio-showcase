from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class BusinessHoursBase(BaseModel):
    day_of_week: str
    is_open: bool = True
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    is_by_appointment: bool = False
    notes: Optional[str] = None

class BusinessHoursCreate(BusinessHoursBase):
    pass

class BusinessHoursUpdate(BaseModel):
    day_of_week: Optional[str] = None
    is_open: Optional[bool] = None
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    is_by_appointment: Optional[bool] = None
    notes: Optional[str] = None

class BusinessHoursInDBBase(BusinessHoursBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class BusinessHours(BusinessHoursInDBBase):
    pass

class BusinessHoursOut(BusinessHoursBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
