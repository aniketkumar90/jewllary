import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { FiSearch, FiTrash2, FiShield, FiUser } from 'react-icons/fi';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const toast = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await cmsService.getUsers({ page, limit: 15, search });
      setUsers(res.users || []);
      setTotalPages(res.pages || 1);
      setTotalCount(res.total || 0);
    } catch (e) {
      toast.error('Failed to load user accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const handleRoleToggle = async (user) => {
    const nextRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      await cmsService.updateUserRole(user._id, nextRole);
      toast.success(`${user.name} role updated to ${nextRole}`);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await cmsService.deleteUser(deleteTarget._id);
      toast.success('User account removed');
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const columns = [
    {
      header: 'Patron',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#18281d] border border-gold-500/40 text-gold-300 flex items-center justify-center font-bold text-xs">
            {row.name ? row.name[0] : 'U'}
          </div>
          <div>
            <h4 className="font-serif text-sm text-ivory font-medium">{row.name}</h4>
            <span className="text-[10px] text-ivory/60">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Contact Phone',
      render: (row) => <span className="text-ivory/80">{row.phone || '—'}</span>,
    },
    {
      header: 'Orders Placed',
      render: (row) => (
        <span className="font-semibold text-gold-300">{row.orderCount || 0} orders</span>
      ),
    },
    {
      header: 'Role',
      render: (row) => (
        <button
          onClick={() => handleRoleToggle(row)}
          className={`px-2.5 py-0.5 text-[10px] uppercase font-semibold border transition-colors ${
            row.role === 'admin'
              ? 'bg-gold-500/20 text-gold-300 border-gold-400/50 hover:bg-gold-500/30'
              : 'bg-white/5 text-ivory/70 border-white/20 hover:bg-white/10'
          }`}
          title="Click to toggle role"
        >
          {row.role === 'admin' ? '✦ Administrator' : 'Client / Patron'}
        </button>
      ),
    },
    {
      header: 'Joined Date',
      render: (row) => <span className="text-ivory/60">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => setDeleteTarget(row)}
          className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
          title="Remove user account"
        >
          <FiTrash2 />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Patron Registry ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Registered Patrons & Accounts ({totalCount})
          </h1>
        </div>
      </div>

      <div className="bg-[#142318] border border-gold-400/30 p-4 flex items-center justify-between shadow-md">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute inset-y-0 left-3 my-auto text-gold-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2 border border-gold-500/35 bg-[#18281d] text-ivory placeholder:text-ivory/40 text-xs font-sans focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        emptyMessage="No patrons found matching your query."
      />

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Patron Account"
        message={`Are you sure you want to remove the account for "${deleteTarget?.name}"?`}
        confirmText="Remove Account"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default AdminUsersPage;
