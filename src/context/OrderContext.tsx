import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, CartItem, ShippingAddress, PaymentMethod } from '../types';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

interface OrderContextType {
  orders: Order[];
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Order | null;
  getOrderById: (orderId: string) => Order | undefined;
}

const ORDERS_STORAGE_KEY = 'giftoria_orders';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const { cart, subtotal, discount, shippingFee, grandTotal, clearCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const createOrder = (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Order | null => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return null;
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `GIFT-2026-${randomSuffix}`;

    const newOrder: Order = {
      orderId,
      customer: shippingAddress,
      items: [...cart],
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'test_mode_success',
      orderStatus: 'Confirmed',
      isTestMode: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    showToast('Order placed successfully! ❤️', 'success');

    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.orderId === orderId);
  };

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrderById }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
