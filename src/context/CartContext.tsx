import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product, CustomizationData } from '../types';
import { useToast } from './ToastContext';
import { businessConfig } from '../config/businessConfig';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, customization?: CustomizationData, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
}

const CART_STORAGE_KEY = 'giftoria_cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const generateCartItemId = (productId: string, customization: CustomizationData = {}): string => {
    const keyParts = [
      productId,
      customization.selectedVariant || '',
      customization.selectedSize || '',
      customization.selectedColor || '',
      customization.customMessage || '',
      customization.uploadedFileName || '',
    ].join('_');
    return keyParts;
  };

  const addToCart = (product: Product, customization: CustomizationData = {}, quantity: number = 1) => {
    if (product.isComingSoon || product.stock <= 0) {
      showToast('This item is currently unavailable.', 'warning');
      return;
    }

    const itemId = generateCartItemId(product.id, customization);

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === itemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId: itemId,
          product,
          quantity,
          customization,
          addedAt: Date.now(),
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added "${product.name}" to cart! 🛍️`, 'success');
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      // Determine unit price based on selected variant if applicable
      let unitPrice = item.product.price;
      if (item.customization.selectedVariant && item.product.availableVariants) {
        const matchedVariant = item.product.availableVariants.find(
          (v) => v.name === item.customization.selectedVariant
        );
        if (matchedVariant) unitPrice = matchedVariant.price;
      }
      return total + unitPrice * item.quantity;
    }, 0);
  }, [cart]);

  const discount = useMemo(() => {
    // Calculate total compareAt savings
    return cart.reduce((total, item) => {
      if (item.product.compareAtPrice && item.product.compareAtPrice > item.product.price) {
        const itemSavings = (item.product.compareAtPrice - item.product.price) * item.quantity;
        return total + itemSavings;
      }
      return total;
    }, 0);
  }, [cart]);

  const shippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= businessConfig.freeShippingThreshold ? 0 : businessConfig.flatShippingFee;
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + shippingFee;
  }, [subtotal, shippingFee]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        grandTotal,
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
