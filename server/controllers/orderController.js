const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (or Logged In)
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      notes,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.email || !shippingAddress.addressLine1 || !shippingAddress.city || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping details' });
    }

    // Verify stock & compute totals
    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.name} is no longer available` });
      }

      const itemPrice = product.salePrice || product.price;
      subtotal += itemPrice * item.quantity;

      verifiedItems.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        price: itemPrice,
        quantity: item.quantity,
        image: product.mainImage.secure_url,
      });

      // Decrement stock
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    const shipping = 0; // Complimentary luxury delivery
    const total = subtotal + shipping;

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VY-${dateStr}-${randomSuffix}`;

    const order = await Order.create({
      orderNumber,
      user: req.user ? req.user._id : null,
      customerEmail: shippingAddress.email.toLowerCase(),
      items: verifiedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      paymentStatus: paymentMethod === 'Online Payment (Demo UPI/Card)' ? 'Paid' : 'Pending',
      orderStatus: 'Confirmed',
      subtotal,
      shipping,
      total,
      notes: notes || '',
      timeline: [
        {
          status: 'Order Placed',
          date: new Date(),
          note: 'Your bespoke order has been placed and received by our concierge.',
        },
        {
          status: 'Confirmed',
          date: new Date(),
          note: 'Order confirmed and scheduled for vault verification and insured packing.',
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { customerEmail: req.user.email.toLowerCase() },
      ],
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID or orderNumber
// @route   GET /api/orders/:identifier
// @access  Public (with email match) or Private (owner / admin)
const getOrderById = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let order;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(identifier);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: identifier });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization check: admin or order owner
    if (req.user) {
      if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id) && order.customerEmail !== req.user.email) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    if (search && search.trim()) {
      query.$or = [
        { orderNumber: { $regex: search.trim(), $options: 'i' } },
        { 'shippingAddress.name': { $regex: search.trim(), $options: 'i' } },
        { customerEmail: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      orders,
      total,
      pages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, note } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'Delivered') {
      order.paymentStatus = 'Paid';
    }

    order.timeline.push({
      status: orderStatus,
      date: new Date(),
      note: note || `Order status updated to ${orderStatus}`,
    });

    await order.save();

    res.json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
