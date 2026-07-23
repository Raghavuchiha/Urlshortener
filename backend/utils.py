import os
import resend
from dotenv import load_dotenv
import uuid 


load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
def generate_short_code():
    return str(uuid.uuid4()).replace("-","")[:8]



async def send_reset_email(to_email: str, reset_link: str):
    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": to_email,
        "subject": "Reset your password",
        "html": f"""
            <p>Hi,</p>
            <p>Click the link below to reset your password. This link expires in 30 minutes.</p>
            <p><a href="{reset_link}">Reset Password</a></p>
            <p>If you didn't request this, you can safely ignore this email.</p>
        """
    })