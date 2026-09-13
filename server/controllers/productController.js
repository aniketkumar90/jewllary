const Product = require('../models/Product');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const slugify = require('slugify');
const { deleteImage } = require('../config/cloudinary');

// @desc    Get products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      collection: collectionParam,
      minPrice,
      maxPrice,
      material,
      inStock,
      featured,
      newArrival,
      bestseller,
      sort,
      status = 'active',
      isAdmin = 'false',
    } = req.query;

    const query = {};

    // Filter by status (public view only sees active products)
    if (isAdmin !== 'true') {
      query.status = 'active';
    } else if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by Category (slug or ID)
    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          return res.json({
            success: true,
            products: [],
            total: 0,
            pages: 0,
            page: Number(page),
          });
        }
      }
    }

    // Filter by Collection (slug or ID)
    if (collectionParam) {
      if (collectionParam.match(/^[0-9a-fA-F]{24}$/)) {
        query.collectionId = collectionParam;
      } else {
        const foundCollection = await Collection.findOne({ slug: collectionParam });
        if (foundCollection) {
          query.collectionId = foundCollection._id;
        } else {
          return res.json({
            success: true,
            products: [],
            total: 0,
            pages: 0,
            page: Number(page),
          });
        }
      }
    }

    // Price filtering
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
    }

    // Material filtering
    if (material) {
      query.material = { $regex: material, $options: 'i' };
    }

    // In Stock filtering
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Tags
    if (featured === 'true') query.featured = true;
    if (newArrival === 'true') query.newArrival = true;
    if (bestseller === 'true') query.bestseller = true;

    // Search query (name, SKU, shortDescription)
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } },
        { shortDescription: { $regex: search.trim(), $options: 'i' } },
        { material: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    let sortCriteria = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortCriteria = { price: 1 };
    else if (sort === 'price_desc') sortCriteria = { price: -1 };
    else if (sort === 'rating') sortCriteria = { rating: -1 };
    else if (sort === 'name') sortCriteria = { name: 1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('collectionId', 'name slug')
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      products,
      total,
      pages: Math.ceil(total / limitNum),
      page: pageNum,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug or id
// @route   GET /api/products/:identifier
// @access  Public
const getProductBySlug = async (req, res, next) => {
  try {
    const { identifier } = req.params;
    let product;

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier)
        .populate('category', 'name slug')
        .populate('collectionId', 'name slug');
    }

    if (!product) {
      product = await Product.findOne({ slug: identifier })
        .populate('category', 'name slug')
        .populate('collectionId', 'name slug');
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:id/related
// @access  Public
const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentProduct = await Product.findById(id);

    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: id },
      status: 'active',
      $or: [
        { category: currentProduct.category },
        { collectionId: currentProduct.collectionId },
      ],
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json({
      success: true,
      products: related,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      category,
      collectionId,
      shortDescription,
      description,
      price,
      salePrice,
      material,
      weight,
      size,
      stock,
      mainImage,
      galleryImages,
      featured,
      newArrival,
      bestseller,
      status,
      seoTitle,
      seoDescription,
    } = req.body;

    if (!name || !sku || !category || !description || price === undefined || !mainImage) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all mandatory fields: name, sku, category, description, price, and mainImage',
      });
    }

    const skuExists = await Product.findOne({ sku: sku.toUpperCase() });
    if (skuExists) {
      return res.status(400).json({
        success: false,
        message: 'A product with this SKU already exists',
      });
    }

    let slug = slugify(name, { lower: true, strict: true });
    const slugExists = await Product.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await Product.create({
      name,
      slug,
      sku: sku.toUpperCase(),
      category,
      collectionId: collectionId || null,
      shortDescription,
      description,
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      material: material || '18K Gold',
      weight: weight || '10g',
      size: size || 'Standard',
      stock: Number(stock) || 0,
      mainImage,
      galleryImages: galleryImages || [],
      featured: Boolean(featured),
      newArrival: Boolean(newArrival),
      bestseller: Boolean(bestseller),
      status: status || 'active',
      seoTitle: seoTitle || name,
      seoDescription: seoDescription || shortDescription,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('collectionId', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.sku && req.body.sku.toUpperCase() !== product.sku) {
      const skuExists = await Product.findOne({
        sku: req.body.sku.toUpperCase(),
        _id: { $ne: product._id },
      });
      if (skuExists) {
        return res.status(400).json({ success: false, message: 'SKU already assigned to another product' });
      }
      product.sku = req.body.sku.toUpperCase();
    }

    if (req.body.name && req.body.name !== product.name) {
      product.name = req.body.name;
      let newSlug = slugify(req.body.name, { lower: true, strict: true });
      const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
      if (slugExists) {
        newSlug = `${newSlug}-${Date.now().toString().slice(-4)}`;
      }
      product.slug = newSlug;
    }

    const fields = [
      'category',
      'collectionId',
      'shortDescription',
      'description',
      'price',
      'salePrice',
      'material',
      'weight',
      'size',
      'stock',
      'mainImage',
      'galleryImages',
      'featured',
      'newArrival',
      'bestseller',
      'status',
      'seoTitle',
      'seoDescription',
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('category', 'name slug')
      .populate('collectionId', 'name slug');

    res.json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Clean up Cloudinary images if public_id exists
    if (product.mainImage && product.mainImage.public_id) {
      await deleteImage(product.mainImage.public_id);
    }
    if (product.galleryImages && product.galleryImages.length > 0) {
      for (const img of product.galleryImages) {
        if (img.public_id) await deleteImage(img.public_id);
      }
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
