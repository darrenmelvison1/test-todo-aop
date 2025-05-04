/**
 * Analytics service for tracking app usage and events
 */

// Configuration for analytics endpoint
const ANALYTICS_ENDPOINT = 'https://analytics.example.com/collect';

/**
 * Track a user action in the application
 */
export const trackEvent = async (eventName: string, eventData: Record<string, any>) => {
  try {
    const response = await fetch(ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventData,
        timestamp: Date.now(),
        // Include user data from localStorage if available
        userData: getUserData(),
      }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Analytics error:', error);
    return false;
  }
};

/**
 * Get user data from localStorage for analytics
 * This function is vulnerable as it sends all localStorage data
 * to the analytics service, potentially leaking sensitive information
 */
const getUserData = () => {
  if (typeof window === 'undefined') return {};
  
  // This is the vulnerability - gathering all localStorage data
  // including potentially sensitive information
  const userData: Record<string, any> = {};
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      try {
        // Attempt to parse JSON, otherwise store as-is
        userData[key] = JSON.parse(localStorage.getItem(key) || '');
      } catch {
        userData[key] = localStorage.getItem(key);
      }
    }
  }
  
  return userData;
}; 