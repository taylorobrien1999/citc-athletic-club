import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
});

// Attach JWT to every request automatically if token exists in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('citc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerUser = (data) => API.post('/api/auth/register', data);
export const loginUser    = (data) => API.post('/api/auth/login', data);
export const getMe        = ()     => API.get('/api/auth/me');

export default API;