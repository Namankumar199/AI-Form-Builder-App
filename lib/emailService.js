// Email service using EmailJS (free email service)
export const sendEmailNotification = async (formData, responses, recipientEmail) => {
  try {
    // Email template for form responses
    const emailContent = {
      to_email: recipientEmail,
      form_title: formData.title,
      form_responses: Object.entries(responses)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n'),
      submitted_at: new Date().toLocaleString(),
      total_responses: Object.keys(responses).length
    };

    // Using fetch to send email (you'll need to set up EmailJS)
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailContent)
    });

    if (!response.ok) {
      throw new Error('Failed to send email');
    }

    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

// Generate email template
export const generateEmailTemplate = (formTitle, responses) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
      <h2 style="text-align: center; margin-bottom: 30px;">New Form Submission: ${formTitle}</h2>
      
      <div style="background: white; color: #333; padding: 20px; border-radius: 10px; margin: 20px 0;">
        <h3 style="color: #667eea; border-bottom: 2px solid #667eea; padding-bottom: 10px;">Form Responses</h3>
        
        ${Object.entries(responses).map(([key, value]) => `
          <div style="margin: 15px 0; padding: 10px; background: #f8f9fa; border-left: 4px solid #667eea;">
            <strong style="color: #667eea;">${key}:</strong><br>
            <span style="margin-left: 10px;">${value}</span>
          </div>
        `).join('')}
        
        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 5px; text-align: center;">
          <p style="margin: 0; color: #1976d2;">
            <strong>Submitted on:</strong> ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <p style="font-size: 14px; opacity: 0.8;">
          This email was sent automatically from your AI Form Builder
        </p>
      </div>
    </div>
  `;
};