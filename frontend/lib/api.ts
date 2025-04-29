import axios from 'axios';
import Cookies from 'js-cookie';

// Get the API URL from environment variables or use default
const API_URL = process.env.NEXT_PUBLIC_CONTROLLER_API_URL || '/api';

// Create an axios instance with a baseURL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000, // 20 seconds timeout
  withCredentials: true, // Important for CORS with credentials
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    // Add authorization token to headers if available
    if (typeof window !== 'undefined') {
      const token = Cookies.get('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    console.error('API request configuration error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API request failed:', error?.response?.data || error.message || error);
    
    // Handle authentication errors (401)
    if (error.response && error.response.status === 401) {
      // Clear auth cookies and redirect to login if not already on login page
      if (typeof window !== 'undefined' && 
          !window.location.pathname.includes('/login') && 
          !window.location.pathname.includes('/signup')) {
        console.log('Unauthorized access. Redirecting to login...');
        Cookies.remove('authToken', { path: '/' });
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Add retry logic for network errors
    if (error.message === 'Network Error' && error.config && !error.config.__isRetryRequest) {
      console.log('Attempting to retry the request...');
      error.config.__isRetryRequest = true;
      return api(error.config);
    }
    
    return Promise.reject(error);
  }
);

export default api; 