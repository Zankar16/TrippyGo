import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('trippygo_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to handle 401 Unauthorized (expired/invalid token)
API.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  if (error.response && error.response.status === 401) {
    const { default: store } = await import('../store/store');
    const { logout } = await import('../store/authSlice');
    store.dispatch(logout());
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export default API;
