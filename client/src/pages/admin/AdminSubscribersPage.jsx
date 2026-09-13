import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import Button from '../../components/common/Button';
import { cmsService } from '../../services/cmsService';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatters';
import { FiCopy, FiTrash2, FiMail } from 'react-icons/fi';

const AdminSubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await cmsService.getSubscribers();
      setSubscribers(res.subscribers || []);
    } catch (e) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await cmsService.deleteSubscriber(id);
      toast.success('Subscriber removed');
      fetchSubscribers();
    } catch (err) {
      toast.error(err.message || 'Failed to remove subscriber');
    }
  };

  const handleCopyAll = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    toast.success('All subscriber emails copied to clipboard');
  };

  const columns = [
    {
      header: 'Subscriber Email Address',
      render: (row) => (
        <span className="font-mono text-xs text-gold-300 font-medium">
          {row.email}
        </span>
      ),
    },
    {
      header: 'Subscription Date',
      render: (row) => <span className="text-ivory/60">{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => handleDelete(row._id)}
          className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
          title="Remove subscriber"
        >
          <FiTrash2 />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Private Salon Registry ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Newsletter Subscribers ({subscribers.length})
          </h1>
        </div>

        {subscribers.length > 0 && (
          <Button variant="outline" icon={FiCopy} onClick={handleCopyAll}>
            Copy All Emails
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={subscribers}
        loading={loading}
        emptyMessage="No newsletter subscribers registered yet."
      />
    </div>
  );
};

export default AdminSubscribersPage;
