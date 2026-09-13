const Category = require('../models/Category');
const Product = require('../models/Product');
const slugify = require('slugify');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const { status, isAdmin } = req.query;
    const query = {};
    if (isAdmin !== 'true') {
      query.status = 'active';
    } else if (status && status !== 'all') {
      query.status = status;
    }

    const categories = await Category.find(query).sort({ createdAt: 1 });

    // Attach product counts
    const categoriesWithCounts = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id, status: 'active' });
        return {
          ...cat.toObject(),
          productCount: count,
        };
      })
    );

    res.json({
      success: true,
      categories: categoriesWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by slug or ID
// @route   GET /api/categories/:identifier
// @access  Public
const getCategoryBySlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let category;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      category = await Category.findById(identifier);
    }
    if (!category) {
      category = await Category.findOne({ slug: identifier });
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, status, seoTitle, seoDescription } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    let slug = slugify(name, { lower: true, strict: true });
    const slugExists = await Category.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || { secure_url: '', public_id: '' },
      status: status || 'active',
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.name && req.body.name !== category.name) {
      category.name = req.body.name;
      let newSlug = slugify(req.body.name, { lower: true, strict: true });
      const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
      category.slug = newSlug;
    }

    if (req.body.description !== undefined) category.description = req.body.description;
    if (req.body.image !== undefined) category.image = req.body.image;
    if (req.body.status !== undefined) category.status = req.body.status;
    if (req.body.seoTitle !== undefined) category.seoTitle = req.body.seoTitle;
    if (req.body.seoDescription !== undefined) category.seoDescription = req.body.seoDescription;

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (category.image && category.image.public_id) {
      await deleteImage(category.image.public_id);
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
