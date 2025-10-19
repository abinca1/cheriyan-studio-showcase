from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.base import Base

class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer)
    mime_type = Column(String)
    category = Column(String)  # Keep for backward compatibility
    tags = Column(String)  # JSON string or comma-separated
    is_featured = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    is_thumbnail = Column(Boolean, default=False)
    is_hero_image = Column(Boolean, default=False)  # New field for hero section
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))

    # Relationships
    owner = relationship("User", back_populates="images")
    category_obj = relationship("Category", back_populates="images")
