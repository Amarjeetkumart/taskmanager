import apiClient from './api';

export const taskService = {
  async getAllTasks(params = {}) {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },

  async getTaskById(id) {
    const response = await apiClient.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await apiClient.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async updateTaskStatus(id, status) {
    const response = await apiClient.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async deleteTask(id) {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response.data;
  },

  async getTaskStats() {
    const response = await apiClient.get('/tasks/stats');
    return response.data;
  },
};
