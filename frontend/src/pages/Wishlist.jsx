import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowRight, ArrowLeft, Star, PackageCheck } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice } from '../utils/currency';
import { handleImageError } from '../utils/imageFallback';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, moveToCart } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Wishlist</h1>
            <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-600" />
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Items you have saved to purchase later or keep track of special deals and discounts
          </p>
        </div>
      </div>

      {/* Wishlist Items Grid */}
      {wishlistItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-5 shadow-xs max-w-xl mx-auto my-8">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">
              Explore thousands of deals across Mobiles, Electronics, Fashion, Appliances and more!
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 transition-all"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((product) => {
            const hasDiscount = product.discountPrice && product.discountPrice > 0;
            const finalPrice = hasDiscount ? product.discountPrice : product.price;
            const discountPercent = hasDiscount
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
              : 0;

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image & Badges */}
                <div className="relative aspect-square bg-slate-50 p-4 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => handleImageError(e, product.category)}
                  />
                  {hasDiscount && (
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                      {discountPercent}% OFF
                    </span>
                  )}
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-400 hover:text-rose-600 shadow-md flex items-center justify-center transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {product.brand || product.category}
                    </p>
                    <Link
                      to={`/products/${product._id}`}
                      className="text-xs font-bold text-slate-800 hover:text-blue-600 line-clamp-2 transition-colors"
                    >
                      {product.name}
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-0.5">
                        {product.rating ? product.rating.toFixed(1) : '4.2'} <Star className="w-2.5 h-2.5 fill-white" />
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ({product.numReviews || 12})
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-black text-slate-900">
                        {formatPrice(finalPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-slate-400 line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    {product.stock <= 5 && (
                      <p className="text-[10px] font-semibold text-amber-600 mt-1">
                        Only {product.stock} items left in stock
                      </p>
                    )}
                  </div>

                  {/* Move to Cart Button */}
                  <button
                    onClick={() => moveToCart(product)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

