const Banner = require('../models/Banner');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all active banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res, next) => {
  try {
    const { position, status, isAdmin } = req.query;
    const query = {};

    if (isAdmin !== 'true') {
      query.status = 'active';
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (position) {
      query.position = position;
    }

    const banners = await Banner.find(query).sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res, next) => {
  try {
    const {
      title,
      subtitle,
      description,
      image,
      buttonText,
      buttonLink,
      position,
      status,
      order,
    } = req.body;

    if (!title || !image) {
      return res.status(400).json({ success: false, message: 'Title and image are required' });
    }

    const banner = await Banner.create({
      title,
      subtitle: subtitle || '',
      description: description || '',
      image,
      buttonText: buttonText || 'Discover Now',
      buttonLink: buttonLink || '/jewellery',
      position: position || 'middle',
      status: status || 'active',
      order: Number(order) || 0,
    });

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    const fields = ['title', 'subtitle', 'description', 'image', 'buttonText', 'buttonLink', 'position', 'status', 'order'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) banner[field] = req.body[field];
    });

    await banner.save();

    res.json({
      success: true,
      message: 'Banner updated successfully',
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (banner.image && banner.image.public_id) {
      await deleteImage(banner.image.public_id);
    }

    await banner.deleteOne();

    res.json({
      success: true,
      message: 'Banner deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
