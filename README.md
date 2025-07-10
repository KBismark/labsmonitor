# Medical Test Records Management System

A comprehensive web application for managing medical test records with beautiful visualizations and role-based access control.

## Features

### Frontend (React + TypeScript + Tailwind CSS)
- **Modern Landing Page** with smooth animations and medical imagery
- **Authentication System** with JWT-based security
- **Patient Dashboard** with interactive data visualizations
- **Test Record Management** with support for 16+ test panels
- **Data Visualization** using Recharts with interactive charts and graphs
- **Responsive Design** with WCAG 2.1 AA compliance
- **Role-based Access** (Patient, Doctor, Admin)

### Backend (FastAPI + PostgreSQL)
- **Async FastAPI** with high-performance endpoints
- **JWT Authentication** with secure password hashing
- **PostgreSQL Database** with SQLAlchemy ORM
- **Comprehensive API** for test record management
- **Data Validation** with Pydantic schemas
- **Role-based Authorization**

### Supported Test Panels
- Complete Blood Count (CBC)
- Kidney Function Test (KFT)
- Liver Function Test (LFT)
- Lipid Profile
- Glucose Panel
- Iron Panel
- Fluid Analysis
- Cardiac Enzymes
- Tropinins
- Thyroid Function Test
- Urine Routine Examination
- Basic Fertilities
- Electrolytes
- Semen Analysis
- ACR
- Urine Protein Creatinine Ratio

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd medical-test-system
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Manual Setup

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Database Setup
```bash
# Install PostgreSQL
# Create database 'medtest'
# Update DATABASE_URL in backend configuration
```

## Project Structure

```
medical-test-system/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   └── ...
│   ├── package.json
│   └── Dockerfile
├── backend/                  # FastAPI backend
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication logic
│   ├── database.py          # Database configuration
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml        # Docker composition
├── nginx.conf               # Nginx configuration
├── init.sql                 # Database initialization
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Test Records
- `POST /api/test-records` - Create test record
- `GET /api/test-records` - Get user's test records
- `PUT /api/test-records/{id}` - Update test record
- `DELETE /api/test-records/{id}` - Delete test record

## Technology Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls

### Backend
- FastAPI with Python 3.11
- PostgreSQL database
- SQLAlchemy ORM (async)
- JWT authentication
- Pydantic for data validation
- Uvicorn ASGI server

### DevOps
- Docker and Docker Compose
- Nginx reverse proxy
- PostgreSQL database container

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

## Future Enhancements

- Doctor portal for managing patients
- Admin dashboard for system management
- Mobile app development
- Advanced analytics and reporting
- Integration with lab systems
- Telemedicine features
- AI-powered health insights

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## License

This project is licensed under the MIT License.