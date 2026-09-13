import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../../components/customer/HeroSection';
import SectionHeading from '../../components/customer/SectionHeading';
import CollectionGrid from '../../components/customer/CollectionGrid';
import ProductSlider from '../../components/customer/ProductSlider';
import BannerSection from '../../components/customer/BannerSection';
import InstagramGallery from '../../components/customer/InstagramGallery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { cmsService } from '../../services/cmsService';
import { collectionService } from '../../services/collectionService';
import { productService } from '../../services/productService';
import { FiAward, FiShield, FiPackage, FiFeather, FiArrowRight } from 'react-icons/fi';

const HomePage = () => {
  const [homepageData, setHomepageData] = useState(null);
  const [collections, setCollections] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [cmsRes, colRes, newRes, bestRes] = await Promise.all([
          cmsService.getHomepage(),
          collectionService.getCollections({ featured: 'true', limit: 4 }),
          productService.getProducts({ newArrival: 'true', limit: 8 }),
          productService.getProducts({ bestseller: 'true', limit: 4 }),
        ]);

        if (cmsRes.homepage) setHomepageData(cmsRes.homepage);
        if (colRes.collections) setCollections(colRes.collections);
        if (newRes.products) setNewArrivals(newRes.products);
        if (bestRes.products) setBestsellers(bestRes.products);
      } catch (error) {
        console.error('[HomePage] Data load error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner fullScreen label="Opening New Shiv Jewellers..." />;
  }

  const { hero, brandStory, luxuryBanner, instagramGallery } = homepageData || {};

  return (
    <div className="space-y-0">
      {/* 1. Hero Section */}
      <HeroSection heroData={hero} />

      {/* 2. New Arrivals (Continuous Auto-Scroll Slider with Matching Royal Theme) */}
      <section className="py-24 bg-[#18281d] text-ivory border-y border-gold-400/30 relative overflow-hidden">
        {/* Ambient Warm Golden Sunlight / Palace Garden Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_rgba(212,175,55,0.18),_transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,_rgba(212,175,55,0.10),_transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Centered Single Royal Heading */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-gold-400 font-semibold mb-2 block drop-shadow-sm">
              ✦ Chapter IV Unveiled ✦
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ivory font-normal tracking-wide leading-tight drop-shadow">
              New Haute Creations
            </h2>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mt-4" />
          </div>

          <ProductSlider products={newArrivals} />
        </div>
      </section>

      {/* 3. Luxury Bridal Promo Banner (The Pieces Our Patrons Reach For Most - Bento Grid) */}
      {luxuryBanner && <BannerSection banner={luxuryBanner} />}

      {/* 4. Featured Curated Chapters (Arched Royal Window Cards) */}
      <section className="relative py-24 sm:py-32 bg-[#1f3227] text-ivory overflow-hidden border-y border-gold-400/30">
        {/* Ambient Warm Golden Sunlight / Botanical Courtyard Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_rgba(212,175,55,0.22),_transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_40%,_rgba(40,70,50,0.35),_transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_60%,_rgba(212,175,55,0.12),_transparent_70%)] pointer-events-none" />
        
        {/* Subtle decorative gold filigree halo behind arches */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            subtitle="Curated Collections"
            title="Sagas in Gold & Solitaires"
            description="Step into our timeless sanctuaries of royal Indian heritage, where every collection unveils handcrafted heirlooms in 22K hallmarked gold, uncut polki diamonds, and celestial gems."
            light={true}
          />

          {/* 4 Arched Collection Cards side-by-side */}
          <CollectionGrid collections={collections.slice(0, 4)} />

          <div className="text-center mt-12 sm:mt-16">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-luxury text-gold-300 hover:text-gold-100 border-b border-gold-400/50 pb-1.5 transition-colors group"
            >
              <span>Explore All Royal Chapters</span>
              <FiArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1.5 text-gold-400" />
            </Link>
          </div>
        </div>

        {/* Floating Ambient Glow Base */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0d150f] to-transparent pointer-events-none" />
      </section>

      {/* 5. Brand Story Section with Cohesive Lighter Royal Styling */}
      {brandStory && (
        <section className="py-24 hero-header-bg text-ivory border-y border-gold-400/30 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Arched Palace Image Frame with double gold arch line */}
              <div className="relative">
                <div className="relative aspect-[4/5] overflow-hidden rounded-t-[140px] sm:rounded-t-[180px] rounded-b-md border border-gold-400/40 shadow-2xl bg-[#131c15]">
                  <img
                    src={brandStory.image?.secure_url}
                    alt="Master Goldsmith at work"
                    className="w-full h-full object-cover brightness-[0.82]"
                  />
                  {/* Double Inset Gold Arch Border */}
                  <div className="absolute inset-2 sm:inset-2.5 border border-gold-400/35 rounded-t-[125px] sm:rounded-t-[165px] rounded-b-sm pointer-events-none" />
                </div>
                {/* Floating Heritage Plaque */}
                <div className="absolute -bottom-6 -right-6 bg-forest-900 border border-gold-500/40 p-6 shadow-2xl max-w-xs hidden sm:block">
                  <p className="font-serif text-xl text-gold-300 font-normal">
                    "Every diamond tells a saga of royalty."
                  </p>
                  <span className="text-[10px] uppercase tracking-luxury text-ivory/60 mt-2 block">
                    — The Master Karigars of New Shiv Jewellers
                  </span>
                </div>
              </div>

              {/* Story Narrative */}
              <div className="space-y-6 text-left">
                <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block">
                  ✦ {brandStory.badge || 'OUR HERITAGE'} ✦
                </span>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-ivory font-normal leading-tight">
                  {brandStory.heading}
                </h2>

                <div className="h-[1px] w-16 bg-gold-500/60" />

                <p className="text-xs sm:text-sm text-ivory/80 font-sans font-light leading-relaxed">
                  {brandStory.description}
                </p>

                {/* Stats */}
                {brandStory.stats && brandStory.stats.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gold-500/20">
                    {brandStory.stats.map((stat, i) => (
                      <div key={i}>
                        <p className="font-serif text-2xl sm:text-3xl text-gold-400 font-normal">
                          {stat.value}
                        </p>
                        <p className="text-[10px] sm:text-xs text-ivory/60 uppercase tracking-wider mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4">
                  <Link to="/about">
                    <Button variant="outline" size="md">
                      Discover Our Artisanal Saga
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Instagram Editorial Gallery */}
      <InstagramGallery images={instagramGallery} />

      {/* 7. Value Pillars / Assurances (Royal Heritage Theme) */}
      <section className="bg-[#142318] text-ivory border-y border-gold-400/30 py-16 relative overflow-hidden">
        {/* Ambient Warm Golden Sunlight / Palace Garden Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,_rgba(212,175,55,0.12),_transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_20%_40%,_rgba(40,70,50,0.35),_transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
            <div className="flex flex-col items-center p-6 rounded-t-[36px] rounded-b-md border border-gold-400/35 bg-[#1b2b20]/80 backdrop-blur-md hover:border-gold-300 hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <FiAward className="text-3xl text-gold-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-300" />
              <h4 className="text-xs uppercase tracking-luxury font-medium text-ivory group-hover:text-gold-300 transition-colors">
                100% BIS Hallmarked
              </h4>
              <p className="text-[11px] text-ivory/70 mt-1.5 font-sans font-light leading-relaxed">Government certified 916 & 750 gold</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-t-[36px] rounded-b-md border border-gold-400/35 bg-[#1b2b20]/80 backdrop-blur-md hover:border-gold-300 hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <FiShield className="text-3xl text-gold-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-300" />
              <h4 className="text-xs uppercase tracking-luxury font-medium text-ivory group-hover:text-gold-300 transition-colors">
                GIA & IGI Diamonds
              </h4>
              <p className="text-[11px] text-ivory/70 mt-1.5 font-sans font-light leading-relaxed">Ethically sourced conflict-free solitaires</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-t-[36px] rounded-b-md border border-gold-400/35 bg-[#1b2b20]/80 backdrop-blur-md hover:border-gold-300 hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <FiFeather className="text-3xl text-gold-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-300" />
              <h4 className="text-xs uppercase tracking-luxury font-medium text-ivory group-hover:text-gold-300 transition-colors">
                Royal Karigar Heritage
              </h4>
              <p className="text-[11px] text-ivory/70 mt-1.5 font-sans font-light leading-relaxed">Handcrafted over hundreds of artisanal hours</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-t-[36px] rounded-b-md border border-gold-400/35 bg-[#1b2b20]/80 backdrop-blur-md hover:border-gold-300 hover:shadow-gold-glow hover:-translate-y-1 transition-all duration-300 group shadow-lg">
              <FiPackage className="text-3xl text-gold-400 mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:text-gold-300" />
              <h4 className="text-xs uppercase tracking-luxury font-medium text-ivory group-hover:text-gold-300 transition-colors">
                Insured White-Glove Courier
              </h4>
              <p className="text-[11px] text-ivory/70 mt-1.5 font-sans font-light leading-relaxed">Tamper-evident sealed luxury delivery</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
