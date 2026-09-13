const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  secure_url: {
    type: String,
    required: true,
  },
  public_id: {
    type: String,
    required: true,
    unique: true,
  },
  fileSize: {
    type: Number,
    default: 0,
  },
  format: {
    type: String,
    default: 'jpg',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Media', mediaSchema);
