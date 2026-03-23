import axios from 'axios';

// Create axios instance with configuration for large file uploads
const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 minutes timeout for large files
  maxContentLength: 500 * 1024 * 1024, // 500MB
  maxBodyLength: 500 * 1024 * 1024, // 500MB
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for file uploads
api.interceptors.request.use(
  (config) => {
    // For FormData uploads, remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - file might be too large or connection is slow');
    }
    return Promise.reject(error);
  }
);

export default api;
