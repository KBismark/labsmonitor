import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import EmailStr
import os

async def send_verification_email(email: EmailStr, verification_code: str, first_name: str):
    """Send email verification code to user using SMTP"""
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #3b82f6;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                background-color: #f9fafb;
                padding: 30px;
                border-radius: 0 0 8px 8px;
            }}
            .verification-code {{
                background-color: #e5e7eb;
                padding: 15px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 5px;
                border-radius: 5px;
                margin: 20px 0;
                color: #374151;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Labs Monitor</h1>
            <p>Email Verification</p>
        </div>
        <div class="content">
            <h2>Hello {first_name}!</h2>
            <p>Thank you for registering with Labs Monitor. To complete your registration, please verify your email address by entering the following verification code:</p>
            
            <div class="verification-code">
                {verification_code}
            </div>
            
            <p>This code will expire in 10 minutes for security reasons.</p>
            
            <p>If you didn't create an account with Labs Monitor, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Labs Monitor. All rights reserved.</p>
        </div>
    </body>
    </html>
    """
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Verify Your Email - Labs Monitor"
        msg['From'] = os.getenv("SMTP_FROM_EMAIL", "noreply@labsmonitor.com")
        msg['To'] = email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # SMTP configuration
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        print(f"Email sent successfully to {email}")
        return {"success": True, "message": "Email sent successfully"}
        
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise e

async def send_password_reset_email(email: EmailStr, reset_code: str, first_name: str):
    """Send password reset code to user using SMTP"""
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Password Reset</title>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }}
            .header {{
                background-color: #dc2626;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
            }}
            .content {{
                background-color: #f9fafb;
                padding: 30px;
                border-radius: 0 0 8px 8px;
            }}
            .reset-code {{
                background-color: #e5e7eb;
                padding: 15px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 5px;
                border-radius: 5px;
                margin: 20px 0;
                color: #374151;
            }}
            .warning {{
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
            }}
            .footer {{
                text-align: center;
                margin-top: 30px;
                color: #6b7280;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Labs Monitor</h1>
            <p>Password Reset Request</p>
        </div>
        <div class="content">
            <h2>Hello {first_name}!</h2>
            <p>We received a request to reset your password for your Labs Monitor account. Use the following code to reset your password:</p>
            
            <div class="reset-code">
                {reset_code}
            </div>
            
            <div class="warning">
                <strong>Security Notice:</strong>
                <ul>
                    <li>This code will expire in 10 minutes</li>
                    <li>If you didn't request this password reset, please ignore this email</li>
                    <li>Never share this code with anyone</li>
                </ul>
            </div>
            
            <p>If you didn't request a password reset, your account is secure and no action is needed.</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Labs Monitor. All rights reserved.</p>
        </div>
    </body>
    </html>
    """
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = "Password Reset - Labs Monitor"
        msg['From'] = os.getenv("SMTP_FROM_EMAIL", "noreply@labsmonitor.com")
        msg['To'] = email
        
        # Attach HTML content
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        # SMTP configuration
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        # Send email
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            if smtp_username and smtp_password:
                server.login(smtp_username, smtp_password)
            server.send_message(msg)
        
        print(f"Password reset email sent successfully to {email}")
        return {"success": True, "message": "Password reset email sent successfully"}
        
    except Exception as e:
        print(f"Failed to send password reset email: {e}")
        raise e 