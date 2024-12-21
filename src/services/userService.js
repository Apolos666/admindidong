import api from '../api/axios';

export const userService = {
  async getAllUsers() {
    const response = await api.get('/users');
    return response.data;
  },

  async deleteUser(id) {
    await api.delete(`/users/${id}`);
  },
}; 