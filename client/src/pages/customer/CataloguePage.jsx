import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProductGrid from '../../components/customer/ProductGrid';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import { SORT_OPTIONS, MATERIALS } from '../../utils/constants';
import { FiFilter, FiX, FiCheck } from 'react-icons/fi';

const CataloguePage = () => {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter States
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(searchParams.get('sort') || 'newest');
  const [selectedCategory, setSelectedCategory] = useState(categorySlug || searchParams.get('category') || '');
  const [selectedCollection, setSelectedCollection] = useState(searchParams.get('collection') || '');
  const [selectedMaterial, setSelectedMaterial] = useState(searchParams.get('material') || '');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || '',
  });
  const currentPage = Number(searchParams.get('page')) || 1;
  const searchQuery = searchParams.get('search') || '';

  // Fetch Categories & Collections list once
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          categoryService.getCategories(),
          collectionService.getCollections(),
        ]);
        if (catRes.categories) setCategories(catRes.categories);
        if (colRes.collections) setCollections(colRes.collections);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMetadata();
  }, []);

  // Sync categorySlug parameter with state
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
      const found = categories.find((c) => c.slug === categorySlug);
      setCurrentCategory(found || null);
    } else {
      setSelectedCategory('');
      setCurrentCategory(null);
    }
  }, [categorySlug, categories]);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 12,
          sort: selectedSort,
          search: searchQuery,
          category: selectedCategory || categorySlug || undefined,
          collection: selectedCollection || undefined,
          material: selectedMaterial || undefined,
          inStock: inStockOnly ? 'true' : undefined,
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined,
        };

        const res = await productService.getProducts(params);
        setProducts(res.products || []);
        setTotalPages(res.pages || 1);
        setTotalCount(res.total || 0);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    selectedSort,
    selectedCategory,
    categorySlug,
    selectedCollection,
    selectedMaterial,
    inStockOnly,
    priceRange.min,
    priceRange.max,
    searchQuery,
  ]);

  const handlePageChange = (newPage) => {
    searchParams.set('page', newPage);
    setSearchParams(searchParams);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSelectedCategory(categorySlug || '');
    setSelectedCollection('');
    setSelectedMaterial('');
    setInStockOnly(false);
    setPriceRange({ min: '', max: '' });
    setSelectedSort('newest');
    setSearchParams({});
  };

  const breadcrumbItems = [
    { label: 'Jewellery', path: '/jewellery' },
    ...(currentCategory ? [{ label: currentCategory.name }] : []),
    ...(searchQuery ? [{ label: `Search: "${searchQuery}"` }] : []),
  ];

  return (
    <div className="pt-24 pb-20 bg-[#0e1610] text-ivory min-h-screen">
      {/* Category Banner with Cohesive Royal Styling */}
      <div className="hero-header-bg text-ivory py-16 sm:py-24 border-b border-gold-400/30 relative overflow-hidden">
        {/* Ambient Warm Golden Sunlight Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,_rgba(212,175,55,0.18),_transparent_75%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_70%,_rgba(212,175,55,0.10),_transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-[10px] uppercase tracking-luxury text-gold-300 font-semibold mb-2 block drop-shadow-sm">
            ✦ Haute Joaillerie Portfolio ✦
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal text-ivory tracking-wide mb-3 drop-shadow">
            {currentCategory ? currentCategory.name : searchQuery ? `Search: "${searchQuery}"` : 'All Jewellery Heirlooms'}
          </h1>
          <p className="text-xs sm:text-sm text-ivory/85 max-w-xl mx-auto leading-relaxed font-sans font-light drop-shadow-sm">
            {currentCategory?.description ||
              'Discover our complete royal treasury, from uncut polki diamond necklaces to solitaires and hand-hammered temple kadas.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Toolbar Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-gold-500/20 gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#18281d] border border-gold-500/35 px-4 py-2.5 text-xs uppercase tracking-luxury font-medium text-ivory hover:border-gold-400 transition-colors"
            >
              <FiFilter className="text-gold-400" />
              <span>Filters</span>
            </button>
            <p className="text-xs uppercase tracking-luxury text-ivory/60">
              Showing <span className="font-semibold text-gold-300">{totalCount}</span> Creations
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <label htmlFor="catalogue-sort" className="text-xs uppercase tracking-luxury text-ivory/60 hidden sm:inline">
              Sort By:
            </label>
            <select
              id="catalogue-sort"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#18281d] border border-gold-500/35 text-xs uppercase tracking-wider py-2.5 px-4 font-sans text-ivory focus:outline-none focus:border-gold-400 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#18281d] text-ivory">
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid and Sidebar layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-8 pr-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold-500/20">
              <h3 className="font-serif text-lg text-ivory font-normal">Filters</h3>
              <button
                onClick={clearAllFilters}
                className="text-[11px] uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
              >
                Reset All
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-3">
                Category
              </h4>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => setSelectedCategory('')}
                  className={`cursor-pointer py-1 flex items-center justify-between hover:text-gold-300 transition-colors ${
                    !selectedCategory ? 'text-gold-300 font-semibold' : 'text-ivory/70'
                  }`}
                >
                  <span>All Categories</span>
                  {!selectedCategory && <FiCheck className="text-gold-400" />}
                </div>
                {categories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`cursor-pointer py-1 flex items-center justify-between hover:text-gold-300 transition-colors ${
                      selectedCategory === cat.slug ? 'text-gold-300 font-semibold' : 'text-ivory/70'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.productCount > 0 && (
                      <span className="text-[10px] text-ivory/40">({cat.productCount})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Collections */}
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-3">
                Collection
              </h4>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => setSelectedCollection('')}
                  className={`cursor-pointer py-1 flex items-center justify-between hover:text-gold-300 transition-colors ${
                    !selectedCollection ? 'text-gold-300 font-semibold' : 'text-ivory/70'
                  }`}
                >
                  <span>All Collections</span>
                </div>
                {collections.map((col) => (
                  <div
                    key={col._id}
                    onClick={() => setSelectedCollection(col.slug)}
                    className={`cursor-pointer py-1 flex items-center justify-between hover:text-gold-300 transition-colors ${
                      selectedCollection === col.slug ? 'text-gold-300 font-semibold' : 'text-ivory/70'
                    }`}
                  >
                    <span>{col.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Material */}
            <div>
              <h4 className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-3">
                Precious Material
              </h4>
              <div className="space-y-2 text-xs">
                <div
                  onClick={() => setSelectedMaterial('')}
                  className={`cursor-pointer py-1 hover:text-gold-300 transition-colors ${
                    !selectedMaterial ? 'text-gold-300 font-semibold' : 'text-ivory/70'
                  }`}
                >
                  All Materials
                </div>
                {MATERIALS.map((mat) => (
                  <div
                    key={mat}
                    onClick={() => setSelectedMaterial(mat === selectedMaterial ? '' : mat)}
                    className={`cursor-pointer py-1 flex items-center justify-between hover:text-gold-300 transition-colors ${
                      selectedMaterial === mat ? 'text-gold-300 font-semibold' : 'text-ivory/70'
                    }`}
                  >
                    <span>{mat}</span>
                    {selectedMaterial === mat && <FiCheck className="text-gold-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-gold-500/20">
              <label className="flex items-center gap-3 cursor-pointer text-xs text-ivory/75">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded-none accent-gold-500"
                />
                <span>In Stock Vault Pieces Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner size="lg" label="Retrieving creations..." fullScreen={false} />
            ) : (
              <>
                <ProductGrid
                  products={products}
                  columns={3}
                  emptyTitle="No Heirlooms Found"
                  emptyDescription="Try adjusting your filter selection or clear filters to view our full collection."
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-4/5 max-w-sm bg-[#142318] text-ivory border-l border-gold-400/30 h-full shadow-2xl z-10 p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gold-500/20">
                <h3 className="font-serif text-xl text-ivory">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <FiX className="text-xl text-ivory/60 hover:text-gold-300" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4 border-b border-gold-500/20">
                <h4 className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-2">Category</h4>
                <div className="space-y-1.5 text-xs">
                  <p
                    onClick={() => { setSelectedCategory(''); setMobileFilterOpen(false); }}
                    className={`py-1 cursor-pointer transition-colors ${!selectedCategory ? 'font-bold text-gold-300' : 'text-ivory/70 hover:text-gold-300'}`}
                  >
                    All Categories
                  </p>
                  {categories.map((c) => (
                    <p
                      key={c._id}
                      onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                      className={`py-1 cursor-pointer transition-colors ${selectedCategory === c.slug ? 'font-bold text-gold-300' : 'text-ivory/70 hover:text-gold-300'}`}
                    >
                      {c.name}
                    </p>
                  ))}
                </div>
              </div>

              {/* Collections */}
              <div className="py-4 border-b border-gold-500/20">
                <h4 className="text-xs uppercase tracking-luxury text-gold-400 font-semibold mb-2">Collection</h4>
                <div className="space-y-1.5 text-xs">
                  {collections.map((col) => (
                    <p
                      key={col._id}
                      onClick={() => { setSelectedCollection(col.slug); setMobileFilterOpen(false); }}
                      className={`py-1 cursor-pointer transition-colors ${selectedCollection === col.slug ? 'font-bold text-gold-300' : 'text-ivory/70 hover:text-gold-300'}`}
                    >
                      {col.name}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <Button variant="gold" fullWidth onClick={() => setMobileFilterOpen(false)}>
                Apply Filters
              </Button>
              <Button variant="outline" fullWidth onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}>
                Clear All
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CataloguePage;
