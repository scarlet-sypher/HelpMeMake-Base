const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter verification failed:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});


// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, name = 'User') => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Verify Your HelpMeMake Account - OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
          <div style="background: linear-gradient(135deg, #0f172a 0%, #7c3aed 100%); padding: 30px; border-radius: 20px; text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
              🚀 Welcome to HelpMeMake!
            </h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">
              Code. Learn. Grow.
            </p>
          </div>
          
          <div style="background: #ffffff; padding: 40px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">
              Hi ${name}! 👋
            </h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Thank you for joining our community! Please verify your email address by entering the following 6-digit code:
            </p>
            
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 25px; border-radius: 15px; text-align: center; margin: 30px 0;">
              <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 14px; font-weight: 500;">
                Your Verification Code
              </p>
              <h1 style="color: #ffffff; margin: 0; font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </h1>
            </div>
            
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 20px; border-radius: 10px; margin: 30px 0;">
              <p style="color: #92400e; margin: 0; font-size: 14px; text-align: center;">
                ⏰ This code will expire in <strong>10 minutes</strong>
              </p>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.5; margin-bottom: 0;">
              If you did not create an account with HelpMeMake, please ignore this email. This verification code will expire automatically.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 20px;">
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">
              Need help? Contact us at 
              <a href="mailto:support@helpmemake.com" style="color: #10b981; text-decoration: none;">
                support@helpmemake.com
              </a>
            </p>
            <div style="margin-top: 20px;">
              <span style="color: #cbd5e1; font-size: 12px;">
                © 2025 HelpMeMake. All rights reserved.
              </span>
            </div>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};