import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { addToCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('shopnova_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync with backend if user is logged in
  useEffect(() => {
    const fetchBackendWishlist = async () => {
      if (user) {
        try {
          const res = await authAPI.getWishlist();
          if (res.data?.wishlist) {
            setWishlistItems(res.data.wishlist);
          }
        } catch (err) {
          console.error('[Wishlist Error]:', err);
        }
      }
    };

    fetchBackendWishlist();
  }, [user]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('shopnova_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(item => {
      const id = typeof item === 'object' ? item._id : item;
      return id === productId;
    });
  };

  const toggleWishlist = async (product) => {
    if (!product || !product._id) return;

    const productId = product._id;
    const currentlyIn = isInWishlist(productId);

    if (currentlyIn) {
      setWishlistItems(prev => prev.filter(item => {
        const id = typeof item === 'object' ? item._id : item;
        return id !== productId;
      }));
      showToast(`Removed "${product.name}" from Wishlist`, 'info');
    } else {
      setWishlistItems(prev => [...prev, product]);
      showToast(`Added "${product.name}" to Wishlist!`, 'success');
    }

    if (user) {
      try {
        await authAPI.toggleWishlist(productId);
      } catch (err) {
        console.error('Failed to sync wishlist with server:', err);
      }
    }
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems(prev => prev.filter(item => {
      const id = typeof item === 'object' ? item._id : item;
      return id !== productId;
    }));
    showToast('Item removed from Wishlist', 'info');

    if (user) {
      try {
        await authAPI.toggleWishlist(productId);
      } catch (err) {
        console.error('Failed to sync remove wishlist:', err);
      }
    }
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        totalWishlist: wishlistItems.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

