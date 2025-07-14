from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
import uvicorn
from sqlalchemy import text

from database import get_db, init_db
from models import User, TestRecord
from auth import get_current_user, create_access_token, create_refresh_token, verify_refresh_token, verify_password, hash_password
from schemas import UserCreate, UserLogin, TestRecordCreate, TestRecordResponse, TestRecordBulkCreate, EmailVerificationRequest, ResendVerificationRequest, TokenResponse, RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest
from email_service import send_verification_email, send_password_reset_email
import secrets
from datetime import datetime, timedelta

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database with retry mechanism
    try:
        await init_db()
        print("✅ Database initialized successfully")
    except Exception as e:
        print(f"❌ Failed to initialize database: {e}")
        raise
    yield

app = FastAPI(
    title="Medical Test Records API",
    description="API for managing medical test records",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

@app.get("/")
async def root():
    return {"message": "Medical Test Records API"}

# Authentication endpoints
@app.post("/api/auth/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    try:
        # Check if user already exists
        existing_user = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": user_data.email}
        )
        if existing_user.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Generate verification code
        verification_code = ''.join(secrets.choice('0123456789') for _ in range(6))
        verification_expires = datetime.utcnow() + timedelta(minutes=10)
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.firstName,
            last_name=user_data.lastName,
            role="patient",
            email_verified=False,
            email_verification_code=verification_code,
            email_verification_expires=verification_expires
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Send verification email
        try:
            await send_verification_email(user_data.email, verification_code, user_data.firstName)
        except Exception as email_error:
            print(f"Email sending error: {email_error}")
            # Continue with registration even if email fails
        
        return {
            "message": "Registration successful. Please check your email for verification code.",
            "email": user_data.email,
            "requiresVerification": True
        }
        
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login", response_model=TokenResponse)
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login user"""
    try:
        # Find user by email
        result = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": user_credentials.email}
        )
        user_data = result.fetchone()
        
        if not user_data or not verify_password(user_credentials.password, user_data.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        # Check if email is verified
        if not user_data.email_verified:
            raise HTTPException(
                status_code=403,
                detail="Email not verified. Please verify your email before logging in."
            )
        
        # Create access token and refresh token
        access_token = create_access_token(data={"sub": user_data.email})
        refresh_token = create_refresh_token(
            data={"sub": user_data.email}, 
            remember_me=user_credentials.rememberMe or False
        )
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=30 * 60  # 30 minutes in seconds
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/verify-email")
async def verify_email(verification_data: EmailVerificationRequest, db: AsyncSession = Depends(get_db)):
    """Verify user email with verification code"""
    try:
        # Find user by email
        result = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": verification_data.email}
        )
        user_data = result.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        if user_data.email_verified:
            raise HTTPException(
                status_code=400,
                detail="Email already verified"
            )
        
        if user_data.email_verification_code != verification_data.code:
            raise HTTPException(
                status_code=400,
                detail="Invalid verification code"
            )
        
        if user_data.email_verification_expires < datetime.utcnow():
            raise HTTPException(
                status_code=400,
                detail="Verification code has expired"
            )
        
        # Update user to verified
        await db.execute(
            text("""
                UPDATE users 
                SET email_verified = true, 
                    email_verification_code = NULL, 
                    email_verification_expires = NULL,
                    updated_at = :updated_at
                WHERE email = :email
            """),
            {
                "email": verification_data.email,
                "updated_at": datetime.utcnow()
            }
        )
        await db.commit()
        
        # Create access token and refresh token
        access_token = create_access_token(data={"sub": user_data.email})
        refresh_token = create_refresh_token(data={"sub": user_data.email}, remember_me=False)
        
        return {
            "message": "Email verified successfully",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": str(user_data.id),
                "email": user_data.email,
                "firstName": user_data.first_name,
                "lastName": user_data.last_name,
                "role": user_data.role,
                "emailVerified": True
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Email verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/resend-verification")
async def resend_verification(resend_data: ResendVerificationRequest, db: AsyncSession = Depends(get_db)):
    """Resend verification email"""
    try:
        # Find user by email
        result = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": resend_data.email}
        )
        user_data = result.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        if user_data.email_verified:
            raise HTTPException(
                status_code=400,
                detail="Email already verified"
            )
        
        # Generate new verification code
        verification_code = ''.join(secrets.choice('0123456789') for _ in range(6))
        verification_expires = datetime.utcnow() + timedelta(minutes=10)
        
        # Update user with new verification code
        await db.execute(
            text("""
                UPDATE users 
                SET email_verification_code = :code, 
                    email_verification_expires = :expires,
                    updated_at = :updated_at
                WHERE email = :email
            """),
            {
                "email": resend_data.email,
                "code": verification_code,
                "expires": verification_expires,
                "updated_at": datetime.utcnow()
            }
        )
        await db.commit()
        
        # Send new verification email
        try:
            await send_verification_email(resend_data.email, verification_code, user_data.first_name)
        except Exception as email_error:
            print(f"Email sending error: {email_error}")
            raise HTTPException(
                status_code=500,
                detail="Failed to send verification email"
            )
        
        return {
            "message": "Verification code sent successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Resend verification error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/verify")
async def verify_token(current_user: User = Depends(get_current_user)):
    """Verify JWT token"""
    return {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "firstName": current_user.first_name,
            "lastName": current_user.last_name,
            "role": current_user.role,
            "emailVerified": bool(current_user.email_verified)
        }
    }

@app.post("/api/auth/refresh", response_model=TokenResponse)
async def refresh_token(refresh_data: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    """Refresh access token using refresh token"""
    try:
        # Verify refresh token
        payload = verify_refresh_token(refresh_data.refresh_token)
        email = payload.get("sub")
        
        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )
        
        # Check if user still exists and is active
        result = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": email}
        )
        user_data = result.fetchone()
        
        if not user_data or not user_data.is_active:
            raise HTTPException(
                status_code=401,
                detail="User not found or inactive"
            )
        
        # Create new access token
        access_token = create_access_token(data={"sub": email})
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_data.refresh_token,  # Return the same refresh token
            expires_in=30 * 60  # 30 minutes in seconds
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Token refresh error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/forgot-password")
async def forgot_password(forgot_data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Send password reset email"""
    try:
        # Find user by email
        result = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": forgot_data.email}
        )
        user_data = result.fetchone()
        
        if not user_data:
            # Don't reveal if user exists or not for security
            return {"message": "If an account with that email exists, a password reset code has been sent."}
        
        # Generate password reset code
        reset_code = ''.join(secrets.choice('0123456789') for _ in range(6))
        reset_expires = datetime.utcnow() + timedelta(minutes=10)
        
        # Update user with reset code
        await db.execute(
            text("""
                UPDATE users 
                SET password_reset_code = :code, 
                    password_reset_expires = :expires,
                    updated_at = :updated_at
                WHERE email = :email
            """),
            {
                "email": forgot_data.email,
                "code": reset_code,
                "expires": reset_expires,
                "updated_at": datetime.utcnow()
            }
        )
        await db.commit()
        
        # Send password reset email
        try:
            await send_password_reset_email(forgot_data.email, reset_code, user_data.first_name)
        except Exception as email_error:
            print(f"Password reset email sending error: {email_error}")
            raise HTTPException(
                status_code=500,
                detail="Failed to send password reset email"
            )
        
        return {"message": "If an account with that email exists, a password reset code has been sent."}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Forgot password error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/reset-password")
async def reset_password(reset_data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    """Reset password using reset code"""
    try:
        # Find user by email
        result = await db.execute(
            text("SELECT * FROM users WHERE email = :email"),
            {"email": reset_data.email}
        )
        user_data = result.fetchone()
        
        if not user_data:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        if user_data.password_reset_code != reset_data.reset_code:
            raise HTTPException(
                status_code=400,
                detail="Invalid reset code"
            )
        
        if user_data.password_reset_expires < datetime.utcnow():
            raise HTTPException(
                status_code=400,
                detail="Reset code has expired"
            )
        
        # Hash new password
        hashed_password = hash_password(reset_data.new_password)
        
        # Update user password and clear reset code
        await db.execute(
            text("""
                UPDATE users 
                SET hashed_password = :hashed_password, 
                    password_reset_code = NULL, 
                    password_reset_expires = NULL,
                    updated_at = :updated_at
                WHERE email = :email
            """),
            {
                "email": reset_data.email,
                "hashed_password": hashed_password,
                "updated_at": datetime.utcnow()
            }
        )
        await db.commit()
        
        return {"message": "Password reset successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Reset password error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Test record endpoints
@app.post("/api/test-records", response_model=TestRecordResponse)
async def create_test_record(
    record: TestRecordCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new test record"""
    try:
        # Convert timezone-aware datetime to naive datetime for database storage
        test_date_naive = record.testDate.replace(tzinfo=None) if record.testDate.tzinfo else record.testDate
        
        test_record = TestRecord(
            user_id=current_user.id,
            test_category=record.testCategory,
            test_type=record.testType,
            test_value=record.testValue,
            unit=record.unit,
            min_range=record.minRange,
            max_range=record.maxRange,
            test_date=test_date_naive,
            notes=record.notes
        )
        db.add(test_record)
        await db.commit()
        await db.refresh(test_record)
        return TestRecordResponse(
            id=test_record.id,
            userId=test_record.user_id,
            testCategory=test_record.test_category,
            testType=test_record.test_type,
            testValue=test_record.test_value,
            unit=test_record.unit,
            minRange=test_record.min_range,
            maxRange=test_record.max_range,
            testDate=test_record.test_date,
            notes=test_record.notes,
            createdAt=test_record.created_at,
            updatedAt=test_record.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/test-records/bulk", response_model=list[TestRecordResponse])
async def create_bulk_test_records(
    bulk_data: TestRecordBulkCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create multiple test records at once"""
    try:
        # Additional backend validation
        if not bulk_data.records:
            raise HTTPException(status_code=400, detail="No test records provided")
        
        # Validate that all records belong to the same category (optional business rule)
        categories = set(record.testCategory for record in bulk_data.records)
        if len(categories) > 1:
            raise HTTPException(
                status_code=400, 
                detail="All test records in a bulk operation must belong to the same category"
            )
        
        # Check for duplicate test types within the same date and category
        test_type_date_pairs = set()
        for record in bulk_data.records:
            pair = (record.testType, record.testDate.date(), record.testCategory)
            if pair in test_type_date_pairs:
                raise HTTPException(
                    status_code=400,
                    detail=f"Duplicate test record found: {record.testType} on {record.testDate.date()}"
                )
            test_type_date_pairs.add(pair)
        
        test_records = []
        for record in bulk_data.records:
            # Convert timezone-aware datetime to naive datetime for database storage
            test_date_naive = record.testDate.replace(tzinfo=None) if record.testDate.tzinfo else record.testDate
            
            test_record = TestRecord(
                user_id=current_user.id,
                test_category=record.testCategory,
                test_type=record.testType,
                test_value=record.testValue,
                unit=record.unit,
                min_range=record.minRange,
                max_range=record.maxRange,
                test_date=test_date_naive,
                notes=record.notes
            )
            test_records.append(test_record)
        
        db.add_all(test_records)
        await db.commit()
        
        # Refresh all records to get their IDs
        for record in test_records:
            await db.refresh(record)
        
        return [
            TestRecordResponse(
                id=record.id,
                userId=record.user_id,
                testCategory=record.test_category,
                testType=record.test_type,
                testValue=record.test_value,
                unit=record.unit,
                minRange=record.min_range,
                maxRange=record.max_range,
                testDate=record.test_date,
                notes=record.notes,
                createdAt=record.created_at,
                updatedAt=record.updated_at
            )
            for record in test_records
        ]
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating bulk test records: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/api/test-records")
async def get_test_records(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all test records for the current user"""
    try:
        result = await db.execute(
            text("SELECT * FROM test_records WHERE user_id = :user_id ORDER BY test_date DESC"),
            {"user_id": current_user.id}
        )
        records = result.fetchall()
        return [
            TestRecordResponse(
                id=record.id,
                userId=record.user_id,
                testCategory=record.test_category,
                testType=record.test_type,
                testValue=record.test_value,
                unit=record.unit,
                minRange=record.min_range,
                maxRange=record.max_range,
                testDate=record.test_date,
                notes=record.notes,
                createdAt=record.created_at,
                updatedAt=record.updated_at
            )
            for record in records
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test-records/categories")
async def get_test_categories(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get unique test categories for the current user"""
    try:
        result = await db.execute(
            text("SELECT DISTINCT test_category FROM test_records WHERE user_id = :user_id ORDER BY test_category"),
            {"user_id": current_user.id}
        )
        categories = result.fetchall()
        return [{"category": row.test_category} for row in categories]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test-records/category/{category}")
async def get_test_records_by_category(
    category: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get test records for a specific category"""
    try:
        result = await db.execute(
            text("SELECT * FROM test_records WHERE user_id = :user_id AND test_category = :category ORDER BY test_date DESC"),
            {"user_id": current_user.id, "category": category}
        )
        records = result.fetchall()
        return [
            TestRecordResponse(
                id=record.id,
                userId=record.user_id,
                testCategory=record.test_category,
                testType=record.test_type,
                testValue=record.test_value,
                unit=record.unit,
                minRange=record.min_range,
                maxRange=record.max_range,
                testDate=record.test_date,
                notes=record.notes,
                createdAt=record.created_at,
                updatedAt=record.updated_at
            )
            for record in records
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)