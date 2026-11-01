import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { 
  Product, 
  ProductCategory, 
  OrderStatus, 
  PaymentStatus, 
  DeliveryStatus,
  Order,
  ORDER_STATUSES, 
  DELIVERY_STATUSES 
} from '../types';
import { CATEGORIES_LIST } from '../data/products';
import { businessConfig } from '../config/businessConfig';
import { 
  LayoutDashboard,
  Package, 
  BarChart3, 
  CreditCard, 
  ShoppingBag, 
  TrendingUp, 
  Truck, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Search, 
  Lock, 
  Unlock, 
  AlertCircle,
  Eye,
  MessageCircle,
  X,
  RotateCcw,
  Calendar,
  Check,
  ShieldCheck,
  Filter,
  DollarSign,
  FileText
} from 'lucide-react';

type AdminTab = 'dashboard' | 'orders' | 'sales' | 'payments' | 'products' | 'profits' | 'delivery' | 'settings';
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const AdminDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useAdmin();
  const { 
    orders, 
    adminVerifyPayment, 
    adminRejectPayment, 
    updateOrderStatus, 
    updateDeliveryInfo,
    cancelOrder,
    deleteOrder,
    restoreOrder,
    updateOrderDetails,
    clearAllOrders
  } = useOrder();
  const { showToast } = useToast();

  // Authentication PIN Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('giftoria_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Shared Time Filter for Sales & Profits
  const [timeFilter, setTimeFilter] = useState<TimePeriod>('monthly');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('All');

  // Orders Tab Filters & State
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [ordersViewMode, setOrdersViewMode] = useState<'active' | 'cancelled' | 'trash'>('active');

  // Order Modals
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancellationReasonInput, setCancellationReasonInput] = useState('');
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Payments Tab Filters & Modals
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [paymentTimeFilter, setPaymentTimeFilter] = useState<TimePeriod>('monthly');
  const [viewingScreenshotOrder, setViewingScreenshotOrder] = useState<Order | null>(null);
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Transaction reference / UTR not found in bank account.');

  // Products Tab CRUD Modals & Filters
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('All');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // New Product Form State (with Cost Price Admin Confidential)
  const [newProd, setNewProd] = useState<{
    name: string;
    category: ProductCategory;
    description: string;
    price: number;
    costPrice: number;
    stock: number;
    thumbnail: string;
    customizable: boolean;
    isComingSoon: boolean;
  }>({
    name: '',
    category: 'Personalized Gifts',
    description: '',
    price: 250,
    costPrice: 120,
    stock: 50,
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    customizable: true,
    isComingSoon: false,
  });

  // Delivery Tab Filters & Modal
  const [deliverySearchQuery, setDeliverySearchQuery] = useState('');
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState<string>('all');
  const [editingDeliveryOrder, setEditingDeliveryOrder] = useState<Order | null>(null);
  const [deliveryForm, setDeliveryForm] = useState<{
    trackingId: string;
    courierPartner: string;
    dispatchDate: string;
    expectedDeliveryDate: string;
    deliveryStatus: DeliveryStatus;
  }>({
    trackingId: '',
    courierPartner: 'Delhivery',
    dispatchDate: '',
    expectedDeliveryDate: '',
    deliveryStatus: 'Not Dispatched',
  });

  // Handle PIN authentication
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'giftoria2026' || pinInput === 'admin123' || pinInput === '8356829605') {
      sessionStorage.setItem('giftoria_admin_auth', 'true');
      setIsAuthenticated(true);
      setPinError('');
      showToast('Admin access granted', 'success');
    } else {
      setPinError('Invalid security PIN. Please enter authorized admin PIN.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('giftoria_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
    showToast('Logged out of admin panel', 'info');
  };

  // Helper: check if order is cancelled
  const isOrderCancelled = (order: Order) => {
    return (
      order.orderStatus === 'Cancelled' ||
      order.orderStatus === 'CANCELLED / REFUNDED' ||
      order.orderStatus.toLowerCase().includes('cancel')
    );
  };

  // Helper: check if order is paid & verified
  const isOrderPaidAndVerified = (order: Order) => {
    const pStatus = (order.paymentStatus || '').toLowerCase();
    const isPaid = pStatus === 'payment verified' || pStatus === 'paid';
    return isPaid && !isOrderCancelled(order) && !order.isDeleted;
  };

  // Helper: check if order date matches period
  const matchesTimePeriod = (dateStr: string, period: TimePeriod, specificDate?: string) => {
    if (specificDate) {
      return dateStr.startsWith(specificDate);
    }
    const orderDate = new Date(dateStr);
    const now = new Date();
    if (period === 'daily') {
      return orderDate.toDateString() === now.toDateString();
    }
    if (period === 'weekly') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return orderDate >= oneWeekAgo && orderDate <= now;
    }
    if (period === 'monthly') {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    if (period === 'yearly') {
      return orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  };

  // =========================================================================
  // 1. DASHBOARD OVERVIEW METRICS (Calculated dynamically from real records)
  // =========================================================================
  const dashboardStats = useMemo(() => {
    const activeOrders = orders.filter(o => !o.isDeleted);
    const nonCancelled = activeOrders.filter(o => !isOrderCancelled(o));

    const totalOrders = activeOrders.length;
    const cancelledOrders = activeOrders.filter(isOrderCancelled).length;
    
    const pendingOrders = activeOrders.filter(o => {
      const s = o.orderStatus.toLowerCase();
      return (
        s.includes('pending') ||
        s.includes('processing') ||
        s.includes('production')
      );
    }).length;

    const confirmedOrders = activeOrders.filter(o => {
      const s = o.orderStatus.toLowerCase();
      return s.includes('confirmed') || s.includes('verified');
    }).length;

    const deliveredOrders = activeOrders.filter(o => {
      const s = o.orderStatus.toLowerCase();
      const d = o.deliveryRecord?.deliveryStatus?.toLowerCase() || '';
      return s.includes('delivered') || d === 'delivered';
    }).length;

    const pendingPayments = activeOrders.filter(o => {
      const s = (o.paymentStatus || '').toLowerCase();
      return s.includes('pending');
    }).length;

    // Paid & verified orders calculate sales & profits
    const verifiedOrders = activeOrders.filter(isOrderPaidAndVerified);
    const totalSales = verifiedOrders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    let totalProfit = 0;
    verifiedOrders.forEach(o => {
      if (o.itemSnapshots && o.itemSnapshots.length > 0) {
        o.itemSnapshots.forEach(snap => {
          totalProfit += (snap.itemProfit || (snap.sellingPriceSnapshot - snap.costPriceSnapshot) * snap.quantity);
        });
      } else if (o.items && o.items.length > 0) {
        o.items.forEach(it => {
          const selling = it.unitPriceSnapshot || it.product.price;
          const cost = it.unitCostSnapshot || it.product.costPrice || Math.round(it.product.price * 0.5);
          totalProfit += (selling - cost) * it.quantity;
        });
      }
    });

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      cancelledOrders,
      totalSales,
      totalProfit,
      pendingPayments,
      deliveredOrders,
      recentOrders: nonCancelled.slice(0, 5),
    };
  }, [orders]);

  // =========================================================================
  // 2. ORDERS MANAGEMENT FILTERED LIST
  // =========================================================================
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // View mode: active, cancelled, or trash
      if (ordersViewMode === 'trash') {
        if (!o.isDeleted) return false;
      } else {
        if (o.isDeleted) return false;
        if (ordersViewMode === 'cancelled' && !isOrderCancelled(o)) return false;
        if (ordersViewMode === 'active' && isOrderCancelled(o)) return false;
      }

      // Search query
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matches = (
          o.orderId.toLowerCase().includes(q) ||
          (o.paymentId && o.paymentId.toLowerCase().includes(q)) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.mobile.includes(q) ||
          (o.customer.email && o.customer.email.toLowerCase().includes(q)) ||
          o.customer.pincode.includes(q) ||
          (o.deliveryRecord?.trackingId && o.deliveryRecord.trackingId.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }

      // Status filter
      if (orderStatusFilter !== 'all') {
        if (o.orderStatus.toLowerCase() !== orderStatusFilter.toLowerCase()) return false;
      }

      return true;
    });
  }, [orders, ordersViewMode, orderSearchQuery, orderStatusFilter]);

  // =========================================================================
  // 3 & 6. SALES AND PROFITS ANALYTICS
  // =========================================================================
  const analyticsData = useMemo(() => {
    // Only verified paid, non-cancelled orders
    const verifiedOrders = orders.filter(isOrderPaidAndVerified);

    // Apply period/date filter
    const periodOrders = verifiedOrders.filter(o => {
      if (!matchesTimePeriod(o.createdAt, timeFilter, selectedDateFilter)) return false;
      return true;
    });

    let totalRevenue = 0;
    let totalCogs = 0;
    let totalUnitsSold = 0;
    const categoryStats: Record<string, { revenue: number; cost: number; profit: number; units: number }> = {};
    const productStats: Record<string, { id: string; name: string; category: string; revenue: number; cost: number; profit: number; units: number }> = {};

    CATEGORIES_LIST.forEach(cat => {
      categoryStats[cat.name] = { revenue: 0, cost: 0, profit: 0, units: 0 };
    });

    periodOrders.forEach(ord => {
      totalRevenue += ord.grandTotal || 0;

      const items = (ord.itemSnapshots && ord.itemSnapshots.length > 0)
        ? ord.itemSnapshots.map(s => ({
            id: s.productId,
            name: s.productName,
            category: s.category,
            quantity: s.quantity,
            selling: s.sellingPriceSnapshot,
            cost: s.costPriceSnapshot,
            profit: s.itemProfit || (s.sellingPriceSnapshot - s.costPriceSnapshot) * s.quantity
          }))
        : ord.items.map(it => {
            const selling = it.unitPriceSnapshot || it.product.price;
            const cost = it.unitCostSnapshot || it.product.costPrice || Math.round(it.product.price * 0.5);
            return {
              id: it.product.id,
              name: it.product.name,
              category: it.product.category,
              quantity: it.quantity,
              selling,
              cost,
              profit: (selling - cost) * it.quantity
            };
          });

      items.forEach(item => {
        // Filter by category or product if selected
        if (selectedCategoryFilter !== 'All' && item.category.toLowerCase() !== selectedCategoryFilter.toLowerCase()) return;
        if (selectedProductFilter !== 'All' && item.name.toLowerCase() !== selectedProductFilter.toLowerCase()) return;

        totalUnitsSold += item.quantity;
        const itemRevenue = item.selling * item.quantity;
        const itemCost = item.cost * item.quantity;
        const itemProfit = itemRevenue - itemCost;

        totalCogs += itemCost;

        if (!categoryStats[item.category]) {
          categoryStats[item.category] = { revenue: 0, cost: 0, profit: 0, units: 0 };
        }
        categoryStats[item.category].revenue += itemRevenue;
        categoryStats[item.category].cost += itemCost;
        categoryStats[item.category].profit += itemProfit;
        categoryStats[item.category].units += item.quantity;

        if (!productStats[item.name]) {
          productStats[item.name] = {
            id: item.id,
            name: item.name,
            category: item.category,
            revenue: 0,
            cost: 0,
            profit: 0,
            units: 0
          };
        }
        productStats[item.name].revenue += itemRevenue;
        productStats[item.name].cost += itemCost;
        productStats[item.name].profit += itemProfit;
        productStats[item.name].units += item.quantity;
      });
    });

    const netProductProfit = totalRevenue - totalCogs;
    const sortedProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue);

    return {
      ordersCount: periodOrders.length,
      totalRevenue,
      totalCogs,
      totalUnitsSold,
      netProductProfit,
      profitMargin: totalRevenue > 0 ? (netProductProfit / totalRevenue) * 100 : 0,
      categoryStats,
      topProducts: sortedProducts,
    };
  }, [orders, timeFilter, selectedDateFilter, selectedCategoryFilter, selectedProductFilter]);

  // =========================================================================
  // 4. PAYMENTS REPORTS FILTERED LIST
  // =========================================================================
  const filteredPayments = useMemo(() => {
    return orders.filter(o => {
      if (o.isDeleted) return false;

      // Period filter
      if (!matchesTimePeriod(o.paymentSubmittedAt || o.createdAt, paymentTimeFilter)) return false;

      // Status filter
      if (paymentStatusFilter !== 'all') {
        const pStatus = (o.paymentStatus || '').toLowerCase();
        if (paymentStatusFilter === 'pending' && !pStatus.includes('pending')) return false;
        if (paymentStatusFilter === 'verified' && !pStatus.includes('verified') && pStatus !== 'paid') return false;
        if (paymentStatusFilter === 'rejected' && !pStatus.includes('rejected') && pStatus !== 'failed') return false;
        if (paymentStatusFilter === 'refunded' && !pStatus.includes('refund')) return false;
      }

      // Search
      if (paymentSearchQuery.trim()) {
        const q = paymentSearchQuery.toLowerCase().trim();
        const matches = (
          (o.paymentId && o.paymentId.toLowerCase().includes(q)) ||
          o.orderId.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.mobile.includes(q) ||
          (o.upiId && o.upiId.toLowerCase().includes(q))
        );
        if (!matches) return false;
      }

      return true;
    });
  }, [orders, paymentTimeFilter, paymentStatusFilter, paymentSearchQuery]);

  // =========================================================================
  // 5. PRODUCTS FILTERED LIST
  // =========================================================================
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (productCatFilter !== 'All' && p.category.toLowerCase() !== productCatFilter.toLowerCase()) return false;
      if (productSearchQuery.trim()) {
        const q = productSearchQuery.toLowerCase().trim();
        return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, productCatFilter, productSearchQuery]);

  // =========================================================================
  // 7. DELIVERY FILTERED LIST
  // =========================================================================
  const filteredDeliveries = useMemo(() => {
    return orders.filter(o => {
      if (o.isDeleted || isOrderCancelled(o)) return false;

      if (deliveryStatusFilter !== 'all') {
        const dStatus = o.deliveryRecord?.deliveryStatus || 'Not Dispatched';
        if (dStatus.toLowerCase() !== deliveryStatusFilter.toLowerCase()) return false;
      }

      if (deliverySearchQuery.trim()) {
        const q = deliverySearchQuery.toLowerCase().trim();
        return (
          o.orderId.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.mobile.includes(q) ||
          o.customer.pincode.includes(q) ||
          (o.deliveryRecord?.trackingId && o.deliveryRecord.trackingId.toLowerCase().includes(q)) ||
          (o.deliveryRecord?.courierPartner && o.deliveryRecord.courierPartner.toLowerCase().includes(q))
        );
      }

      return true;
    });
  }, [orders, deliveryStatusFilter, deliverySearchQuery]);

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim() || newProd.price <= 0) {
      showToast('Please enter a valid product name and selling price', 'error');
      return;
    }

    const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productPayload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newProd.name.trim(),
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      category: newProd.category,
      description: newProd.description || `Handcrafted ${newProd.name} by GIFTORIA.`,
      price: Number(newProd.price),
      costPrice: Number(newProd.costPrice || 0), // Admin confidential
      compareAtPrice: Math.round(Number(newProd.price) * 1.3),
      currency: '₹',
      images: [newProd.thumbnail],
      thumbnail: newProd.thumbnail,
      customizable: newProd.customizable,
      stock: Number(newProd.stock),
      featured: true,
      bestSeller: false,
      newProduct: true,
      isActive: true,
      isComingSoon: newProd.isComingSoon,
      tags: [newProd.category.toLowerCase(), 'giftoria', 'custom'],
      rating: 5.0,
      reviewsCount: 1,
      deliveryLabel: 'Earliest Dispatch: 24-48 hrs',
    };

    addProduct(productPayload);
    setIsAddProductModalOpen(false);
    setNewProd({
      name: '',
      category: 'Personalized Gifts',
      description: '',
      price: 250,
      costPrice: 120,
      stock: 50,
      thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
      customizable: true,
      isComingSoon: false,
    });
  };

  // Handle Edit Product Submit
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      costPrice: Number(editingProduct.costPrice || 0), // Admin confidential
      stock: Number(editingProduct.stock),
      thumbnail: editingProduct.thumbnail,
      images: [editingProduct.thumbnail],
      customizable: editingProduct.customizable,
      isComingSoon: editingProduct.isComingSoon,
      isActive: editingProduct.isActive !== false,
    });

    setEditingProduct(null);
  };

  // Handle Delivery Form Save
  const handleSaveDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeliveryOrder) return;

    updateDeliveryInfo(editingDeliveryOrder.orderId, {
      trackingId: deliveryForm.trackingId.trim(),
      courierPartner: deliveryForm.courierPartner,
      dispatchDate: deliveryForm.dispatchDate,
      expectedDeliveryDate: deliveryForm.expectedDeliveryDate,
      deliveryStatus: deliveryForm.deliveryStatus,
    });

    setEditingDeliveryOrder(null);
  };

  // =========================================================================
  // IF NOT AUTHENTICATED: PIN LOCK GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F8FCFF]">
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Enterprise Administration</span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">GIFTORIA Owner Console</h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter authorized PIN to access sales, orders, profits, live catalog &amp; logistics.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter 4-10 digit Security PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-slate-50 border border-sky-200 focus:border-sky-500 rounded-2xl py-3 px-4 text-center font-mono text-lg tracking-widest text-slate-900 placeholder:text-slate-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-sky-200"
                autoFocus
              />
              {pinError && <p className="text-xs text-rose-600 font-semibold mt-2">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md shadow-sky-200 transition-all active:scale-95"
            >
              Unlock Business Portal
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Internal Authorized Personnel Only • Confidential Financial &amp; Cost Pricing System
          </p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN ADMIN CONSOLE (AUTHENTICATED)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FCFF] py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-black shadow-md shadow-sky-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">GIFTORIA Business Management</h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-200">
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500">
                UPI ID: <strong className="font-mono text-slate-800">{businessConfig.upiId}</strong> • WhatsApp: <strong>+91 {businessConfig.rawPhone}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Lock Console</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* NAVIGATION TABS (Strictly all 7 requested sections) */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { 
              id: 'orders', 
              label: `Orders (${orders.filter(o => !o.isDeleted && !isOrderCancelled(o)).length})`, 
              icon: Package 
            },
            { id: 'sales', label: 'Sales Reports', icon: BarChart3 },
            { 
              id: 'payments', 
              label: `Payments Reports`, 
              icon: CreditCard,
              badge: dashboardStats.pendingPayments > 0 ? dashboardStats.pendingPayments : undefined
            },
            { id: 'products', label: `Products (${products.length})`, icon: ShoppingBag },
            { id: 'profits', label: 'Profits', icon: TrendingUp },
            { id: 'delivery', label: 'Delivery', icon: Truck },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-200'
                    : 'bg-white border border-sky-100 text-slate-600 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 rounded-full text-[10px] font-black animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: DASHBOARD OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 8 Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{dashboardStats.totalOrders}</p>
                <span className="text-[11px] text-slate-500">All recorded orders</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-1">{dashboardStats.pendingOrders}</p>
                <span className="text-[11px] text-amber-700 font-medium">Awaiting action</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Confirmed Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">{dashboardStats.confirmedOrders}</p>
                <span className="text-[11px] text-sky-700 font-medium">In queue/production</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cancelled Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-1">{dashboardStats.cancelledOrders}</p>
                <span className="text-[11px] text-rose-700 font-medium">Excluded from sales</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs bg-gradient-to-br from-sky-50 to-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">Total Net Sales</span>
                <p className="text-2xl sm:text-3xl font-black text-sky-900 mt-1">₹{dashboardStats.totalSales.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-sky-700 font-semibold">Verified paid orders</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs bg-gradient-to-br from-emerald-50 to-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Product Profit</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">₹{dashboardStats.totalProfit.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-800 font-semibold">Selling - Cost price</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Payments</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">{dashboardStats.pendingPayments}</p>
                <span className="text-[11px] text-slate-500">Needs UPI verification</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Delivered Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">{dashboardStats.deliveredOrders}</p>
                <span className="text-[11px] text-slate-500">Successfully delivered</span>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-sky-600 hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                {dashboardStats.recentOrders.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100">
                    <Package className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">No active customer orders yet</p>
                    <p className="text-[11px] text-slate-500">Orders placed by customers will automatically show up here.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Amount</th>
                          <th className="p-3">Payment</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-50 text-slate-700">
                        {dashboardStats.recentOrders.map((ord) => (
                          <tr key={ord.orderId} className="hover:bg-sky-50/40">
                            <td className="p-3 font-mono font-bold text-sky-700">#{ord.orderId}</td>
                            <td className="p-3 font-semibold text-slate-900">{ord.customer.fullName}</td>
                            <td className="p-3 font-bold text-slate-900">₹{ord.grandTotal}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.paymentStatus.toLowerCase().includes('verified')
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : ord.paymentStatus.toLowerCase().includes('reject')
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <button
                                onClick={() => { setViewingOrder(ord); }}
                                className="text-xs font-bold text-sky-600 hover:text-sky-800"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Navigation Cards */}
              <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Business Control Center</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab('payments')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/60 hover:bg-sky-100/70 border border-sky-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-sky-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">UPI Payment Verification</p>
                        <p className="text-[10px] text-slate-500">Review screenshots &amp; verify transfers</p>
                      </div>
                    </div>
                    {dashboardStats.pendingPayments > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        {dashboardStats.pendingPayments} New
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveTab('sales')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-slate-700" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Sales Reports &amp; Graphs</p>
                        <p className="text-[10px] text-slate-500">Daily, weekly, monthly &amp; yearly volume</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('profits')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Profit Breakdown</p>
                        <p className="text-[10px] text-slate-500">Automated profit formulas per item</p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('delivery')}
                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Truck className="w-5 h-5 text-slate-700" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Delivery &amp; Logistics Tracking</p>
                        <p className="text-[10px] text-slate-500">Update tracking IDs and courier partner</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Filter and Mode Bar */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-sky-50">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Orders Management Console</h2>
                  <p className="text-xs text-slate-500">Multi-product orders, customer instructions, cancellation and archival</p>
                </div>

                {/* Orders View Modes */}
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                  <button
                    onClick={() => setOrdersViewMode('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ordersViewMode === 'active' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Active Orders ({orders.filter(o => !o.isDeleted && !isOrderCancelled(o)).length})
                  </button>
                  <button
                    onClick={() => setOrdersViewMode('cancelled')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ordersViewMode === 'cancelled' ? 'bg-white text-rose-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Cancelled ({orders.filter(o => !o.isDeleted && isOrderCancelled(o)).length})
                  </button>
                  <button
                    onClick={() => setOrdersViewMode('trash')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      ordersViewMode === 'trash' ? 'bg-white text-slate-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    Archived/Trash ({orders.filter(o => o.isDeleted).length})
                  </button>
                </div>
              </div>

              {/* Search & Status Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Order ID, name, phone, pincode..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="all">Filter by Order Status (All)</option>
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <span className="text-xs text-slate-500 font-medium">
                    Showing <strong>{filteredOrders.length}</strong> orders
                  </span>
                </div>
              </div>
            </div>

            {/* Orders Cards List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs">
                <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">
                  {ordersViewMode === 'active' 
                    ? 'Zero Active Orders' 
                    : ordersViewMode === 'cancelled' 
                      ? 'No Cancelled Orders' 
                      : 'Trash is Empty'}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  {ordersViewMode === 'active'
                    ? 'Order records will appear here as soon as customers place an order on GIFTORIA.'
                    : 'No records matching this view.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => {
                  const isVerified = order.paymentStatus === 'Payment Verified' || order.paymentStatus === 'PAYMENT VERIFIED' || order.paymentStatus === 'paid';
                  const isCancelled = isOrderCancelled(order);
                  const itemsList = order.itemSnapshots && order.itemSnapshots.length > 0
                    ? order.itemSnapshots
                    : order.items.map(i => ({
                        productId: i.product.id,
                        productName: i.product.name,
                        category: i.product.category,
                        quantity: i.quantity,
                        sellingPriceSnapshot: i.product.price,
                        costPriceSnapshot: i.product.costPrice,
                        itemProfit: (i.product.price - i.product.costPrice) * i.quantity,
                        thumbnail: i.product.thumbnail,
                        customization: i.customization
                      }));

                  return (
                    <div
                      key={order.orderId}
                      className={`bg-white rounded-3xl border shadow-xs p-6 space-y-4 transition-all ${
                        isCancelled 
                          ? 'border-rose-200 bg-rose-50/20' 
                          : order.isDeleted
                            ? 'border-slate-300 bg-slate-50/40 opacity-80'
                            : 'border-sky-100 hover:border-sky-300'
                      }`}
                    >
                      {/* Top Header of Order */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-50">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-base font-black text-slate-900">#{order.orderId}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">
                            Placed: {new Date(order.createdAt).toLocaleString('en-IN')}
                          </span>
                          {order.paymentId && (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              {order.paymentId}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Payment status badge */}
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            isVerified 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                              : order.paymentStatus.toLowerCase().includes('reject')
                                ? 'bg-rose-50 text-rose-700 border-rose-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300'
                          }`}>
                            Payment: {order.paymentStatus}
                          </span>

                          {/* Order status dropdown */}
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.orderId, e.target.value as OrderStatus)}
                            className="bg-sky-50 border border-sky-200 text-sky-800 text-[11px] font-bold py-1 px-2.5 rounded-xl focus:outline-none focus:ring-1 focus:ring-sky-400"
                          >
                            {ORDER_STATUSES.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Customer Details & Address Block */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Customer</span>
                          <p className="font-bold text-slate-900">{order.customer.fullName}</p>
                          <p className="text-slate-600">📞 {order.customer.mobile}</p>
                          <p className="text-slate-500 truncate">{order.customer.email}</p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Shipping Destination</span>
                          <p className="text-slate-800">{order.customer.addressLine}</p>
                          <p className="text-slate-800 font-semibold">{order.customer.city}, MH - {order.customer.pincode}</p>
                          <p className="text-sky-700 font-medium mt-0.5">
                            Expected: {order.deliveryRecord?.expectedDeliveryDate || order.customer.deliveryDate || 'Standard Dispatch'}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Delivery &amp; Tracking</span>
                          <p className="text-slate-800 font-semibold">
                            Partner: <strong>{order.deliveryRecord?.courierPartner || 'Delhivery'}</strong>
                          </p>
                          <p className="text-sky-700 font-mono">
                            Tracking ID: <strong>{order.deliveryRecord?.trackingId || 'Awaiting Dispatch'}</strong>
                          </p>
                          {order.customerInstructions && (
                            <p className="text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200 mt-1 italic text-[11px]">
                              Note: "{order.customerInstructions}"
                            </p>
                          )}
                          {isCancelled && order.cancellationReason && (
                            <p className="text-rose-700 bg-rose-50 p-1.5 rounded-lg border border-rose-200 mt-1 text-[11px]">
                              Cancelled on {order.cancelledAt ? new Date(order.cancelledAt).toLocaleString('en-IN') : ''}: "{order.cancellationReason}"
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Multiple Product Line Items Inside This Single Order */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Order Line Items ({itemsList.length} distinct items)
                        </span>

                        <div className="divide-y divide-sky-50 border border-sky-100 rounded-2xl overflow-hidden bg-white">
                          {itemsList.map((item, idx) => (
                            <div key={idx} className="p-3.5 flex items-start gap-3 hover:bg-sky-50/20 transition-colors">
                              <img
                                src={item.thumbnail || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'}
                                alt={item.productName}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-sky-100 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-sky-600 uppercase">{item.category}</span>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900">{item.productName}</h4>
                                <p className="text-[11px] text-slate-500">
                                  Quantity: <strong>{item.quantity}</strong> × ₹{item.sellingPriceSnapshot}
                                </p>
                                {item.customization && (
                                  <div className="text-[10px] text-slate-600 bg-slate-50 p-1 rounded border border-slate-100 mt-1 inline-block">
                                    {item.customization.recipientName && <span className="mr-2">Recipient: <strong>{item.customization.recipientName}</strong></span>}
                                    {item.customization.customMessage && <span className="mr-2">Message: <strong>"{item.customization.customMessage}"</strong></span>}
                                    {item.customization.uploadedFileName && <span>File: <strong>{item.customization.uploadedFileName}</strong></span>}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-black text-slate-900">
                                  ₹{item.sellingPriceSnapshot * item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Footer & Actions */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-sky-50">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-slate-500">Total Order Amount:</span>
                          <span className="text-base font-black text-emerald-700">₹{order.grandTotal}</span>
                          <span className="text-[10px] text-slate-400">({order.paymentMethod.toUpperCase()})</span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="inline-flex items-center gap-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-sky-200 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Full</span>
                          </button>

                          <button
                            onClick={() => setEditingOrder(order)}
                            className="inline-flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          {!isCancelled && !order.isDeleted && (
                            <button
                              onClick={() => {
                                setCancellingOrderId(order.orderId);
                                setCancellationReasonInput('');
                              }}
                              className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-rose-200 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          )}

                          {order.isDeleted ? (
                            <button
                              onClick={() => restoreOrder(order.orderId)}
                              className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setDeletingOrderId(order.orderId)}
                              className="inline-flex items-center gap-1 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: SALES REPORTS */}
        {/* ========================================================================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Header & Time Period Selector */}
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Sales Reports &amp; Analytics</h2>
                <p className="text-xs text-slate-500">Calculated strictly from verified paid &amp; non-cancelled customer orders</p>
              </div>

              {/* 4 Time Periods */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setTimeFilter(p); setSelectedDateFilter(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      timeFilter === p && !selectedDateFilter 
                        ? 'bg-sky-500 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p} Sales
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Pick Exact Date</label>
                <input
                  type="date"
                  value={selectedDateFilter}
                  onChange={(e) => setSelectedDateFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Filter by Category</label>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Filter by Product</label>
                <select
                  value={selectedProductFilter}
                  onChange={(e) => setSelectedProductFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800"
                >
                  <option value="All">All Products</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary Cards for Selected Period */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Sales Amount</span>
                <p className="text-3xl font-black text-slate-900 mt-1">₹{analyticsData.totalRevenue.toLocaleString('en-IN')}</p>
                <span className="text-xs text-sky-600 font-semibold">{analyticsData.ordersCount} verified orders in this period</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Number of Orders</span>
                <p className="text-3xl font-black text-sky-600 mt-1">{analyticsData.ordersCount}</p>
                <span className="text-xs text-slate-500">Paid and verified checkouts</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Products Sold</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">{analyticsData.totalUnitsSold}</p>
                <span className="text-xs text-slate-500">Units crafted &amp; fulfilled</span>
              </div>
            </div>

            {/* Dynamic Category-wise Sales Bar Graph */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Category-wise Sales Bar Graph</h3>
                  <p className="text-xs text-slate-500">Visual breakdown of sales revenue (₹) and items sold by category</p>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                  Interactive Chart
                </span>
              </div>

              <div className="space-y-3.5 pt-2">
                {CATEGORIES_LIST.map((cat) => {
                  const stat = analyticsData.categoryStats[cat.name] || { revenue: 0, units: 0 };
                  const maxRev = Math.max(...Object.values(analyticsData.categoryStats).map(c => c.revenue), 1000);
                  const percentage = Math.round((stat.revenue / maxRev) * 100);

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{cat.name}</span>
                        <div className="flex gap-4 text-slate-600">
                          <span>{stat.units} items sold</span>
                          <strong className="text-sky-700 font-bold">₹{stat.revenue.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-sky-400 to-sky-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(percentage, stat.revenue > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product-wise Sales Table (Highest Sales Products) */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Product-wise Sales Performance</h3>
              {analyticsData.topProducts.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No sales records in the selected period.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Units Sold</th>
                        <th className="p-3">Total Sales Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-50 text-slate-700">
                      {analyticsData.topProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-sky-50/40">
                          <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="p-3 text-sky-700 font-medium">{p.category}</td>
                          <td className="p-3 font-bold">{p.units}</td>
                          <td className="p-3 font-black text-slate-900">₹{p.revenue.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: PAYMENTS REPORTS */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Payments Reports &amp; Verification</h2>
                <p className="text-xs text-slate-500">
                  UPI QR submissions, screenshot verification, transaction audit &amp; refund status
                </p>
              </div>

              {/* Time Period Filter */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPaymentTimeFilter(p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      paymentTimeFilter === p ? 'bg-sky-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Payment ID, Order ID, name, phone..."
                  value={paymentSearchQuery}
                  onChange={(e) => setPaymentSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <select
                  value={paymentStatusFilter}
                  onChange={(e) => setPaymentStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Payment Statuses</option>
                  <option value="pending">Payment Verification Pending</option>
                  <option value="verified">Payment Verified</option>
                  <option value="rejected">Payment Rejected</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="flex items-center justify-end text-xs text-slate-500">
                <span>Showing <strong>{filteredPayments.length}</strong> payment records</span>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
              {filteredPayments.length === 0 ? (
                <div className="p-12 text-center">
                  <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No payment records found</p>
                  <p className="text-[11px] text-slate-400">Customer UPI receipts will appear here automatically.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                      <tr>
                        <th className="p-3.5">Payment ID</th>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer</th>
                        <th className="p-3.5">Date</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Mode</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Screenshot</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-50 text-slate-700">
                      {filteredPayments.map((ord) => {
                        const pStatus = (ord.paymentStatus || '').toLowerCase();
                        const isVerified = pStatus.includes('verified') || pStatus === 'paid';
                        const isPending = pStatus.includes('pending');
                        const isRejected = pStatus.includes('reject') || pStatus === 'failed';

                        return (
                          <tr key={ord.orderId} className="hover:bg-sky-50/40">
                            <td className="p-3.5 font-mono font-bold text-slate-900">
                              {ord.paymentId || `PAY-${ord.orderId.replace('GFT-', '')}`}
                            </td>
                            <td className="p-3.5 font-mono text-sky-700 font-bold">
                              #{ord.orderId}
                            </td>
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-900">{ord.customer.fullName}</p>
                              <span className="text-[10px] text-slate-400">📞 {ord.customer.mobile}</span>
                            </td>
                            <td className="p-3.5 text-slate-500 text-[11px]">
                              {new Date(ord.paymentSubmittedAt || ord.createdAt).toLocaleString('en-IN')}
                            </td>
                            <td className="p-3.5 font-black text-slate-900">
                              ₹{ord.grandTotal}
                            </td>
                            <td className="p-3.5">
                              <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                                UPI QR ({businessConfig.upiId})
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                isVerified
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : isRejected
                                    ? 'bg-rose-50 text-rose-700 border-rose-300'
                                    : 'bg-amber-50 text-amber-700 border-amber-300'
                              }`}>
                                {ord.paymentStatus}
                              </span>
                            </td>
                            <td className="p-3.5">
                              {ord.paymentScreenshot ? (
                                <button
                                  onClick={() => setViewingScreenshotOrder(ord)}
                                  className="flex items-center gap-1.5 text-sky-600 hover:text-sky-800 font-bold text-[11px] bg-sky-50 px-2 py-1 rounded-lg border border-sky-200"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>View</span>
                                </button>
                              ) : (
                                <span className="text-slate-400 text-[10px]">No image</span>
                              )}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isPending && (
                                  <>
                                    <button
                                      onClick={() => adminVerifyPayment(ord.orderId)}
                                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] px-2.5 py-1 rounded-lg shadow-xs"
                                    >
                                      Verify
                                    </button>
                                    <button
                                      onClick={() => setRejectingOrder(ord)}
                                      className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] px-2.5 py-1 rounded-lg border border-rose-200"
                                    >
                                      Reject
                                    </button>
                                  </>
                                )}
                                {isVerified && (
                                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-3 h-3" /> Verified
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: PRODUCTS (LIVE WEBSITE INTEGRATION) */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Live Website Product Management</h2>
                <p className="text-xs text-slate-500">
                  Products edited or created here are immediately synced live across the GIFTORIA store.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>

                <button
                  onClick={() => {
                    if (window.confirm('Reset catalog to the default GIFTORIA curated product catalog?')) {
                      resetProductsToDefault();
                    }
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Approved</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by title or description..."
                  value={productSearchQuery}
                  onChange={(e) => setProductSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <select
                  value={productCatFilter}
                  onChange={(e) => setProductCatFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="All">All Categories ({products.length})</option>
                  {CATEGORIES_LIST.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Customer Price</th>
                      <th className="p-3.5">Cost Price (Admin Only)</th>
                      <th className="p-3.5">Margin</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50 text-slate-700">
                    {filteredProducts.map((prod) => {
                      const cost = prod.costPrice || 0;
                      const marginPct = prod.price > 0 ? Math.round(((prod.price - cost) / prod.price) * 100) : 0;
                      const isActive = prod.isActive !== false;

                      return (
                        <tr key={prod.id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.thumbnail || prod.images?.[0]}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover bg-sky-50 border border-sky-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 truncate max-w-xs">{prod.name}</p>
                                {prod.isComingSoon && (
                                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                                    Coming Soon
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-sky-700 font-semibold">{prod.category}</td>
                          <td className="p-3.5 font-black text-slate-900">₹{prod.price}</td>
                          <td className="p-3.5 font-mono text-rose-600 font-bold bg-rose-50/40 px-2 py-1 rounded">
                            ₹{cost}
                          </td>
                          <td className="p-3.5">
                            <span className="text-emerald-700 font-bold">{marginPct}%</span>
                          </td>
                          <td className="p-3.5">{prod.stock} units</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => updateProduct(prod.id, { isActive: !isActive })}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                                isActive 
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300' 
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}
                            >
                              {isActive ? 'Active on Site' : 'Disabled'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setEditingProduct(prod)}
                                className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingProduct(prod)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: PROFITS ANALYSIS */}
        {/* ========================================================================= */}
        {activeTab === 'profits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Profit Analytics &amp; Margin Reports</h2>
                <p className="text-xs text-slate-500">
                  Formula: <code className="font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded text-[11px]">Product Profit = (Selling Price - Cost Price) × Quantity Sold</code>
                </p>
              </div>

              {/* 4 Time Periods */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimePeriod[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setTimeFilter(p); setSelectedDateFilter(''); }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      timeFilter === p && !selectedDateFilter 
                        ? 'bg-emerald-600 text-white shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {p} Profit
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Customer Revenue</span>
                <p className="text-2xl font-black text-slate-900 mt-1">₹{analyticsData.totalRevenue.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">{analyticsData.ordersCount} verified orders</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cost of Goods (COGS)</span>
                <p className="text-2xl font-black text-rose-600 mt-1">₹{analyticsData.totalCogs.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">Direct material/making cost</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs bg-gradient-to-br from-emerald-50 to-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Total Product Profit</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">₹{analyticsData.netProductProfit.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-800 font-bold">{analyticsData.profitMargin.toFixed(1)}% Gross Margin</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Items Sold</span>
                <p className="text-2xl font-black text-sky-600 mt-1">{analyticsData.totalUnitsSold}</p>
                <span className="text-[11px] text-slate-500">Across verified orders</span>
              </div>
            </div>

            {/* Dynamic Category Profit Bar Graph */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Category-wise Profit Bar Graph</h3>
                  <p className="text-xs text-slate-500">Direct profit generated per category (Selling Price - Cost Price)</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Profit Distribution
                </span>
              </div>

              <div className="space-y-3.5 pt-2">
                {CATEGORIES_LIST.map((cat) => {
                  const stat = analyticsData.categoryStats[cat.name] || { revenue: 0, cost: 0, profit: 0, units: 0 };
                  const maxProfit = Math.max(...Object.values(analyticsData.categoryStats).map(c => c.profit), 500);
                  const percentage = Math.round((stat.profit / maxProfit) * 100);

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{cat.name}</span>
                        <div className="flex gap-4 text-slate-600">
                          <span>Rev: ₹{stat.revenue}</span>
                          <span>Cost: ₹{stat.cost}</span>
                          <strong className="text-emerald-700 font-bold">Profit: ₹{stat.profit}</strong>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(percentage, stat.profit > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product-wise Profit Breakdown Table */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Product-wise Profit Breakdown</h3>
              {analyticsData.topProducts.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No profit records in the selected period.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                      <tr>
                        <th className="p-3">Product Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Units Sold</th>
                        <th className="p-3">Revenue</th>
                        <th className="p-3">Total Cost</th>
                        <th className="p-3 font-bold text-emerald-700">Total Profit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-50 text-slate-700">
                      {analyticsData.topProducts.map((p, idx) => (
                        <tr key={idx} className="hover:bg-sky-50/40">
                          <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                          <td className="p-3 text-sky-700 font-medium">{p.category}</td>
                          <td className="p-3 font-bold">{p.units}</td>
                          <td className="p-3">₹{p.revenue.toLocaleString('en-IN')}</td>
                          <td className="p-3 text-rose-600 font-mono">₹{p.cost.toLocaleString('en-IN')}</td>
                          <td className="p-3 font-black text-emerald-700">₹{p.profit.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: DELIVERY MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Delivery &amp; Logistics Tracking</h2>
                <p className="text-xs text-slate-500">
                  Update tracking IDs, select courier partner, and synchronize live tracking with customer orders.
                </p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, tracking ID, customer name..."
                  value={deliverySearchQuery}
                  onChange={(e) => setDeliverySearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <select
                  value={deliveryStatusFilter}
                  onChange={(e) => setDeliveryStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Delivery Statuses</option>
                  {DELIVERY_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Table */}
            <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
              {filteredDeliveries.length === 0 ? (
                <div className="p-12 text-center">
                  <Truck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No active shipments to track</p>
                  <p className="text-[11px] text-slate-400">Confirmed orders ready for shipment will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer &amp; Phone</th>
                        <th className="p-3.5">Destination</th>
                        <th className="p-3.5">Courier Partner</th>
                        <th className="p-3.5">Tracking ID</th>
                        <th className="p-3.5">Delivery Status</th>
                        <th className="p-3.5">Expected Date</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-50 text-slate-700">
                      {filteredDeliveries.map((ord) => {
                        const del = ord.deliveryRecord || {
                          orderId: ord.orderId,
                          customerName: ord.customer.fullName,
                          customerPhone: ord.customer.mobile,
                          productSummary: ord.items.map(i => `${i.product.name} (x${i.quantity})`).join(', '),
                          quantity: ord.items.reduce((acc, i) => acc + i.quantity, 0),
                          deliveryAddress: `${ord.customer.addressLine}, ${ord.customer.city}`,
                          pincode: ord.customer.pincode,
                          deliveryStatus: 'Not Dispatched',
                          updatedAt: ord.updatedAt
                        };

                        return (
                          <tr key={ord.orderId} className="hover:bg-sky-50/40">
                            <td className="p-3.5 font-mono font-bold text-sky-700">
                              #{ord.orderId}
                            </td>
                            <td className="p-3.5">
                              <p className="font-semibold text-slate-900">{del.customerName}</p>
                              <span className="text-[10px] text-slate-400">📞 {del.customerPhone}</span>
                            </td>
                            <td className="p-3.5">
                              <p className="max-w-xs truncate">{del.deliveryAddress}</p>
                              <span className="font-semibold text-slate-800">{del.pincode}</span>
                            </td>
                            <td className="p-3.5 font-semibold text-slate-800">
                              {del.courierPartner || 'Delhivery'}
                            </td>
                            <td className="p-3.5 font-mono font-bold text-sky-700">
                              {del.trackingId || <span className="text-slate-400 font-normal">Not Set</span>}
                            </td>
                            <td className="p-3.5">
                              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                del.deliveryStatus === 'Delivered'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                  : del.deliveryStatus === 'Shipped' || del.deliveryStatus === 'In Transit'
                                    ? 'bg-sky-50 text-sky-700 border-sky-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}>
                                {del.deliveryStatus}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-600">
                              {del.expectedDeliveryDate || ord.customer.deliveryDate || 'Within 2-4 days'}
                            </td>
                            <td className="p-3.5 text-right">
                              <button
                                onClick={() => {
                                  setEditingDeliveryOrder(ord);
                                  setDeliveryForm({
                                    trackingId: del.trackingId || '',
                                    courierPartner: del.courierPartner || 'Delhivery',
                                    dispatchDate: del.dispatchDate || new Date().toISOString().split('T')[0],
                                    expectedDeliveryDate: del.expectedDeliveryDate || ord.customer.deliveryDate || '',
                                    deliveryStatus: del.deliveryStatus || 'Not Dispatched',
                                  });
                                }}
                                className="bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs px-3 py-1.5 rounded-xl border border-sky-200 transition-colors"
                              >
                                Edit Logistics
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 8: SETTINGS & CLEANUP */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">Admin System Controls &amp; Data Maintenance</h2>
                <p className="text-xs text-slate-500">Database synchronization, test order reset, and backup</p>
              </div>

              <div className="divide-y divide-sky-50 border border-sky-100 rounded-2xl overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Reset Active Orders to Zero</h3>
                    <p className="text-[11px] text-slate-500 max-w-md">
                      Clears all test and sample customer orders. Resets active order count to exactly zero. Product catalogue, pricing and customer records are safely preserved.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clean all test orders and reset the active orders count to 0?')) {
                        clearAllOrders();
                      }
                    }}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl border border-rose-200 transition-colors shrink-0"
                  >
                    Clear All Orders (Start at 0)
                  </button>
                </div>

                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Reset Product Catalog to Default Approved</h3>
                    <p className="text-[11px] text-slate-500 max-w-md">
                      Restores all 17 approved catalog items across all categories (Personalized Gifts, 3D Arts, Frames, Forever Blooms, etc.).
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Reset catalog products back to default?')) {
                        resetProductsToDefault();
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-colors shrink-0"
                  >
                    Reset Catalog Default
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: VIEW ORDER FULL DETAILS */}
      {/* ========================================================================= */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-black text-slate-900">Order #{viewingOrder.orderId}</span>
                <span className="text-xs bg-sky-50 text-sky-700 font-bold px-2.5 py-0.5 rounded-full">
                  {viewingOrder.orderStatus}
                </span>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Customer Information</span>
                <p className="font-bold text-slate-900 mt-1">{viewingOrder.customer.fullName}</p>
                <p className="text-slate-600">📞 {viewingOrder.customer.mobile}</p>
                <p className="text-slate-600">✉️ {viewingOrder.customer.email}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Address</span>
                <p className="text-slate-900 mt-1">{viewingOrder.customer.addressLine}</p>
                <p className="font-semibold text-slate-800">{viewingOrder.customer.city}, Maharashtra - {viewingOrder.customer.pincode}</p>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">Ordered Items</span>
              <div className="divide-y divide-sky-50 border border-sky-100 rounded-2xl overflow-hidden">
                {(viewingOrder.itemSnapshots && viewingOrder.itemSnapshots.length > 0 ? viewingOrder.itemSnapshots : viewingOrder.items.map(i => ({
                  productName: i.product.name,
                  category: i.product.category,
                  quantity: i.quantity,
                  sellingPriceSnapshot: i.product.price,
                  thumbnail: i.product.thumbnail,
                  customization: i.customization
                }))).map((it, idx) => (
                  <div key={idx} className="p-3 flex items-start gap-3 bg-white">
                    <img
                      src={it.thumbnail || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'}
                      alt={it.productName}
                      className="w-12 h-12 rounded-xl object-cover border border-sky-100 shrink-0"
                    />
                    <div className="flex-1 text-xs">
                      <span className="text-[10px] font-bold text-sky-600 uppercase">{it.category}</span>
                      <h4 className="font-bold text-slate-900">{it.productName}</h4>
                      <p className="text-slate-500">Qty: {it.quantity} × ₹{it.sellingPriceSnapshot}</p>
                      {it.customization && (
                        <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-1">
                          {it.customization.recipientName && <p>• Recipient: {it.customization.recipientName}</p>}
                          {it.customization.customMessage && <p>• Message: "{it.customization.customMessage}"</p>}
                          {it.customization.uploadedFileName && <p>• File: {it.customization.uploadedFileName}</p>}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-black text-slate-900">
                      ₹{it.sellingPriceSnapshot * it.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Delivery Summary */}
            <div className="flex items-center justify-between pt-2 border-t border-sky-100 text-xs">
              <div>
                <span className="text-slate-500">Payment Status: </span>
                <strong className="text-emerald-700">{viewingOrder.paymentStatus}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500">Grand Total: </span>
                <span className="text-lg font-black text-slate-900">₹{viewingOrder.grandTotal}</span>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setViewingOrder(null)}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT ORDER DETAILS */}
      {/* ========================================================================= */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-sm">Edit Order #{editingOrder.orderId}</h3>
              <button onClick={() => setEditingOrder(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateOrderDetails(editingOrder.orderId, {
                  customer: editingOrder.customer,
                  customerInstructions: editingOrder.customerInstructions,
                  adminNotes: editingOrder.adminNotes,
                });
                setEditingOrder(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={editingOrder.customer.fullName}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, fullName: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Phone Number</label>
                <input
                  type="text"
                  value={editingOrder.customer.mobile}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, mobile: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Address</label>
                <textarea
                  rows={2}
                  value={editingOrder.customer.addressLine}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customer: { ...editingOrder.customer, addressLine: e.target.value }
                  })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    value={editingOrder.customer.city}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, city: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Pincode</label>
                  <input
                    type="text"
                    value={editingOrder.customer.pincode}
                    onChange={(e) => setEditingOrder({
                      ...editingOrder,
                      customer: { ...editingOrder.customer, pincode: e.target.value }
                    })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Special Instructions</label>
                <textarea
                  rows={2}
                  value={editingOrder.customerInstructions || ''}
                  onChange={(e) => setEditingOrder({
                    ...editingOrder,
                    customerInstructions: e.target.value
                  })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  placeholder="Greeting card message or delivery note"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-xl"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CANCEL ORDER CONFIRMATION */}
      {/* ========================================================================= */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">Cancel Order #{cancellingOrderId}?</h3>
            </div>
            <p className="text-xs text-slate-500">
              This will update the order status to CANCELLED, record the cancellation timestamp, and automatically exclude it from net sales and profits calculations.
            </p>
            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1">Cancellation Reason (Optional)</label>
              <textarea
                rows={2}
                value={cancellationReasonInput}
                onChange={(e) => setCancellationReasonInput(e.target.value)}
                placeholder="e.g. Customer requested cancellation, payment failed verification"
                className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Dismiss
              </button>
              <button
                onClick={() => {
                  cancelOrder(cancellingOrderId, cancellationReasonInput.trim());
                  setCancellingOrderId(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE ORDER CONFIRMATION */}
      {/* ========================================================================= */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">Move Order #{deletingOrderId} to Trash?</h3>
            </div>
            <p className="text-xs text-slate-500">
              Archiving this order prevents accidental deletion. The record can be recovered from the Trash view anytime. Product catalogue and customer data will NOT be deleted.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingOrderId(null)}
                className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteOrder(deletingOrderId, false);
                  setDeletingOrderId(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Archive to Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PAYMENT SCREENSHOT PREVIEW */}
      {/* ========================================================================= */}
      {viewingScreenshotOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Payment Receipt • Order #{viewingScreenshotOrder.orderId}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {viewingScreenshotOrder.customer.fullName} • ₹{viewingScreenshotOrder.grandTotal}
                </p>
              </div>
              <button
                onClick={() => setViewingScreenshotOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center max-h-96">
              <img
                src={viewingScreenshotOrder.paymentScreenshot}
                alt="Payment Receipt"
                className="max-h-96 object-contain"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-xs text-slate-500">
                Status: <strong>{viewingScreenshotOrder.paymentStatus}</strong>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    adminVerifyPayment(viewingScreenshotOrder.orderId);
                    setViewingScreenshotOrder(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
                >
                  Verify Payment
                </button>
                <button
                  onClick={() => {
                    setRejectingOrder(viewingScreenshotOrder);
                    setViewingScreenshotOrder(null);
                  }}
                  className="bg-rose-50 text-rose-700 font-bold text-xs px-4 py-2 rounded-xl border border-rose-200"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REJECT PAYMENT WITH REASON */}
      {/* ========================================================================= */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">
              Reject Payment for Order #{rejectingOrder.orderId}
            </h3>
            <p className="text-xs text-slate-500">
              The customer will receive a notification to re-upload their genuine payment receipt.
            </p>
            <div>
              <label className="font-bold text-slate-700 text-xs block mb-1">Rejection Reason</label>
              <textarea
                rows={2}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingOrder(null)}
                className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  adminRejectPayment(rejectingOrder.orderId, rejectionReasonInput.trim());
                  setRejectingOrder(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW PRODUCT (Live website connection & hidden cost price) */}
      {/* ========================================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Add New Product to Live Catalog</h3>
                <p className="text-[11px] text-slate-500">Instantly appears on customer-facing store</p>
              </div>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3D Moon Lamp 15cm"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="1"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Pricing: Customer Price vs Cost Price */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-sky-50/50 rounded-2xl border border-sky-100">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Selling Price (₹) <span className="text-[10px] text-sky-600 font-normal">Customer Visible</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full bg-white border border-sky-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-rose-700 block mb-1">
                    Cost Price (₹) <span className="text-[10px] font-normal text-rose-500">Admin Only</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newProd.costPrice}
                    onChange={(e) => setNewProd({ ...newProd, costPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-rose-200 rounded-xl p-2.5 text-xs font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  value={newProd.thumbnail}
                  onChange={(e) => setNewProd({ ...newProd, thumbnail: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Details, dimensions, material and care instructions..."
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProd.customizable}
                    onChange={(e) => setNewProd({ ...newProd, customizable: e.target.checked })}
                    className="w-4 h-4 text-sky-500 rounded"
                  />
                  <span className="font-bold text-slate-700">Customizable (photo/text upload)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProd.isComingSoon}
                    onChange={(e) => setNewProd({ ...newProd, isComingSoon: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span className="font-bold text-slate-700">Mark as Coming Soon</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Publish to Live Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-sm">Edit Product Details</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Pricing: Customer Price vs Hidden Cost Price */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-sky-50/50 rounded-2xl border border-sky-100">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    Selling Price (₹) <span className="text-[10px] text-sky-600 font-normal">Public</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-white border border-sky-200 rounded-xl p-2.5 text-xs font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-rose-700 block mb-1">
                    Cost Price (₹) <span className="text-[10px] text-rose-500 font-normal">Admin Confidential</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.costPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full bg-white border border-rose-200 rounded-xl p-2.5 text-xs font-bold text-rose-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive !== false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="font-bold text-slate-700">Active on Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isComingSoon || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isComingSoon: e.target.checked })}
                    className="w-4 h-4 text-amber-500 rounded"
                  />
                  <span className="font-bold text-slate-700">Coming Soon</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-xl shadow-xs"
                >
                  Update Live Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DELETE PRODUCT CONFIRMATION */}
      {/* ========================================================================= */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Delete "{deletingProduct.name}"?</h3>
            <p className="text-xs text-slate-500">
              Removing this product takes it off the customer storefront. Historical order records containing this product will be safely preserved.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="bg-slate-100 text-slate-700 font-bold text-xs px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteProduct(deletingProduct.id);
                  setDeletingProduct(null);
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2 rounded-xl"
              >
                Delete from Catalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT DELIVERY / LOGISTICS */}
      {/* ========================================================================= */}
      {editingDeliveryOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Logistics &amp; Tracking • Order #{editingDeliveryOrder.orderId}
              </h3>
              <button onClick={() => setEditingDeliveryOrder(null)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDelivery} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Courier Partner</label>
                <select
                  value={deliveryForm.courierPartner}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, courierPartner: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="Blue Dart">Blue Dart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="India Post / Speed Post">India Post / Speed Post</option>
                  <option value="Shadowfax">Shadowfax</option>
                  <option value="Xpressbees">Xpressbees</option>
                  <option value="Local Courier / Self Delivery">Local Courier / Self Delivery</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Tracking ID / Consignment Number</label>
                <input
                  type="text"
                  placeholder="e.g. DLV98321049"
                  value={deliveryForm.trackingId}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, trackingId: e.target.value })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Delivery Status</label>
                <select
                  value={deliveryForm.deliveryStatus}
                  onChange={(e) => setDeliveryForm({ ...deliveryForm, deliveryStatus: e.target.value as DeliveryStatus })}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                >
                  {DELIVERY_STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Dispatch Date</label>
                  <input
                    type="date"
                    value={deliveryForm.dispatchDate}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, dispatchDate: e.target.value })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Expected Delivery</label>
                  <input
                    type="date"
                    value={deliveryForm.expectedDeliveryDate}
                    onChange={(e) => setDeliveryForm({ ...deliveryForm, expectedDeliveryDate: e.target.value })}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingDeliveryOrder(null)}
                  className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-xl"
                >
                  Update Customer Tracking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
