import { NextResponse } from 'next/server';
import { generateEmailTemplate } from '@/lib/emailService';
import nodemailer from 'nodemailer';

// Validate environment variables
const validateEmailConfig = () => {
  const required = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing email configuration: ${missing.join(', ')}`);
  }
};

let transporter;

const getTransporter = () => {
  if (!transporter) {
    validateEmailConfig();
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
};

export async function POST(request) {
  try {
    const emailData = await request.json();
    validateEmailConfig();
    console.log('📧 Email API called with data:', emailData);
    const { to_email, subject, html_content } = emailData;
    
    let mailOptions;
    
    if (html_content) {
      // Direct HTML email (like team invitations)
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: to_email,
        subject: subject || 'AI Form Builder Notification',
        html: html_content,
      };
    } else {
      // Form response email
      const { form_title, form_responses } = emailData;
      
      const responsesObj = {};
      if (form_responses) {
        form_responses.split('\n').forEach(line => {
          const [key, ...valueParts] = line.split(': ');
          if (key && valueParts.length > 0) {
            responsesObj[key] = valueParts.join(': ');
          }
        });
      }
      
      mailOptions = {
        from: process.env.EMAIL_USER,
        to: to_email,
        subject: `New Form Submission: ${form_title}`,
        html: generateEmailTemplate(form_title, responsesObj),
      };
    }
    
    console.log('📧 Sending email with options:', mailOptions);
    const emailTransporter = getTransporter();
    const result = await emailTransporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId
    });
    
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}