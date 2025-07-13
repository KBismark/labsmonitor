import resend
from pydantic import EmailStr
import os

# Initialize Resend with API key
resend.api_key = os.getenv("RESEND_API_KEY")

async def send_verification_email(email: EmailStr, verification_code: str, first_name: str):
    """Send email verification code to user using Resend"""
    
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
        response = resend.Emails.send({
            "from": os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev"),
            "to": [email],
            "subject": "Verify Your Email - Labs Monitor",
            "html": html_content
        })
        print(f"Email sent successfully: {response}")
        return response
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise e 