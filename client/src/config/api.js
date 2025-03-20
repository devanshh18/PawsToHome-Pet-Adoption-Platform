const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api` // Add /api prefix for production
  : "/api"; // Development fallback
export default API_BASE_URL;
