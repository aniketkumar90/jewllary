const Newsletter = require('../models/Newsletter');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: 'You are already a distinguished subscriber to our private salon updates.',
      });
    }

    await Newsletter.create({ email: email.toLowerCase() });

    res.status(201).json({
      success: true,
      message: 'Welcome to VANYA. You are now subscribed to our private salon updates.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/newsletter
// @access  Private/Admin
const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      subscribers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subscriber
// @route   DELETE /api/newsletter/:id
// @access  Private/Admin
const deleteSubscriber = async (req, res, next) => {
  try {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
      return res.status(404).json({ success: false, message: 'Subscriber not found' });
    }

    await subscriber.deleteOne();

    res.json({
      success: true,
      message: 'Subscriber removed',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  subscribe,
  getSubscribers,
  deleteSubscriber,
};
