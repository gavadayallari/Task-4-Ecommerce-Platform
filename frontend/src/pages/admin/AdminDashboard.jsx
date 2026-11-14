import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  Clock
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../utils/currency';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">Administrator Dashboard</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Store performance metrics, financial revenue, live inventory and recent customer orders
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="flex-1 w-full space-y-8">
          {loading ? (
            <LoadingSpinner text="Compiling store analytics & metrics..." size="lg" />
          ) : !stats ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
              Unable to load statistics.
            </div>
          ) : (
            <>
              {/* Top KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="Total Revenue"
                  value={formatPrice(stats.totalRevenue)}
                  icon={IndianRupee}
                  color="blue"
                  subtitle="Gross non-cancelled orders"
                />
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={ShoppingBag}
                  color="emerald"
                  subtitle="Completed & in-flight"
                />
                <StatCard
                  title="Products in Store"
                  value={stats.totalProducts}
                  icon={Package}
                  color="purple"
                  subtitle="Active catalog items"
                />
                <StatCard
                  title="Registered Users"
                  value={stats.totalUsers}
                  icon={Users}
                  color="amber"
                  subtitle="Customer profiles"
                />
              </div>

              {/* Low stock warning banner if applicable */}
              {stats.lowStockCount > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>
                      <strong>Inventory Alert:</strong> {stats.lowStockCount} product(s) have 5 or fewer items remaining in stock.
                    </span>
                  </div>
                  <Link
                    to="/admin/inventory"
                    className="font-bold underline hover:text-amber-950 shrink-0"
                  >
                    Manage Inventory →
                  </Link>
                </div>
              )}

              {/* Order Status Breakdown */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-800">Order Status Distribution</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                  {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <div key={st} className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                      <p className="text-xs text-slate-400 font-semibold">{st}</p>
                      <p className="text-lg font-black text-slate-800">{stats.statusCounts[st] || 0}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800">Recent Customer Orders</h3>
                  <Link
                    to="/admin/orders"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>View All Orders</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Total Amount</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {stats.recentOrders.map((ord) => (
                        <tr key={ord._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-800">{ord.shippingAddress?.fullName || ord.user?.name}</p>
                            <p className="text-[10px] text-slate-400">{ord.user?.email}</p>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-600">
                            {ord.orderItems?.length || 0} items
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
                            <OrderStatusBadge status={ord.orderStatus} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
