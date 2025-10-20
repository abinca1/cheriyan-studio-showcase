from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.db.base import Base

class BusinessHours(Base):
    __tablename__ = "business_hours"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String, nullable=False, unique=True)  # Monday, Tuesday, etc.
    is_open = Column(Boolean, default=True)
    open_time = Column(String)  # Format: "09:00"
    close_time = Column(String)  # Format: "18:00"
    is_by_appointment = Column(Boolean, default=False)  # For "By Appointment Only"
    notes = Column(String)  # Additional notes like "By Appointment Only"
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
