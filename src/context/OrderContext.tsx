import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Order, 
  CartItem, 
  ShippingAddress, 
  PaymentMethod, 
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
}

const ORDERS_STORAGE_KEY = 'giftoria_orders_records_v3';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const SAMPLE_SEED_ORDERS: Order[] = [
  {
    orderId: 'GFT-8492',
    customer: {
      fullName: 'Pooja Kulkarni',
      mobile: '9820123456',
      email: 'pooja.kulkarni@example.com',
      addressLine: 'Flat 402, Shivneri Apartments, Shivaji Nagar',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411005',
      deliveryDate: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
      deliveryTimeSlot: 'Standard Daytime Dispatch (9:00 AM - 6:00 PM)',
      messageCard: 'May goddess Saraswati bless your new venture with wisdom and success!'
    },
    items: [],
    itemSnapshots: [
      {
        productId: 'gft-fr-01',
        productName: 'सरस्वती Frame 4x4',
        category: 'Frames',
        quantity: 2,
        sellingPriceSnapshot: 200,
        costPriceSnapshot: 90,
        itemProfit: 220,
        thumbnail: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800',
        customization: {
          recipientName: 'Aarav Educational Institute'
        }
      },
      {
        productId: 'gft-pg-04',
        productName: 'Acrylic Keychain (1 pc)',
        category: 'Personalized Gifts',
        quantity: 1,
        sellingPriceSnapshot: 120,
        costPriceSnapshot: 50,
        itemProfit: 70,
        thumbnail: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
        customization: {
          customMessage: 'Aarav - 2026'
        }
      }
    ],
    subtotal: 520,
    discount: 0,
    shippingFee: 0,
    directExpenses: 40,
    grandTotal: 520,
    paymentMethod: 'upi',
    paymentStatus: 'PAYMENT VERIFIED',
    orderStatus: 'ORDER DELIVERED',
    upiId: 'aditya15662-2@okaxis',
    paymentScreenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    paymentScreenshotName: 'upi_payment_screenshot_8492.jpeg',
    paymentSubmittedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    paymentVerifiedAt: new Date(Date.now() - 86400000 * 3 + 1800000).toISOString(),
    paymentVerifiedBy: 'Admin (Master Owner)',
    deliveryRecord: {
      orderId: 'GFT-8492',
      customerName: 'Pooja Kulkarni',
      customerPhone: '9820123456',
      productSummary: 'सरस्वती Frame 4x4 (x2), Acrylic Keychain (1 pc) (x1)',
      quantity: 3,
      deliveryAddress: 'Flat 402, Shivneri Apartments, Shivaji Nagar, Pune',
      pincode: '411005',
      expectedDeliveryDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      deliveryStatus: 'Delivered',
      courierPartner: 'Delhivery',
      trackingId: 'DLV98371204',
      trackingUrl: 'https://www.delhivery.com/track/package/DLV98371204',
      updatedAt: new Date(Date.now() - 86400000).toISOString()
    },
    isTestMode: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    orderId: 'GFT-9154',
    customer: {
      fullName: 'Rahul Deshmukh',
      mobile: '9822987654',
      email: 'rahul.deshmukh@gmail.com',
      addressLine: 'Row House 12, Baner Hill View, Baner',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411045',
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: 'Morning Rush (9:00 AM - 1:00 PM)',
      messageCard: 'Happy 5th Anniversary to the best couple in Maharashtra! With love, Rahul.'
    },
    items: [],
    itemSnapshots: [
      {
        productId: 'gft-3d-04',
        productName: 'Moon with Customization',
        category: '3D Prints',
        quantity: 1,
        sellingPriceSnapshot: 600,
        costPriceSnapshot: 270,
        itemProfit: 330,
        thumbnail: 'https://images.unsplash.com/photo-1517816743773-6e0fd518b4a6?auto=format&fit=crop&q=80&w=800',
        customization: {
          customMessage: 'Rahul & Sneha - Forever in Love',
          uploadedFileName: 'couple_photo_baner.jpg'
        }
      }
    ],
    subtotal: 600,
    discount: 0,
    shippingFee: 0,
    directExpenses: 35,
    grandTotal: 600,
    paymentMethod: 'upi',
    paymentStatus: 'PAYMENT VERIFICATION PENDING',
    orderStatus: 'PAYMENT VERIFICATION PENDING',
    upiId: 'aditya15662-2@okaxis',
    paymentScreenshot: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800',
    paymentScreenshotName: 'gpay_receipt_9154.jpg',
    paymentSubmittedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    deliveryRecord: {
      orderId: 'GFT-9154',
      customerName: 'Rahul Deshmukh',
      customerPhone: '9822987654',
      productSummary: 'Moon with Customization (x1)',
      quantity: 1,
      deliveryAddress: 'Row House 12, Baner Hill View, Baner, Pune',
      pincode: '411045',
      expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryStatus: 'Not Dispatched',
      courierPartner: 'Delhivery',
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    isTestMode: false,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
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

  // Submit UPI order with payment screenshot
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
    const orderId = `GFT-${Math.floor(1000 + Math.random() * 9000)}`;
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
      customer: shippingAddress,
      items: [...items],
      itemSnapshots: snapshots,
      subtotal: ordSubtotal,
      discount: ordDiscount,
      shippingFee: ordShippingFee,
      directExpenses: 35, // standard packaging fee
      grandTotal: ordGrandTotal,
      paymentMethod: 'upi',
      paymentStatus: 'PAYMENT VERIFICATION PENDING',
      orderStatus: 'PAYMENT VERIFICATION PENDING',
      upiId: 'aditya15662-2@okaxis',
      paymentScreenshot: screenshotDataUrl,
      paymentScreenshotName: screenshotName,
      paymentSubmittedAt: now,
      deliveryRecord: {
        orderId,
        customerName: shippingAddress.fullName,
        customerPhone: shippingAddress.mobile,
        productSummary: snapshots.map(s => `${s.productName} (x${s.quantity})`).join(', '),
        quantity: snapshots.reduce((acc, s) => acc + s.quantity, 0),
        deliveryAddress: `${shippingAddress.addressLine}, ${shippingAddress.city}`,
        pincode: shippingAddress.pincode,
        expectedDeliveryDate: shippingAddress.deliveryDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
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
          paymentStatus: 'PAYMENT VERIFIED',
          orderStatus: 'ORDER CONFIRMED',
          paymentVerifiedAt: now,
          paymentVerifiedBy: adminName,
          rejectionReason: undefined,
          updatedAt: now
        };
      })
    );
    showToast(`PAYMENT VERIFIED SUCCESSFULLY! Order #${orderId} is now confirmed.`, 'success');
  };

  // Admin rejects payment
  const adminRejectPayment = (orderId: string, reason: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        return {
          ...ord,
          paymentStatus: 'PAYMENT REJECTED',
          orderStatus: 'PAYMENT REJECTED',
          rejectionReason: reason,
          updatedAt: now
        };
      })
    );
    showToast(`Order #${orderId} payment rejected: ${reason}`, 'warning');
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
          paymentStatus: 'PAYMENT VERIFICATION PENDING',
          orderStatus: 'PAYMENT VERIFICATION PENDING',
          rejectionReason: undefined,
          updatedAt: now
        };
      })
    );
    showToast('Payment screenshot resubmitted successfully! It is now under verification.', 'success');
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase());
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNotes?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        const now = new Date().toISOString();
        const updatedDelivery = ord.deliveryRecord
          ? {
              ...ord.deliveryRecord,
              deliveryStatus: status === 'ORDER SHIPPED' || status === 'Dispatched' 
                ? 'Dispatched' 
                : status === 'ORDER DELIVERED' || status === 'Delivered' 
                  ? 'Delivered' 
                  : ord.deliveryRecord.deliveryStatus,
              updatedAt: now,
            }
          : undefined;

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
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, paymentStatus, updatedAt: new Date().toISOString() } : ord
      )
    );
    showToast(`Order #${orderId} payment status updated to ${paymentStatus}`, 'success');
  };

  const updateDeliveryInfo = (orderId: string, deliveryUpdate: Partial<DeliveryRecord>) => {
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

        return {
          ...ord,
          deliveryRecord: mergedRecord,
          updatedAt: now
        };
      })
    );
    showToast(`Delivery record updated for #${orderId}`, 'success');
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
