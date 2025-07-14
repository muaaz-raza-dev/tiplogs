from config import APP_NAME



def generate_verification_email(username: str, verification_link: str):
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Verify Your Email</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {{
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f4f4;
          padding: 20px;
        }}
        .email-container {{
          background-color: #ffffff;
          border-radius: 8px;
          padding: 40px;
          max-width: 600px;
          margin: auto;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }}
        .logo {{
          text-align: center;
          margin-bottom: 30px;
        }}
        .title {{
          font-size: 24px;
          font-weight: 600;
          color: #333;
        }}
        .message {{
          margin-top: 20px;
          font-size: 16px;
          color: #555;
        }}
        .button {{
          display: inline-block;
          margin-top: 30px;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }}
        .footer {{
          margin-top: 40px;
          font-size: 12px;
          color: #999;
          text-align: center;
        }}

        @media only screen and (max-width: 600px) {{
          .email-container {{
            padding: 20px;
          }}
          .title {{
            font-size: 20px;
          }}
          .message {{
            font-size: 14px;
          }}
          .button {{
            padding: 10px 20px;
            font-size: 14px;
          }}
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="logo">
          <img src="{""}" alt="Logo" height="50">
        </div>
        <div class="title">Email Verification</div>
        <div class="message">
          Hello {username},<br><br>
          Thank you for registering with us. Please click the button below to verify your email address:
        </div>
        <div style="text-align: center;">
          <a href="{verification_link}" class="button">Verify Email</a>
        </div>
        <div class="message">
          If the button doesn't work, copy and paste this link into your browser:<br>
          <a href="{verification_link}">{verification_link}</a>
        </div>
        <div class="footer">
          If you didn’t request this, you can ignore this email.<br><br>
          &copy; 2025 {APP_NAME}
        </div>
      </div>
    </body>
    </html>
    """
    return html
