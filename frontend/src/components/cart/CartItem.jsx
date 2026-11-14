import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import { handleImageError } from '../../utils/imageFallback';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/80 gap-4 transition-all hover:border-slate-300">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <Link to={`/products/${item.product}`} className="shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-xl border border-slate-100 bg-slate-50"
            onError={(e) => handleImageError(e, item.category)}
          />
        </Link>

        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {item.category || item.brand}
          </span>
          <Link
            to={`/products/${item.product}`}
            className="block text-sm font-bold text-slate-800 hover:text-blue-600 line-clamp-1 transition-colors"
          >
            {item.name}
          </Link>
          <p className="text-xs text-slate-400">Unit Price: {formatPrice(item.price)}</p>
        </div>
      </div>

      {/* Quantity Controls & Line Total */}
      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
          <button
            onClick={() => updateQuantity(item.product, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center text-xs font-bold text-slate-800">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.product, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="p-1.5 rounded-lg hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Price */}
        <div className="text-right min-w-[80px]">
          <span className="text-sm font-bold text-slate-900">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => removeFromCart(item.product)}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
          title="Remove from cart"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
