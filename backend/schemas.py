from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID

class UserBase(BaseModel):
    email: EmailStr
    firstName: str
    lastName: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: UUID
    role: str
    isActive: bool
    emailVerified: bool
    createdAt: datetime
    
    class Config:
        orm_mode = True

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class TestRecordBase(BaseModel):
    testType: str
    value: float
    unit: str
    minRange: Optional[float] = None
    maxRange: Optional[float] = None
    date: datetime

class TestRecordCreate(TestRecordBase):
    pass

class TestRecordResponse(TestRecordBase):
    id: UUID
    createdAt: datetime
    
    class Config:
        orm_mode = True

class TestPanelBase(BaseModel):
    name: str
    description: Optional[str] = None
    tests: str

class TestPanelCreate(TestPanelBase):
    pass

class TestPanelResponse(TestPanelBase):
    id: UUID
    createdAt: datetime
    
    class Config:
        orm_mode = True