import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('novacart_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    localStorage.setItem('novacart_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));

    if (product.stock <= 0) {
      showToast(`Sorry, "${product.name}" is currently out of stock.`, 'error');
      return false;
    }

    let itemAdded = false;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product === product._id);

      if (existing) {
        const newQty = existing.quantity + qty;
        if (newQty > product.stock) {
          showToast(`Cannot add more than available stock (${product.stock} items).`, 'warning');
          return prevItems;
        }
        itemAdded = true;
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        if (qty > product.stock) {
          showToast(`Only ${product.stock} items available in stock.`, 'warning');
          return prevItems;
        }
        itemAdded = true;
        const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            price: effectivePrice,
            image: product.image,
            brand: product.brand,
            category: product.category,
            stock: product.stock,
            quantity: qty
          }
        ];
      }
    });

    if (itemAdded) {
      showToast(`Added "${product.name}" to cart!`, 'success');
    }
    return true;
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product === productId) {
          if (qty > item.stock) {
            showToast(`Maximum stock limit reached (${item.stock})`, 'warning');
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.product !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Computations
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const taxPrice = Math.round(itemsPrice * 0.05 * 100) / 100;
  const freeShippingThreshold = 500;
  const shippingPrice = itemsPrice >= freeShippingThreshold || itemsPrice === 0 ? 0 : 49;
  const totalPrice = Math.round((itemsPrice + taxPrice + shippingPrice) * 100) / 100;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - itemsPrice);
  const freeShippingProgress = Math.min(100, (itemsPrice / freeShippingThreshold) * 100);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        amountToFreeShipping,
        freeShippingProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
