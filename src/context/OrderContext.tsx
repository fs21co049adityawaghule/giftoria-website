import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  CartItem, 
  ShippingAddress, 
  OrderStatus, 
  PaymentStatus, 
  DeliveryRecord,
  OrderItemSnapshot 
} from '../types';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';

interface OrderContextType {
  orders: Order[];
  submitUpiOrder: (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    subtotal: number,
    discount: number,
    shippingFee: number,
    grandTotal: number,
    screenshotDataUrl: string,
    screenshotName: string
  ) => Order;
  adminVerifyPayment: (orderId: string, adminName?: string) => void;
  adminRejectPayment: (orderId: string, reason: string) => void;
  resubmitPaymentScreenshot: (orderId: string, screenshotDataUrl: string, screenshotName: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  updateDeliveryInfo: (orderId: string, deliveryUpdate: Partial<DeliveryRecord>) => void;
  cancelOrder: (orderId: string, reason?: string) => void;
  deleteOrder: (orderId: string, permanent?: boolean) => void;
  restoreOrder: (orderId: string) => void;
  updateOrderDetails: (orderId: string, updates: Partial<Order>) => void;
  clearAllOrders: () => void;
}

const ORDERS_STORAGE_KEY = 'giftoria_orders_records_v4';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial orders start with ZERO active orders as strictly instructed
const SAMPLE_SEED_ORDERS: Order[] = [];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return SAMPLE_SEED_ORDERS;
    } catch {
      return SAMPLE_SEED_ORDERS;
    }
  });

  const { clearCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  // Synchronize orders with central backend database
  const fetchGlobalOrders = async () => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) return;
      const data = await res.json();
      const serverOrders: Order[] = Array.isArray(data) ? data : (data.orders || []);
      
      setOrders((prev) => {
        const orderMap = new Map<string, Order>();
        for (const ord of serverOrders) {
          if (ord && ord.orderId) {
            orderMap.set(ord.orderId.toLowerCase(), ord);
          }
        }
        for (const localOrd of prev) {
          if (localOrd && localOrd.orderId) {
            const key = localOrd.orderId.toLowerCase();
            const existing = orderMap.get(key);
            if (!existing) {
              orderMap.set(key, localOrd);
            } else if (localOrd.updatedAt && (!existing.updatedAt || localOrd.updatedAt > existing.updatedAt)) {
              orderMap.set(key, localOrd);
            }
          }
        }
        const merged = Array.from(orderMap.values()).sort(
          (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );

        if (JSON.stringify(merged) === JSON.stringify(prev)) {
          return prev;
        }
        return merged;
      });
    } catch (e) {
      // Retain local orders gracefully if offline
    }
  };

  // Poll for live order updates every 3.5 seconds
  useEffect(() => {
    fetchGlobalOrders();
    const interval = setInterval(fetchGlobalOrders, 3500);
    return () => clearInterval(interval);
  }, []);

  // Submit UPI order with payment screenshot and unique Order ID + Payment ID
  const submitUpiOrder = (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    ordSubtotal: number,
    ordDiscount: number,
    ordShippingFee: number,
    ordGrandTotal: number,
    screenshotDataUrl: string,
    screenshotName: string
  ): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `GFT-${randomSuffix}`;
    const paymentId = `PAY-${randomSuffix}-${Date.now().toString().slice(-4)}`;
    const now = new Date().toISOString();

    const snapshots: OrderItemSnapshot[] = items.map((item) => {
      const selling = item.unitPriceSnapshot || item.product.price;
      const cost = item.unitCostSnapshot || item.product.costPrice || Math.round(item.product.price * 0.5);
      const profit = (selling - cost) * item.quantity;

      return {
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        sellingPriceSnapshot: selling,
        costPriceSnapshot: cost,
        itemProfit: profit,
        customization: item.customization,
        thumbnail: item.product.thumbnail || item.product.images?.[0]
      };
    });

    const newOrder: Order = {
      orderId,
      paymentId,
      customer: shippingAddress,
      items: [...items],
      itemSnapshots: snapshots,
      subtotal: ordSubtotal,
      discount: ordDiscount,
      shippingFee: ordShippingFee,
      directExpenses: 35, // standard packaging fee
      grandTotal: ordGrandTotal,
      paymentMethod: 'upi',
      paymentStatus: 'Payment Verification Pending',
      orderStatus: 'Payment Verification Pending',
      upiId: 'aditya15662-2@okaxis',
      paymentScreenshot: screenshotDataUrl,
      paymentScreenshotName: screenshotName,
      paymentSubmittedAt: now,
      customerInstructions: shippingAddress.messageCard || undefined,
      deliveryRecord: {
        orderId,
        customerName: shippingAddress.fullName,
        customerPhone: shippingAddress.mobile,
        productSummary: snapshots.map(s => `${s.productName} (x${s.quantity})`).join(', '),
        quantity: snapshots.reduce((acc, s) => acc + s.quantity, 0),
        deliveryAddress: `${shippingAddress.addressLine}, ${shippingAddress.city}`,
        pincode: shippingAddress.pincode,
        expectedDeliveryDate: shippingAddress.deliveryDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
        deliveryStatus: 'Not Dispatched',
        courierPartner: 'Delhivery',
        updatedAt: now
      },
      isTestMode: false,
      createdAt: now,
      updatedAt: now
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist immediately to central serverless backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newOrder }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.order) {
          setOrders((prev) =>
            prev.map((o) => (o.orderId === newOrder.orderId ? { ...o, ...data.order } : o))
          );
        }
      })
      .catch((err) => {
        console.error('Failed to persist order to central database:', err);
      });

    return newOrder;
  };

  // Admin verifies payment
  const adminVerifyPayment = (orderId: string, adminName = 'Admin (Master Owner)') => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          paymentStatus: 'Payment Verified',
          orderStatus: 'Order Confirmed',
          paymentVerifiedAt: now,
          paymentVerifiedBy: adminName,
          rejectionReason: undefined,
          updatedAt: now
        };
      })
    );
    showToast(`Payment Verified! Order #${orderId} confirmed.`, 'success');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        paymentStatus: 'Payment Verified',
        orderStatus: 'Order Confirmed',
        paymentVerifiedAt: now,
        paymentVerifiedBy: adminName,
        rejectionReason: null,
      }),
    }).catch(console.error);
  };

  // Admin rejects payment
  const adminRejectPayment = (orderId: string, reason: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          paymentStatus: 'Payment Rejected',
          orderStatus: 'Cancelled',
          rejectionReason: reason,
          cancelledAt: now,
          cancellationReason: `Payment Rejected: ${reason}`,
          updatedAt: now
        };
      })
    );
    showToast(`Order #${orderId} payment rejected: ${reason}`, 'warning');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        paymentStatus: 'Payment Rejected',
        orderStatus: 'Cancelled',
        rejectionReason: reason,
        cancelledAt: now,
        cancellationReason: `Payment Rejected: ${reason}`,
      }),
    }).catch(console.error);
  };

  // Customer resubmits payment screenshot
  const resubmitPaymentScreenshot = (orderId: string, screenshotDataUrl: string, screenshotName: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          paymentScreenshot: screenshotDataUrl,
          paymentScreenshotName: screenshotName,
          paymentSubmittedAt: now,
          paymentStatus: 'Payment Verification Pending',
          orderStatus: 'Payment Verification Pending',
          rejectionReason: undefined,
          updatedAt: now
        };
      })
    );
    showToast('Payment screenshot resubmitted successfully! It is now under verification.', 'success');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        paymentScreenshot: screenshotDataUrl,
        paymentScreenshotName: screenshotName,
        paymentSubmittedAt: now,
        paymentStatus: 'Payment Verification Pending',
        orderStatus: 'Payment Verification Pending',
        rejectionReason: null,
      }),
    }).catch(console.error);
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNotes?: string) => {
    const now = new Date().toISOString();
    let updatedDeliveryRec: DeliveryRecord | undefined;

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        
        let newDeliveryStatus = ord.deliveryRecord?.deliveryStatus;
        if (status === 'Shipped' || status === 'ORDER SHIPPED' || status === 'Dispatched') {
          newDeliveryStatus = 'Shipped';
        } else if (status === 'Delivered' || status === 'ORDER DELIVERED') {
          newDeliveryStatus = 'Delivered';
        } else if (status === 'Ready for Dispatch') {
          newDeliveryStatus = 'Ready for Dispatch';
        }

        const updatedDelivery = ord.deliveryRecord
          ? {
              ...ord.deliveryRecord,
              deliveryStatus: newDeliveryStatus || ord.deliveryRecord.deliveryStatus,
              updatedAt: now,
            }
          : undefined;

        updatedDeliveryRec = updatedDelivery;

        return {
          ...ord,
          orderStatus: status,
          adminNotes: adminNotes !== undefined ? adminNotes : ord.adminNotes,
          deliveryRecord: updatedDelivery,
          updatedAt: now,
        };
      })
    );
    showToast(`Order #${orderId} status set to ${status}`, 'success');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        orderStatus: status,
        adminNotes: adminNotes,
        deliveryRecord: updatedDeliveryRec,
      }),
    }).catch(console.error);
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, paymentStatus, updatedAt: new Date().toISOString() } : ord
      )
    );
    showToast(`Order #${orderId} payment status updated to ${paymentStatus}`, 'success');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        paymentStatus,
      }),
    }).catch(console.error);
  };

  const updateDeliveryInfo = (orderId: string, deliveryUpdate: Partial<DeliveryRecord>) => {
    let finalDeliveryRecord: DeliveryRecord | undefined;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        const now = new Date().toISOString();
        const existingRec = ord.deliveryRecord || {
          orderId,
          customerName: ord.customer.fullName,
          customerPhone: ord.customer.mobile,
          productSummary: ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
          quantity: ord.items.reduce((acc, i) => acc + i.quantity, 0),
          deliveryAddress: `${ord.customer.addressLine}, ${ord.customer.city}`,
          pincode: ord.customer.pincode,
          deliveryStatus: 'Not Dispatched',
          updatedAt: now
        };

        const mergedRecord: DeliveryRecord = {
          ...existingRec,
          ...deliveryUpdate,
          updatedAt: now
        };
        finalDeliveryRecord = mergedRecord;

        return {
          ...ord,
          deliveryRecord: mergedRecord,
          updatedAt: now
        };
      })
    );
    showToast(`Delivery record updated for #${orderId}`, 'success');

    if (finalDeliveryRecord) {
      fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          deliveryRecord: finalDeliveryRecord,
        }),
      }).catch(console.error);
    }
  };

  // Cancel order with recorded reason & timestamp
  const cancelOrder = (orderId: string, reason?: string) => {
    const now = new Date().toISOString();
    const cancellationReason = reason || 'Cancelled by Admin';

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          orderStatus: 'Cancelled',
          cancelledAt: now,
          cancellationReason,
          updatedAt: now
        };
      })
    );
    showToast(`Order #${orderId} cancelled. Excluded from active sales & profit.`, 'warning');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        orderStatus: 'Cancelled',
        cancelledAt: now,
        cancellationReason,
      }),
    }).catch(console.error);
  };

  // Delete order (soft-delete / archive or permanent delete)
  const deleteOrder = (orderId: string, permanent = false) => {
    if (permanent) {
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      showToast(`Order #${orderId} permanently deleted from database.`, 'info');
    } else {
      const now = new Date().toISOString();
      setOrders((prev) =>
        prev.map((ord) =>
          ord.orderId === orderId
            ? { ...ord, isDeleted: true, deletedAt: now, updatedAt: now }
            : ord
        )
      );
      showToast(`Order #${orderId} archived/moved to trash.`, 'info');
    }

    fetch(`/api/orders?orderId=${encodeURIComponent(orderId)}${permanent ? '&permanent=true' : ''}`, {
      method: 'DELETE',
    }).catch(console.error);
  };

  // Restore deleted/archived order
  const restoreOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId
          ? { ...ord, isDeleted: false, deletedAt: undefined, updatedAt: new Date().toISOString() }
          : ord
      )
    );
    showToast(`Order #${orderId} restored to active records.`, 'success');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        isDeleted: false,
        deletedAt: null,
      }),
    }).catch(console.error);
  };

  // Update order general details (customer info, expected date, admin notes)
  const updateOrderDetails = (orderId: string, updates: Partial<Order>) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast(`Order #${orderId} details updated.`, 'success');

    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        ...updates,
      }),
    }).catch(console.error);
  };

  // Initial order cleanup: resets active orders to 0
  const clearAllOrders = () => {
    setOrders([]);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    showToast('Orders cleared! Active orders count is now 0.', 'info');

    fetch('/api/orders?clearAll=true', {
      method: 'DELETE',
    }).catch(console.error);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        submitUpiOrder,
        adminVerifyPayment,
        adminRejectPayment,
        resubmitPaymentScreenshot,
        getOrderById,
        updateOrderStatus,
        updatePaymentStatus,
        updateDeliveryInfo,
        cancelOrder,
        deleteOrder,
        restoreOrder,
        updateOrderDetails,
        clearAllOrders,
      }}
    >
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
