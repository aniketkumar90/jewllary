import api from './api';

export const reviewService = {
  async getProductReviews(productId) {
    const res = await api.get(`/reviews/product/${productId}`);
    return res.data;
  },

  async createReview(data) {
    const res = await api.post('/reviews', data);
    return res.data;
  },

  async getAllReviews(params = {}) {
    const res = await api.get('/reviews', { params });
    return res.data;
  },

  async updateReviewStatus(id, status) {
    const res = await api.put(`/reviews/${id}/status`, { status });
    return res.data;
  },

  async deleteReview(id) {
    const res = await api.delete(`/reviews/${id}`);
    return res.data;
  },
};
