const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  storeName: {
    type: String,
    default: 'VANYA Haute Joaillerie',
  },
  tagline: {
    type: String,
    default: 'Timeless Luxury & Royal Indian Craftsmanship',
  },
  contactEmail: {
    type: String,
    default: 'concierge@vanyajewels.com',
  },
  contactPhone: {
    type: String,
    default: '+91 (0) 22 8976 5432',
  },
  address: {
    type: String,
    default: 'Maison Vanya, Heritage Promenade, Colaba, Mumbai 400001, India',
  },
  currency: {
    type: String,
    default: 'INR',
  },
  currencySymbol: {
    type: String,
    default: '₹',
  },
  freeShippingThreshold: {
    type: Number,
    default: 0, // Always complimentary
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Settings', settingsSchema);
