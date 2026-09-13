import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CloudinaryUploader from '../../components/admin/CloudinaryUploader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminBannersPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deleteBannerItem, setDeleteBannerItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    buttonText: 'Discover Chapter IV',
    buttonLink: '/collections',
    position: 'middle',
    status: 'active',
    image: { secure_url: '', public_id: '' },
  });

  const toast = useToast();

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await cmsService.getBanners({ isAdmin: 'true', status: 'all' });
      setBanners(res.banners || []);
    } catch (e) {
      toast.error('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      buttonText: 'Discover Chapter IV',
      buttonLink: '/collections',
      position: 'middle',
      status: 'active',
      image: { secure_url: '', public_id: '' },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle || '',
      description: b.description || '',
      buttonText: b.buttonText || 'Discover Now',
      buttonLink: b.buttonLink || '/jewellery',
      position: b.position || 'middle',
      status: b.status || 'active',
      image: b.image || { secure_url: '', public_id: '' },
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      title: formData.title?.trim() || 'Haute Jewellery Showcase',
      image: formData.image?.secure_url
        ? formData.image
        : {
            secure_url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200',
            public_id: 'default_banner',
          },
    };

    setSaving(true);
    try {
      if (editingBanner) {
        await cmsService.updateBanner(editingBanner._id, submissionData);
        toast.success('Banner updated');
      } else {
        await cmsService.createBanner(submissionData);
        toast.success('New banner created');
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      toast.error(err.message || 'Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteBannerItem) return;
    setIsDeleting(true);
    try {
      await cmsService.deleteBanner(deleteBannerItem._id);
      toast.success('Banner deleted');
      setDeleteBannerItem(null);
      fetchBanners();
    } catch (err) {
      toast.error(err.message || 'Failed to delete banner');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Banner',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image?.secure_url}
            alt={row.title}
            className="w-16 h-10 object-cover border border-gold-500/30 bg-[#18281d] flex-shrink-0"
          />
          <div>
            <h4 className="font-serif text-sm text-ivory font-medium">{row.title}</h4>
            <span className="text-[10px] text-gold-300/70 block">{row.subtitle || '—'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Position',
      render: (row) => (
        <span className="uppercase tracking-wider text-[10px] text-ivory/70 font-medium">
          {row.position}
        </span>
      ),
    },
    {
      header: 'Action Link',
      render: (row) => (
        <span className="text-gold-300 text-xs font-mono">{row.buttonLink}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${
            row.status === 'active'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : 'bg-white/5 text-ivory/60 border-white/20'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="p-1.5 text-gold-400 hover:text-gold-200 transition-colors"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => setDeleteBannerItem(row)}
            className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
          >
            <FiTrash2 />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Promotional Showcases ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Promotional Banners ({banners.length})
          </h1>
        </div>

        <Button variant="gold" icon={FiPlus} onClick={handleOpenCreate}>
          Add Banner
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={banners}
        loading={loading}
        emptyMessage="No promotional banners found."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBanner ? 'Edit Banner' : 'New Promotional Banner'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            dark={true}
            label="Banner Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Royal Bridal Season"
          />

          <Input
            dark={true}
            label="Subtitle / Tagline"
            value={formData.subtitle}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
            placeholder="e.g. UNVEILING CHAPTER IV"
          />

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1">
              Description
            </label>
            <textarea
              rows="2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Short description..."
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-xs focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              dark={true}
              label="Button Label"
              value={formData.buttonText}
              onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
            />
            <Input
              dark={true}
              label="Button Link Path"
              value={formData.buttonLink}
              onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
            />
          </div>

          <CloudinaryUploader
            label="Banner Photography (Cloudinary)"
            value={formData.image}
            onChange={(img) => setFormData({ ...formData, image: img })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-400/20">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={saving}>
              {editingBanner ? 'Save Changes' : 'Publish Banner'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deleteBannerItem)}
        onClose={() => setDeleteBannerItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Banner"
        message="Are you sure you want to delete this promotional banner?"
        confirmText="Delete"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminBannersPage;
