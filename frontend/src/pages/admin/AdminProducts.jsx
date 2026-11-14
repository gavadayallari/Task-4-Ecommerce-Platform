import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  ExternalLink,
  AlertTriangle,
  PlusCircle
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ProductModal from '../../components/admin/ProductModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatPrice } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { showToast } = useToast();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await productAPI.getProducts({ limit: 100 });
      setProducts(res.data.products);
    } catch (err) {
      console.error('Error loading products:', err);
      showToast('Failed to load products inventory', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    setModalLoading(true);
    try {
      if (editingProduct) {
        await productAPI.updateProduct(editingProduct._id, formData);
        showToast(`Updated "${formData.name}" successfully!`, 'success');
      } else {
        await productAPI.createProduct(formData);
        showToast(`Created "${formData.name}" successfully!`, 'success');
      }
      setIsModalOpen(false);
      loadProducts();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save product';
      showToast(msg, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async (prod) => {
    if (window.confirm(`Are you sure you want to permanently delete "${prod.name}"?`)) {
      try {
        await productAPI.deleteProduct(prod._id);
        showToast(`Deleted "${prod.name}"`, 'info');
        loadProducts();
      } catch (err) {
        showToast('Failed to delete product', 'error');
      }
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Products Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage product listings, update prices in INR (₹), and edit descriptions across all 8 categories
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product</span>
          </Link>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-2xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Quick Modal</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content Area */}
        <div className="flex-1 w-full space-y-6">
          {/* Search Box */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search by name, brand, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            {loading ? (
              <LoadingSpinner text="Loading inventory records..." />
            ) : filteredProducts.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No products found matching your search.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Price</th>
                      <th className="py-3 px-3">Inventory</th>
                      <th className="py-3 px-3">Rating</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.image}
                              alt={prod.name}
                              className="w-10 h-10 object-contain rounded-lg border border-slate-100 bg-slate-50 shrink-0"
                              onError={(e) => handleImageError(e, prod.category)}
                            />
                            <div>
                              <p className="font-bold text-slate-800 line-clamp-1">{prod.name}</p>
                              <p className="text-[10px] text-slate-400">{prod.brand}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] border border-blue-100">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-3 px-3 font-bold text-slate-900">
                          {formatPrice(prod.discountPrice > 0 ? prod.discountPrice : prod.price)}
                          {prod.discountPrice > 0 && (
                            <span className="text-[10px] text-slate-400 line-through block">
                              {formatPrice(prod.price)}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3">
                          {prod.stock <= 5 ? (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold text-[10px] border border-amber-200">
                              <AlertTriangle className="w-3 h-3" />
                              {prod.stock} left (Low)
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold text-[10px]">
                              {prod.stock} in stock
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-semibold text-slate-700">
                          ★ {prod.rating ? prod.rating.toFixed(1) : '0.0'} ({prod.numReviews})
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/admin/products/edit/${prod._id}`}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Full edit page"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteProduct(prod)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
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

      {/* Quick Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
        loading={modalLoading}
      />
    </div>
  );
};

export default AdminProducts;
