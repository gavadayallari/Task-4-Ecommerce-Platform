import React, { useState, useEffect } from 'react';
import {
  Boxes,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  Minus,
  Save,
  ArrowRight,
  TrendingDown,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminAPI, productAPI } from '../../services/api';
import { formatPrice } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';
import { useToast } from '../../context/ToastContext';

const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'low', 'out'
  const [updatingId, setUpdatingId] = useState(null);

  const { showToast } = useToast();

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getInventory();
      setInventory(res.data?.inventory || []);
    } catch (err) {
      console.error('Failed to load inventory:', err);
      showToast('Could not load inventory data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockUpdate = async (productId, newStock) => {
    if (newStock < 0) return;
    setUpdatingId(productId);
    try {
      await productAPI.updateStock(productId, newStock);
      showToast('Inventory stock updated successfully!', 'success');
      // Update local state
      setInventory((prev) =>
        prev.map((item) => (item._id === productId ? { ...item, stock: newStock } : item))
      );
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update stock', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculations
  const totalItems = inventory.length;
  const lowStockCount = inventory.filter((item) => item.stock > 0 && item.stock <= 5).length;
  const outOfStockCount = inventory.filter((item) => item.stock === 0).length;
  const totalValuation = inventory.reduce((acc, item) => acc + (item.price * item.stock), 0);

  // Filtered items
  const filteredItems = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'low') return item.stock > 0 && item.stock <= 5;
    if (filter === 'out') return item.stock === 0;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Inventory Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time MongoDB stock tracking, low inventory alerts, and instant stock level adjustments
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total SKUs</span>
              <p className="text-2xl font-black text-slate-900">{totalItems}</p>
              <p className="text-[11px] text-slate-400">Active catalog items</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Low Stock (≤ 5)</span>
              <p className="text-2xl font-black text-amber-600">{lowStockCount}</p>
              <p className="text-[11px] text-amber-600/80">Re-order required</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">Out of Stock (0)</span>
              <p className="text-2xl font-black text-rose-600">{outOfStockCount}</p>
              <p className="text-[11px] text-rose-500">Unavailable for purchase</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Stock Valuation</span>
              <p className="text-xl font-black text-blue-600">{formatPrice(totalValuation)}</p>
              <p className="text-[11px] text-slate-400">Total warehouse value (₹)</p>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                All Products ({totalItems})
              </button>
              <button
                onClick={() => setFilter('low')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === 'low'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                Low Stock ({lowStockCount})
              </button>
              <button
                onClick={() => setFilter('out')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === 'out'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                Out of Stock ({outOfStockCount})
              </button>
            </div>

            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="Search inventory..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <LoadingSpinner text="Loading warehouse inventory records..." size="lg" />
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No inventory records match the current filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Product & Category</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Current Stock</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Inventory Value</th>
                      <th className="py-3 px-4 text-right">Adjust Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => {
                      const isUpdating = updatingId === item._id;
                      const isLow = item.stock > 0 && item.stock <= 5;
                      const isOut = item.stock === 0;

                      return (
                        <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-10 h-10 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0"
                                onError={(e) => handleImageError(e, item.category)}
                              />
                              <div>
                                <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                                <p className="text-[10px] text-slate-400">{item.brand} • {item.category}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 font-semibold text-slate-800">
                            {formatPrice(item.price)}
                          </td>

                          <td className="py-3 px-3 font-bold text-slate-900">
                            {item.stock} units
                          </td>

                          <td className="py-3 px-3">
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold text-[10px] border border-rose-200">
                                <XCircle className="w-3 h-3" />
                                Out of Stock
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-200">
                                <AlertTriangle className="w-3 h-3" />
                                Low Stock ({item.stock})
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3" />
                                In Stock
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 font-black text-slate-800">
                            {formatPrice(item.price * item.stock)}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              <button
                                disabled={isUpdating || item.stock <= 0}
                                onClick={() => handleStockUpdate(item._id, item.stock - 1)}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-40"
                                title="Decrease stock"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center font-bold text-xs font-mono">
                                {item.stock}
                              </span>
                              <button
                                disabled={isUpdating}
                                onClick={() => handleStockUpdate(item._id, item.stock + 1)}
                                className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors disabled:opacity-40"
                                title="Increase stock"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default AdminInventory;

