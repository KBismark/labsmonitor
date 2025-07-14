from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List
from datetime import datetime, timezone
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
    rememberMe: Optional[bool] = False

class UserResponse(UserBase):
    id: UUID
    role: str
    isActive: bool
    emailVerified: bool
    createdAt: datetime
    
    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds until access token expires

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    reset_code: str
    new_password: str

class EmailVerificationRequest(BaseModel):
    email: EmailStr
    code: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class TestRecordBase(BaseModel):
    testCategory: str = Field(..., min_length=1, max_length=50, description="Test category (e.g., 'CBC', 'KFT', 'LFT')")
    testType: str = Field(..., min_length=1, max_length=100, description="Test type (e.g., 'RBC', 'HB', 'PLATELETS')")
    testValue: float = Field(..., gt=0, description="Test value (must be positive)")
    unit: str = Field(..., min_length=1, max_length=20, description="Unit of measurement")
    minRange: Optional[float] = Field(None, ge=0, description="Minimum reference range")
    maxRange: Optional[float] = Field(None, ge=0, description="Maximum reference range")
    testDate: datetime = Field(..., description="Date when the test was performed")
    notes: Optional[str] = Field(None, max_length=1000, description="Optional notes about the test")

    @validator('testCategory', 'testType', 'unit')
    def validate_string_fields(cls, v):
        if not v or not v.strip():
            raise ValueError('Field cannot be empty or contain only whitespace')
        return v.strip()

    @validator('testDate')
    def validate_test_date(cls, v):
        # Always convert to UTC and make timezone-aware for comparison
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)
        now = datetime.now(timezone.utc)
        if v > now:
            raise ValueError('Test date cannot be in the future')
        return v

    @validator('maxRange')
    def validate_ranges(cls, v, values):
        if v is not None and 'minRange' in values and values['minRange'] is not None:
            if v <= values['minRange']:
                raise ValueError('Maximum range must be greater than minimum range')
        return v

    @validator('testValue')
    def validate_test_value(cls, v):
        # Only validate that the value is positive, not that it's within ranges
        # Reference ranges are for comparison, not restriction
        return v

class TestRecordCreate(TestRecordBase):
    pass

class TestRecordResponse(TestRecordBase):
    id: UUID
    userId: UUID
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        orm_mode = True

class TestRecordBulkCreate(BaseModel):
    records: List[TestRecordCreate] = Field(..., min_items=1, max_items=100, description="List of test records to create")

    @validator('records')
    def validate_records_list(cls, v):
        if not v:
            raise ValueError('At least one test record is required')
        if len(v) > 100:
            raise ValueError('Cannot create more than 100 test records at once')
        return v

class TestPanelBase(BaseModel):
    name: str
    displayName: str
    description: Optional[str] = None
    tests: str  # JSON string of test names
    isActive: bool = True

class TestPanelCreate(TestPanelBase):
    pass

class TestPanelResponse(TestPanelBase):
    id: UUID
    createdAt: datetime
    updatedAt: datetime
    
    class Config:
        orm_mode = True