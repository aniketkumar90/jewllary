import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const res = await api.get('/products', { params });
    return res.data;
  },

  async getProductBySlug(identifier) {
    const res = await api.get(`/products/${identifier}`);
    return res.data;
  },

  async getRelatedProducts(id) {
    const res = await api.get(`/products/${id}/related`);
    return res.data;
  },

  async createProduct(data) {
    const res = await api.post('/products', data);
    return res.data;
  },

  async updateProduct(id, data) {
    const res = await api.put(`/products/${id}`, data);
    return res.data;
  },

  async deleteProduct(id) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};
