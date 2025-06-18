import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor to add the auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance; 