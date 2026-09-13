const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a category name'],
    unique: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    secure_url: { type: String, default: '' },
    public_id: { type: String, default: '' },
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  seoTitle: {
    type: String,
    default: '',
  },
  seoDescription: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Category', categorySchema);
