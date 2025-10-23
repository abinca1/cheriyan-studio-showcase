from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base

class HeroSlide(Base):
    __tablename__ = "hero_slides"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    subtitle = Column(String)
    description = Column(Text)
    button_text = Column(String)
    button_link = Column(String)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    image_id = Column(Integer, ForeignKey("images.id"))
    
    # Relationships
    image = relationship("Image", backref="hero_slides")
