// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/partner/register',
    },
    PARTNER: {
      DATA_ENTRY_2: '/api/partner/data-entry-2',
      DATA_ENTRY_3: '/api/partner/data-entry-3',
      DATA_ENTRY_4: '/api/partner/data-entry-4',
    }
  }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

