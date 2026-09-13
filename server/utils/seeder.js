require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Banner = require('../models/Banner');
const Homepage = require('../models/Homepage');
const Settings = require('../models/Settings');
const { sampleCategories, sampleCollections, sampleProducts } = require('./sampleData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vanya_jewels';
    console.log(`[Seeder] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Clearing previous collections...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Collection.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});
    await Banner.deleteMany({});
    await Homepage.deleteMany({});
    await Settings.deleteMany({});

    console.log('[Seeder] Seeding Users...');
    const adminUser = await User.create({
      name: 'New Shiv Jewellers Concierge (Admin)',
      email: 'admin@vanya.com',
      password: 'Admin@123456',
      phone: '+91 98200 12345',
      role: 'admin',
    });

    const demoCustomer = await User.create({
      name: 'Priyanka Sharma',
      email: 'customer@vanya.com',
      password: 'Customer@123456',
      phone: '+91 98111 54321',
      role: 'user',
      addresses: [
        {
          name: 'Priyanka Sharma',
          phone: '+91 98111 54321',
          addressLine1: 'B-402, Imperial Heights, Altamount Road',
          addressLine2: 'Near Cumballa Hill Hospital',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400026',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    console.log('[Seeder] Seeding Categories...');
    const createdCategories = await Category.insertMany(sampleCategories);
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    console.log('[Seeder] Seeding Collections...');
    const createdCollections = await Collection.insertMany(sampleCollections);
    const collectionMap = {};
    createdCollections.forEach((col) => {
      collectionMap[col.slug] = col._id;
    });

    console.log('[Seeder] Seeding Products...');
    const productsWithRefs = sampleProducts.map((p) => {
      const { categorySlug, collectionSlug, ...rest } = p;
      return {
        ...rest,
        category: categoryMap[categorySlug] || createdCategories[0]._id,
        collectionId: collectionMap[collectionSlug] || null,
        status: 'active',
      };
    });
    const createdProducts = await Product.insertMany(productsWithRefs);

    console.log('[Seeder] Seeding Homepage CMS...');
    await Homepage.create({
      hero: {
        smallText: 'EST. 2024 • FINE JEWELS',
        heading: 'New Shiv Jewellers\nTimeless Royal Heirlooms',
        description: 'Discover jewellery designed to celebrate your most beautiful moments. Handcrafted in 22K hallmarked gold, uncut Polki diamonds, and sacred temple jewels.',
        buttonText: 'Explore Collection',
        buttonLink: '/jewellery',
        image: {
          secure_url: '/images/hero-banner.png',
          public_id: 'new_shiv_hero_banner',
        },
      },
      brandStory: {
        badge: 'OUR HERITAGE',
        heading: 'New Shiv Jewellers — A Saga of Divine Craftsmanship',
        description: 'Each masterpiece at New Shiv Jewellers is handcrafted by master karigars whose generations have preserved royal goldsmithing traditions. From hand-strung Basra pearls to uncut Polki diamonds set in 22K hallmarked gold, we sculpt timeless heirlooms for modern royalty.',
        image: {
          secure_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
          public_id: 'sample_brand_story',
        },
        stats: [
          { value: '100%', label: 'Certified BIS Hallmarked' },
          { value: '4 Decades', label: 'Artisanal Heritage' },
          { value: '50,000+', label: 'Heirlooms Crafted' },
        ],
      },
      luxuryBanner: {
        title: 'The Royal Bridal Affair',
        subtitle: 'BESPOKE BRIDAL TROUSSEAU',
        description: 'Book a private virtual or salon consultation with our master jewellery stylists to curate your bridal heirloom suite.',
        buttonText: 'Book Private Appointment',
        buttonLink: '/contact',
        image: {
          secure_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop',
          public_id: 'sample_luxury_banner',
        },
      },
      instagramGallery: [
        { image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop', link: 'https://instagram.com', handle: '@vanyajewels' },
        { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop', link: 'https://instagram.com', handle: '@vanyajewels' },
        { image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=600&auto=format&fit=crop', link: 'https://instagram.com', handle: '@vanyajewels' },
        { image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop', link: 'https://instagram.com', handle: '@vanyajewels' },
        { image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop', link: 'https://instagram.com', handle: '@vanyajewels' },
        { image: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=600&auto=format&fit=crop', link: 'https://instagram.com', handle: '@vanyajewels' },
      ],
    });

    console.log('[Seeder] Seeding Banners...');
    await Banner.create([
      {
        title: 'Heirloom Polki Diamonds',
        subtitle: 'UNVEILING CHAPTER IV',
        description: 'Spectacular uncut diamonds framed in 22K vintage gold leaf.',
        image: {
          secure_url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?q=80&w=1600&auto=format&fit=crop',
          public_id: 'banner_hero',
        },
        buttonText: 'Discover Chapter IV',
        buttonLink: '/collections/royal-bridal-heritage',
        position: 'middle',
        status: 'active',
      },
    ]);

    console.log('[Seeder] Seeding Initial Order...');
    await Order.create({
      orderNumber: 'VY-2026-89412',
      user: demoCustomer._id,
      customerEmail: demoCustomer.email,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          sku: createdProducts[0].sku,
          price: createdProducts[0].salePrice || createdProducts[0].price,
          quantity: 1,
          image: createdProducts[0].mainImage.secure_url,
        },
      ],
      shippingAddress: {
        ...demoCustomer.addresses[0].toObject(),
        email: demoCustomer.email,
      },
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      orderStatus: 'Confirmed',
      subtotal: createdProducts[0].salePrice || createdProducts[0].price,
      shipping: 0,
      total: createdProducts[0].salePrice || createdProducts[0].price,
      timeline: [
        { status: 'Order Placed', date: new Date(), note: 'Order placed by client.' },
        { status: 'Confirmed', date: new Date(), note: 'Vault verified and certified.' },
      ],
    });

    console.log('[Seeder] Seeding Sample Reviews...');
    await Review.create([
      {
        product: createdProducts[0]._id,
        user: demoCustomer._id,
        userName: demoCustomer.name,
        rating: 5,
        comment: 'Breathtaking artistry! The polki diamonds have extraordinary fire and the basra pearl drape feels so luxurious. Arrived in a velvet lockbox.',
        status: 'approved',
      },
      {
        product: createdProducts[1]._id,
        user: demoCustomer._id,
        userName: 'Vikramaditya Singhania',
        rating: 5,
        comment: 'The emerald cut solitaire is perfection. Flawless proportion and the platinum band is understated luxury.',
        status: 'approved',
      },
    ]);

    console.log('[Seeder] Seeding Settings...');
    await Settings.create({
      storeName: 'VANYA Haute Joaillerie',
      tagline: 'Timeless Luxury & Royal Indian Craftsmanship',
      contactEmail: 'concierge@vanyajewels.com',
      contactPhone: '+91 (0) 22 8976 5432',
      address: 'Maison Vanya, Heritage Promenade, Colaba, Mumbai 400001, India',
      currency: 'INR',
      currencySymbol: '₹',
      freeShippingThreshold: 0,
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Admin Account:    admin@vanya.com / Admin@123456');
    console.log('Customer Account: customer@vanya.com / Customer@123456');
    console.log(`Categories:       ${createdCategories.length}`);
    console.log(`Collections:      ${createdCollections.length}`);
    console.log(`Products:         ${createdProducts.length}`);
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder Error:', error);
    process.exit(1);
  }
};

seedDatabase();
