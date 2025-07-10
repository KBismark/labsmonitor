from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from contextlib import asynccontextmanager
import uvicorn

from database import get_db, init_db
from models import User, TestRecord
from auth import get_current_user, create_access_token, verify_password, hash_password
from schemas import UserCreate, UserLogin, TestRecordCreate, TestRecordResponse

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database
    await init_db()
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
            "SELECT * FROM users WHERE email = :email",
            {"email": user_data.email}
        )
        if existing_user.fetchone():
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = hash_password(user_data.password)
        user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            first_name=user_data.firstName,
            last_name=user_data.lastName,
            role="patient"
        )
        
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        # Create access token
        access_token = create_access_token(data={"sub": user.email})
        
        return {
            "token": access_token,
            "user": {
                "id": str(user.id),
                "email": user.email,
                "firstName": user.first_name,
                "lastName": user.last_name,
                "role": user.role
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
async def login(user_credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login user"""
    try:
        # Find user by email
        result = await db.execute(
            "SELECT * FROM users WHERE email = :email",
            {"email": user_credentials.email}
        )
        user_data = result.fetchone()
        
        if not user_data or not verify_password(user_credentials.password, user_data.hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )
        
        # Create access token
        access_token = create_access_token(data={"sub": user_data.email})
        
        return {
            "token": access_token,
            "user": {
                "id": str(user_data.id),
                "email": user_data.email,
                "firstName": user_data.first_name,
                "lastName": user_data.last_name,
                "role": user_data.role
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
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
            "role": current_user.role
        }
    }

# Test record endpoints
@app.post("/api/test-records", response_model=TestRecordResponse)
async def create_test_record(
    record: TestRecordCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new test record"""
    try:
        test_record = TestRecord(
            user_id=current_user.id,
            test_type=record.testType,
            test_value=record.value,
            unit=record.unit,
            min_range=record.minRange,
            max_range=record.maxRange,
            test_date=record.date
        )
        
        db.add(test_record)
        await db.commit()
        await db.refresh(test_record)
        
        return TestRecordResponse(
            id=test_record.id,
            testType=test_record.test_type,
            value=test_record.test_value,
            unit=test_record.unit,
            minRange=test_record.min_range,
            maxRange=test_record.max_range,
            date=test_record.test_date,
            createdAt=test_record.created_at
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/test-records")
async def get_test_records(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all test records for the current user"""
    try:
        result = await db.execute(
            "SELECT * FROM test_records WHERE user_id = :user_id ORDER BY test_date DESC",
            {"user_id": current_user.id}
        )
        records = result.fetchall()
        
        return [
            TestRecordResponse(
                id=record.id,
                testType=record.test_type,
                value=record.test_value,
                unit=record.unit,
                minRange=record.min_range,
                maxRange=record.max_range,
                date=record.test_date,
                createdAt=record.created_at
            )
            for record in records
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)