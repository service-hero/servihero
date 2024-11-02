export const API_CONFIG = {
  crm: {
    baseUrl: process.env.VITE_CRM_API_URL || '',
    apiKey: process.env.VITE_CRM_API_KEY || '',
  },
  marketing: {
    baseUrl: process.env.VITE_MARKETING_API_URL || '',
    apiKey: process.env.VITE_MARKETING_API_KEY || '',
  },
};