/**
 * Professional HTML Email Template Generator for FUNRADO OTP Verification
 */

export function generateFunradoOtpEmailHtml({ customerName, otpCode, isPasswordReset = false }) {
  const title = isPasswordReset ? 'Password Reset Verification' : 'Welcome to FUNRADO!';
  const message = isPasswordReset 
    ? 'We received a request to reset your FUNRADO account password. Please use the verification code below:' 
    : `Hi ${customerName || 'Explorer'}, thank you for joining FUNRADO! Please use the 6-digit verification code below to complete your registration:`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your FUNRADO Verification Code</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcfbf9; margin: 0; padding: 0; color: #1c1917; }
    .container { max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #f3ebd8; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #782725 0%, #4a1514 100%); padding: 30px; text-align: center; color: #ffffff; }
    .logo { font-size: 28px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #ffffff; margin: 0; }
    .logo span { color: #f59e0b; }
    .subtitle { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; color: #fde68a; margin-top: 4px; }
    .content { padding: 36px 30px; text-align: center; }
    .greeting { font-size: 22px; font-weight: 800; color: #1c1917; margin-bottom: 12px; }
    .message { font-size: 14px; color: #57534e; line-height: 1.6; margin-bottom: 28px; }
    .otp-card { background: #fffbe6; border: 2px dashed #f59e0b; border-radius: 16px; padding: 20px; margin: 0 auto 28px auto; max-width: 320px; }
    .otp-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: #b45309; margin-bottom: 8px; }
    .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #782725; margin: 0; font-family: monospace; }
    .expiry-badge { display: inline-flex; align-items: center; gap: 6px; background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 12px; font-weight: 700; padding: 6px 16px; border-radius: 50px; margin-bottom: 24px; }
    .warning-box { background: #f5f5f4; border-left: 4px solid #782725; padding: 14px 16px; border-radius: 8px; text-align: left; font-size: 12px; color: #44403c; line-height: 1.5; margin-bottom: 28px; }
    .footer { background: #fafaf9; border-top: 1px solid #f5f5f4; padding: 20px 30px; text-align: center; font-size: 11px; color: #a8a29e; }
    .footer a { color: #782725; text-decoration: none; font-weight: 700; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">FUN<span>RADO</span></h1>
      <div class="subtitle">Pure & Playful Luxury</div>
    </div>
    
    <div class="content">
      <div class="greeting">${title}</div>
      <p class="message">${message}</p>
      
      <div class="otp-card">
        <div class="otp-label">Your Verification Code</div>
        <div class="otp-code">${otpCode}</div>
      </div>

      <div class="expiry-badge">
        ⏱️ Code expires in 5 minutes
      </div>

      <div class="warning-box">
        <strong>⚠️ Security Reminder:</strong> Never share this OTP with anyone. FUNRADO staff will never ask for your verification code or account password.
      </div>
    </div>

    <div class="footer">
      <p>© ${new Date().getFullYear()} FUNRADO Inc. All rights reserved.</p>
      <p>This is an automated security message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
  `;
}

// Compatibility alias
export const generateKiddigoOtpEmailHtml = generateFunradoOtpEmailHtml;
