import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Button from '../../components/common/Button';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/formatters';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEye } from 'react-icons/fi';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete modal state
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productService.getProducts({
        page,
        limit: 12,
        search,
        isAdmin: 'true',
        status: 'all',
      });
      setProducts(res.products || []);
      setTotalPages(res.pages || 1);
      setTotalCount(res.total || 0);
    } catch (e) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDeleteConfirm = async () => {
    if (!deleteProduct) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deleteProduct._id);
      toast.success(`${deleteProduct.name} removed from vault catalogue`);
      setDeleteProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.message || 'Failed to remove product');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Creation',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.mainImage?.secure_url}
            alt={row.name}
            className="w-12 h-14 object-cover border border-gold-500/30 bg-[#18281d] flex-shrink-0"
          />
          <div>
            <h4 className="font-serif text-sm text-ivory font-medium">
              {row.name}
            </h4>
            <span className="font-mono text-[10px] text-gold-300/60 block">
              SKU: {row.sku}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Category',
      render: (row) => <span className="text-ivory/80">{row.category?.name || '—'}</span>,
    },
    {
      header: 'Price',
      render: (row) => (
        <div>
          <span className="font-semibold text-gold-300 block">
            {formatPrice(row.salePrice || row.price)}
          </span>
          {row.salePrice && (
            <span className="line-through text-ivory/50 text-[10px] block">
              {formatPrice(row.price)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: 'Vault Stock',
      render: (row) => (
        <span
          className={`font-semibold ${
            row.stock > 0 ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {row.stock} in vault
        </span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold border ${
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
          <a
            href={`/product/${row.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-gold-400/70 hover:text-gold-300 transition-colors"
            title="Preview on live store"
          >
            <FiEye className="text-sm" />
          </a>
          <Link
            to={`/admin/products/edit/${row._id}`}
            className="p-1.5 text-gold-400 hover:text-gold-200 transition-colors"
            title="Edit product"
          >
            <FiEdit2 className="text-sm" />
          </Link>
          <button
            onClick={() => setDeleteProduct(row)}
            className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
            title="Delete product"
          >
            <FiTrash2 className="text-sm" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Inventory Management ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Haute Joaillerie Catalogue ({totalCount})
          </h1>
        </div>

        <Link to="/admin/products/new">
          <Button variant="gold" icon={FiPlus}>
            Add Creation
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-[#142318] border border-gold-400/30 p-4 flex items-center justify-between gap-4 shadow-md">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute inset-y-0 left-3 my-auto text-gold-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, SKU, or precious material..."
            className="w-full pl-9 pr-4 py-2 border border-gold-500/35 bg-[#18281d] text-ivory placeholder:text-ivory/40 text-xs font-sans focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        emptyMessage="No creations found matching your query."
      />

      {/* Confirm Deletion Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteProduct)}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Heirloom Creation"
        message={`Are you certain you wish to remove "${deleteProduct?.name}"? Its Cloudinary imagery and records will be deleted from the live catalogue.`}
        confirmText="Remove Creation"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminProductsPage;
