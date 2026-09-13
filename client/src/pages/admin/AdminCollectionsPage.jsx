import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CloudinaryUploader from '../../components/admin/CloudinaryUploader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { collectionService } from '../../services/collectionService';
import { useToast } from '../../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminCollectionsPage = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [saving, setSaving] = useState(false);

  // Deletion state
  const [deleteCollection, setDeleteCollection] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    featured: true,
    coverImage: { secure_url: '', public_id: '' },
  });

  const toast = useToast();

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await collectionService.getCollections({ isAdmin: 'true', status: 'all' });
      setCollections(res.collections || []);
    } catch (e) {
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleOpenCreate = () => {
    setEditingCollection(null);
    setFormData({
      name: '',
      description: '',
      status: 'active',
      featured: true,
      coverImage: { secure_url: '', public_id: '' },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (col) => {
    setEditingCollection(col);
    setFormData({
      name: col.name,
      description: col.description || '',
      status: col.status || 'active',
      featured: Boolean(col.featured),
      coverImage: col.coverImage || { secure_url: '', public_id: '' },
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      name: formData.name.trim() || 'New Collection',
    };

    setSaving(true);
    try {
      if (editingCollection) {
        await collectionService.updateCollection(editingCollection._id, submissionData);
        toast.success('Collection updated successfully');
      } else {
        await collectionService.createCollection(submissionData);
        toast.success('New collection chapter established');
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (err) {
      toast.error(err.message || 'Failed to save collection');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCollection) return;
    setIsDeleting(true);
    try {
      await collectionService.deleteCollection(deleteCollection._id);
      toast.success('Collection removed');
      setDeleteCollection(null);
      fetchCollections();
    } catch (err) {
      toast.error(err.message || 'Failed to delete collection');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Collection Title',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.coverImage?.secure_url}
            alt={row.name}
            className="w-12 h-14 object-cover border border-gold-500/30 bg-[#18281d] flex-shrink-0"
          />
          <div>
            <h4 className="font-serif text-sm text-ivory font-medium">{row.name}</h4>
            <span className="font-mono text-[10px] text-gold-300/60">/collections/{row.slug}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Description',
      render: (row) => (
        <p className="max-w-xs text-ivory/70 truncate">{row.description || '—'}</p>
      ),
    },
    {
      header: 'Creation Count',
      render: (row) => (
        <span className="font-semibold text-gold-300">{row.productCount || 0} pieces</span>
      ),
    },
    {
      header: 'Homepage Spotlight',
      render: (row) => (
        <span
          className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${
            row.featured
              ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
              : 'bg-white/5 text-ivory/60 border-white/20'
          }`}
        >
          {row.featured ? 'Featured' : 'Standard'}
        </span>
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
            title="Edit collection"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => setDeleteCollection(row)}
            className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
            title="Delete collection"
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
            ✦ Curated Narratives ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Curated Collections ({collections.length})
          </h1>
        </div>

        <Button variant="gold" icon={FiPlus} onClick={handleOpenCreate}>
          Add Collection
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={collections}
        loading={loading}
        emptyMessage="No collections found."
      />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCollection ? `Edit: ${editingCollection.name}` : 'New Curated Collection'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            dark={true}
            label="Collection Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. The Royal Bridal Heritage"
          />

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1">
              Editorial Narrative / Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Poetic introduction to this high jewellery saga..."
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-xs focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full bg-[#18281d] border border-gold-500/35 text-ivory py-2.5 px-3 text-xs focus:outline-none focus:border-gold-400"
              >
                <option value="active" className="bg-[#18281d] text-ivory">Active (Visible)</option>
                <option value="inactive" className="bg-[#18281d] text-ivory">Inactive (Hidden)</option>
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-ivory font-medium">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="accent-gold-500 w-4 h-4 rounded"
                />
                <span>Feature on Homepage Spotlight</span>
              </label>
            </div>
          </div>

          <CloudinaryUploader
            label="Curated Collection Cover Art"
            value={formData.coverImage}
            onChange={(img) => setFormData({ ...formData, coverImage: img })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-400/20">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={saving}>
              {editingCollection ? 'Save Changes' : 'Publish Collection'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCollection)}
        onClose={() => setDeleteCollection(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Collection"
        message={`Are you sure you want to delete "${deleteCollection?.name}"?`}
        confirmText="Delete"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminCollectionsPage;
