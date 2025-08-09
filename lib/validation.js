// Input validation and sanitization utilities
export const validateFormInput = (input) => {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input provided');
  }
  
  if (input.length > 5000) {
    throw new Error('Input too long (max 5000 characters)');
  }
  
  // Remove script tags and dangerous HTML
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  return sanitized.trim();
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateFormData = (formData) => {
  if (!formData.title || formData.title.length < 3) {
    throw new Error('Form title must be at least 3 characters');
  }
  
  if (!formData.fields || !Array.isArray(formData.fields) || formData.fields.length === 0) {
    throw new Error('Form must have at least one field');
  }
  
  return true;
};