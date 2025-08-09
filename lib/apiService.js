// API access and webhook service
export const generateApiKey = () => {
  const prefix = 'afb_'; // AI Form Builder prefix
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${prefix}${timestamp}_${random}`;
};

export const createApiKey = async (name, permissions = []) => {
  try {
    const response = await fetch('/api/keys/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, permissions })
    });

    if (!response.ok) {
      throw new Error('Failed to create API key');
    }

    return await response.json();
  } catch (error) {
    console.error('API key creation failed:', error);
    throw error;
  }
};

export const revokeApiKey = async (keyId) => {
  try {
    const response = await fetch('/api/keys/revoke', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyId })
    });

    if (!response.ok) {
      throw new Error('Failed to revoke API key');
    }

    return await response.json();
  } catch (error) {
    console.error('API key revocation failed:', error);
    throw error;
  }
};

export const createWebhook = async (url, events, formId = null) => {
  try {
    const response = await fetch('/api/webhooks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, events, formId })
    });

    if (!response.ok) {
      throw new Error('Failed to create webhook');
    }

    return await response.json();
  } catch (error) {
    console.error('Webhook creation failed:', error);
    throw error;
  }
};

export const testWebhook = async (webhookId) => {
  try {
    const response = await fetch('/api/webhooks/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ webhookId })
    });

    if (!response.ok) {
      throw new Error('Webhook test failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Webhook test failed:', error);
    throw error;
  }
};

// API endpoints documentation
export const API_ENDPOINTS = {
  FORMS: {
    LIST: 'GET /api/v1/forms',
    GET: 'GET /api/v1/forms/{id}',
    CREATE: 'POST /api/v1/forms',
    UPDATE: 'PUT /api/v1/forms/{id}',
    DELETE: 'DELETE /api/v1/forms/{id}'
  },
  RESPONSES: {
    LIST: 'GET /api/v1/forms/{id}/responses',
    GET: 'GET /api/v1/responses/{id}',
    CREATE: 'POST /api/v1/forms/{id}/responses'
  },
  ANALYTICS: {
    FORM_STATS: 'GET /api/v1/forms/{id}/analytics',
    EXPORT: 'GET /api/v1/forms/{id}/export'
  }
};

export const WEBHOOK_EVENTS = [
  'form.created',
  'form.updated',
  'form.deleted',
  'response.created',
  'response.updated'
];