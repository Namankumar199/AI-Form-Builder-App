// Rate limiting for API calls
const rateLimit = new Map();

export const checkRateLimit = (userId, limit = 5, windowMs = 60000) => {
  const now = Date.now();
  const userRequests = rateLimit.get(userId) || [];
  
  // Filter requests within the time window
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= limit) {
    throw new Error('Rate limit exceeded. Please try again later.');
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimit.set(userId, recentRequests);
  
  return true;
};

export const clearOldEntries = () => {
  const now = Date.now();
  for (const [userId, requests] of rateLimit.entries()) {
    const validRequests = requests.filter(time => now - time < 300000); // 5 minutes
    if (validRequests.length === 0) {
      rateLimit.delete(userId);
    } else {
      rateLimit.set(userId, validRequests);
    }
  }
};

// Clean up old entries every 5 minutes
setInterval(clearOldEntries, 300000);