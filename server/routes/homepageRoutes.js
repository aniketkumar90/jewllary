const express = require('express');
const router = express.Router();
const {
  getHomepageData,
  updateHomepageData,
} = require('../controllers/homepageController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getHomepageData)
  .put(protect, requireAdmin, updateHomepageData);

module.exports = router;
