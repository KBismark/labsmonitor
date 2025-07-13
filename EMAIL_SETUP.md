# Email Verification Setup Guide

## Backend Configuration

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables
Create a `.env` file in the backend directory with the following variables:

```env
# Email Configuration (Resend)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=your-verified-domain@yourdomain.com

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/labsmonitor

# JWT Secret Key
SECRET_KEY=your-secret-key-here
```

### 3. Resend Setup
To use Resend for email sending:

1. **Sign up for Resend**: Go to [resend.com](https://resend.com) and create an account
2. **Get API Key**: In your Resend dashboard, go to API Keys and create a new key
3. **Verify Domain**: Add and verify your domain in Resend (or use the default `onboarding@resend.dev` for testing)
4. **Add API Key**: Use your API key in the `RESEND_API_KEY` environment variable

### 4. Database Migration
Run the database migration to add email verification fields:

```sql
-- Add email verification fields to users table
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN email_verification_code VARCHAR(10),
ADD COLUMN email_verification_expires TIMESTAMP;

-- Create index for email verification code lookups
CREATE INDEX idx_users_email_verification_code ON users(email_verification_code);

-- Update existing users to have email_verified = true (for backward compatibility)
UPDATE users SET email_verified = true WHERE email_verified IS NULL;
```

## Frontend Configuration

The frontend is already configured to handle email verification. The flow works as follows:

1. User registers → receives verification email
2. User clicks verification link or enters code manually
3. User is redirected to verification page
4. After successful verification, user is logged in and redirected to dashboard

## Testing Email Verification

### Development Testing
For development, you can use services like:
- [Mailtrap](https://mailtrap.io/) - Email testing service
- [Ethereal Email](https://ethereal.email/) - Fake SMTP service

### Production
For production, use a reliable email service like:
- Gmail SMTP
- SendGrid
- Amazon SES
- Mailgun

## API Endpoints

### Registration
- `POST /api/auth/register` - Register new user (sends verification email)

### Email Verification
- `POST /api/auth/verify-email` - Verify email with code
- `POST /api/auth/resend-verification` - Resend verification code

### Login
- `POST /api/auth/login` - Login (requires email verification)

## Security Features

- Verification codes expire after 10 minutes
- Codes are 6-digit numeric
- Users cannot login without email verification
- Resend has 60-second cooldown
- Verification codes are cleared after successful verification 