import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
  Heart,
  MapPin,
  HelpCircle,
  Smartphone,
  Laptop,
  Shirt,
  Armchair,
  Tv,
  Sparkles,
  Apple,
  Headphones
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const CATEGORIES = [
  { name: 'Mobiles', icon: Smartphone, href: '/products?category=Mobiles' },
  { name: 'Electronics', icon: Laptop, href: '/products?category=Electronics' },
  { name: 'Fashion', icon: Shirt, href: '/products?category=Fashion' },
  { name: 'Home & Furniture', icon: Armchair, href: '/products?category=Home%20%26%20Furniture' },
  { name: 'Appliances', icon: Tv, href: '/products?category=Appliances' },
  { name: 'Beauty', icon: Sparkles, href: '/products?category=Beauty' },
  { name: 'Grocery', icon: Apple, href: '/products?category=Grocery' },
  { name: 'Accessories', icon: Headphones, href: '/products?category=Accessories' }
];

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { totalWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner Bar - Indian Marketplace Highlights */}
      <div className="bg-blue-700 text-white text-[11px] py-1 px-4 sm:px-8 flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <span className="bg-blue-900/60 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
            Festive Mega Sale
          </span>
          <span className="hidden sm:inline">
            Free Delivery across India on orders over ₹500 | 7-Day Replacement
          </span>
        </div>
        <div className="flex items-center gap-4 text-blue-100">
          <Link to="/contact" className="hover:text-white flex items-center gap-1 transition-colors">
            <HelpCircle className="w-3 h-3" />
            <span>24x7 Customer Care</span>
          </Link>
          <span className="hidden md:inline">|</span>
          <span className="hidden md:flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-300" />
            Deliver to: <strong>India (+91)</strong>
          </span>
        </div>
      </div>

      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black tracking-tight text-blue-600">
                  Shop<span className="text-slate-900">Nova</span>
                </span>
                <span className="text-[10px] font-black text-amber-500 tracking-wider">.IN</span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-wider -mt-1 hidden sm:block">
                INDIAN MARKETPLACE
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="Search for Mobiles, Electronics, Fashion, Appliances and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 hover:bg-slate-100/90 focus:bg-white text-slate-800 placeholder-slate-400 text-xs sm:text-sm pl-11 pr-24 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:outline-hidden transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              Search
            </button>
          </form>

          {/* Right Action Icons & User Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Wishlist Link */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              title="View Wishlist"
            >
              <Heart className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-semibold">Wishlist</span>
              {totalWishlist > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalWishlist > 9 ? '9+' : totalWishlist}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden xl:inline text-xs font-semibold">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 hidden sm:inline-block max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdown && (
                  <div
                    onMouseLeave={() => setUserDropdown(false)}
                    className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Signed in as</p>
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-blue-700 bg-blue-50/50 hover:bg-blue-100/50 font-bold transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                        Admin Portal
                      </Link>
                    )}

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/wishlist"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-slate-400" />
                      My Wishlist ({totalWishlist})
                    </Link>

                    <Link
                      to="/addresses"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Manage Addresses
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Profile Settings
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdown(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 px-3 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 px-3.5 py-2 rounded-xl shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-4 space-y-3 animate-in fade-in">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search products in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 text-slate-800 text-xs pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <nav className="flex flex-col gap-1 text-xs font-semibold text-slate-700 pt-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                All Products Catalog
              </Link>
              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                My Wishlist ({totalWishlist})
              </Link>
              {user && (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/addresses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Manage Addresses
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-lg hover:bg-slate-100"
                  >
                    Profile Settings
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-bold"
                >
                  Admin Portal
                </Link>
              )}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100"
              >
                Contact & Support
              </Link>
            </nav>
          </div>
        )}
      </div>

      {/* Secondary Marketplace Category Bar - Inspired by Top Indian Portals */}
      <div className="bg-slate-50 border-t border-slate-100 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 sm:gap-4 py-2 min-w-max text-xs font-semibold text-slate-700">
            <Link
              to="/products"
              className={`px-3 py-1.5 rounded-lg hover:text-blue-600 transition-colors ${
                location.pathname === '/products' && !location.search ? 'text-blue-600 font-bold bg-blue-50' : ''
              }`}
            >
              All Categories
            </Link>
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = location.search.includes(encodeURIComponent(cat.name)) || location.search.includes(cat.name);
              return (
                <Link
                  key={cat.name}
                  to={cat.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:text-blue-600 hover:bg-blue-50/80 ${
                    isActive ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
