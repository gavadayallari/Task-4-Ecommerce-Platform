import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ShoppingBag } from 'lucide-react';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { orderAPI } from '../services/api';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/imageFallback';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getMyOrders();
        setOrders(res.data.orders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Fetching your purchase history..." size="lg" />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review previous orders, check delivery tracking, and download purchase invoices
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't made any purchases on ShopNova yet. Start exploring our marketplace to place your first order!
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Shopping</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-800">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <OrderStatusBadge status={order.orderStatus} />
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Items Thumbnails */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-x-auto py-1">
                  {order.orderItems?.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl border border-slate-100 bg-slate-50"
                        title={item.name}
                        onError={(e) => handleImageError(e, item.category)}
                      />
                    </div>
                  ))}
                  {order.orderItems?.length > 4 && (
                    <span className="text-xs text-slate-400 font-semibold px-2">
                      +{order.orderItems.length - 4} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div>
                    <p className="text-[11px] text-slate-400">Total Amount</p>
                    <p className="text-base font-black text-blue-600">{formatPrice(order.totalPrice)}</p>
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 text-xs font-bold border border-slate-200 hover:border-blue-200 transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
