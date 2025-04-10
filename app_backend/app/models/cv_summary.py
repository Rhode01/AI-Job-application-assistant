from sqlalchemy import Column, String, ForeignKey, DateTime, JSON, func
from sqlalchemy.orm import relationship
from app_backend.app.db.base import Base

class CVSummary(Base):
    __tablename__ = "cv_summaries"
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("users.id"))
    summary = Column(JSON)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="cv_summaries")