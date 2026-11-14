import React from 'react';
import { Filter, RotateCcw, Star } from 'lucide-react';

const ProductFilters = ({
  categories = [],
  selectedCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  minRating,
  onRatingChange,
  inStock,
  onInStockChange,
  sort,
  onSortChange,
  onReset
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filters</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Sort By Dropdown */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Sort Products
        </label>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-hidden focus:border-blue-500 font-medium"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
          <option value="name-asc">Alphabetical (A - Z)</option>
        </select>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Categories ({categories.length})
        </label>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-1 scrollbar-none">
          <button
            onClick={() => onSelectCategory('All')}
            className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
              selectedCategory === 'All'
                ? 'bg-blue-50 text-blue-700 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>All Categories</span>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className={`w-full text-left text-xs font-semibold px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${
                selectedCategory === cat.name
                  ? 'bg-blue-50 text-blue-700 font-bold'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md font-bold">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Price Range (₹ INR)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
            <input
              type="number"
              placeholder="Min"
              min="0"
              value={minPrice}
              onChange={(e) => onPriceChange('min', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-2.5 py-2 text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">₹</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              value={maxPrice}
              onChange={(e) => onPriceChange('max', e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-6 pr-2.5 py-2 text-slate-700 focus:outline-hidden focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Customer Rating
        </label>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => onRatingChange(minRating === r ? '' : r)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded-xl transition-colors flex items-center gap-2 ${
                minRating === r ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
              </div>
              <span>{r} Stars & Above</span>
            </button>
          ))}
        </div>
      </div>

      {/* In Stock Only Checkbox */}
      <div className="pt-2 border-t border-slate-100">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-700 select-none">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => onInStockChange(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
          />
          <span>In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
