const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/', protect, createReview);

// Admin routes
router.get('/', protect, requireAdmin, getAllReviews);
router.put('/:id/status', protect, requireAdmin, updateReviewStatus);
router.delete('/:id', protect, requireAdmin, deleteReview);

module.exports = router;
