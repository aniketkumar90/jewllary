const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, requireAdmin, createProduct);

router.route('/:identifier')
  .get(getProductBySlug);

router.route('/:id/related')
  .get(getRelatedProducts);

router.route('/:id')
  .put(protect, requireAdmin, updateProduct)
  .delete(protect, requireAdmin, deleteProduct);

module.exports = router;
