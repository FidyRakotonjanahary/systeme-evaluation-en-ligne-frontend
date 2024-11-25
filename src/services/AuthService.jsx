// services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('token')
  }
});

// Intercepteur pour mettre à jour le token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    return response.data;
  },

  register: async (name, email, password) => {
    const response = await api.post('/register', { name, email, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  updateProfile: async (endpoint, data) => {
    const response = await api.put(endpoint, data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/delete');
    localStorage.removeItem('token');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default AuthService;