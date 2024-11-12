// services/authService.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json',
    'x-auth-token': localStorage.getItem('token')
  }
});

const AuthService = {
  login: async (email, password) => {
    const response = await api.post('/login', { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    
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
  logout: () => {
    localStorage.removeItem('token');
  },
  getToken: () => {
    const token = localStorage.getItem('token');
    return token;
  },
  updateProfile: async (endpoint, data) => {
    const response = await api.put(endpoint, data);
    return response.data;
  }
};

export default AuthService;