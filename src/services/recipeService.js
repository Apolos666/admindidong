import api from '../api/axios';

export const recipeService = {
  async getAllRecipes() {
    const response = await api.get('/recipes');
    return response.data;
  },

  async getRecipe(id) {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  async updateRecipe(id, formData) {
    await api.put(`/recipes/${id}`, JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  },

  async deleteRecipe(id) {
    await api.delete(`/recipes/${id}`);
  },

  async approveRecipe(id) {
    await api.post(`/recipes/${id}/approve`);
  },

  async deleteComment(id) {
    await api.delete(`/comments/${id}`);
  }
}; 