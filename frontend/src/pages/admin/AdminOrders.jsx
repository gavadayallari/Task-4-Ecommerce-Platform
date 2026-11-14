import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const { showToast } = useToast();

  const loadOrders = async (status = selectedStatus) => {
    setLoading(true);
    try {
      const res = await adminAPI.getAllOrders({
        status: status === 'All' ? undefined : status,
        limit: 50
      });
      setOrders(res.data.orders);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(selectedStatus);
  }, [selectedStatus]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      showToast(`Order status updated to "${newStatus}"`, 'success');
      // Update local state
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, orderStatus: newStatus } : ord))
      );
    } catch (err) {
      showToast('Failed to update order status', 'error');
    }
  };

  const statusTabs = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Customer Orders</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review customer purchases, fulfill packages, and transition delivery tracking statuses
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statusTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedStatus(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedStatus === tab
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <LoadingSpinner text="Fetching customer orders..." />
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No orders found for status "{selectedStatus}".
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Order ID & Date</th>
                      <th className="py-3 px-3">Customer</th>
                      <th className="py-3 px-3">Destination</th>
                      <th className="py-3 px-3">Total</th>
                      <th className="py-3 px-3">Payment</th>
                      <th className="py-3 px-3">Status Pipeline</th>
                      <th className="py-3 px-4 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((ord) => (
                      <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <p className="font-mono font-bold text-slate-800">
                            #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        <td className="py-3 px-3">
                          <p className="font-bold text-slate-800">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                          <p className="text-[10px] text-slate-400">{ord.user?.email || ord.shippingAddress?.phone}</p>
                        </td>

                        <td className="py-3 px-3 text-slate-600">
                          {ord.shippingAddress?.city}, {ord.shippingAddress?.postalCode}
                        </td>

                        <td className="py-3 px-3 font-black text-slate-900">
                          {formatPrice(ord.totalPrice)}
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>

                        <td className="py-3 px-3">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 focus:outline-hidden focus:border-blue-600"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <Link
                            to={`/orders/${ord._id}`}
                            className="p-1.5 inline-flex items-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Inspect order details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
