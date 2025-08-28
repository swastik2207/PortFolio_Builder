// For App Router (e.g. /app/api/contact/route.ts)
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      ownerEmail,
      ownerName,
      userName,
      userEmail,
      message,
    } = body;

    // Enhanced validation with logging
    console.log('Received form data:', { ownerEmail, ownerName, userName, userEmail, message: message.substring(0, 50) + '...' });

    if (!ownerEmail || !ownerName || !userEmail || !userName || !message) {
      console.error('Missing required fields:', { ownerEmail: !!ownerEmail, ownerName: !!ownerName, userEmail: !!userEmail, userName: !!userName, message: !!message });
      return NextResponse.json({
        success: false,
        error: 'Missing required fields'
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(ownerEmail) || !emailRegex.test(userEmail)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 });
    }

    // Check if Gmail credentials exist
    if (!process.env.GMAIL_EMAIL || !process.env.GMAIL_APP_PASSWORD) {
      console.error('Gmail credentials are not set in environment variables');
      return NextResponse.json({
        success: false,
        error: 'Email service configuration error'
      }, { status: 500 });
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
      },
    });

    console.log('Attempting to send emails...');

    // 1. Email to Owner with error handling
    let ownerEmailResponse;
    try {
      const ownerMailOptions = {
        from: {
          name: 'Contact Form',
          address: process.env.GMAIL_EMAIL
        },
        to: ownerEmail,
        subject: `New message from ${userName}`,
        html: `
        
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New Contact Message</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Arial, sans-serif; color: #334155;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="620" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e0e7ef; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #6366f1, #f43f5e); padding: 30px 20px;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #ffffff;">📬 New Contact Message</h1>
              <p style="margin: 5px 0 0; font-size: 16px; color: #f1f5f9;">Someone reached out through your portfolio</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px 28px;">
              
              <p style="font-size: 14px; background-color: #fffbea; border-left: 5px solid #facc15; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                ⚠️ <strong>Action Required:</strong> A potential client/collaborator is waiting for your response.
              </p>

              <h2 style="font-size: 18px; margin-bottom: 10px; color: #1e293b;">Contact Details</h2>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 10px 0; font-size: 14px;">
                    <strong>Name:</strong> ${userName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px;">
                    <strong>Email:</strong> <a href="mailto:${userEmail}" style="color: #0ea5e9; text-decoration: none;">${userEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; font-size: 14px;">
                    <strong>Received:</strong> ${new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
                  </td>
                </tr>
              </table>

              <h2 style="font-size: 18px; margin-bottom: 10px; color: #1e293b;">Message</h2>
              <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; font-style: italic; border-left: 4px solid #6366f1;">
                ${message.replace(/\n/g, '<br>')}
              </div>

              <p style="margin-top: 20px; font-size: 13px; color: #64748b;">
                📊 ${message.split(' ').length} words • ${message.length} characters • ⏱️ ~${Math.ceil(message.split(' ').length / 200)} min read
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 28px; background-color: #f8fafc; border-top: 1px solid #e0e7ef; text-align: center;">
              <p style="font-size: 13px; color: #64748b; margin: 0;">
                🤖 This message was sent from your portfolio contact form.
              </p>
              <p style="font-size: 12px; color: #94a3b8; margin: 4px 0 0;">
                Please respond promptly to maintain professional communication.
              </p>
              <p style="font-size: 11px; color: #cbd5e1; margin-top: 12px;">
                &copy; ${new Date().getFullYear()} Portfolio Notification System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>


        `,
        text: `New message from ${userName} (${userEmail}):\n\n${message}`
      };

      ownerEmailResponse = await transporter.sendMail(ownerMailOptions);
      console.log('Owner email sent:', ownerEmailResponse.messageId);

    } catch (ownerEmailError) {
      console.error('Owner email send error:', ownerEmailError);
      return NextResponse.json({
        success: false,
        error: 'Failed to send notification email'
      }, { status: 500 });
    }

    // 2. Acknowledgement Email to User with error handling
    let userEmailResponse;
    let warnings: string[] = [];

    try {
      const userMailOptions = {
        from: {
          name: ownerName,
          address: process.env.GMAIL_EMAIL
        },
        to: userEmail,
        subject: `Thanks for reaching out to ${ownerName}`,
        html: `
        
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Message Received</title>
</head>
<body style="margin: 0; padding: 0; background-color: #667eea; font-family: Arial, sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #667eea; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background: linear-gradient(90deg, #3b82f6, #1d4ed8); padding: 40px 20px;">
              <div style="font-size: 50px;">✅</div>
              <h1 style="color: white; font-size: 24px; font-weight: bold; margin: 10px 0 0;">Message Received Successfully</h1>
              <p style="color: #e0f2fe; font-size: 16px; margin: 5px 0 0;">Thank you for reaching out</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 25px;">
              <h2 style="font-size: 20px; margin-bottom: 10px; color: #1f2937;">Hello ${userName}! 👋</h2>
              <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0;">
                Thank you for contacting <strong style="color: #3b82f6;">${ownerName}</strong>. Your message has been received and I appreciate you taking the time to reach out.
              </p>
            </td>
          </tr>

          <!-- Response Time -->
          <tr>
            <td style="padding: 0 25px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f9ff; border-left: 5px solid #3b82f6; border-radius: 8px;">
                <tr>
                  <td style="padding: 15px;">
                    <p style="margin: 0; color: #1d4ed8; font-weight: bold; font-size: 15px;">⏱ Expected Response Time</p>
                    <p style="margin: 8px 0 0; color: #1e3a8a; font-size: 14px;">I typically respond within <strong>24–48 hours</strong>. For urgent matters, feel free to connect via email directly.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message Summary -->
          <tr>
            <td style="padding: 0 25px 30px;">
              <h3 style="font-size: 18px; color: #111827; margin-bottom: 10px;">📩 Your Message Summary</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px;">
                <tr>
                  <td style="padding: 20px; font-size: 14px; color: #374151; line-height: 1.6;">
                    ${message.replace(/\n/g, '<br>')}
                    <div style="margin-top: 15px; color: #6b7280; font-size: 12px;">
                      📅 Received on ${new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Info -->
          <tr>
            <td style="padding: 0 25px 30px;" align="center">
              <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">
                Need to contact me directly?
              </p>
              <a href="mailto:${ownerEmail}" style="display: inline-block; font-size: 15px; color: #059669; background-color: #ecfdf5; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                📧 ${ownerEmail}
              </a>
              <p style="font-size: 12px; color: #047857; margin-top: 8px;">For urgent inquiries, email me directly.</p>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding: 0 25px 30px;">
              <p style="font-size: 15px; color: #374151; margin: 0;">
                Best regards,<br>
                <strong style="color: #3b82f6;">${ownerName}</strong>
              </p>
              <p style="font-size: 13px; color: #9ca3af; margin: 6px 0 0;">Looking forward to connecting with you! 🚀</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f1f5f9; text-align: center; padding: 20px;">
              <p style="font-size: 12px; color: #6b7280; margin: 0 0 5px;">This is an automated message. Please do not reply.</p>
              <p style="font-size: 11px; color: #cbd5e1; margin: 0;">© ${new Date().getFullYear()} ${ownerName}. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>

        
        `,
        text: `Hi ${userName},\n\nThanks for contacting ${ownerName}. I have received your message and will get back to you shortly.\n\nYour message:\n${message}\n\nBest regards,\n${ownerName}`
      };

      userEmailResponse = await transporter.sendMail(userMailOptions);
      console.log('User email sent:', userEmailResponse.messageId);

    } catch (userEmailError) {
      console.error('User email send error:', userEmailError);
      console.warn('Acknowledgment email failed, but main notification was sent');
      warnings.push('Acknowledgment email failed');
    }

    console.log('Email process completed');
    return NextResponse.json({
      success: true,
      ownerEmailId: ownerEmailResponse.messageId,
      userEmailId: userEmailResponse?.messageId,
      warnings: warnings.length > 0 ? warnings : undefined
    });

  } catch (err) {
    console.error('General email error:', err);
    return NextResponse.json({
      success: false,
      error: 'Failed to send email'
    }, { status: 500 });
  }
}