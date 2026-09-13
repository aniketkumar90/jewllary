import api from './api';

export const cmsService = {
  // Homepage CMS
  async getHomepage() {
    const res = await api.get('/homepage');
    return res.data;
  },

  async updateHomepage(data) {
    const res = await api.put('/homepage', data);
    return res.data;
  },

  // Banners
  async getBanners(params = {}) {
    const res = await api.get('/banners', { params });
    return res.data;
  },

  async createBanner(data) {
    const res = await api.post('/banners', data);
    return res.data;
  },

  async updateBanner(id, data) {
    const res = await api.put(`/banners/${id}`, data);
    return res.data;
  },

  async deleteBanner(id) {
    const res = await api.delete(`/banners/${id}`);
    return res.data;
  },

  // Media Library & Cloudinary Upload
  async uploadMedia(formData) {
    const res = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async getMediaList(params = {}) {
    const res = await api.get('/media', { params });
    return res.data;
  },

  async deleteMedia(id) {
    const res = await api.delete(`/media/${id}`);
    return res.data;
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await api.post('/newsletter/subscribe', { email });
    return res.data;
  },

  async getSubscribers() {
    const res = await api.get('/newsletter');
    return res.data;
  },

  async deleteSubscriber(id) {
    const res = await api.delete(`/newsletter/${id}`);
    return res.data;
  },

  // Admin Dashboard & Users
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getUsers(params = {}) {
    const res = await api.get('/admin/users', { params });
    return res.data;
  },

  async updateUserRole(id, role) {
    const res = await api.put(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  async deleteUser(id) {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },

  // Store Settings
  async getSettings() {
    const res = await api.get('/admin/settings');
    return res.data;
  },

  async updateSettings(data) {
    const res = await api.put('/admin/settings', data);
    return res.data;
  },
};
