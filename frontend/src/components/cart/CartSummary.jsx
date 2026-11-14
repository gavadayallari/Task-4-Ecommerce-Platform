import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';

const CartSummary = ({ isCheckoutPage = false, onProceed = null, disabled = false }) => {
  const {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    amountToFreeShipping,
    freeShippingProgress,
    totalItems
  } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
      <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100">
        Price Details ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </h3>

      {/* Free Shipping Indicator */}
      {!isCheckoutPage && (
        <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Truck className="w-4 h-4 text-blue-600 shrink-0" />
            {amountToFreeShipping > 0 ? (
              <span>Add <strong className="text-blue-600">{formatPrice(amountToFreeShipping)}</strong> more for Free Shipping!</span>
            ) : (
              <span className="text-emerald-600 font-bold">🎉 Congratulations! You unlocked Free Shipping across India!</span>
            )}
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Calculations */}
      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between text-slate-600">
          <span>Items Subtotal</span>
          <span className="font-semibold text-slate-800">{formatPrice(itemsPrice)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Estimated Indian Tax (5% GST)</span>
          <span className="font-semibold text-slate-800">{formatPrice(taxPrice)}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span>Delivery Charges</span>
          <span className="font-semibold text-slate-800">
            {shippingPrice === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-xs">FREE</span>
            ) : (
              formatPrice(shippingPrice)
            )}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
          <span className="text-base font-bold text-slate-900">Total Payable</span>
          <div className="text-right">
            <span className="text-2xl font-black text-blue-600">{formatPrice(totalPrice)}</span>
            <p className="text-[11px] text-slate-400">Inclusive of all Indian taxes</p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      {!isCheckoutPage ? (
        <Link
          to="/checkout"
          className="w-full py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] text-sm"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        onProceed && (
          <button
            type="button"
            onClick={onProceed}
            disabled={disabled}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed text-sm"
          >
            <span>Confirm & Place Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )
      )}

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>100% Safe & Secure Indian Payment Gateway</span>
      </div>
    </div>
  );
};

export default CartSummary;
