const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  sku: { type: String, default: '' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' },
  },
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Online Payment (Demo UPI/Card)'],
    default: 'Cash on Delivery',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
    index: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
  shipping: {
    type: Number,
    default: 0, // Complimentary luxury courier & insurance
  },
  total: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
    default: '',
  },
  timeline: [{
    status: { type: String, required: true },
    date: { type: Date, default: Date.now },
    note: { type: String, default: '' },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
