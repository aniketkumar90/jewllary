const Collection = require('../models/Collection');
const Product = require('../models/Product');
const slugify = require('slugify');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all collections
// @route   GET /api/collections
// @access  Public
const getCollections = async (req, res, next) => {
  try {
    const { status, featured, isAdmin } = req.query;
    const query = {};

    if (isAdmin !== 'true') {
      query.status = 'active';
    } else if (status && status !== 'all') {
      query.status = status;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    const collections = await Collection.find(query).sort({ createdAt: -1 });

    const collectionsWithCounts = await Promise.all(
      collections.map(async (col) => {
        const count = await Product.countDocuments({ collectionId: col._id, status: 'active' });
        return {
          ...col.toObject(),
          productCount: count,
        };
      })
    );

    res.json({
      success: true,
      collections: collectionsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get collection by slug or ID
// @route   GET /api/collections/:identifier
// @access  Public
const getCollectionBySlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let collection;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      collection = await Collection.findById(identifier);
    }
    if (!collection) {
      collection = await Collection.findOne({ slug: identifier });
    }

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    const products = await Product.find({ collectionId: collection._id, status: 'active' })
      .populate('category', 'name slug');

    res.json({
      success: true,
      collection,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = async (req, res, next) => {
  try {
    const { name, description, coverImage, status, featured, seoTitle, seoDescription } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Collection name is required' });
    }

    let slug = slugify(name, { lower: true, strict: true });
    const slugExists = await Collection.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const collection = await Collection.create({
      name,
      slug,
      description: description || '',
      coverImage: coverImage || { secure_url: '', public_id: '' },
      status: status || 'active',
      featured: featured !== undefined ? Boolean(featured) : true,
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Collection created successfully',
      collection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (req.body.name && req.body.name !== collection.name) {
      collection.name = req.body.name;
      let newSlug = slugify(req.body.name, { lower: true, strict: true });
      const slugExists = await Collection.findOne({ slug: newSlug, _id: { $ne: collection._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
      collection.slug = newSlug;
    }

    if (req.body.description !== undefined) collection.description = req.body.description;
    if (req.body.coverImage !== undefined) collection.coverImage = req.body.coverImage;
    if (req.body.status !== undefined) collection.status = req.body.status;
    if (req.body.featured !== undefined) collection.featured = Boolean(req.body.featured);
    if (req.body.seoTitle !== undefined) collection.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription !== undefined) collection.seoDescription = req.body.seoDescription;

    await collection.save();

    res.json({
      success: true,
      message: 'Collection updated successfully',
      collection,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ success: false, message: 'Collection not found' });
    }

    if (collection.coverImage && collection.coverImage.public_id) {
      await deleteImage(collection.coverImage.public_id);
    }

    await collection.deleteOne();

    res.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
};
