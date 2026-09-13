const express = require('express');
const router = express.Router();
const {
  subscribe,
  getSubscribers,
  deleteSubscriber,
} = require('../controllers/newsletterController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.post('/subscribe', subscribe);

// Admin routes
router.get('/', protect, requireAdmin, getSubscribers);
router.delete('/:id', protect, requireAdmin, deleteSubscriber);

module.exports = router;
