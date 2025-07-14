from sqlalchemy import Column, String, Float, DateTime, ForeignKey, Boolean, Integer, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    role = Column(String, default="patient")  # patient, doctor, admin
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    email_verification_code = Column(String, nullable=True)
    email_verification_expires = Column(DateTime, nullable=True)
    password_reset_code = Column(String, nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    test_records = relationship("TestRecord", back_populates="user", cascade="all, delete-orphan")

class TestRecord(Base):
    __tablename__ = "test_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    test_category = Column(String, nullable=False, index=True)  # e.g., 'CBC', 'KFT', 'LFT', etc.
    test_type = Column(String, nullable=False)  # e.g., 'RBC', 'HB', 'PLATELETS', etc.
    test_value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    min_range = Column(Float, nullable=True)
    max_range = Column(Float, nullable=True)
    test_date = Column(DateTime, nullable=False, index=True)
    notes = Column(Text, nullable=True)  # Optional notes for the test record
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="test_records")

class TestPanel(Base):
    __tablename__ = "test_panels"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, unique=True)
    display_name = Column(String, nullable=False)  # e.g., "Complete Blood Count" for "CBC"
    description = Column(Text, nullable=True)
    tests = Column(Text, nullable=False)  # JSON string of test names
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)