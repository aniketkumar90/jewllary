import api from './api';

export const orderService = {
  async createOrder(data) {
    const res = await api.post('/orders', data);
    return res.data;
  },

  async getMyOrders() {
    const res = await api.get('/orders/my-orders');
    return res.data;
  },

  async getOrderById(identifier) {
    const res = await api.get(`/orders/${identifier}`);
    return res.data;
  },

  async getAllOrders(params = {}) {
    const res = await api.get('/orders', { params });
    return res.data;
  },

  async updateOrderStatus(id, statusData) {
    const res = await api.put(`/orders/${id}/status`, statusData);
    return res.data;
  },
};
