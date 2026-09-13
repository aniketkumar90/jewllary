const mongoose = require('mongoose');

const instagramImageSchema = new mongoose.Schema({
  image: { type: String, required: true },
  link: { type: String, default: 'https://instagram.com' },
  handle: { type: String, default: '@vanyajewellery' },
}, { _id: false });

const homepageSchema = new mongoose.Schema({
  hero: {
    smallText: { type: String, default: 'THE ART OF ELEGANCE' },
    heading: { type: String, default: 'Timeless Jewellery, Made For You' },
    description: { type: String, default: 'Discover jewellery designed to celebrate your most beautiful moments.' },
    buttonText: { type: String, default: 'Explore Collection' },
    buttonLink: { type: String, default: '/jewellery' },
    image: {
      secure_url: { type: String, default: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop' },
      public_id: { type: String, default: '' },
    },
  },
  brandStory: {
    badge: { type: String, default: 'OUR HERITAGE' },
    heading: { type: String, default: 'A Legacy of Indian Royal Craftsmanship' },
    description: {
      type: String,
      default: 'Each masterpiece at Vanya is handcrafted by master karigars whose generations have preserved the royal goldsmithing traditions of Rajasthan and Bengal. From hand-strung Basra pearls to uncut Polki diamonds set in 22K hallmarked gold, we sculpt timeless heirlooms for modern royalty.',
    },
    image: {
      secure_url: { type: String, default: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1200&auto=format&fit=crop' },
      public_id: { type: String, default: '' },
    },
    stats: [{
      value: { type: String, default: '' },
      label: { type: String, default: '' },
    }],
  },
  luxuryBanner: {
    title: { type: String, default: 'The Royal Bridal Affair' },
    subtitle: { type: String, default: 'BESPOKE BRIDAL TROUSSEAU' },
    description: { type: String, default: 'Book a private virtual or salon consultation with our master jewellery stylists to curate your bridal heirloom suite.' },
    buttonText: { type: String, default: 'Book Consultation' },
    buttonLink: { type: String, default: '/contact' },
    image: {
      secure_url: { type: String, default: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1600&auto=format&fit=crop' },
      public_id: { type: String, default: '' },
    },
  },
  instagramGallery: [instagramImageSchema],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Homepage', homepageSchema);
