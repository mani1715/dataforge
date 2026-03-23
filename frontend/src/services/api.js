import axios from 'axios';

// Use environment variable for backend URL (configurable for deployment)
const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api'
});

export default api;
