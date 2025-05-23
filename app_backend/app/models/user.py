from sqlalchemy import Column, String,ForeignKey, Boolean, DateTime, func, JSON
from sqlalchemy.orm import relationship
from app_backend.app.db.base import Base
class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True) 
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    auth0_metadata = Column(JSON, nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    cv_summaries = relationship("CVSummary", back_populates="user")

class CVSummary(Base):
    __tablename__ = "cv_summaries"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    summary = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="cv_summaries")