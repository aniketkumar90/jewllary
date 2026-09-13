import React, { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import { formatPrice, formatDate } from '../../utils/formatters';
import { FiEye, FiSearch, FiEdit3 } from 'react-icons/fi';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Selected Order for viewing / status update
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search,
      });
      setOrders(res.orders || []);
      setTotalPages(res.pages || 1);
      setTotalCount(res.total || 0);
    } catch (e) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, search]);

  const handleOpenDetail = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setStatusNote('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await orderService.updateOrderStatus(selectedOrder._id, {
        orderStatus: newStatus,
        note: statusNote || `Status updated to ${newStatus} by concierge`,
      });
      toast.success(`Order ${selectedOrder.orderNumber} status updated to ${newStatus}`);
      setSelectedOrder(res.order);
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    {
      header: 'Order Identifier',
      render: (row) => (
        <div>
          <span className="font-mono font-semibold text-gold-300 block text-xs">
            {row.orderNumber}
          </span>
          <span className="text-[10px] text-ivory/50">
            {formatDate(row.createdAt)}
          </span>
        </div>
      ),
    },
    {
      header: 'Patron',
      render: (row) => (
        <div>
          <span className="font-serif text-ivory font-medium block">
            {row.shippingAddress?.name || 'Patron'}
          </span>
          <span className="text-[10px] text-ivory/60 block">
            {row.shippingAddress?.email}
          </span>
        </div>
      ),
    },
    {
      header: 'Creations',
      render: (row) => (
        <span className="text-xs text-ivory/80">
          {row.items?.length} {row.items?.length === 1 ? 'piece' : 'pieces'}
        </span>
      ),
    },
    {
      header: 'Total Value',
      render: (row) => (
        <div>
          <span className="font-serif text-sm font-semibold text-gold-300 block">
            {formatPrice(row.total)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-ivory/50 block">
            {row.paymentMethod}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.orderStatus} />,
    },
    {
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => handleOpenDetail(row)}
          className="p-1.5 text-gold-400 hover:text-gold-200 transition-colors"
          title="Inspect and update order"
        >
          <FiEdit3 className="text-base" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-luxury text-gold-400 font-semibold block mb-1">
            ✦ Client Vault Dispatches ✦
          </span>
          <h1 className="text-3xl font-serif text-ivory font-normal">
            Orders & Reservations ({totalCount})
          </h1>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#142318] border border-gold-400/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <FiSearch className="absolute inset-y-0 left-3 my-auto text-gold-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by order ID, email, or name..."
            className="w-full pl-9 pr-4 py-2 border border-gold-500/35 bg-[#18281d] text-ivory placeholder:text-ivory/40 text-xs font-sans focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label htmlFor="admin-order-status-filter" className="text-xs uppercase tracking-luxury text-gold-300">Status:</label>
          <select
            id="admin-order-status-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#18281d] border border-gold-500/35 text-ivory py-2 px-3 text-xs focus:outline-none focus:border-gold-400"
          >
            <option value="all" className="bg-[#18281d] text-ivory">All Statuses</option>
            <option value="Pending" className="bg-[#18281d] text-ivory">Pending</option>
            <option value="Confirmed" className="bg-[#18281d] text-ivory">Confirmed</option>
            <option value="Processing" className="bg-[#18281d] text-ivory">Processing</option>
            <option value="Shipped" className="bg-[#18281d] text-ivory">Shipped</option>
            <option value="Delivered" className="bg-[#18281d] text-ivory">Delivered</option>
            <option value="Cancelled" className="bg-[#18281d] text-ivory">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
        emptyMessage="No orders found matching the filter."
      />

      {/* Order Detail & Status Modal */}
      {selectedOrder && (
        <Modal
          isOpen={Boolean(selectedOrder)}
          onClose={() => setSelectedOrder(null)}
          title={`Order Dossier: ${selectedOrder.orderNumber}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6 text-left text-xs">
            {/* Patron & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-4 border-b border-gold-400/20">
              <div>
                <h4 className="font-serif text-sm text-gold-300 mb-1">Patron Information</h4>
                <p className="font-semibold text-ivory">{selectedOrder.shippingAddress?.name}</p>
                <p className="text-ivory/70">{selectedOrder.shippingAddress?.email}</p>
                <p className="text-ivory/70">Phone: {selectedOrder.shippingAddress?.phone}</p>
              </div>
              <div>
                <h4 className="font-serif text-sm text-gold-300 mb-1">Insured Delivery Address</h4>
                <p className="text-ivory/90">
                  {selectedOrder.shippingAddress?.addressLine1}, {selectedOrder.shippingAddress?.addressLine2}
                </p>
                <p className="text-ivory/90">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                </p>
                <p className="text-ivory/60">{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Reserved Items */}
            <div>
              <h4 className="font-serif text-sm text-gold-300 mb-3">Reserved Creations</h4>
              <div className="divide-y divide-gold-500/15">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-14 object-cover border border-gold-500/30 bg-[#18281d]"
                      />
                      <div>
                        <p className="font-serif text-sm text-ivory">{item.name}</p>
                        <p className="text-[10px] text-ivory/60">Qty: {item.quantity} • SKU: {item.sku}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-gold-300">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-gold-400/20 flex justify-between items-center text-sm">
                <span className="uppercase tracking-wider text-[11px] text-ivory/60">Total Investment</span>
                <span className="font-serif text-xl font-semibold text-gold-300">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>
            </div>

            {/* Timeline Log */}
            <div className="p-4 bg-[#18281d]/80 border border-gold-400/20 space-y-2">
              <h4 className="font-serif text-sm text-gold-300">Insured Vault Timeline</h4>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {selectedOrder.timeline?.map((entry, idx) => (
                  <div key={idx} className="text-[11px] text-ivory/80 flex items-start gap-2">
                    <span className="text-gold-400 font-bold">•</span>
                    <span>
                      <strong className="text-gold-300">{entry.status}</strong> ({formatDate(entry.date)}): {entry.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-gold-400/20 space-y-4">
              <h4 className="font-serif text-sm text-ivory">Update Order Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="admin-order-modal-status" className="block text-[11px] uppercase tracking-luxury text-gold-300 mb-1">
                    New Order Status
                  </label>
                  <select
                    id="admin-order-modal-status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#18281d] border border-gold-500/35 text-ivory py-2 px-3 text-xs focus:outline-none focus:border-gold-400"
                  >
                    <option value="Pending" className="bg-[#18281d] text-ivory">Pending</option>
                    <option value="Confirmed" className="bg-[#18281d] text-ivory">Confirmed</option>
                    <option value="Processing" className="bg-[#18281d] text-ivory">Processing</option>
                    <option value="Shipped" className="bg-[#18281d] text-ivory">Shipped</option>
                    <option value="Delivered" className="bg-[#18281d] text-ivory">Delivered</option>
                    <option value="Cancelled" className="bg-[#18281d] text-ivory">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-luxury text-gold-300 mb-1">
                    Timeline Note / Courier Tracking
                  </label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Handed over to BlueDart Vault Express AWB #89421"
                    className="w-full bg-[#18281d] border border-gold-500/35 text-ivory placeholder:text-ivory/40 py-2 px-3 text-xs focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <Button type="submit" variant="gold" loading={updating}>
                  Save Status Update
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrdersPage;
