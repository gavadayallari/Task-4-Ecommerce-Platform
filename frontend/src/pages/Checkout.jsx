import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  CheckCircle2,
  AlertCircle,
  Smartphone,
  Building,
  MapPin,
  Plus,
  Check,
  QrCode
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderAPI, authAPI } from '../services/api';
import CartSummary from '../components/cart/CartSummary';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/imageFallback';

const INDIAN_BANKS = [
  'State Bank of India (SBI)',
  'HDFC Bank',
  'ICICI Bank',
  'Axis Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank (PNB)',
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India'
];

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');

  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phone: '',
    houseFlat: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Karnataka',
    pinCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, Cash on Delivery, Debit Card, Credit Card, Net Banking
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardName: '',
    expiry: '12/28',
    cvv: '123'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch saved addresses from MongoDB
  useEffect(() => {
    const fetchAddresses = async () => {
      if (user) {
        try {
          const res = await authAPI.getAddresses();
          const addrs = res.data.addresses || [];
          setSavedAddresses(addrs);

          if (addrs.length > 0) {
            const defaultAddr = addrs.find(a => a.isDefault) || addrs[0];
            setSelectedAddressId(defaultAddr._id);
            setShippingAddress({
              fullName: defaultAddr.name || user.name || '',
              phone: defaultAddr.phone || user.phone || '',
              houseFlat: defaultAddr.houseFlat || '',
              street: defaultAddr.street || '',
              landmark: defaultAddr.landmark || '',
              city: defaultAddr.city || '',
              state: defaultAddr.state || 'Karnataka',
              pinCode: defaultAddr.pinCode || '',
              country: 'India'
            });
          } else {
            // Pre-fill from user profile
            setShippingAddress(prev => ({
              ...prev,
              fullName: user.name || '',
              phone: user.phone || '',
              city: user.address?.city || '',
              state: user.address?.state || 'Karnataka',
              pinCode: user.address?.postalCode || '',
              street: user.address?.street || ''
            }));
          }
        } catch (err) {
          console.error('Failed to load user addresses:', err);
        }
      }
    };

    fetchAddresses();
  }, [user]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setShippingAddress({
      fullName: addr.name,
      phone: addr.phone,
      houseFlat: addr.houseFlat,
      street: addr.street,
      landmark: addr.landmark || '',
      city: addr.city,
      state: addr.state,
      pinCode: addr.pinCode,
      country: 'India'
    });
  };

  const handleInputChange = (field, val) => {
    setShippingAddress(prev => ({ ...prev, [field]: val }));
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    if (!user) {
      showToast('Please sign in to complete your purchase', 'warning');
      navigate('/login?redirect=/checkout');
      return;
    }

    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.city ||
      !shippingAddress.pinCode
    ) {
      setError('Please provide all required shipping details: Name, Phone, City, and PIN code.');
      showToast('Please complete required address fields', 'warning');
      return;
    }

    if (!/^\d{6}$/.test(shippingAddress.pinCode.trim())) {
      setError('Please enter a valid 6-digit Indian PIN code.');
      showToast('PIN code must be 6 digits', 'warning');
      return;
    }

    if (paymentMethod === 'UPI' && upiId && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. name@okhdfcbank or 9876543210@paytm).');
      showToast('Invalid UPI ID format', 'warning');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Payment test gateway simulation data
      const isOnline = ['UPI', 'Debit Card', 'Credit Card', 'Net Banking'].includes(paymentMethod);
      const paymentResult = isOnline ? {
        id: `SN-TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
        upiId: paymentMethod === 'UPI' ? (upiId || `${user.email.split('@')[0]}@okaxis`) : '',
        bankName: paymentMethod === 'Net Banking' ? selectedBank : '',
        cardLast4: paymentMethod.includes('Card') ? '4242' : ''
      } : {
        id: `COD-${Date.now()}`,
        status: 'PENDING_DELIVERY',
        update_time: new Date().toISOString()
      };

      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item.product,
          quantity: item.quantity
        })),
        shippingAddress: {
          ...shippingAddress,
          postalCode: shippingAddress.pinCode,
          address: `${shippingAddress.houseFlat ? shippingAddress.houseFlat + ', ' : ''}${shippingAddress.street}${shippingAddress.landmark ? ', Near ' + shippingAddress.landmark : ''}`
        },
        paymentMethod,
        paymentResult
      };

      const res = await orderAPI.createOrder(orderPayload);
      clearCart();
      showToast('Order confirmed! Thank you for shopping on ShopNova.', 'success');
      navigate(`/order-success/${res.data.order._id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order. Please try again.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Secure Indian Checkout</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review delivery address, choose an Indian payment method, and confirm your order
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Forms + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-bold text-slate-800">Select or Enter Delivery Address</h2>
              </div>
              <Link to="/addresses" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                Manage Address Book →
              </Link>
            </div>

            {/* Saved Addresses Selector */}
            {savedAddresses.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Your Saved Addresses</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {savedAddresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => handleSelectSavedAddress(addr)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr._id
                          ? 'border-blue-600 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-bold text-slate-800">{addr.name}</span>
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                          {addr.addressType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {addr.houseFlat}, {addr.street}, {addr.city} – {addr.pinCode}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}
                  <div
                    onClick={() => {
                      setSelectedAddressId('new');
                      setShippingAddress({
                        fullName: user?.name || '',
                        phone: user?.phone || '',
                        houseFlat: '',
                        street: '',
                        landmark: '',
                        city: '',
                        state: 'Karnataka',
                        pinCode: '',
                        country: 'India'
                      });
                    }}
                    className={`p-3.5 rounded-xl border-2 border-dashed cursor-pointer flex items-center justify-center gap-2 text-xs font-bold ${
                      selectedAddressId === 'new'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-600'
                        : 'border-slate-300 text-slate-600 hover:border-blue-400'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Enter a Different Address</span>
                  </div>
                </div>
              </div>
            )}

            {/* Address Input Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="e.g. Yallari Gavada"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone Number (+91) *</label>
                <input
                  type="tel"
                  required
                  value={shippingAddress.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+91 91234 56789"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">House / Flat / Building No. *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.houseFlat}
                  onChange={(e) => handleInputChange('houseFlat', e.target.value)}
                  placeholder="e.g. Flat 402, Green Glen Residency"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Street / Area / Sector *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  placeholder="e.g. Magarpatta City, Hadapsar"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  value={shippingAddress.landmark}
                  onChange={(e) => handleInputChange('landmark', e.target.value)}
                  placeholder="e.g. Near Cybercity Tower 4"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="e.g. Pune, Bangalore, Mumbai, Delhi"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="e.g. Maharashtra, Karnataka"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">6-Digit Indian PIN Code *</label>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={shippingAddress.pinCode}
                  onChange={(e) => handleInputChange('pinCode', e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 411028"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Indian Payment Options */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                2
              </div>
              <h2 className="text-base font-bold text-slate-800">Select Payment Option</h2>
            </div>

            <div className="space-y-3">
              
              {/* Option 1: UPI */}
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'UPI'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">UPI (Google Pay / PhonePe / Paytm / BHIM)</p>
                      <p className="text-xs text-slate-500">Instant approval with zero transaction fees</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'UPI' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'UPI' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Enter UPI ID (VPA)</label>
                    <div className="flex gap-2 max-w-sm">
                      <input
                        type="text"
                        placeholder="e.g. yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">Test mode: Enter any UPI ID or leave blank to auto-simulate approval.</p>
                  </div>
                )}
              </div>

              {/* Option 2: Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Cash on Delivery (COD)</p>
                      <p className="text-xs text-slate-500">Pay via cash or UPI scan when your order arrives at your door</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Cash on Delivery' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'Cash on Delivery' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Option 3: Debit Card */}
              <div
                onClick={() => setPaymentMethod('Debit Card')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Debit Card'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Debit Card (RuPay / Visa / Mastercard)</p>
                      <p className="text-xs text-slate-500">All major Indian banks supported with test gateway</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Debit Card' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'Debit Card' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Option 4: Credit Card */}
              <div
                onClick={() => setPaymentMethod('Credit Card')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Credit Card'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Credit Card (Visa / Mastercard / RuPay / Amex)</p>
                      <p className="text-xs text-slate-500">Instant 10% discount on HDFC/SBI Credit Cards</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Credit Card' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'Credit Card' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </div>

              {/* Option 5: Net Banking */}
              <div
                onClick={() => setPaymentMethod('Net Banking')}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'Net Banking'
                    ? 'border-blue-600 bg-blue-50/40'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">Net Banking</p>
                      <p className="text-xs text-slate-500">Direct online payment from 50+ Indian banks</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === 'Net Banking' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'Net Banking' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>

                {paymentMethod === 'Net Banking' && (
                  <div className="mt-3 pt-3 border-t border-blue-100 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Select Your Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full max-w-sm text-xs bg-white border border-slate-200 rounded-lg p-2.5 focus:outline-hidden focus:border-blue-500"
                    >
                      {INDIAN_BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Step 3: Items Review Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                3
              </div>
              <h2 className="text-base font-bold text-slate-800">Review Ordered Items ({cartItems.length})</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {cartItems.map((item) => (
                <div key={item.product} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-100"
                      onError={(e) => handleImageError(e, item.category)}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Cart Summary & Place Order */}
        <div className="lg:col-span-1 sticky top-28">
          <CartSummary
            isCheckoutPage={true}
            onProceed={handlePlaceOrder}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
