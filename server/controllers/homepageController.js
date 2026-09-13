const Homepage = require('../models/Homepage');

// @desc    Get homepage dynamic content
// @route   GET /api/homepage
// @access  Public
const getHomepageData = async (req, res, next) => {
  try {
    let homepage = await Homepage.findOne();

    if (!homepage) {
      // Default luxury initial content
      homepage = await Homepage.create({
        hero: {
          smallText: 'THE ART OF ELEGANCE',
          heading: 'Timeless Jewellery, Made For You',
          description: 'Discover jewellery designed to celebrate your most beautiful moments.',
          buttonText: 'Explore Collection',
          buttonLink: '/jewellery',
          image: {
            secure_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
            public_id: '',
          },
        },
        brandStory: {
          badge: 'OUR HERITAGE',
          heading: 'A Legacy of Indian Royal Craftsmanship',
          description: 'Each masterpiece at Vanya is handcrafted by master karigars whose generations have preserved royal goldsmithing traditions. From hand-strung Basra pearls to uncut Polki diamonds set in 22K hallmarked gold, we sculpt timeless heirlooms for modern royalty.',
          image: {
            secure_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop',
            public_id: '',
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
          buttonText: 'Book Consultation',
          buttonLink: '/contact',
          image: {
            secure_url: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop',
            public_id: '',
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
    }

    res.json({
      success: true,
      homepage,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update homepage dynamic content
// @route   PUT /api/homepage
// @access  Private/Admin
const updateHomepageData = async (req, res, next) => {
  try {
    let homepage = await Homepage.findOne();

    if (!homepage) {
      homepage = new Homepage(req.body);
    } else {
      if (req.body.hero) homepage.hero = { ...homepage.hero.toObject(), ...req.body.hero };
      if (req.body.brandStory) homepage.brandStory = { ...homepage.brandStory.toObject(), ...req.body.brandStory };
      if (req.body.luxuryBanner) homepage.luxuryBanner = { ...homepage.luxuryBanner.toObject(), ...req.body.luxuryBanner };
      if (req.body.instagramGallery) homepage.instagramGallery = req.body.instagramGallery;
    }

    await homepage.save();

    res.json({
      success: true,
      message: 'Homepage CMS content updated successfully',
      homepage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHomepageData,
  updateHomepageData,
};
