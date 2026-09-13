const Media = require('../models/Media');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const path = require('path');

// @desc    Upload media to Cloudinary (or local fallback)
// @route   POST /api/media/upload
// @access  Private/Admin
const uploadMedia = async (req, res, next) => {
  try {
    if (!req.file && (!req.files || req.files.length === 0)) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const files = req.files ? req.files : [req.file];
    const uploadResults = [];

    for (const file of files) {
      const uploadData = await uploadImage(file.path, 'vanya_jewels');

      const mediaRecord = await Media.create({
        fileName: file.originalname,
        secure_url: uploadData.secure_url,
        public_id: uploadData.public_id,
        fileSize: file.size,
        format: path.extname(file.originalname).replace('.', '').toLowerCase(),
      });

      uploadResults.push({
        id: mediaRecord._id,
        fileName: mediaRecord.fileName,
        secure_url: mediaRecord.secure_url,
        public_id: mediaRecord.public_id,
        createdAt: mediaRecord.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: req.file ? uploadResults[0] : uploadResults,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all media library items
// @route   GET /api/media
// @access  Private/Admin
const getMediaList = async (req, res, next) => {
  try {
    const { page = 1, limit = 24, search } = req.query;
    const query = {};

    if (search && search.trim()) {
      query.fileName = { $regex: search.trim(), $options: 'i' };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await Media.countDocuments(query);
    const media = await Media.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum);

    res.json({
      success: true,
      media,
      total,
      pages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media item
// @route   DELETE /api/media/:id
// @access  Private/Admin
const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ success: false, message: 'Media record not found' });
    }

    if (media.public_id) {
      await deleteImage(media.public_id);
    }

    await media.deleteOne();

    res.json({
      success: true,
      message: 'Media deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadMedia,
  getMediaList,
  deleteMedia,
};
