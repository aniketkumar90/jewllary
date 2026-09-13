const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  secure_url: { type: String, required: true },
  public_id: { type: String, required: true },
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
  },
  sku: {
    type: String,
    required: [true, 'Please add a product SKU'],
    unique: true,
    uppercase: true,
    trim: true,
    index: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Please assign a category'],
    index: true,
  },
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collection',
    default: null,
    index: true,
  },
  shortDescription: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    required: [true, 'Please add product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0,
  },
  salePrice: {
    type: Number,
    default: null,
  },
  material: {
    type: String,
    default: '18K Yellow Gold', // e.g. 22K Yellow Gold, 18K Rose Gold, Platinum 950
  },
  weight: {
    type: String,
    default: '10.5g',
  },
  size: {
    type: String,
    default: 'Standard / Adjustable',
  },
  stock: {
    type: Number,
    required: true,
    default: 10,
    min: 0,
  },
  mainImage: {
    type: imageSchema,
    required: [true, 'Please provide a primary product image'],
  },
  galleryImages: [imageSchema],
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  newArrival: {
    type: Boolean,
    default: false,
    index: true,
  },
  bestseller: {
    type: Boolean,
    default: false,
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
    index: true,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  numReviews: {
    type: Number,
    default: 0,
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

// Compound text search index for fast product search
productSchema.index({
  name: 'text',
  sku: 'text',
  shortDescription: 'text',
  material: 'text',
});

module.exports = mongoose.model('Product', productSchema);
