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

export interface VerifiedPaymentMeta {
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentVerifiedAt?: string;
  paymentStatus?: PaymentStatus;
  orderStatus?: OrderStatus;
  paymentFailureReason?: string;
  isTestMode?: boolean;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Order | null;
  placeOrder: (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    subtotal: number,
    discount: number,
    shippingFee: number,
    grandTotal: number,
    paymentMethod: PaymentMethod,
    paymentMeta?: VerifiedPaymentMeta
  ) => Order;
  confirmVerifiedOrder: (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    subtotal: number,
    discount: number,
    shippingFee: number,
    grandTotal: number,
    paymentMeta: VerifiedPaymentMeta
  ) => Order;
  recordPendingOrder: (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    subtotal: number,
    grandTotal: number,
    razorpayOrderId: string
  ) => Order;
  recordFailedOrder: (
    orderId: string,
    reason: string
  ) => void;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus, adminNotes?: string) => void;
  updatePaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  updateDeliveryInfo: (orderId: string, deliveryUpdate: Partial<DeliveryRecord>) => void;
  addOrderExpense: (orderId: string, expenseAmount: number) => void;
}

const ORDERS_STORAGE_KEY = 'giftoria_orders_records_v2';

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
        productId: 'frame-saraswati-4x4',
        productName: 'Saraswati Frame (4x4)',
        category: 'Frames',
        quantity: 2,
        sellingPriceSnapshot: 250,
        costPriceSnapshot: 150,
        itemProfit: 200,
        thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600',
        customization: {
          recipientName: 'Aarav Educational Institute'
        }
      },
      {
        productId: 'pers-acrylic-keychain',
        productName: 'Acrylic Keychain',
        category: 'Personalized Gifts',
        quantity: 1,
        sellingPriceSnapshot: 75,
        costPriceSnapshot: 35,
        itemProfit: 40,
        thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        customization: {
          customMessage: 'Aarav - 2026'
        }
      }
    ],
    subtotal: 575,
    discount: 0,
    shippingFee: 0,
    directExpenses: 40,
    grandTotal: 575,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'DELIVERED',
    razorpayOrderId: 'order_N8492KULK77',
    razorpayPaymentId: 'pay_N849298371204',
    razorpaySignature: 'sig_verified_8492',
    paymentVerifiedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    deliveryRecord: {
      orderId: 'GFT-8492',
      customerName: 'Pooja Kulkarni',
      customerPhone: '9820123456',
      productSummary: 'Saraswati Frame (4x4) (x2), Acrylic Keychain (x1)',
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
      mobile: '9822334455',
      email: 'rahul.d@example.com',
      addressLine: 'Bungalow 12, Prathamesh Park, Baner',
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      pincode: '411045',
      deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: 'Morning Dispatch Window (9:00 AM - 1:00 PM)',
      messageCard: 'Happy Birthday Bhai! Enjoy the magic mug with morning coffee.'
    },
    items: [],
    itemSnapshots: [
      {
        productId: 'pers-heat-sensitive-mug',
        productName: 'Heat-Sensitive Magic Mug',
        category: 'Personalized Gifts',
        quantity: 2,
        sellingPriceSnapshot: 160,
        costPriceSnapshot: 80,
        itemProfit: 160,
        thumbnail: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=600',
        customization: {
          recipientName: 'Snehal & Rahul',
          customMessage: 'Memories of Goa 2025'
        }
      },
      {
        productId: '3d-ganesh-murti',
        productName: '3D Ganesh Murti',
        category: '3D Arts',
        quantity: 1,
        sellingPriceSnapshot: 200,
        costPriceSnapshot: 90,
        itemProfit: 110,
        thumbnail: 'https://images.unsplash.com/photo-1567591414240-e593574c3d31?auto=format&fit=crop&q=80&w=600'
      }
    ],
    subtotal: 520,
    discount: 0,
    shippingFee: 0,
    directExpenses: 30,
    grandTotal: 520,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'PROCESSING',
    razorpayOrderId: 'order_N9154DESH88',
    razorpayPaymentId: 'pay_N915488392019',
    razorpaySignature: 'sig_verified_9154',
    paymentVerifiedAt: new Date().toISOString(),
    deliveryRecord: {
      orderId: 'GFT-9154',
      customerName: 'Rahul Deshmukh',
      customerPhone: '9822334455',
      productSummary: 'Heat-Sensitive Magic Mug (x2), 3D Ganesh Murti (x1)',
      quantity: 3,
      deliveryAddress: 'Bungalow 12, Prathamesh Park, Baner, Pune',
      pincode: '411045',
      expectedDeliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryStatus: 'Not Dispatched',
      courierPartner: 'BlueDart',
      trackingId: 'BLU77382109',
      updatedAt: new Date().toISOString()
    },
    isTestMode: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    orderId: 'GFT-6320',
    customer: {
      fullName: 'Ananya Sharma',
      mobile: '9821889900',
      email: 'ananya.s@example.com',
      addressLine: 'A-203, Lakeview Enclave, Powai',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400076',
      deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deliveryTimeSlot: 'Standard Daytime Dispatch (9:00 AM - 6:00 PM)',
      messageCard: 'To the love of my life, happy 5th anniversary!'
    },
    items: [],
    itemSnapshots: [
      {
        productId: '3d-customized-moon-lamp',
        productName: 'Customized Moon Lamp (With Photo)',
        category: '3D Arts',
        quantity: 1,
        sellingPriceSnapshot: 600,
        costPriceSnapshot: 280,
        itemProfit: 320,
        thumbnail: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&q=80&w=600',
        customization: {
          recipientName: 'Rohan & Ananya',
          customMessage: 'Forever and Always'
        }
      }
    ],
    subtotal: 600,
    discount: 0,
    shippingFee: 0,
    directExpenses: 50,
    grandTotal: 600,
    paymentMethod: 'razorpay',
    paymentStatus: 'paid',
    orderStatus: 'PAID / CONFIRMED',
    razorpayOrderId: 'order_N6320SHAR99',
    razorpayPaymentId: 'pay_N632055198200',
    razorpaySignature: 'sig_verified_6320',
    paymentVerifiedAt: new Date(Date.now() - 86400000).toISOString(),
    deliveryRecord: {
      orderId: 'GFT-6320',
      customerName: 'Ananya Sharma',
      customerPhone: '9821889900',
      productSummary: 'Customized Moon Lamp (With Photo) (x1)',
      quantity: 1,
      deliveryAddress: 'A-203, Lakeview Enclave, Powai, Mumbai',
      pincode: '400076',
      expectedDeliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
      deliveryStatus: 'Not Dispatched',
      courierPartner: 'DTDC',
      trackingId: 'DTDC551982',
      updatedAt: new Date().toISOString()
    },
    isTestMode: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return SAMPLE_SEED_ORDERS;
    } catch {
      return SAMPLE_SEED_ORDERS;
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

  const placeOrder = (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    ordSubtotal: number,
    ordDiscount: number,
    ordShippingFee: number,
    ordGrandTotal: number,
    paymentMethod: PaymentMethod,
    paymentMeta?: VerifiedPaymentMeta
  ): Order => {
    const orderId = paymentMeta?.orderId || `GFT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const orderItems = items.length > 0 ? [...items] : [...cart];

    // Build historical price & cost snapshots per product block
    const itemSnapshots: OrderItemSnapshot[] = orderItems.map((item) => {
      const selling = item.product.price || 0;
      const cost = item.product.costPrice || Math.round(selling * 0.55);
      return {
        productId: item.product.id,
        productName: item.product.name,
        category: item.product.category,
        quantity: item.quantity,
        sellingPriceSnapshot: selling,
        costPriceSnapshot: cost,
        itemProfit: (selling - cost) * item.quantity,
        customization: item.customization,
        thumbnail: item.product.thumbnail || item.product.images?.[0]
      };
    });

    const productSummary = orderItems.map(i => `${i.product.name} (x${i.quantity})`).join(', ');

    const initialDelivery: DeliveryRecord = {
      orderId,
      customerName: shippingAddress.fullName,
      customerPhone: shippingAddress.mobile,
      productSummary,
      quantity: orderItems.reduce((acc, i) => acc + i.quantity, 0),
      deliveryAddress: `${shippingAddress.addressLine}, ${shippingAddress.city}`,
      pincode: shippingAddress.pincode,
      expectedDeliveryDate: shippingAddress.deliveryDate,
      deliveryStatus: 'Not Dispatched',
      updatedAt: now
    };

    const paymentStatus: PaymentStatus = paymentMeta?.paymentStatus || 
      (paymentMethod === 'razorpay' ? 'pending' : paymentMethod === 'whatsapp_enquiry' ? 'pending' : 'paid');

    const orderStatus: OrderStatus = paymentMeta?.orderStatus || 
      (paymentStatus === 'paid' ? 'PAID / CONFIRMED' : 'PENDING PAYMENT');

    const newOrder: Order = {
      orderId,
      customer: shippingAddress,
      items: orderItems,
      itemSnapshots,
      subtotal: ordSubtotal,
      discount: ordDiscount,
      shippingFee: ordShippingFee,
      directExpenses: 0,
      grandTotal: ordGrandTotal,
      paymentMethod,
      paymentStatus,
      orderStatus,
      deliveryRecord: initialDelivery,
      isTestMode: paymentMeta?.isTestMode ?? false,
      createdAt: now,
      updatedAt: now,
      razorpayOrderId: paymentMeta?.razorpayOrderId,
      razorpayPaymentId: paymentMeta?.razorpayPaymentId,
      razorpaySignature: paymentMeta?.razorpaySignature,
      paymentVerifiedAt: paymentMeta?.paymentVerifiedAt,
      paymentFailureReason: paymentMeta?.paymentFailureReason
    };

    setOrders((prev) => {
      // Upsert: If order exists with this ID or razorpayOrderId, update it
      const existingIndex = prev.findIndex(
        (o) => o.orderId === orderId || (paymentMeta?.razorpayOrderId && o.razorpayOrderId === paymentMeta.razorpayOrderId)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = newOrder;
        return updated;
      }
      return [newOrder, ...prev];
    });

    return newOrder;
  };

  const confirmVerifiedOrder = (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    ordSubtotal: number,
    ordDiscount: number,
    ordShippingFee: number,
    ordGrandTotal: number,
    paymentMeta: VerifiedPaymentMeta
  ): Order => {
    const verifiedOrder = placeOrder(
      shippingAddress,
      items,
      ordSubtotal,
      ordDiscount,
      ordShippingFee,
      ordGrandTotal,
      'razorpay',
      {
        ...paymentMeta,
        paymentStatus: 'paid',
        orderStatus: 'PAID / CONFIRMED',
        paymentVerifiedAt: paymentMeta.paymentVerifiedAt || new Date().toISOString()
      }
    );

    showToast(`Payment Verified! Order #${verifiedOrder.orderId} confirmed 🎉`, 'success');
    return verifiedOrder;
  };

  const recordPendingOrder = (
    shippingAddress: ShippingAddress,
    items: CartItem[],
    ordSubtotal: number,
    ordGrandTotal: number,
    razorpayOrderId: string
  ): Order => {
    return placeOrder(
      shippingAddress,
      items,
      ordSubtotal,
      0,
      0,
      ordGrandTotal,
      'razorpay',
      {
        razorpayOrderId,
        paymentStatus: 'pending',
        orderStatus: 'PENDING PAYMENT'
      }
    );
  };

  const recordFailedOrder = (orderId: string, reason: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId && ord.razorpayOrderId !== orderId) return ord;
        return {
          ...ord,
          orderStatus: 'PAYMENT FAILED',
          paymentStatus: 'failed',
          paymentFailureReason: reason,
          updatedAt: new Date().toISOString()
        };
      })
    );
    showToast(`Payment declined: ${reason}`, 'error');
  };

  const createOrder = (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod): Order | null => {
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return null;
    }

    const order = placeOrder(
      shippingAddress,
      cart,
      subtotal,
      discount,
      shippingFee,
      grandTotal,
      paymentMethod
    );

    clearCart();
    showToast(`Order #${order.orderId} created successfully!`, 'success');
    return order;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find((o) => o.orderId === orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, adminNotes?: string) => {
    const targetOrder = orders.find(o => o.orderId === orderId);
    if (
      targetOrder && 
      (targetOrder.orderStatus === 'PENDING PAYMENT' || targetOrder.orderStatus === 'PAYMENT FAILED') && 
      status === 'PAID / CONFIRMED'
    ) {
      showToast('Security Alert: Unverified orders cannot be manually marked as PAID. Backend verification required.', 'error');
      return;
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderId !== orderId) return ord;
        const now = new Date().toISOString();
        const updatedDelivery = ord.deliveryRecord
          ? {
              ...ord.deliveryRecord,
              deliveryStatus: status === 'SHIPPED' || status === 'Dispatched' ? 'Dispatched' : status === 'DELIVERED' || status === 'Delivered' ? 'Delivered' : ord.deliveryRecord.deliveryStatus,
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
    showToast(`Order #${orderId} marked as ${status}`, 'success');
  };

  const updatePaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    const targetOrder = orders.find(o => o.orderId === orderId);
    if (targetOrder && targetOrder.paymentStatus !== 'paid' && paymentStatus === 'paid') {
      showToast('Security Alert: Unverified payments cannot be manually marked as paid.', 'error');
      return;
    }

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

        // Automatic synchronization of main order status when delivery status updates
        let newOrderStatus = ord.orderStatus;
        if (mergedRecord.deliveryStatus === 'Dispatched') {
          newOrderStatus = 'Dispatched';
        } else if (mergedRecord.deliveryStatus === 'Delivered') {
          newOrderStatus = 'Delivered';
        } else if (mergedRecord.deliveryStatus === 'Out for Delivery') {
          newOrderStatus = 'Out for Delivery';
        }

        return {
          ...ord,
          orderStatus: newOrderStatus,
          deliveryRecord: mergedRecord,
          updatedAt: now,
        };
      })
    );
    showToast(`Delivery record updated for #${orderId}`, 'success');
  };

  const addOrderExpense = (orderId: string, expenseAmount: number) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.orderId === orderId ? { ...ord, directExpenses: (ord.directExpenses || 0) + expenseAmount, updatedAt: new Date().toISOString() } : ord
      )
    );
    showToast(`Added ₹${expenseAmount} expense to order #${orderId}`, 'info');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        placeOrder,
        confirmVerifiedOrder,
        recordPendingOrder,
        recordFailedOrder,
        getOrderById,
        updateOrderStatus,
        updatePaymentStatus,
        updateDeliveryInfo,
        addOrderExpense,
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
