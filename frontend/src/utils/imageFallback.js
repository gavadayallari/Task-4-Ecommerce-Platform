// Category-specific high-resolution CDN fallback images
export const CATEGORY_FALLBACK_IMAGES = {
  'Mobiles': 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
  'Electronics': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  'Fashion': 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80',
  'Home & Furniture': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80',
  'Home & Office': 'https://images.unsplash.com/photo-1580481077197-2a677943c5b8?w=600&auto=format&fit=crop&q=80',
  'Appliances': 'https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?w=600&auto=format&fit=crop&q=80',
  'Beauty': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
  'Grocery': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80',
  'Accessories': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
  'Audio': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
  'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
  'Gaming': 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80'
};

// Safe inline SVG fallback that works completely offline or when external image CDNs fail
export const DEFAULT_SVG_PLACEHOLDER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="%23f1f5f9"><rect width="400" height="400" fill="%23f8fafc"/><circle cx="200" cy="180" r="50" fill="%23e2e8f0"/><path d="M140 270 C160 230, 240 230, 260 270 Z" fill="%23cbd5e1"/><text x="200" y="320" font-family="system-ui, sans-serif" font-size="14" font-weight="bold" fill="%2364748b" text-anchor="middle">ShopNova Product Image</text></svg>`;

export const getCategoryFallbackImage = (category) => {
  if (!category) return DEFAULT_SVG_PLACEHOLDER;
  return CATEGORY_FALLBACK_IMAGES[category] || DEFAULT_SVG_PLACEHOLDER;
};

export const handleImageError = (e, category) => {
  const target = e.currentTarget;
  const fallback = getCategoryFallbackImage(category);

  // If current source is already the category fallback, use the guaranteed SVG placeholder to avoid infinite loops
  if (target.src === fallback || target.getAttribute('data-fallback-tried') === 'true') {
    target.src = DEFAULT_SVG_PLACEHOLDER;
  } else {
    target.setAttribute('data-fallback-tried', 'true');
    target.src = fallback;
  }
};

