const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    secure_url: { type: String, required: true },
    public_id: { type: String, default: '' },
  },
  buttonText: {
    type: String,
    default: 'Discover Now',
  },
  buttonLink: {
    type: String,
    default: '/jewellery',
  },
  position: {
    type: String,
    enum: ['hero', 'top', 'middle', 'bottom'],
    default: 'middle',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Banner', bannerSchema);
