// ./lib/email.ts - Updated with server-side only import
'use server'; // Mark this as a server-only file

import type { Transporter } from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';

// Create a type-safe transporter that's only used on server
let transporter: Transporter | null = null;

// Only initialize nodemailer on server side
if (typeof window === 'undefined') {
  // Dynamic import on server side only
  const nodemailer = await import('nodemailer');
  
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export async function sendVerificationEmail(
  to: string,
  token: string,
  type: 'verification' | 'invitation'
) {
  // Only run on server
  if (typeof window !== 'undefined') {
    console.warn('sendVerificationEmail called on client side - skipping');
    return;
  }

  if (!transporter) {
    console.error('Email transporter not initialized');
    return;
  }

  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`;
  const invitationUrl = `${process.env.NEXTAUTH_URL}/auth/accept-invite?token=${token}`;
  
  const url = type === 'verification' ? verificationUrl : invitationUrl;
  const subject = type === 'verification' 
    ? 'Verify Your Email Address' 
    : 'You\'ve been invited to join a team';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Welcome!</h1>
      </div>
      <div style="padding: 30px; background: #fff; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2>${subject}</h2>
        <p>Thank you for creating an account with us. To get started, please click the button below to ${
          type === 'verification' ? 'verify your email address' : 'accept your invitation'
        }:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" 
             style="background: #667eea; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            ${type === 'verification' ? 'Verify Email' : 'Accept Invitation'}
          </a>
        </div>
        
        <p>Or copy and paste this link into your browser:</p>
        <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${url}
        </p>
        
        <p style="color: #666; font-size: 14px;">
          This link will expire in 24 hours. If you didn't request this, please ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  industry: string
) {
  // Only run on server
  if (typeof window !== 'undefined') {
    console.warn('sendWelcomeEmail called on client side - skipping');
    return;
  }

  if (!transporter) {
    console.error('Email transporter not initialized');
    return;
  }

  const industryWelcomeMessages = {
    pharmacy: {
      subject: 'Welcome to Your Pharmacy Management System',
      message: 'Get started with managing prescriptions, inventory, and patient records efficiently.'
    },
    fashion: {
      subject: 'Welcome to Your Retail Management Platform',
      message: 'Start managing your fashion inventory, orders, and customer relationships.'
    },
    education: {
      subject: 'Welcome to Your Education Management System',
      message: 'Begin organizing students, courses, and educational resources.'
    },
    healthcare: {
      subject: 'Welcome to Your Healthcare Management Platform',
      message: 'Start managing appointments, patient records, and medical workflows.'
    }
  };

  const welcome = industryWelcomeMessages[industry as keyof typeof industryWelcomeMessages] || {
    subject: 'Welcome to Your Dashboard',
    message: 'Get started with your new business management system.'
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Welcome ${name}!</h1>
      <p>${welcome.message}</p>
      <p>Your industry-specific features have been configured and are ready to use.</p>
      <a href="${process.env.NEXTAUTH_URL}/dashboard">Go to Dashboard</a>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject: welcome.subject,
    html,
  });
}