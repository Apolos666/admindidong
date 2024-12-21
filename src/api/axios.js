import axios from 'axios';
import { authService } from '../services/authService';

const api = axios.create({
  baseURL: 'https://app-chia-se-cong-thuc.azurewebsites.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Request URL:', config.baseURL + config.url);
    console.log('Request Method:', config.method.toUpperCase());
    console.log('Request Headers:', config.headers);
    
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('Error Response:', error.response);
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default api; 