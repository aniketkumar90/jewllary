import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import CloudinaryUploader from '../../components/admin/CloudinaryUploader';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { categoryService } from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  // Deletion state
  const [deleteCategory, setDeleteCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'active',
    image: { secure_url: '', public_id: '' },
  });

  const toast = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getCategories({ isAdmin: 'true', status: 'all' });
      setCategories(res.categories || []);
    } catch (e) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      status: 'active',
      image: { secure_url: '', public_id: '' },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description || '',
      status: cat.status || 'active',
      image: cat.image || { secure_url: '', public_id: '' },
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      name: formData.name.trim() || 'New Category',
    };

    setSaving(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory._id, submissionData);
        toast.success('Category updated successfully');
      } else {
        await categoryService.createCategory(submissionData);
        toast.success('New category created');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteCategory) return;
    setIsDeleting(true);
    try {
      await categoryService.deleteCategory(deleteCategory._id);
      toast.success('Category removed');
      setDeleteCategory(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || 'Failed to remove category');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Category',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image?.secure_url}
            alt={row.name}
            className="w-10 h-10 object-cover border border-gold-500/30 bg-[#18281d] flex-shrink-0"
          />
          <div>
            <h4 className="font-serif text-sm text-ivory font-medium">{row.name}</h4>
            <span className="font-mono text-[10px] text-gold-300/60">/{row.slug}</span>
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
      header: 'Catalogue Items',
      render: (row) => (
        <span className="font-semibold text-gold-300">{row.productCount || 0} creations</span>
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
            title="Edit category"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={() => setDeleteCategory(row)}
            className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
            title="Delete category"
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
            ✦ Classification Portfolio ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Jewellery Categories ({categories.length})
          </h1>
        </div>

        <Button variant="gold" icon={FiPlus} onClick={handleOpenCreate}>
          Add Category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        emptyMessage="No categories created yet."
      />

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Jewellery Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <Input
            dark={true}
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Royal Bridal"
          />

          <div>
            <label className="block text-[11px] uppercase tracking-luxury text-gold-300 font-medium mb-1">
              Description
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Editorial summary of this category..."
              className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 p-3 text-xs focus:outline-none focus:border-gold-400 font-sans transition-colors"
            />
          </div>

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

          <CloudinaryUploader
            label="Category Cover Photo"
            value={formData.image}
            onChange={(img) => setFormData({ ...formData, image: img })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-gold-400/20">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gold" loading={saving}>
              {editingCategory ? 'Save Changes' : 'Create Category'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteCategory)}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteCategory?.name}"?`}
        confirmText="Delete"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminCategoriesPage;
