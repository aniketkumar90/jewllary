import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import CloudinaryUploader from '../../components/admin/CloudinaryUploader';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { collectionService } from '../../services/collectionService';
import { useToast } from '../../context/ToastContext';
import { FiArrowLeft, FiSave } from 'react-icons/fi';

const ProductFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    collectionId: '',
    shortDescription: '',
    description: '',
    price: '',
    salePrice: '',
    material: '22K Hallmarked Yellow Gold',
    weight: '12.5g Net Gold',
    size: 'Standard / Adjustable',
    stock: 5,
    featured: false,
    newArrival: true,
    bestseller: false,
    status: 'active',
    mainImage: { secure_url: '', public_id: '' },
    galleryImages: [],
    seoTitle: '',
    seoDescription: '',
  });

  // Load categories & collections
  useEffect(() => {
    const fetchSelectOptions = async () => {
      try {
        const [catRes, colRes] = await Promise.all([
          categoryService.getCategories({ isAdmin: 'true' }),
          collectionService.getCollections({ isAdmin: 'true' }),
        ]);
        if (catRes.categories) setCategories(catRes.categories);
        if (colRes.collections) setCollections(colRes.collections);
      } catch (e) {
        console.error(e);
      }
    };
    fetchSelectOptions();
  }, []);

  // If edit mode, load product details
  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        try {
          const res = await productService.getProductBySlug(id);
          if (res.product) {
            const p = res.product;
            setFormData({
              name: p.name,
              sku: p.sku,
              category: p.category?._id || p.category,
              collectionId: p.collectionId?._id || p.collectionId || '',
              shortDescription: p.shortDescription || '',
              description: p.description || '',
              price: p.price,
              salePrice: p.salePrice || '',
              material: p.material || '22K Hallmarked Yellow Gold',
              weight: p.weight || '',
              size: p.size || '',
              stock: p.stock,
              featured: Boolean(p.featured),
              newArrival: Boolean(p.newArrival),
              bestseller: Boolean(p.bestseller),
              status: p.status || 'active',
              mainImage: p.mainImage || { secure_url: '', public_id: '' },
              galleryImages: p.galleryImages || [],
              seoTitle: p.seoTitle || '',
              seoDescription: p.seoDescription || '',
            });
          }
        } catch (e) {
          toast.error('Failed to load product details');
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = {
      ...formData,
      name: formData.name?.trim() || 'Fine Jewellery Creation',
      sku: formData.sku?.trim() || `NSJ-${Date.now().toString().slice(-6)}`,
      category: formData.category || (categories[0]?._id || ''),
      price: formData.price !== '' ? Number(formData.price) : 0,
      description: formData.description?.trim() || formData.shortDescription?.trim() || 'Fine jewellery handcrafted with royal Indian heritage.',
      mainImage: formData.mainImage?.secure_url
        ? formData.mainImage
        : {
            secure_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
            public_id: 'default_jewel',
          },
    };

    setSaving(true);
    try {
      if (isEdit) {
        await productService.updateProduct(id, submissionData);
        toast.success('Creation updated successfully');
      } else {
        await productService.createProduct(submissionData);
        toast.success('New creation added to royal catalogue');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen label="Loading Creation Vault Details..." />;
  }

  return (
    <div className="space-y-6 text-left max-w-5xl">
      {/* Top action bar */}
      <div className="flex items-center justify-between pb-4 border-b border-gold-400/20">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2.5 border border-gold-500/35 bg-[#18281d] text-ivory hover:text-gold-300 transition-colors"
          >
            <FiArrowLeft />
          </Link>
          <div>
            <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block">
              ✦ Vault Inventory ✦
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif text-ivory font-normal">
              {isEdit ? `Edit: ${formData.name}` : 'Catalog New Heirloom Piece'}
            </h1>
          </div>
        </div>

        <Button
          variant="gold"
          onClick={handleSubmit}
          loading={saving}
          icon={FiSave}
        >
          {isEdit ? 'Update Creation' : 'Publish Creation'}
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: General Details */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            1. Essential Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                dark={true}
                label="Heirloom Creation Title"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Maharani Royal Basra Pearl Choker"
              />
            </div>
            <Input
              dark={true}
              label="Unique SKU"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g. NSJ-NK-102"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#18281d] text-ivory text-sm border border-gold-500/35 py-3 px-4 focus:outline-none focus:border-gold-400 transition-colors"
              >
                <option value="" className="bg-[#18281d] text-ivory/60">Select Category...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id} className="bg-[#18281d] text-ivory">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
                Curated Collection
              </label>
              <select
                name="collectionId"
                value={formData.collectionId}
                onChange={handleChange}
                className="w-full bg-[#18281d] text-ivory text-sm border border-gold-500/35 py-3 px-4 focus:outline-none focus:border-gold-400 transition-colors"
              >
                <option value="" className="bg-[#18281d] text-ivory/60">None / Standalone Portfolio</option>
                {collections.map((col) => (
                  <option key={col._id} value={col._id} className="bg-[#18281d] text-ivory">
                    {col.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
              Short Description
            </label>
            <input
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              placeholder="e.g. Uncut syndetic polki diamonds set in 22K gold with Colombian emerald drops."
              className="w-full bg-[#18281d] text-ivory placeholder:text-ivory/40 text-sm border border-gold-500/35 py-3 px-4 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1.5">
              Comprehensive Story & Craftsmanship Details
            </label>
            <textarea
              rows="5"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail the karigar craftsmanship, hallmarking, diamond specifications, and setting techniques..."
              className="w-full bg-[#18281d] text-ivory placeholder:text-ivory/40 text-sm border border-gold-500/35 p-4 focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>
        </div>

        {/* Section 2: Pricing & Vault Stock */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            2. Valuation & Vault Availability
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              dark={true}
              label="Standard Retail Price (₹)"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 250000"
            />

            <Input
              dark={true}
              label="Special Privilege Price (Optional ₹)"
              type="number"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              placeholder="e.g. 235000"
            />

            <Input
              dark={true}
              label="Vault Stock Count"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
            />
          </div>
        </div>

        {/* Section 3: Material & Technical Specifications */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            3. Jewellery Matrix & Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              dark={true}
              label="Precious Material / Karat"
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. 22K Hallmarked Yellow Gold"
            />

            <Input
              dark={true}
              label="Net / Gross Gold Weight"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="e.g. 42.5g Net Gold"
            />

            <Input
              dark={true}
              label="Sizing / Adjustable Dimensions"
              name="size"
              value={formData.size}
              onChange={handleChange}
              placeholder="e.g. 16 - 18 inches / Size 2.6"
            />
          </div>

          {/* Visibility Badges */}
          <div className="pt-4 border-t border-gold-400/20 grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-ivory">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
                className="accent-gold-500 w-4 h-4 rounded"
              />
              <span>New Arrival</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-ivory">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
                className="accent-gold-500 w-4 h-4 rounded"
              />
              <span>Bestseller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-ivory">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="accent-gold-500 w-4 h-4 rounded"
              />
              <span>Featured Spotlight</span>
            </label>

            <div>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#18281d] border border-gold-500/35 text-ivory text-xs py-2 px-3 focus:outline-none focus:border-gold-400"
              >
                <option value="active" className="bg-[#18281d] text-ivory">Active (Visible)</option>
                <option value="inactive" className="bg-[#18281d] text-ivory">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Cloudinary Imagery */}
        <div className="bg-[#142318] border border-gold-400/30 p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="font-serif text-lg text-ivory pb-2 border-b border-gold-400/20">
            4. Cloudinary Imagery (Stored Remotely)
          </h3>

          <CloudinaryUploader
            label="Primary Showcase Image (Cloudinary)"
            value={formData.mainImage}
            onChange={(img) => setFormData({ ...formData, mainImage: img })}
            helperText="Directly uploaded to Cloudinary CDN"
          />

          <div className="pt-4 border-t border-gold-400/20">
            <CloudinaryUploader
              label="Additional Gallery Images (Cloudinary Multi-Upload)"
              multiple={true}
              value={formData.galleryImages}
              onChange={(imgs) => setFormData({ ...formData, galleryImages: imgs })}
              helperText="Upload multiple alternate angles or karigar details"
            />
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex items-center justify-end gap-4 py-4">
          <Link to="/admin/products">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" variant="gold" size="lg" loading={saving} icon={FiSave}>
            {isEdit ? 'Save Changes' : 'Publish Creation'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
