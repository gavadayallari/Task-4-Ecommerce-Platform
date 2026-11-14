import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  CreditCard,
  Truck,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  FileText,
  Building,
  Phone,
  ShieldCheck
} from 'lucide-react';
import OrderStatusBadge from '../components/common/OrderStatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/imageFallback';

const OrderDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const res = await orderAPI.getOrderById(id);
        setOrder(res.data.order);
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSimulatePayment = async () => {
    setPaying(true);
    try {
      const res = await orderAPI.payOrder(id, {
        id: `PAY-UPI-${Date.now()}`,
        status: 'COMPLETED'
      });
      setOrder(res.data.order);
      showToast('Payment verified successfully!', 'success');
    } catch (err) {
      showToast('Payment simulation failed', 'error');
    } finally {
      setPaying(false);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving order details & tax invoice..." size="lg" />;
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-sm text-slate-500">The requested order could not be located.</p>
        <Link to="/orders" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs">
          View My Orders
        </Link>
      </div>
    );
  }

  const steps = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentStepIndex = steps.indexOf(order.orderStatus);

  // Address resolution
  const addr = order.shippingAddress || {};
  const formattedAddress = [
    addr.houseFlat,
    addr.street,
    addr.landmark ? `Near ${addr.landmark}` : '',
    addr.address, // fallback
    addr.city,
    addr.state,
    addr.pinCode || addr.postalCode
  ].filter(Boolean).join(', ');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0 print:max-w-none">
      {/* Top Bar - hidden on print */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 print:hidden">
        <div>
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900">
              Order #{order._id.substring(order._id.length - 8).toUpperCase()}
            </h1>
            <OrderStatusBadge status={order.orderStatus} />
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })} at{' '}
              {new Date(order.createdAt).toLocaleTimeString()}
            </span>
          </p>
        </div>

        {/* Actions & Payment Status Pill */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrintInvoice}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Tax Invoice</span>
          </button>

          {order.isPaid ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Paid ({order.paymentMethod})
            </span>
          ) : (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                <Clock className="w-3.5 h-3.5" />
                Unpaid ({order.paymentMethod})
              </span>
              <button
                onClick={handleSimulatePayment}
                disabled={paying}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {paying ? 'Processing...' : 'Pay Online Now'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Printable Invoice Header (only visible when printing or in formal view) */}
      <div className="hidden print:block border-b-2 border-slate-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-blue-600">ShopNova</h2>
            <p className="text-xs text-slate-600">ShopNova Marketplace India Private Limited</p>
            <p className="text-xs text-slate-500">GSTIN: 29AABCS1429B1Z0 | Bengaluru, Karnataka 560103</p>
          </div>
          <div className="text-right">
            <h3 className="text-lg font-bold text-slate-900">ORIGINAL TAX INVOICE</h3>
            <p className="text-xs text-slate-600">Invoice No: SN-INV-{order._id.substring(order._id.length - 8).toUpperCase()}</p>
            <p className="text-xs text-slate-500">Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Progress Timeline Stepper - hidden on print */}
      {order.orderStatus !== 'Cancelled' ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs print:hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
            Delivery Status Pipeline
          </h3>
          <div className="relative flex items-center justify-between max-w-2xl mx-auto">
            {/* Background line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
            {/* Active line */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 transition-all duration-500 z-0"
              style={{
                width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%`
              }}
            />

            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div key={step} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-4 ring-white'
                        : 'bg-white text-slate-400 border-2 border-slate-200'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs mt-2 font-medium ${
                      isCurrent
                        ? 'text-blue-600 font-bold'
                        : isCompleted
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-3 print:hidden">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>This order has been cancelled.</span>
        </div>
      )}

      {/* Grid: Order Items & Delivery/Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Ordered Items List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4 print:border-none print:shadow-none print:p-0">
          <h3 className="text-sm font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <span>Items in This Order ({order.orderItems?.length || 0})</span>
          </h3>

          <div className="divide-y divide-slate-100">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain rounded-xl border border-slate-100 bg-slate-50 p-1 shrink-0 print:w-12 print:h-12"
                    onError={(e) => handleImageError(e, item.category)}
                  />
                  <div className="space-y-1">
                    <Link
                      to={`/products/${item.product}`}
                      className="text-sm font-bold text-slate-800 hover:text-blue-600 line-clamp-1 transition-colors print:pointer-events-none"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-slate-500">
                      Price: {formatPrice(item.price)} × Quantity: {item.quantity}
                    </p>
                    <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      GST Inclusive
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold text-slate-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Shipping Info & Summary */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Indian Delivery Address</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{addr.name || addr.fullName || order.user?.name}</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {formattedAddress || 'Standard Delivery Address'}
              </p>
              <p className="text-xs font-semibold text-slate-700 mt-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 {addr.phone || '9876543210'}</span>
              </p>
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>Payment Details</span>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-800 flex items-center justify-between">
                <span>Method:</span>
                <span className="font-bold text-blue-600">{order.paymentMethod}</span>
              </p>
              {order.paymentResult?.id && (
                <p className="text-xs text-slate-600 flex items-center justify-between">
                  <span>Reference ID:</span>
                  <span className="font-mono text-[11px] text-slate-700">{order.paymentResult.id}</span>
                </p>
              )}
              {order.paymentResult?.upiId && (
                <p className="text-xs text-slate-600 flex items-center justify-between">
                  <span>UPI VPA:</span>
                  <span className="font-mono text-[11px] text-slate-700">{order.paymentResult.upiId}</span>
                </p>
              )}
              <p className="text-xs text-slate-600 flex items-center justify-between pt-1">
                <span>Status:</span>
                <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {order.isPaid ? 'Payment Captured' : 'Payment Pending'}
                </span>
              </p>
            </div>
          </div>

          {/* Cost Summary with 5% GST and Shipping */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3 text-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Price Details (INR)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-800">{formatPrice(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Goods & Services Tax (5% GST)</span>
              <span className="font-semibold text-slate-800">{formatPrice(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charges</span>
              <span className="font-semibold text-emerald-600">
                {order.shippingPrice === 0 ? 'FREE' : formatPrice(order.shippingPrice)}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline text-sm">
              <span className="font-bold text-slate-900">Total Amount</span>
              <span className="text-xl font-black text-blue-600">{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
