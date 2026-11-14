import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  IndianRupee,
  ShoppingBag,
  Printer,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI } from '../../services/api';
import { formatPrice } from '../../utils/currency';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await adminAPI.getReports();
        setReports(res.data?.reports || null);
      } catch (err) {
        console.error('Failed to load sales reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Marketplace Sales Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Financial analytics, category revenue shares, Indian payment method distribution and AOV
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Sales Report</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar - hidden on print */}
        <div className="print:hidden">
          <AdminSidebar />
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          {loading ? (
            <LoadingSpinner text="Aggregating sales figures & MongoDB metrics..." size="lg" />
          ) : !reports ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-400">
              No sales data available yet.
            </div>
          ) : (
            <>
              {/* Top Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales</span>
                    <IndianRupee className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{formatPrice(reports.totalRevenue || 0)}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Active Revenue Stream</span>
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{reports.totalOrders || 0}</p>
                  <p className="text-[11px] text-slate-400">Customer transactions</p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Average Order Value (AOV)</span>
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-purple-600">
                    {formatPrice(reports.totalOrders > 0 ? reports.totalRevenue / reports.totalOrders : 0)}
                  </p>
                  <p className="text-[11px] text-slate-400">Per purchase average</p>
                </div>
              </div>

              {/* Category Breakdown & Payment Methods Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Sales Distribution */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Revenue by Category</span>
                  </h3>

                  <div className="space-y-3 pt-2">
                    {reports.categoryBreakdown && reports.categoryBreakdown.length > 0 ? (
                      reports.categoryBreakdown.map((cat, idx) => {
                        const total = reports.totalRevenue || 1;
                        const percent = Math.min(100, Math.round((cat.revenue / total) * 100));

                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold">
                              <span className="text-slate-700">{cat._id || 'General'}</span>
                              <span className="text-slate-900 font-bold">
                                {formatPrice(cat.revenue)} ({percent}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No category breakdown data available.</p>
                    )}
                  </div>
                </div>

                {/* Payment Methods Distribution */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Indian Payment Methods Used</span>
                  </h3>

                  <div className="space-y-3 pt-2">
                    {reports.paymentMethods && reports.paymentMethods.length > 0 ? (
                      reports.paymentMethods.map((pm, idx) => {
                        const total = reports.totalOrders || 1;
                        const percent = Math.min(100, Math.round((pm.count / total) * 100));

                        return (
                          <div key={idx} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold">
                              <span className="text-slate-700">{pm._id || 'UPI / Other'}</span>
                              <span className="text-slate-900 font-bold">
                                {pm.count} orders ({percent}%)
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 py-4 text-center">No payment methods recorded yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tax & Financial Compliance Note */}
              <div className="p-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-2xl text-xs space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>GST Compliance & Indian Invoicing Summary</span>
                </p>
                <p className="text-blue-800 leading-relaxed">
                  All gross revenue calculated above incorporates a 5% GST rate as mandated for domestic e-commerce transactions in India. Free delivery thresholds apply to orders ₹500 and above; ₹49 standard shipping is applied to orders below ₹500.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

