-- Add email verification fields to users table
ALTER TABLE users 
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN email_verification_code VARCHAR(10),
ADD COLUMN email_verification_expires TIMESTAMP;

-- Create index for email verification code lookups
CREATE INDEX idx_users_email_verification_code ON users(email_verification_code);

-- Update existing users to have email_verified = true (for backward compatibility)
UPDATE users SET email_verified = true WHERE email_verified IS NULL; 