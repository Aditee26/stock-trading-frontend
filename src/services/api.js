import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for CORS
  timeout: 10000 // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('📥 Response Error:', error.response?.status, error.response?.data);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      return Promise.reject({ message: 'Request timeout. Please try again.' });
    }
    
    if (!error.response) {
      console.error('Network error - is backend running?');
      return Promise.reject({ message: 'Cannot connect to server. Please check if backend is running.' });
    }
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;