import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import CollectionGrid from '../../components/customer/CollectionGrid';
import ProductGrid from '../../components/customer/ProductGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { collectionService } from '../../services/collectionService';

const CollectionsPage = () => {
  const { slug } = useParams();
  const [collections, setCollections] = useState([]);
  const [currentCollection, setCurrentCollection] = useState(null);
  const [collectionProducts, setCollectionProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (slug) {
          const res = await collectionService.getCollectionBySlug(slug);
          if (res.collection) {
            setCurrentCollection(res.collection);
            setCollectionProducts(res.products || []);
          }
        } else {
          const res = await collectionService.getCollections();
          if (res.collections) {
            setCollections(res.collections);
          }
        }
      } catch (error) {
        console.error('[Collections Error]:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <LoadingSpinner fullScreen label="Unveiling Curated Chapters..." />;
  }

  // Single Collection Showcase
  if (slug && currentCollection) {
    return (
      <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
        {/* Editorial Cover Banner with Royal Forest Styling */}
        <div className="relative h-[55vh] min-h-[400px] bg-[#142318] overflow-hidden flex items-center justify-center border-b border-gold-400/30">
          <img
            src={currentCollection.coverImage?.secure_url}
            alt={currentCollection.name}
            className="absolute inset-0 w-full h-full object-cover brightness-[0.70] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e1610] via-[#142318]/60 to-transparent" />
          <div className="relative z-10 max-w-3xl mx-auto px-4 text-center text-ivory">
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold mb-2 block">
              ✦ Curated Chapter ✦
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-ivory font-normal tracking-wide mb-4 drop-shadow">
              {currentCollection.name}
            </h1>
            <p className="text-xs sm:text-sm text-ivory/85 font-sans font-light leading-relaxed max-w-xl mx-auto drop-shadow-sm">
              {currentCollection.description}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb
            items={[
              { label: 'Collections', path: '/collections' },
              { label: currentCollection.name },
            ]}
          />

          <div className="py-10">
            <ProductGrid
              products={collectionProducts}
              emptyTitle="Chapter Creations Under Curation"
              emptyDescription="Our master karigars are presently handcrafting new heirloom suites for this collection."
            />
          </div>
        </div>
      </div>
    );
  }

  // All Collections Listing
  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      <div className="hero-header-bg text-ivory py-16 sm:py-24 border-b border-gold-400/30 text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-[10px] uppercase tracking-luxury text-gold-300 font-semibold mb-2 block drop-shadow-sm">
            ✦ Royal Curation Portfolios ✦
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-ivory tracking-wide mb-4 drop-shadow">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-ivory/85 max-w-lg mx-auto font-sans font-light leading-relaxed drop-shadow-sm">
            From regal matrimonial suites to everyday diamond silhouettes, journey through our artisanal dynasties.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <Breadcrumb items={[{ label: 'Collections' }]} />
        <div className="py-10">
          <CollectionGrid collections={collections} />
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
