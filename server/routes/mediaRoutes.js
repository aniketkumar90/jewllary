const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadMedia,
  getMediaList,
  deleteMedia,
} = require('../controllers/mediaController');
const { protect } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');

router.use(protect, requireAdmin);

router.post('/upload', upload.single('image'), uploadMedia);
router.post('/upload-multiple', upload.array('images', 10), uploadMedia);
router.get('/', getMediaList);
router.delete('/:id', deleteMedia);

module.exports = router;
