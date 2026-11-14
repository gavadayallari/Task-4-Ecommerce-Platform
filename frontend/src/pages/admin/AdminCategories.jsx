import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FolderTree, Package, ArrowUpRight, Plus, ExternalLink } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { productAPI } from '../../services/api';

const DEFAULT_CATEGORIES = [
  {
    name: 'Mobiles',
    description: 'Smartphones, 5G devices, basic phones, tablets, and mobile cases',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Electronics',
    description: 'Laptops, noise cancelling headphones, smartwatches, speakers, and cameras',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Fashion',
    description: 'Traditional Indian kurtas, sarees, modern denim, sneakers, and shirts',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Home & Furniture',
    description: 'Bedsheets, curtains, ergonomic study tables, recliner sofas, and decor',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Appliances',
    description: 'Air conditioners, smart LED televisions, microwave ovens, and refrigerators',
    image: 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Beauty',
    description: 'Ayurvedic personal care, skincare, perfumes, face washes, and cosmetics',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Grocery',
    description: 'Organic basmati rice, cold-pressed mustard oil, spices, and dry fruits',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Accessories',
    description: 'Fast chargers, power banks, USB-C cables, leather wallets, and backpacks',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60'
  }
];

const AdminCategories = () => {
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryMetrics = async () => {
      try {
        const res = await productAPI.getProducts({ limit: 200 });
        const prods = res.data.products || [];
        const counts = {};
        prods.forEach((p) => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setProductCounts(counts);
      } catch (err) {
        console.error('Failed to load category counts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryMetrics();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Marketplace Categories</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage the 8 core Indian e-commerce catalog departments and active product distributions
          </p>
        </div>

        <Link
          to="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Product to Category</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Categories Grid */}
        <div className="flex-1 w-full space-y-6">
          {loading ? (
            <LoadingSpinner text="Counting category inventory from MongoDB..." size="lg" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => {
                const count = productCounts[cat.name] || 0;
                return (
                  <div
                    key={cat.name}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-50 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{cat.name}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                            {count} {count === 1 ? 'Product' : 'Products'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400 font-medium">Department Status: Active</span>
                      <Link
                        to={`/products?category=${encodeURIComponent(cat.name)}`}
                        className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>View Store Listing</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;

