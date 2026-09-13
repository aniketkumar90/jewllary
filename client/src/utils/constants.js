export const BRAND_NAME = 'NEW SHIV JEWELLERS';
export const BRAND_TAGLINE = 'Fine Jewels';
export const BRAND_EST = 'Est. 2024';
export const BRAND_SUBTITLE = 'Fine Jewels & Royal Indian Craftsmanship';
export const BRAND_LOGO = '/images/logo.png';

export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Jewellery', path: '/jewellery' },
  { label: 'Collections', path: '/collections' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export const JEWELLERY_CATEGORIES = [
  { label: 'All Jewellery', slug: 'all', path: '/jewellery' },
  { label: 'Necklaces', slug: 'necklaces', path: '/jewellery/necklaces' },
  { label: 'Rings', slug: 'rings', path: '/jewellery/rings' },
  { label: 'Earrings', slug: 'earrings', path: '/jewellery/earrings' },
  { label: 'Bracelets & Bangles', slug: 'bracelets-bangles', path: '/jewellery/bracelets-bangles' },
  { label: 'Pendants', slug: 'pendants', path: '/jewellery/pendants' },
  { label: 'Royal Bridal', slug: 'bridal', path: '/jewellery/bridal' },
];

export const MATERIALS = [
  '22K Hallmarked Yellow Gold',
  '18K Yellow Gold',
  '18K Rose Gold',
  '18K White Gold',
  'Platinum 950',
  'Uncut Polki Diamonds',
  'Certified Solitaires',
  'Basra Pearls',
];

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Alphabetical: A-Z', value: 'name' },
];

export const ORDER_STATUS_COLORS = {
  Pending: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
  Confirmed: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
  Processing: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
  Shipped: 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40',
  Delivered: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
  Cancelled: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
};

