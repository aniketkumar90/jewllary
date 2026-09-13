const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getCollections)
  .post(protect, requireAdmin, createCollection);

router.route('/:identifier')
  .get(getCollectionBySlug);

router.route('/:id')
  .put(protect, requireAdmin, updateCollection)
  .delete(protect, requireAdmin, deleteCollection);

module.exports = router;
