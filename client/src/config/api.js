// Fix API base URL for production vs development
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL  // No /api - we'll add it in service files
  : "/api"; // Development fallback

export default API_BASE_URL;