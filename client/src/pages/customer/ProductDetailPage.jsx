import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import PriceDisplay from '../../components/common/PriceDisplay';
import ProductGrid from '../../components/customer/ProductGrid';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productService } from '../../services/productService';
import { reviewService } from '../../services/reviewService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  FiShield,
  FiAward,
  FiTruck,
  FiPhone,
  FiMessageCircle,
  FiCalendar,
  FiStar,
  FiCheck,
} from 'react-icons/fi';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('details'); // details | shipping | returns

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductBySlug(slug);
        if (res.product) {
          setProduct(res.product);
          setActiveImage(0);

          // Fetch related products & reviews
          const [relRes, revRes] = await Promise.all([
            productService.getRelatedProducts(res.product._id),
            reviewService.getProductReviews(res.product._id),
          ]);
          if (relRes.products) setRelatedProducts(relRes.products);
          if (revRes.reviews) setReviews(revRes.reviews);
        }
      } catch (error) {
        console.error('[ProductDetail Error]:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Unlocking Royal Vault Creation..." />;
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center max-w-md mx-auto min-h-screen bg-[#0e1610] text-ivory">
        <h2 className="text-2xl font-serif text-ivory mb-2">Creations Not Found</h2>
        <p className="text-xs text-ivory/60 mb-6">The requested piece may have been reserved or moved.</p>
        <Link to="/jewellery">
          <Button variant="gold">Return to Jewellery</Button>
        </Link>
      </div>
    );
  }

  const images = [
    product.mainImage?.secure_url,
    ...(product.galleryImages?.map((img) => img.secure_url) || []),
  ].filter(Boolean);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info('Please sign in to submit a review');
      navigate('/login');
      return;
    }
    if (!reviewComment.trim()) {
      toast.error('Please write a brief comment');
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewService.createReview({
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      toast.success(res.message || 'Review submitted successfully');
      setReviews((prev) => [res.review, ...prev]);
      setReviewComment('');
    } catch (err) {
      toast.error(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const breadcrumbItems = [
    { label: 'Jewellery', path: '/jewellery' },
    ...(product.category ? [{ label: product.category.name, path: `/jewellery/${product.category.slug}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Product Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pt-4 pb-16 items-start">
          {/* Left: Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:w-24 flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square w-20 md:w-full rounded-md border overflow-hidden transition-all duration-300 bg-[#131c15] ${
                      activeImage === idx
                        ? 'border-gold-400 ring-2 ring-gold-400/60 shadow-lg shadow-gold-500/10'
                        : 'border-gold-500/25 opacity-60 hover:opacity-100 hover:border-gold-400/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image with Arched Palace Jharokha Framing */}
            <div className="flex-1 relative aspect-[4/5] rounded-t-[80px] sm:rounded-t-[120px] rounded-b-md bg-[#131c15] border border-gold-400/40 overflow-hidden shadow-2xl shadow-black/70 group">
              <img
                src={images[activeImage] || product.mainImage?.secure_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 brightness-[0.95]"
              />

              {/* Ambient Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-transparent to-transparent opacity-60 pointer-events-none" />

              {/* Double Inset Gold Arch Border */}
              <div className="absolute inset-2.5 sm:inset-3.5 border border-gold-400/30 rounded-t-[70px] sm:rounded-t-[105px] rounded-b-sm pointer-events-none transition-colors duration-500 group-hover:border-gold-400/55" />
            </div>
          </div>

          {/* Right: Specifications & Inquiries (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
                ✦ {product.category?.name || 'Haute Joaillerie'}
                {product.collectionId && ` • ${product.collectionId.name}`} ✦
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif text-ivory font-normal leading-snug">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-xs text-ivory/60">
                <span className="uppercase tracking-widest font-mono text-[11px] text-gold-400/80">
                  SKU: {product.sku}
                </span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                  <FiCheck /> {product.stock > 0 ? 'Vault Reserved / Ready for Dispatch' : 'Made to Order'}
                </span>
              </div>
            </div>

            {/* Price Display */}
            <div className="pt-2 border-t border-gold-400/25">
              <PriceDisplay
                price={product.price}
                salePrice={product.salePrice}
                size="xl"
                light={true}
              />
              <p className="text-[11px] text-ivory/60 mt-1">
                Inclusive of all taxes. Complimentary insured white-glove delivery across India.
              </p>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-ivory/75 leading-relaxed font-sans font-light">
              {product.shortDescription || product.description}
            </p>

            {/* Hallmark & Specification Matrix */}
            <div className="bg-[#142318] border border-gold-400/30 rounded-lg p-5 divide-y divide-gold-500/20 text-xs shadow-xl shadow-black/40">
              <div className="py-2.5 flex justify-between">
                <span className="text-gold-300/80 uppercase tracking-wider text-[11px]">Precious Metal</span>
                <span className="font-medium text-ivory">{product.material}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gold-300/80 uppercase tracking-wider text-[11px]">Gross Weight</span>
                <span className="font-medium text-ivory">{product.weight}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gold-300/80 uppercase tracking-wider text-[11px]">Sizing / Dimensions</span>
                <span className="font-medium text-ivory">{product.size}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gold-300/80 uppercase tracking-wider text-[11px]">Certification</span>
                <span className="font-medium text-gold-300">BIS 916 Hallmarked & GIA/IGI</span>
              </div>
            </div>

            {/* Bespoke Royal Inquiries & Private Consultations */}
            <div className="space-y-3 pt-4 border-t border-gold-400/25">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(
                    `Namaste New Shiv Jewellers, I am interested in inquiring about "${product.name}" (SKU: ${product.sku}). Please share availability and details.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button
                    variant="forest"
                    fullWidth
                    size="lg"
                    icon={FiMessageCircle}
                  >
                    WhatsApp Concierge
                  </Button>
                </a>

                <Link to={`/contact?product=${encodeURIComponent(product.name)}`} className="w-full">
                  <Button
                    variant="gold"
                    fullWidth
                    size="lg"
                    icon={FiCalendar}
                  >
                    Book Private Viewing
                  </Button>
                </Link>
              </div>

              <div className="p-3.5 bg-[#18281d] border border-gold-400/30 rounded-lg flex items-center justify-between text-xs">
                <span className="text-ivory/70">Private Jewellery Salon Helpline:</span>
                <a href="tel:+919876543210" className="font-medium text-gold-300 hover:text-gold-200 flex items-center gap-1.5 transition-colors">
                  <FiPhone /> +91 (0) 98765 43210
                </a>
              </div>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gold-400/25 text-center text-[10px] text-ivory/60 uppercase tracking-wider">
              <div className="flex flex-col items-center">
                <FiAward className="text-lg text-gold-400 mb-1" />
                <span>100% Certified</span>
              </div>
              <div className="flex flex-col items-center">
                <FiTruck className="text-lg text-gold-400 mb-1" />
                <span>Insured Delivery</span>
              </div>
              <div className="flex flex-col items-center">
                <FiShield className="text-lg text-gold-400 mb-1" />
                <span>Lifetime Exchange</span>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Tabs */}
        <div className="mt-12 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-10 shadow-2xl shadow-black/50">
          <div className="flex border-b border-gold-400/25 gap-8 pb-4 text-xs sm:text-sm uppercase tracking-luxury font-medium">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'details' ? 'text-gold-300 font-semibold' : 'text-ivory/50 hover:text-gold-300/80'
              }`}
            >
              Artisanal Craftsmanship
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'shipping' ? 'text-gold-300 font-semibold' : 'text-ivory/50 hover:text-gold-300/80'
              }`}
            >
              Complimentary Shipping
              {activeTab === 'shipping' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('returns')}
              className={`pb-2 transition-colors relative ${
                activeTab === 'returns' ? 'text-gold-300 font-semibold' : 'text-ivory/50 hover:text-gold-300/80'
              }`}
            >
              30-Day Inspection & Exchange
              {activeTab === 'returns' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.7)]" />
              )}
            </button>
          </div>

          <div className="py-6 text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans font-light">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description}</p>
                <p>
                  Every gemstone and diamond undergoes microscopic examination by our in-house gemologists. Hallmarked under the Bureau of Indian Standards (BIS) regulations, your piece is etched with a laser identification hallmark guaranteeing purity.
                </p>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="space-y-3 max-w-3xl">
                <p>
                  We offer <strong className="text-gold-300 font-medium">complimentary, fully insured white-glove courier delivery</strong> across all pin codes in India.
                </p>
                <p>
                  Your heirloom is transported inside a discreet, tamper-evident steel lockbox. Delivery requires one-time password (OTP) verification and government identification of the recipient upon arrival.
                </p>
                <p className="text-gold-400 font-medium">Standard Delivery Timeline: 2 - 4 Business Days.</p>
              </div>
            )}
            {activeTab === 'returns' && (
              <div className="space-y-3 max-w-3xl">
                <p>
                  We provide a complimentary <strong className="text-gold-300 font-medium">30-Day Inspection Period</strong>. If you are not completely enchanted by your heirloom, our concierge will arrange an insured return collection for an exchange or full refund.
                </p>
                <p>
                  Additionally, all New Shiv Jewellers fine jewellery enjoys our <strong className="text-gold-300 font-medium">Lifetime Buyback & Exchange Guarantee</strong> across our showrooms.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-[#142318] border border-gold-400/35 rounded-xl p-6 sm:p-10 shadow-2xl shadow-black/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gold-400/25 gap-4">
            <div>
              <h3 className="font-serif text-2xl text-ivory font-normal">
                Patron Reflections & Reviews
              </h3>
              <p className="text-xs text-gold-400/80 mt-1">
                Average Rating: ★ {product.rating.toFixed(1)} ({reviews.length} reviews)
              </p>
            </div>
          </div>

          {/* Reviews List */}
          <div className="divide-y divide-gold-500/20 py-6">
            {reviews.length === 0 ? (
              <p className="text-xs text-ivory/50 py-6 text-center">
                Be the first distinguished patron to review this masterpiece.
              </p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="py-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-base text-ivory font-normal">
                      {rev.userName}
                    </span>
                    <span className="text-gold-400 text-xs tracking-wider">
                      {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-ivory/75 leading-relaxed font-light">
                    "{rev.comment}"
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Submit Review Form */}
          <div className="mt-8 pt-8 border-t border-gold-400/25 max-w-xl">
            <h4 className="font-serif text-lg text-ivory mb-3">Leave a Patron Reflection</h4>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-gold-300/90 mb-1.5">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map((num) => (
                    <button
                      type="button"
                      key={num}
                      onClick={() => setReviewRating(num)}
                      className={`px-3.5 py-1.5 text-xs border rounded-sm transition-all duration-200 ${
                        reviewRating === num
                          ? 'border-gold-400 bg-gold-500/20 text-gold-300 font-bold shadow-md shadow-gold-500/10'
                          : 'border-gold-500/30 text-ivory/70 hover:border-gold-400/50 hover:text-gold-300'
                      }`}
                    >
                      {num} ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-luxury text-gold-300/90 mb-1.5">
                  Reflection / Comment
                </label>
                <textarea
                  rows="3"
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience with this heirloom..."
                  className="w-full bg-[#18281d] border border-gold-500/35 p-3.5 text-xs font-sans rounded-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold-400 focus:bg-[#1f3227] transition-all"
                />
              </div>

              <Button type="submit" variant="gold" size="sm" loading={submittingReview}>
                Submit Review
              </Button>
            </form>
          </div>
        </div>

        {/* You May Also Like */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-1 block">
                ✦ Harmonious Complements ✦
              </span>
              <h2 className="text-3xl font-serif text-ivory font-normal">
                You May Also Admire
              </h2>
            </div>
            <ProductGrid products={relatedProducts} columns={4} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
