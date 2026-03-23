import axios from 'axios';

// Use relative path for API calls (works with preview URL and localhost)
const api = axios.create({
  baseURL: '/api'
});

export default api;
