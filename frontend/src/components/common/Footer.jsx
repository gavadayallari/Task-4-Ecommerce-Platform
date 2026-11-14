import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  Clock,
  RefreshCw,
  Heart,
  MapPin,
  Phone,
  Mail,
  CreditCard
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Value Proposition Highlights for Indian Consumers */}
      <div className="border-b border-slate-800/80 bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-600/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Free Express Shipping</p>
                <p className="text-xs text-slate-400">On all orders over ₹500 across India</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">100% Secure Payments</p>
                <p className="text-xs text-slate-400">UPI, Cards, NetBanking & COD</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-amber-600/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">7-Day Easy Returns</p>
                <p className="text-xs text-slate-400">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-600/15 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">24/7 Dedicated Support</p>
                <p className="text-xs text-slate-400">Toll-free Indian helpline</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                Shop<span className="text-blue-500">Nova</span>
                <span className="text-xs text-amber-400 ml-1">.IN</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              ShopNova is India's premier multi-category digital marketplace delivering authentic electronics, mobiles, fashion, home essentials, and groceries to over 19,000+ PIN codes across India.
            </p>
            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span>101 ShopNova Tech Tower, Outer Ring Rd, Bellandur, Bangalore – 560103, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Customer Care: +91 1800 123 4567 (Toll-Free, 9 AM - 9 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500 shrink-0" />
                <span>support@shopnova.in</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Categories</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/products?category=Mobiles" className="hover:text-blue-400 transition-colors">Mobiles & Tablets</Link></li>
              <li><Link to="/products?category=Electronics" className="hover:text-blue-400 transition-colors">Laptops & Monitors</Link></li>
              <li><Link to="/products?category=Fashion" className="hover:text-blue-400 transition-colors">Indian & Western Fashion</Link></li>
              <li><Link to="/products?category=Home%20%26%20Furniture" className="hover:text-blue-400 transition-colors">Home & Furniture</Link></li>
              <li><Link to="/products?category=Appliances" className="hover:text-blue-400 transition-colors">Home Appliances</Link></li>
              <li><Link to="/products?category=Beauty" className="hover:text-blue-400 transition-colors">Beauty & Grooming</Link></li>
              <li><Link to="/products?category=Grocery" className="hover:text-blue-400 transition-colors">Staples & Superfoods</Link></li>
              <li><Link to="/products?category=Accessories" className="hover:text-blue-400 transition-colors">Audio & Wearables</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/orders" className="hover:text-blue-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/addresses" className="hover:text-blue-400 transition-colors">Manage Delivery Addresses</Link></li>
              <li><Link to="/wishlist" className="hover:text-blue-400 transition-colors">Your Wishlist</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors">Help & Contact Us</Link></li>
              <li><Link to="/cart" className="hover:text-blue-400 transition-colors">Shopping Cart</Link></li>
              <li><Link to="/login" className="hover:text-blue-400 transition-colors">Customer Login</Link></li>
              <li><Link to="/admin/login" className="hover:text-blue-400 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Payment Options Supported */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Payment Methods</h4>
            <p className="text-xs text-slate-400">
              We accept all major Indian payment gateways:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px] font-bold text-slate-300">
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">UPI</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">Google Pay</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">PhonePe</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">Paytm</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">RuPay</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">Visa / MC</span>
              <span className="bg-slate-800 px-2.5 py-1 rounded border border-slate-700">Net Banking</span>
              <span className="bg-emerald-900/60 text-emerald-400 px-2.5 py-1 rounded border border-emerald-800">Cash on Delivery</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-8 mt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} ShopNova India Marketplace Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Use</span>
            <span>•</span>
            <span>GST Registered (India)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
