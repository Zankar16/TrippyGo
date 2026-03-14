import API from './api';

const authService = {
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    return response.data; // { token, user: { id, name, email ... } }
  },

  register: async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    return response.data;
  },

  getMe: async () => {
    const response = await API.get('/auth/me');
    return response.data;
  },

  updateMe: async (data) => {
    const response = await API.put('/auth/me', data);
    return response.data;
  }
};

export default authService;
