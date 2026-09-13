import api from './api';

export const collectionService = {
  async getCollections(params = {}) {
    const res = await api.get('/collections', { params });
    return res.data;
  },

  async getCollectionBySlug(identifier) {
    const res = await api.get(`/collections/${identifier}`);
    return res.data;
  },

  async createCollection(data) {
    const res = await api.post('/collections', data);
    return res.data;
  },

  async updateCollection(id, data) {
    const res = await api.put(`/collections/${id}`, data);
    return res.data;
  },

  async deleteCollection(id) {
    const res = await api.delete(`/collections/${id}`);
    return res.data;
  },
};
