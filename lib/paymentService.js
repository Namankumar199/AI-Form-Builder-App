// Payment service for form submissions
export const PAYMENT_PROVIDERS = {
  STRIPE: 'stripe',
  PAYPAL: 'paypal',
  RAZORPAY: 'razorpay'
};

export const createPaymentIntent = async (amount, currency = 'usd', provider = 'stripe') => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to cents
        currency,
        provider
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment intent creation failed:', error);
    throw error;
  }
};

export const processPayment = async (paymentData, formData) => {
  try {
    const response = await fetch('/api/process-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...paymentData,
        formData
      })
    });

    if (!response.ok) {
      throw new Error('Payment processing failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw error;
  }
};

// Payment form validation
export const validatePaymentForm = (paymentData) => {
  const errors = {};

  if (!paymentData.amount || paymentData.amount <= 0) {
    errors.amount = 'Amount must be greater than 0';
  }

  if (!paymentData.email) {
    errors.email = 'Email is required for payment';
  }

  if (!paymentData.name || paymentData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};