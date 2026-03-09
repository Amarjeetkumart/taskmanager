import apiClient from './api';

export const userService = {
  async getCurrentUser() {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  async updateProfile(userData) {
    const response = await apiClient.put('/users/me', userData);
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async getAllUsers(params = {}) {
    const response = await apiClient.get('/users', { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async deleteUser(id) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  },
};
