import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import RatingStars from '../common/RatingStars';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isDiscounted = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = isDiscounted
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const inWishlist = isInWishlist(product._id);

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col relative">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <Link to={`/products/${product._id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => handleImageError(e, product.category)}
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isDiscounted && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs tracking-wide">
              {discountPercent}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              Top Deal
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-md z-20 ${
            inWishlist
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <Link
            to={`/products/${product._id}`}
            className="p-2.5 bg-white text-slate-800 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-colors pointer-events-auto"
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1.5">
          <span className="uppercase tracking-wider font-semibold text-blue-600 text-[10px]">{product.category}</span>
          <span className="text-slate-500 font-bold text-[11px]">{product.brand}</span>
        </div>

        {/* Product Title */}
        <Link
          to={`/products/${product._id}`}
          className="text-xs sm:text-sm font-bold text-slate-800 hover:text-blue-600 transition-colors line-clamp-2 mb-2 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating} numReviews={product.numReviews} size="sm" />
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                {formatPrice(isDiscounted ? product.discountPrice : product.price)}
              </span>
              {isDiscounted && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-600 font-bold">
              {product.stock > 0 ? 'Free Delivery' : 'Out of Stock'}
            </p>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
            className={`p-2.5 rounded-xl transition-all flex items-center justify-center shadow-xs ${
              product.stock > 0
                ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white active:scale-95'
                : 'bg-slate-100 text-slate-300 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
