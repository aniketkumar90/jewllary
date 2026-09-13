import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await reviewService.getAllReviews({
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setReviews(res.reviews || []);
    } catch (e) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await reviewService.updateReviewStatus(id, status);
      toast.success(`Review ${status}`);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to update review status');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await reviewService.deleteReview(deleteTarget._id);
      toast.success('Review deleted');
      setDeleteTarget(null);
      fetchReviews();
    } catch (err) {
      toast.error(err.message || 'Failed to delete review');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Creation Piece',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.product?.mainImage?.secure_url}
            alt=""
            className="w-10 h-12 object-cover border border-gold-500/30 bg-[#18281d] flex-shrink-0"
          />
          <div>
            <h4 className="font-serif text-xs text-ivory font-medium">
              {row.product?.name || 'Product'}
            </h4>
            <span className="text-[10px] text-ivory/60">
              By: {row.userName}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Rating',
      render: (row) => (
        <span className="text-gold-400 font-semibold text-xs">
          {'★'.repeat(row.rating)}{'☆'.repeat(5 - row.rating)} ({row.rating}.0)
        </span>
      ),
    },
    {
      header: 'Comment / Reflection',
      render: (row) => (
        <p className="max-w-md text-xs text-ivory/80 italic">
          "{row.comment}"
        </p>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`px-2 py-0.5 text-[10px] uppercase font-semibold border ${
            row.status === 'approved'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
              : row.status === 'rejected'
              ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Date',
      render: (row) => <span className="text-ivory/60">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Moderation',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2">
          {row.status !== 'approved' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'approved')}
              className="p-1.5 text-emerald-400 hover:text-emerald-300 transition-colors"
              title="Approve Review"
            >
              <FiCheck className="text-base" />
            </button>
          )}
          {row.status !== 'rejected' && (
            <button
              onClick={() => handleUpdateStatus(row._id, 'rejected')}
              className="p-1.5 text-amber-400 hover:text-amber-300 transition-colors"
              title="Reject Review"
            >
              <FiX className="text-base" />
            </button>
          )}
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
            title="Delete Review"
          >
            <FiTrash2 className="text-base" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Social Endorsements ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Patron Reflections & Reviews ({reviews.length})
          </h1>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#18281d] border border-gold-500/35 text-ivory py-2 px-3 text-xs focus:outline-none focus:border-gold-400"
        >
          <option value="all" className="bg-[#18281d] text-ivory">All Reviews</option>
          <option value="approved" className="bg-[#18281d] text-ivory">Approved</option>
          <option value="pending" className="bg-[#18281d] text-ivory">Pending</option>
          <option value="rejected" className="bg-[#18281d] text-ivory">Rejected</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        emptyMessage="No patron reviews to moderate."
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Patron Review"
        message="Are you sure you want to permanently delete this customer review?"
        confirmText="Delete"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminReviewsPage;
