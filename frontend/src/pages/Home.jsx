import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingUp,
  Headphones,
  Smartphone,
  Laptop,
  Shirt,
  Armchair,
  Tv,
  Apple,
  Clock,
  Truck,
  RotateCcw,
  CheckCircle2,
  Tag
} from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { productAPI } from '../services/api';

const CATEGORIES = [
  { name: 'Mobiles', icon: Smartphone, color: 'from-blue-600 to-indigo-600', count: '5G Smartphones & Accs', href: '/products?category=Mobiles' },
  { name: 'Electronics', icon: Laptop, color: 'from-indigo-600 to-purple-600', count: 'MacBooks, Laptops & Hubs', href: '/products?category=Electronics' },
  { name: 'Fashion', icon: Shirt, color: 'from-pink-600 to-rose-600', count: 'Ethnic & Modern Wear', href: '/products?category=Fashion' },
  { name: 'Home & Furniture', icon: Armchair, color: 'from-amber-500 to-orange-600', count: 'Mattresses & Decor', href: '/products?category=Home%20%26%20Furniture' },
  { name: 'Appliances', icon: Tv, color: 'from-cyan-600 to-blue-600', count: 'OLED TVs, Washers & Fans', href: '/products?category=Appliances' },
  { name: 'Beauty', icon: Sparkles, color: 'from-purple-500 to-pink-600', count: 'Ayurveda & Skin Care', href: '/products?category=Beauty' },
  { name: 'Grocery', icon: Apple, color: 'from-emerald-500 to-teal-700', count: 'Organic Staples & Superfoods', href: '/products?category=Grocery' },
  { name: 'Accessories', icon: Headphones, color: 'from-violet-600 to-indigo-700', count: 'ANC Audio & Smartwatches', href: '/products?category=Accessories' }
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBanner, setActiveBanner] = useState(0);

  // Flash Sale Countdown simulation (e.g., 08h 45m 12s remaining)
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 45, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await productAPI.getFeatured();
        setFeaturedProducts(res.data.products);
      } catch (error) {
        console.error('Failed to load featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const banners = [
    {
      badge: 'Festive Great Indian Shopping Festival',
      title: 'Upgrade to Flagship Smartphones & Electronics',
      subtitle: 'Instant ₹1,500 bank discount on HDFC/SBI cards, No Cost EMI & guaranteed fast delivery across India.',
      ctaText: 'Explore Mobile Deals',
      link: '/products?category=Mobiles',
      bgGradient: 'from-blue-900 via-indigo-900 to-slate-900',
      tag: 'Up to 40% OFF'
    },
    {
      badge: 'Work & Gaming Superstore',
      title: 'Next-Gen M3 Laptops, 4K Hub Monitors & Gear',
      subtitle: 'Unleash your workflow with high-performance Apple workstations, IPS monitors and ultra-light peripherals.',
      ctaText: 'Shop Electronics',
      link: '/products?category=Electronics',
      bgGradient: 'from-slate-950 via-blue-950 to-indigo-900',
      tag: 'Special Prices'
    },
    {
      badge: 'Traditional & Modern Festive Wear',
      title: 'Authentic Indian Silk Sarees & Designer Kurtas',
      subtitle: 'Celebrate the festive season with Manyavar, FabIndia & pure ethnic craftsmanship delivered to your doorstep.',
      ctaText: 'Discover Fashion',
      link: '/products?category=Fashion',
      bgGradient: 'from-indigo-950 via-purple-950 to-slate-950',
      tag: 'New Collection'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Carousel Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mt-4">
        <div className={`relative overflow-hidden bg-gradient-to-r ${banners[activeBanner].bgGradient} text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-xl transition-all duration-700`}>
          {/* Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{banners[activeBanner].badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {banners[activeBanner].title}
            </h1>

            <p className="text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
              {banners[activeBanner].subtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={banners[activeBanner].link}
                className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all active:scale-95 text-xs sm:text-sm"
              >
                <span>{banners[activeBanner].ctaText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/products"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md transition-colors text-xs sm:text-sm"
              >
                Browse All Categories
              </Link>
            </div>
          </div>

          {/* Carousel Dot Indicators */}
          <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveBanner(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeBanner === idx ? 'w-8 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`Banner ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Indian Marketplace Value Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Free Express Delivery</p>
              <p className="text-[11px] text-slate-400">On all orders over ₹500</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">100% Authentic Brands</p>
              <p className="text-[11px] text-slate-400">Direct Indian manufacturer warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">7-Day Easy Returns</p>
              <p className="text-[11px] text-slate-400">Doorstep pickup & replacement</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Instant UPI & COD</p>
              <p className="text-[11px] text-slate-400">GPay, PhonePe, Cards & Cash</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular 8 Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Explore Top Indian Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Curated marketplace collections tailored for Indian households & lifestyles
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={cat.href}
                className="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col items-center text-center space-y-2.5"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Deal of the Day / Flash Deals Banner with Countdown */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full">
              <Zap className="w-3.5 h-3.5 fill-slate-950" />
              <span>Flash Sale — Today's Special Deals</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Save up to 40% on Premium Electronics & Mobiles
            </h3>
            <p className="text-blue-100 text-xs sm:text-sm">
              Limited inventory available at special promotional prices. Ends today!
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-center bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-xl font-black text-amber-300">{String(timeLeft.hours).padStart(2, '0')}</span>
              <p className="text-[9px] uppercase font-bold text-slate-300">Hours</p>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="text-center bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-xl font-black text-amber-300">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <p className="text-[9px] uppercase font-bold text-slate-300">Mins</p>
            </div>
            <span className="text-xl font-bold">:</span>
            <div className="text-center bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <span className="text-xl font-black text-amber-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <p className="text-[9px] uppercase font-bold text-slate-300">Secs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Releases & Best Sellers
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Top trending items loved by shoppers across India
            </p>
          </div>
          <Link
            to="/products"
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>See All ({featuredProducts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Loading top Indian marketplace products..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Bank & Payment Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-slate-800">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md">
              Safe & Seamless Indian Checkout
            </span>
            <h3 className="text-xl sm:text-2xl font-black">
              Pay securely via UPI, Net Banking or Cash on Delivery
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We support Google Pay, PhonePe, Paytm, BHIM, RuPay, Visa, Mastercard, and Cash on Delivery across 19,000+ Indian PIN codes.
            </p>
          </div>

          <Link
            to="/products"
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 text-xs sm:text-sm shrink-0"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
