from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.db.base import Base

class SocialMedia(Base):
    __tablename__ = "social_media"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, nullable=False)  # whatsapp, instagram, facebook, etc.
    url = Column(String, nullable=False)
    icon_name = Column(String, nullable=False)  # lucide icon name
    display_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
