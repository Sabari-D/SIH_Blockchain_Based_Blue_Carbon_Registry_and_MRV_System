import axios from 'axios';

// Backend runs on port 8000 by default (or the docker-compose backend service)
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to attach JWT token to all requests if it exists in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
export { API_URL };
