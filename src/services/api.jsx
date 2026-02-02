import axios from 'axios';

// FIX: Use import.meta.env for Vite instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
  
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateOnboarding: (data) => api.post('/user/onboarding', data)
};

export const resumeAPI = {
  upload: (formData) => api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};

export const recommendationAPI = {
  generate: () => api.post('/recommendation/generate'),
  getMyRecommendation: () => api.get('/recommendation/my-recommendation')
};

export default api;
