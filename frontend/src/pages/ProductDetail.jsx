import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  AlertCircle,
  Heart,
  MapPin,
  Tag,
  CreditCard,
  Zap
} from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/imageFallback';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Indian PIN Code Delivery Checker State
  const [pinCode, setPinCode] = useState('560001');
  const [pinChecked, setPinChecked] = useState(true);
  const [pinMessage, setPinMessage] = useState('Delivery in 2-3 business days | Cash on Delivery Available');

  // Customer Review Form State
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getProductById(id);
        setProduct(res.data.product);
        setSelectedImage(res.data.product.image);
      } catch (error) {
        console.error('Failed to load product details:', error);
        showToast('Product not found or unavailable', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const added = addToCart(product, quantity);
    if (added) {
      navigate('/checkout');
    }
  };

  const handleCheckPinCode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pinCode.trim())) {
      setPinChecked(false);
      setPinMessage('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }
    setPinChecked(true);
    setPinMessage(`Fast Express Delivery to ${pinCode.trim()} in 2 days. COD & UPI available!`);
    showToast(`PIN Code ${pinCode} verified for delivery!`, 'success');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in to write a product review', 'warning');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!comment.trim()) {
      showToast('Please provide a review comment', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      await productAPI.createReview(id, { rating, comment });
      showToast('Review submitted successfully! Thank you.', 'success');
      setComment('');
      // Refresh product to show new review and updated rating
      const res = await productAPI.getProductById(id);
      setProduct(res.data.product);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit review';
      showToast(msg, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching product specifications & verified reviews..." size="lg" />;
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
        <p className="text-sm text-slate-500">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const isDiscounted = product.discountPrice > 0 && product.discountPrice < product.price;
  const effectivePrice = isDiscounted ? product.discountPrice : product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const allImages = [product.image, ...(product.images || [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const inWishlist = isInWishlist(product._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/products" className="hover:text-blue-600">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 font-bold text-slate-600">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-28">
          {/* Main Large Image */}
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-50 border border-slate-200/90 shadow-xs flex items-center justify-center">
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="w-full h-full object-contain p-4"
              onError={(e) => handleImageError(e, product.category)}
            />
            {isDiscounted && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-lg shadow-md tracking-wider">
                {discountPercent}% OFF
              </span>
            )}
            
            {/* Wishlist Button on image */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-2xl shadow-lg backdrop-blur-md transition-all ${
                inWishlist ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-500 hover:text-rose-500'
              }`}
              title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails list */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-18 h-18 rounded-2xl overflow-hidden border-2 transition-all p-1 bg-white shrink-0 ${
                    selectedImage === img
                      ? 'border-blue-600 ring-2 ring-blue-600/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Pricing, PIN delivery & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Title & Brand */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md">
                {product.category}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Brand: <strong className="text-slate-800">{product.brand}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-3">
              <RatingStars rating={product.rating} numReviews={product.numReviews} size="md" />
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs font-bold">
                {product.stock > 0 ? (
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">In Stock ({product.stock} units)</span>
                ) : (
                  <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded">Currently Out of Stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Indian Rupee Price Box */}
          <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              {formatPrice(effectivePrice)}
            </span>
            {isDiscounted && (
              <>
                <span className="text-base text-slate-400 line-through font-semibold">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-black text-emerald-600">
                  Save {discountPercent}% (₹{(product.price - product.discountPrice).toLocaleString('en-IN')})
                </span>
              </>
            )}
            <div className="w-full text-[11px] text-slate-500 pt-1 flex items-center gap-1">
              <span>Inclusive of all applicable Indian taxes (5% GST included)</span>
            </div>
          </div>

          {/* Promotional Bank Offers */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Available Marketplace Bank Offers</span>
            </div>
            <ul className="space-y-1 text-slate-700 list-disc list-inside">
              <li><strong>UPI Instant Discount:</strong> Get ₹100 instant discount on orders above ₹2,000 via Google Pay, PhonePe or Paytm.</li>
              <li><strong>HDFC / SBI Cards:</strong> 10% instant savings up to ₹1,500 on Credit/Debit Card payments.</li>
              <li><strong>No Cost EMI:</strong> Available on leading Indian banks starting at ₹1,999/month.</li>
            </ul>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Product Highlights</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Delivery & 6-digit Indian PIN Code Checker */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Check Delivery & Cash on Delivery Availability</span>
            </div>
            <form onSubmit={handleCheckPinCode} className="flex gap-2 max-w-sm">
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit PIN Code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-hidden focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0"
              >
                Check
              </button>
            </form>
            <p className={`text-xs font-medium ${pinChecked ? 'text-emerald-700' : 'text-rose-600'}`}>
              {pinMessage}
            </p>
          </div>

          {/* Quantity Stepper & Add to Cart / Buy Now */}
          <div className="space-y-4 pt-2">
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1 shadow-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-bold text-slate-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs text-slate-500">
                  Subtotal: <strong className="text-slate-900 text-sm font-bold">{formatPrice(effectivePrice * quantity)}</strong>
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Assurances */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">100% Genuine</p>
              <p className="text-[10px] text-slate-400">Direct from Brands</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <RotateCcw className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">7 Days Return</p>
              <p className="text-[10px] text-slate-400">Replacement Guarantee</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <Truck className="w-5 h-5 text-purple-600 mx-auto mb-1" />
              <p className="text-[11px] font-bold text-slate-800">Free Delivery</p>
              <p className="text-[10px] text-slate-400">On orders &gt; ₹500</p>
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews & Rating Section */}
      <div className="border-t border-slate-200 pt-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Verified Customer Reviews & Ratings</h2>
            <p className="text-xs text-slate-500">Real feedback from verified purchasers across India</p>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
            <span className="text-2xl font-black text-blue-700">{product.rating.toFixed(1)}</span>
            <div className="text-left">
              <RatingStars rating={product.rating} numReviews={0} size="sm" />
              <span className="text-[10px] font-semibold text-slate-500">{product.numReviews} ratings</span>
            </div>
          </div>
        </div>

        {/* Write a review box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Share Your Experience with this Product</h3>
          {user ? (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Rating *</label>
                <div className="flex items-center gap-2">
                  <RatingStars rating={rating} onRate={(r) => setRating(r)} size="lg" interactive={true} />
                  <span className="text-xs font-bold text-amber-500 ml-2">{rating} out of 5 stars</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Your Review Comment *</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you like or dislike about the build quality, performance, or value..."
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors disabled:opacity-50"
              >
                {submittingReview ? 'Submitting Review...' : 'Post Customer Review'}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-600">Have you purchased this product? Sign in to submit your rating.</span>
              <Link
                to={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-xs hover:bg-blue-700 transition-colors"
              >
                Sign In to Review
              </Link>
            </div>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((rev, index) => (
              <div key={index} className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                      {rev.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {rev.name}
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1.5 py-0.2 rounded border border-emerald-200">
                          ✓ Verified Purchase
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <RatingStars rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-10">
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No customer reviews yet. Be the first to share your experience!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
