const express = require('express');
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require('../controllers/bannerController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getBanners)
  .post(protect, requireAdmin, createBanner);

router.route('/:id')
  .put(protect, requireAdmin, updateBanner)
  .delete(protect, requireAdmin, deleteBanner);

module.exports = router;
