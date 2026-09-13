const Review = require('../models/Review');
const Product = require('../models/Product');

// Helper to recalculate product rating
const updateProductRating = async (productId) => {
  const approvedReviews = await Review.find({ product: productId, status: 'approved' });
  if (approvedReviews.length > 0) {
    const avg = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Number(avg.toFixed(1)),
      numReviews: approvedReviews.length,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      rating: 5.0,
      numReviews: 0,
    });
  }
};

// @desc    Get approved reviews for a product
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and comment' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      status: 'approved', // Auto-approved for luxury demo experience
    });

    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews
// @access  Private/Admin
const getAllReviews = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const reviews = await Review.find(query)
      .populate('product', 'name slug mainImage')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review status (Admin)
// @route   PUT /api/reviews/:id/status
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.status = status;
    await review.save();
    await updateProductRating(review.product);

    res.json({
      success: true,
      message: `Review ${status} successfully`,
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    const productId = review.product;
    await review.deleteOne();
    await updateProductRating(productId);

    res.json({
      success: true,
      message: 'Review deleted',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
