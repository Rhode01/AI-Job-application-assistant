from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, func, Enum, JSON, Index
from sqlalchemy.orm import relationship
import enum
from app.db.base import Base


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)  # Auth0 user ID
    email = Column(String, unique=True, nullable=False, index=True)
    first_name = Column(String)
    last_name = Column(String)
    is_active = Column(Boolean, default=True)
    auth0_metadata = Column(JSON, nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

