from fastapi_mail import ConnectionConfig
from config import EMAIL_ID, EMAIL_PASSWORD

conf = ConnectionConfig(
    MAIL_USERNAME=EMAIL_ID,
    MAIL_PASSWORD=EMAIL_PASSWORD,
    MAIL_FROM=EMAIL_ID,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",  # or your mail provider
    MAIL_FROM_NAME="TipLogs",
    MAIL_STARTTLS=True,         
    MAIL_SSL_TLS=False,   
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)
