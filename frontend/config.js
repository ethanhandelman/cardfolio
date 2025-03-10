// Central configuration file for the application
// Contains environment-specific settings

// API URL from environment variables or fallback to localhost
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Other configuration settings can be added here
export const APP_NAME = 'Cardfolio';
export const APP_VERSION = '1.0.0';

// Helper for logging configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 App Configuration:', {
    BACKEND_URL,
    APP_NAME,
    APP_VERSION,
    ENV: import.meta.env.MODE
  });
}