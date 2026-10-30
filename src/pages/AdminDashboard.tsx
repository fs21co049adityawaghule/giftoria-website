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
  ORDER_STATUSES, 
  DELIVERY_STATUSES 
} from '../types';
import { CATEGORIES_LIST } from '../data/products';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Truck, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Save, 
  FileText,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  X
} from 'lucide-react';

type AdminTab = 'dashboard' | 'orders' | 'sales' | 'products' | 'profits' | 'delivery' | 'settings';
type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const AdminDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useAdmin();
  const { orders, updateOrderStatus, updatePaymentStatus, updateDeliveryInfo, addOrderExpense } = useOrder();
  const { showToast } = useToast();

  // Authentication PIN Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('giftoria_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Time filter for Sales & Profits
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('monthly');

  // Orders Tab filters & state
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [editingNotesOrderId, setEditingNotesOrderId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');
  const [expenseOrderId, setExpenseOrderId] = useState<string | null>(null);
  const [expenseAmountInput, setExpenseAmountInput] = useState('');

  // Product CRUD Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Product Form State
  const [newProd, setNewProd] = useState<{
    name: string;
    category: ProductCategory;
    description: string;
    price: number;
    costPrice: number;
    stock: number;
    thumbnail: string;
    customizable: boolean;
  }>({
    name: '',
    category: 'Personalized Gifts',
    description: '',
    price: 250,
    costPrice: 120,
    stock: 50,
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    customizable: true,
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
      setPinError('Invalid security PIN. Please enter the authorized owner PIN.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('giftoria_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
    showToast('Logged out of admin panel', 'info');
  };

  // Helper date filtering
  const filterOrdersByDate = (orderList: typeof orders, filter: TimeFilter) => {
    const now = new Date();
    return orderList.filter((ord) => {
      const ordDate = new Date(ord.createdAt);
      if (filter === 'daily') {
        return ordDate.toDateString() === now.toDateString();
      } else if (filter === 'weekly') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return ordDate >= oneWeekAgo;
      } else if (filter === 'monthly') {
        return ordDate.getMonth() === now.getMonth() && ordDate.getFullYear() === now.getFullYear();
      } else if (filter === 'yearly') {
        return ordDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  // Filtered orders for metrics
  const filteredOrdersForReports = useMemo(() => {
    return filterOrdersByDate(orders, timeFilter);
  }, [orders, timeFilter]);

  // Overall Financial Calculations (Calculated exclusively from verified paid orders)
  const metrics = useMemo(() => {
    const verifiedPaidOrders = orders.filter(
      (o) => o.paymentStatus === 'paid' && o.orderStatus !== 'PENDING PAYMENT' && o.orderStatus !== 'PAYMENT FAILED'
    );
    const totalOrders = orders.length;
    const confirmedCount = verifiedPaidOrders.length;
    const todayOrders = filterOrdersByDate(verifiedPaidOrders, 'daily').length;

    let totalRevenue = 0;
    let totalCostOfGoods = 0;
    let totalDirectExpenses = 0;

    verifiedPaidOrders.forEach((ord) => {
      totalRevenue += ord.grandTotal || 0;
      totalDirectExpenses += ord.directExpenses || 0;

      if (ord.itemSnapshots && ord.itemSnapshots.length > 0) {
        ord.itemSnapshots.forEach((snap) => {
          totalCostOfGoods += (snap.costPriceSnapshot || 0) * snap.quantity;
        });
      } else if (ord.items && ord.items.length > 0) {
        ord.items.forEach((item) => {
          const cost = item.product.costPrice || Math.round(item.product.price * 0.5);
          totalCostOfGoods += cost * item.quantity;
        });
      }
    });

    const netProfit = totalRevenue - totalCostOfGoods - totalDirectExpenses;
    const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING PAYMENT').length;
    const processingOrders = orders.filter((o) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'PAID / CONFIRMED').length;
    const shippedOrders = orders.filter((o) => o.orderStatus === 'SHIPPED').length;
    const deliveredOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;

    return {
      totalOrders,
      confirmedCount,
      todayOrders,
      totalRevenue,
      totalCostOfGoods,
      totalDirectExpenses,
      netProfit,
      profitMargin,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      activeProductsCount: products.filter((p) => p.isActive !== false).length,
    };
  }, [orders, products]);

  // Report Metrics (filtered by time, exclusively verified paid orders)
  const reportMetrics = useMemo(() => {
    let rev = 0;
    let cogs = 0;
    let expenses = 0;

    const categoryStats: Record<string, { units: number; revenue: number; cost: number }> = {};
    const productStats: Record<string, { name: string; category: string; units: number; revenue: number }> = {};

    const paidFiltered = filteredOrdersForReports.filter(
      (o) => o.paymentStatus === 'paid' && o.orderStatus !== 'PENDING PAYMENT' && o.orderStatus !== 'PAYMENT FAILED'
    );

    paidFiltered.forEach((ord) => {
      rev += ord.grandTotal || 0;
      expenses += ord.directExpenses || 0;

      const items = (ord.itemSnapshots && ord.itemSnapshots.length > 0)
        ? ord.itemSnapshots.map(s => ({
            name: s.productName,
            category: s.category,
            quantity: s.quantity,
            selling: s.sellingPriceSnapshot,
            cost: s.costPriceSnapshot,
          }))
        : ord.items.map(i => ({
            name: i.product.name,
            category: i.product.category,
            quantity: i.quantity,
            selling: i.product.price,
            cost: i.product.costPrice || Math.round(i.product.price * 0.5),
          }));

      items.forEach((it) => {
        const itemRev = it.selling * it.quantity;
        const itemCost = it.cost * it.quantity;
        cogs += itemCost;

        // Category stats
        if (!categoryStats[it.category]) {
          categoryStats[it.category] = { units: 0, revenue: 0, cost: 0 };
        }
        categoryStats[it.category].units += it.quantity;
        categoryStats[it.category].revenue += itemRev;
        categoryStats[it.category].cost += itemCost;

        // Product stats
        if (!productStats[it.name]) {
          productStats[it.name] = { name: it.name, category: it.category, units: 0, revenue: 0 };
        }
        productStats[it.name].units += it.quantity;
        productStats[it.name].revenue += itemRev;
      });
    });

    const netProfit = rev - cogs - expenses;
    const profitMargin = rev > 0 ? (netProfit / rev) * 100 : 0;

    return {
      revenue: rev,
      cogs,
      expenses,
      netProfit,
      profitMargin,
      ordersCount: paidFiltered.length,
      categoryStats,
      topProducts: Object.values(productStats).sort((a, b) => b.revenue - a.revenue),
    };
  }, [filteredOrdersForReports]);

  // Filtered orders list for Orders Tab
  const displayedOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        orderSearchQuery === '' ||
        ord.orderId.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        ord.customer.fullName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        (ord.customer.email && ord.customer.email.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
        ord.customer.mobile.includes(orderSearchQuery) ||
        (ord.razorpayPaymentId && ord.razorpayPaymentId.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
        (ord.razorpayOrderId && ord.razorpayOrderId.toLowerCase().includes(orderSearchQuery.toLowerCase())) ||
        ord.customer.city.toLowerCase().includes(orderSearchQuery.toLowerCase());

      let matchesStatus = true;
      if (orderStatusFilter === 'confirmed') {
        matchesStatus = ord.paymentStatus === 'paid' && ord.orderStatus !== 'PENDING PAYMENT' && ord.orderStatus !== 'PAYMENT FAILED';
      } else if (orderStatusFilter === 'pending') {
        matchesStatus = ord.orderStatus === 'PENDING PAYMENT';
      } else if (orderStatusFilter === 'failed') {
        matchesStatus = ord.orderStatus === 'PAYMENT FAILED';
      } else if (orderStatusFilter !== 'all') {
        matchesStatus = ord.orderStatus === orderStatusFilter;
      }

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Handle Add Product Submission
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
      service: 'customized-gifts',
      serviceName: newProd.category,
      description: newProd.description || `Handcrafted ${newProd.name} by GIFTORIA. Custom designs available on WhatsApp.`,
      price: Number(newProd.price),
      costPrice: Number(newProd.costPrice),
      compareAtPrice: Math.round(Number(newProd.price) * 1.3),
      currency: '₹',
      images: [newProd.thumbnail],
      thumbnail: newProd.thumbnail,
      customizable: newProd.customizable,
      customizationType: 'image_text',
      stock: Number(newProd.stock),
      featured: true,
      bestSeller: false,
      newProduct: true,
      isActive: true,
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
    });
    showToast(`Product "${newProd.name}" added to live catalog!`, 'success');
  };

  // Handle Edit Product Submission
  const handleEditProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      category: editingProduct.category,
      description: editingProduct.description,
      price: Number(editingProduct.price),
      costPrice: Number(editingProduct.costPrice || 0),
      stock: Number(editingProduct.stock),
      thumbnail: editingProduct.thumbnail,
      images: [editingProduct.thumbnail],
      customizable: editingProduct.customizable,
      isActive: editingProduct.isActive !== false,
    });

    setEditingProduct(null);
    showToast(`Updated product "${editingProduct.name}"`, 'success');
  };

  // If not authenticated, render the PIN lock gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F8FCFF]">
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
              Authorized Personnel Only
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-2">
              GIFTORIA Admin Portal
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter master owner PIN to manage products, view multi-product orders, and calculate profit reports.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Admin PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full text-center tracking-widest text-lg font-bold py-3.5 px-4 rounded-2xl border border-sky-200 focus:outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all text-slate-800"
              />
              {pinError && (
                <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-2xl text-sm shadow-md shadow-sky-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Unlock className="w-4 h-4" />
              Unlock Admin Console
            </button>
          </form>

          <div className="text-[11px] text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
            Hint: Master Admin PIN is <code className="font-mono text-sky-600 font-bold">giftoria2026</code>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header & Navigation Banner */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-sky-500 text-white shadow-md shadow-sky-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">
                  GIFTORIA Management Portal
                </h1>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized Control: Orders, Live Catalog, Costs &amp; Delivery Tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddProductModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all"
            >
              <Lock className="w-3.5 h-3.5" />
              Lock Console
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'sales', label: 'Sales Reports', icon: TrendingUp },
            { id: 'products', label: `Products (${products.length})`, icon: Package },
            { id: 'profits', label: 'Profit Calculations', icon: DollarSign },
            { id: 'delivery', label: 'Delivery Tracking', icon: Truck },
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
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">{metrics.totalOrders}</p>
                <span className="text-[11px] text-sky-600 font-medium">Today: {metrics.todayOrders} new</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Sales</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">₹{metrics.totalRevenue.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-600 font-medium">All completed orders</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Profit</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1">₹{metrics.netProfit.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-700 font-bold">{metrics.profitMargin.toFixed(1)}% margin</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Products</span>
                <p className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">{metrics.activeProductsCount}</p>
                <span className="text-[11px] text-slate-500 font-medium">Visible to customers</span>
              </div>
            </div>

            {/* Pipeline status widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-800">Pending Payment</span>
                  <p className="text-xl font-black text-amber-900">{metrics.pendingOrders} orders</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500 opacity-80" />
              </div>

              <div className="bg-sky-50/70 border border-sky-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-sky-800">Paid / Processing</span>
                  <p className="text-xl font-black text-sky-900">{metrics.processingOrders} orders</p>
                </div>
                <Package className="w-8 h-8 text-sky-500 opacity-80" />
              </div>

              <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-800">Dispatched</span>
                  <p className="text-xl font-black text-indigo-900">{metrics.shippedOrders} orders</p>
                </div>
                <Truck className="w-8 h-8 text-indigo-500 opacity-80" />
              </div>

              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-800">Delivered</span>
                  <p className="text-xl font-black text-emerald-900">{metrics.deliveredOrders} orders</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500 opacity-80" />
              </div>
            </div>

            {/* Recent Orders Quick Preview */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  View All Orders →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50 text-slate-700">
                    {orders.slice(0, 5).map((ord) => {
                      const itemCount = (ord.itemSnapshots?.length) || ord.items.length || 0;
                      return (
                        <tr key={ord.orderId} className="hover:bg-sky-50/40 transition-colors">
                          <td className="p-3 font-mono font-bold text-sky-600">{ord.orderId}</td>
                          <td className="p-3 font-semibold text-slate-900">
                            {ord.customer.fullName}
                            <span className="block text-[10px] text-slate-400 font-normal">{ord.customer.city}</span>
                          </td>
                          <td className="p-3">{itemCount} items</td>
                          <td className="p-3 font-bold text-slate-900">₹{ord.grandTotal.toLocaleString('en-IN')}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-[11px] text-slate-400">
                            {new Date(ord.createdAt).toLocaleDateString('en-IN')}
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

        {/* ========================================================= */}
        {/* TAB 2: ORDERS MANAGEMENT (MULTI-PRODUCT HANDLING & PAYMENT VERIFICATION) */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Quick Filter Tabs & Search Bar */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs space-y-3">
              {/* Filter pills */}
              <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-sky-50">
                <button
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    orderStatusFilter === 'all'
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Records ({orders.length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('confirmed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderStatusFilter === 'confirmed'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Confirmed &amp; Paid ({orders.filter(o => o.paymentStatus === 'paid' && o.orderStatus !== 'PENDING PAYMENT' && o.orderStatus !== 'PAYMENT FAILED').length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderStatusFilter === 'pending'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  Pending Payment ({orders.filter(o => o.orderStatus === 'PENDING PAYMENT').length})
                </button>
                <button
                  onClick={() => setOrderStatusFilter('failed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    orderStatusFilter === 'failed'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  Payment Failed ({orders.filter(o => o.orderStatus === 'PAYMENT FAILED').length})
                </button>
              </div>

              {/* Search and Specific Status Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pt-1">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Order ID, Customer, Phone, Email, Payment ID..."
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">Exact Status:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    <option value="all">All Statuses</option>
                    <option value="confirmed">Only Confirmed &amp; Paid</option>
                    <option value="pending">Only Pending Payment</option>
                    <option value="failed">Only Payment Failed</option>
                    {ORDER_STATUSES.map((st: OrderStatus) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List Cards with Multi-Product Blocks */}
            <div className="space-y-6">
              {displayedOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center text-slate-400 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold">No orders match the selected search or filter.</p>
                  <p className="text-xs text-slate-400">Try changing your search keywords or switching filter tabs.</p>
                </div>
              ) : (
                displayedOrders.map((ord) => {
                  const isVerifiedPaid = ord.paymentStatus === 'paid' && ord.orderStatus !== 'PENDING PAYMENT' && ord.orderStatus !== 'PAYMENT FAILED';
                  const itemsList = (ord.itemSnapshots && ord.itemSnapshots.length > 0)
                    ? ord.itemSnapshots
                    : ord.items.map(i => ({
                        productId: i.product.id,
                        productName: i.product.name,
                        category: i.product.category,
                        quantity: i.quantity,
                        sellingPriceSnapshot: i.product.price,
                        costPriceSnapshot: i.product.costPrice || Math.round(i.product.price * 0.5),
                        thumbnail: i.product.thumbnail || i.product.images[0],
                        customization: i.customization,
                      }));

                  const totalCogs = itemsList.reduce((acc, i) => acc + (i.costPriceSnapshot * i.quantity), 0);
                  const orderProfit = (ord.grandTotal || 0) - totalCogs - (ord.directExpenses || 0);

                  return (
                    <div key={ord.orderId} className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden">
                      {/* Top Order Summary Bar */}
                      <div className="bg-slate-50/70 p-4 sm:p-5 border-b border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-mono font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                              #{ord.orderId}
                            </span>

                            {/* Payment Verification Badge */}
                            {ord.paymentStatus === 'paid' ? (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1.5 border border-emerald-300">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Razorpay Verified</span>
                                {ord.razorpayPaymentId && (
                                  <span className="font-mono text-[11px] opacity-90">({ord.razorpayPaymentId})</span>
                                )}
                              </span>
                            ) : ord.orderStatus === 'PAYMENT FAILED' ? (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1.5 border border-rose-300">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>Payment Failed</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1.5 border border-amber-300">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Pending Payment (Unverified)</span>
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400 font-medium">
                              📅 {new Date(ord.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{ord.customer.fullName}</h3>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
                              <span>📞 {ord.customer.mobile}</span>
                              {ord.customer.email && (
                                <>
                                  <span>•</span>
                                  <span>✉️ {ord.customer.email}</span>
                                </>
                              )}
                              <span>•</span>
                              <span>📍 {ord.customer.city}, PIN: {ord.customer.pincode}</span>
                            </div>
                          </div>
                        </div>

                        {/* Order Controls */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Order Status Selector */}
                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Status:</span>
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => {
                                const newSt = e.target.value as OrderStatus;
                                if (!isVerifiedPaid && (newSt === 'PAID / CONFIRMED' || newSt === 'PROCESSING' || newSt === 'SHIPPED' || newSt === 'DELIVERED')) {
                                  showToast('Cannot mark an unverified order as confirmed. Requires valid Razorpay payment verification.', 'error');
                                  return;
                                }
                                updateOrderStatus(ord.orderId, newSt);
                              }}
                              className="text-xs font-bold text-sky-700 bg-transparent focus:outline-none cursor-pointer"
                            >
                              {ORDER_STATUSES.map((st: OrderStatus) => {
                                const isDisallowedForUnpaid = !isVerifiedPaid && (st === 'PAID / CONFIRMED' || st === 'PROCESSING' || st === 'SHIPPED' || st === 'DELIVERED');
                                return (
                                  <option key={st} value={st} disabled={isDisallowedForUnpaid}>
                                    {st} {isDisallowedForUnpaid ? '(Requires Verified Payment)' : ''}
                                  </option>
                                );
                              })}
                            </select>
                          </div>

                          {/* Payment Status Indicator / Locked Toggle */}
                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 rounded-xl border border-sky-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Payment:</span>
                            {ord.paymentStatus === 'paid' ? (
                              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" /> Paid (Verified)
                              </span>
                            ) : (
                              <select
                                value={ord.paymentStatus}
                                onChange={(e) => {
                                  const newPayStatus = e.target.value as PaymentStatus;
                                  if (newPayStatus === 'paid') {
                                    showToast('Cannot manually mark as paid. Payment must be verified by Razorpay webhook or signature.', 'error');
                                    return;
                                  }
                                  updatePaymentStatus(ord.orderId, newPayStatus);
                                }}
                                className="text-xs font-bold text-amber-600 bg-transparent focus:outline-none cursor-pointer"
                              >
                                <option value="pending">Pending</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                                <option value="paid" disabled>Paid (Requires Razorpay)</option>
                              </select>
                            )}
                          </div>

                          {/* WhatsApp Customer Action */}
                          <a
                            href={`https://wa.me/91${ord.customer.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${ord.customer.fullName}! Update from GIFTORIA regarding Order #${ord.orderId}: Currently "${ord.orderStatus}".`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
                            title="Message customer on WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Razorpay Audit Details Bar (if present or pending) */}
                      <div className="bg-slate-100/50 px-4 py-2 border-b border-sky-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-600">
                        <div className="flex items-center gap-4 flex-wrap font-mono">
                          <span>Razorpay Order ID: <strong>{ord.razorpayOrderId || 'Pending checkout'}</strong></span>
                          {ord.razorpayPaymentId && (
                            <span>Payment ID: <strong className="text-emerald-700">{ord.razorpayPaymentId}</strong></span>
                          )}
                          {ord.paymentVerifiedAt && (
                            <span className="font-sans text-slate-500">
                              Verified at: {new Date(ord.paymentVerifiedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          )}
                        </div>
                        {ord.paymentFailureReason && (
                          <span className="text-rose-600 font-medium">
                            Failure: {ord.paymentFailureReason}
                          </span>
                        )}
                      </div>

                      {/* Multi-Product Blocks Container */}
                      <div className="p-4 sm:p-6 space-y-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          Ordered Items ({itemsList.length} distinct products)
                        </span>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {itemsList.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-2xl bg-sky-50/40 border border-sky-100 flex items-start gap-3"
                            >
                              <img
                                src={item.thumbnail || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'}
                                alt={item.productName}
                                className="w-16 h-16 rounded-xl object-cover bg-white border border-sky-200 shrink-0"
                              />

                              <div className="space-y-1 min-w-0 flex-1">
                                <span className="text-[10px] font-bold uppercase text-sky-600 block">
                                  {item.category}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                  {item.productName}
                                </h4>

                                <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                                  <span>Quantity: <strong className="text-slate-900">{item.quantity}</strong></span>
                                  <span>•</span>
                                  <span>Selling: <strong>₹{item.sellingPriceSnapshot}</strong></span>
                                  <span>•</span>
                                  <span className="text-sky-700 font-semibold">Cost: ₹{item.costPriceSnapshot}</span>
                                </div>

                                {/* Customization Details */}
                                {item.customization && (
                                  <div className="mt-2 pt-2 border-t border-sky-100 text-[11px] text-slate-600 space-y-0.5 bg-white p-2 rounded-lg">
                                    {item.customization.recipientName && (
                                      <p>• <strong>Name / Text:</strong> {item.customization.recipientName}</p>
                                    )}
                                    {item.customization.customMessage && (
                                      <p>• <strong>Greeting Message:</strong> "{item.customization.customMessage}"</p>
                                    )}
                                    {item.customization.uploadedFileName && (
                                      <p>• <strong>Attached Photo:</strong> {item.customization.uploadedFileName}</p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Delivery & Financial Details Footer */}
                        <div className="pt-4 border-t border-sky-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Shipping & Delivery Address
                            </span>
                            <p className="font-medium text-slate-800">{ord.customer.addressLine}, {ord.customer.city} ({ord.customer.pincode})</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Slot: {ord.customer.deliveryTimeSlot || 'Standard Delivery'}</p>
                          </div>

                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                              Internal Admin Notes
                            </span>
                            {editingNotesOrderId === ord.orderId ? (
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={notesInput}
                                  onChange={(e) => setNotesInput(e.target.value)}
                                  placeholder="e.g. Gift wrap added, customer called"
                                  className="w-full text-xs p-1.5 border border-sky-200 rounded-lg focus:outline-none"
                                />
                                <button
                                  onClick={() => {
                                    updateOrderStatus(ord.orderId, ord.orderStatus, notesInput);
                                    setEditingNotesOrderId(null);
                                  }}
                                  className="p-1.5 bg-sky-500 text-white rounded-lg"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setEditingNotesOrderId(ord.orderId);
                                  setNotesInput(ord.adminNotes || '');
                                }}
                                className="cursor-pointer text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 hover:border-sky-300"
                              >
                                {ord.adminNotes || <span className="italic text-slate-400">+ Add internal note...</span>}
                              </div>
                            )}
                          </div>

                          <div className="bg-sky-50/60 p-3 rounded-2xl border border-sky-100 space-y-1 text-right">
                            <div className="flex justify-between">
                              <span>Grand Total:</span>
                              <strong className="text-slate-900">₹{ord.grandTotal}</strong>
                            </div>
                            <div className="flex justify-between text-slate-500">
                              <span>Total Cost (COGS):</span>
                              <span>₹{totalCogs}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-500">
                              <span>Extra Expenses:</span>
                              {expenseOrderId === ord.orderId ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    placeholder="₹"
                                    value={expenseAmountInput}
                                    onChange={(e) => setExpenseAmountInput(e.target.value)}
                                    className="w-16 p-1 text-xs border rounded"
                                  />
                                  <button
                                    onClick={() => {
                                      if (Number(expenseAmountInput) > 0) {
                                        addOrderExpense(ord.orderId, Number(expenseAmountInput));
                                      }
                                      setExpenseOrderId(null);
                                      setExpenseAmountInput('');
                                    }}
                                    className="px-1.5 py-0.5 bg-sky-500 text-white rounded text-[10px]"
                                  >
                                    Add
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setExpenseOrderId(ord.orderId)}
                                  className="text-sky-600 hover:underline"
                                >
                                  ₹{ord.directExpenses || 0} (+Add)
                                </button>
                              )}
                            </div>
                            <div className="pt-1 border-t border-sky-200 flex justify-between font-bold text-emerald-700">
                              <span>Order Profit:</span>
                              <span>₹{orderProfit}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SALES REPORTING WITH BAR GRAPHS */}
        {/* ========================================================= */}
        {activeTab === 'sales' && (
          <div className="space-y-6">
            {/* Time Filter Controls */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Sales Analytics &amp; Volume</h2>
                <p className="text-xs text-slate-500">Category-wise performance &amp; top selling gift items</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimeFilter[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeFilter(tf)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      timeFilter === tf ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Metrics cards for period */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Filtered Sales Revenue</span>
                <p className="text-3xl font-black text-slate-900 mt-1">₹{reportMetrics.revenue.toLocaleString('en-IN')}</p>
                <span className="text-xs text-sky-600 font-semibold">{reportMetrics.ordersCount} orders in this period</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Average Order Value (AOV)</span>
                <p className="text-3xl font-black text-sky-600 mt-1">
                  ₹{reportMetrics.ordersCount > 0 ? Math.round(reportMetrics.revenue / reportMetrics.ordersCount) : 0}
                </p>
                <span className="text-xs text-slate-500">Per checkout cart</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Units Sold</span>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {Object.values(reportMetrics.categoryStats).reduce((acc, c) => acc + c.units, 0)}
                </p>
                <span className="text-xs text-slate-500">Across all 8 categories</span>
              </div>
            </div>

            {/* Responsive Category Sales Bar Graph */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Category-wise Sales Volume (₹ Revenue)</h3>
                <span className="text-xs text-slate-400">Interactive Bar Graph</span>
              </div>

              {/* Bar Graph visualization */}
              <div className="space-y-3 pt-2">
                {CATEGORIES_LIST.map((cat) => {
                  const stat = reportMetrics.categoryStats[cat.name] || { units: 0, revenue: 0 };
                  const maxRev = Math.max(...Object.values(reportMetrics.categoryStats).map(c => c.revenue), 1000);
                  const percentage = Math.round((stat.revenue / maxRev) * 100);

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{cat.name}</span>
                        <div className="flex gap-3 text-slate-600">
                          <span>{stat.units} units</span>
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

            {/* Top Products Table */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Top Selling Products in Selected Period</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Units Sold</th>
                      <th className="p-3">Sales Generated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50 text-slate-700">
                    {reportMetrics.topProducts.map((p, idx) => (
                      <tr key={idx} className="hover:bg-sky-50/40">
                        <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                        <td className="p-3 text-sky-700 font-medium">{p.category}</td>
                        <td className="p-3 font-bold">{p.units}</td>
                        <td className="p-3 font-bold text-slate-900">₹{p.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PRODUCTS CATALOG MANAGEMENT (CRUD) */}
        {/* ========================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Product Database &amp; Pricing Control</h2>
                <p className="text-xs text-slate-500">
                  Update customer prices, set hidden cost prices, and instantly sync customer catalog.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Reset catalog to the default GIFTORIA curated product set?')) {
                      resetProductsToDefault();
                    }
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset to Default
                </button>
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
                      <th className="p-3.5">Selling Price</th>
                      <th className="p-3.5">Cost Price (Internal)</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50 text-slate-700">
                    {products.map((prod) => {
                      const cost = prod.costPrice || Math.round(prod.price * 0.5);
                      const marginPct = prod.price > 0 ? Math.round(((prod.price - cost) / prod.price) * 100) : 0;
                      const isActive = prod.isActive !== false;

                      return (
                        <tr key={prod.id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="p-3.5">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.thumbnail || prod.images[0]}
                                alt={prod.name}
                                className="w-10 h-10 rounded-xl object-cover bg-sky-50 border border-sky-100"
                              />
                              <div>
                                <span className="font-bold text-slate-900 block truncate max-w-xs">{prod.name}</span>
                                <span className="text-[10px] text-slate-400">ID: {prod.id}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 font-semibold text-sky-700">{prod.category}</td>
                          <td className="p-3.5 font-black text-slate-900">₹{prod.price}</td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-700">₹{cost}</span>
                            <span className="text-[10px] text-emerald-600 block">({marginPct}% margin)</span>
                          </td>
                          <td className="p-3.5 font-bold">{prod.stock}</td>
                          <td className="p-3.5">
                            <button
                              onClick={() => {
                                updateProduct(prod.id, { isActive: !isActive });
                                showToast(`Product ${isActive ? 'deactivated' : 'activated'}`, 'info');
                              }}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                                isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isActive ? 'Active' : 'Inactive'}
                            </button>
                          </td>
                          <td className="p-3.5 text-right space-x-1">
                            <button
                              onClick={() => setEditingProduct(prod)}
                              className="p-1.5 text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${prod.name}" from catalog?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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

        {/* ========================================================= */}
        {/* TAB 5: PROFIT CALCULATIONS */}
        {/* ========================================================= */}
        {activeTab === 'profits' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Comprehensive Profit Formula &amp; Analysis</h2>
                <p className="text-xs text-slate-500">
                  Formula: <code className="font-mono bg-sky-50 text-sky-800 px-2 py-0.5 rounded text-[11px]">PROFIT = (SELLING - COST) × QTY - EXPENSES</code>
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
                {(['daily', 'weekly', 'monthly', 'yearly'] as TimeFilter[]).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeFilter(tf)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                      timeFilter === tf ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Gross Sales</span>
                <p className="text-2xl font-black text-slate-900 mt-1">₹{reportMetrics.revenue.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">Total customer revenue</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cost of Goods (COGS)</span>
                <p className="text-2xl font-black text-rose-600 mt-1">₹{reportMetrics.cogs.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">Direct material/item cost</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Direct Order Expenses</span>
                <p className="text-2xl font-black text-amber-600 mt-1">₹{reportMetrics.expenses.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-slate-500">Packaging, transit &amp; runners</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-sky-100 shadow-xs bg-gradient-to-br from-emerald-50 to-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Net Profit</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">₹{reportMetrics.netProfit.toLocaleString('en-IN')}</p>
                <span className="text-[11px] text-emerald-800 font-bold">{reportMetrics.profitMargin.toFixed(1)}% Net Margin</span>
              </div>
            </div>

            {/* Category Profit Distribution Bar Graph */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">Profit Breakdown by Category</h3>
              
              <div className="space-y-3 pt-2">
                {CATEGORIES_LIST.map((cat) => {
                  const stat = reportMetrics.categoryStats[cat.name] || { units: 0, revenue: 0, cost: 0 };
                  const profit = stat.revenue - stat.cost;
                  const maxProfit = Math.max(...Object.values(reportMetrics.categoryStats).map(c => c.revenue - c.cost), 500);
                  const percentage = Math.round((profit / maxProfit) * 100);

                  return (
                    <div key={cat.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-800">{cat.name}</span>
                        <div className="flex gap-4 text-slate-600">
                          <span>Rev: ₹{stat.revenue}</span>
                          <span>Cost: ₹{stat.cost}</span>
                          <strong className="text-emerald-700 font-bold">Profit: ₹{profit}</strong>
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full transition-all duration-700"
                          style={{ width: `${Math.max(percentage, profit > 0 ? 5 : 0)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: DELIVERY & LOGISTICS TRACKING */}
        {/* ========================================================= */}
        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs">
              <h2 className="text-base font-bold text-slate-900">Logistics &amp; Courier Tracking Console</h2>
              <p className="text-xs text-slate-500">
                Manage tracking IDs, courier partners, and synchronize delivery statuses across Maharashtra.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden">
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sky-50 text-slate-700">
                    {orders.map((ord) => {
                      const delivery = ord.deliveryRecord || {
                        deliveryStatus: ord.orderStatus === 'DELIVERED' ? 'Delivered' : ord.orderStatus === 'SHIPPED' ? 'Dispatched' : 'Not Dispatched',
                        courierPartner: 'Delhivery',
                        trackingId: '',
                        trackingUrl: '',
                      };

                      return (
                        <tr key={ord.orderId} className="hover:bg-sky-50/40">
                          <td className="p-3.5 font-mono font-bold text-sky-600">{ord.orderId}</td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-900 block">{ord.customer.fullName}</span>
                            <span className="text-[10px] text-slate-400">{ord.customer.mobile}</span>
                          </td>
                          <td className="p-3.5">
                            <span className="block truncate max-w-xs">{ord.customer.addressLine}, {ord.customer.city}</span>
                            <span className="text-[10px] font-bold text-sky-700">PIN: {ord.customer.pincode}</span>
                          </td>
                          <td className="p-3.5">
                            <input
                              type="text"
                              defaultValue={delivery.courierPartner || 'Delhivery'}
                              onBlur={(e) => updateDeliveryInfo(ord.orderId, { courierPartner: e.target.value })}
                              className="px-2 py-1 bg-slate-50 border border-sky-100 rounded-lg text-xs w-28 focus:outline-none focus:border-sky-500"
                            />
                          </td>
                          <td className="p-3.5">
                            <input
                              type="text"
                              defaultValue={delivery.trackingId || ''}
                              placeholder="e.g. DLV983712"
                              onBlur={(e) => updateDeliveryInfo(ord.orderId, { trackingId: e.target.value })}
                              className="px-2 py-1 bg-slate-50 border border-sky-100 rounded-lg text-xs w-32 focus:outline-none focus:border-sky-500 font-mono"
                            />
                          </td>
                          <td className="p-3.5">
                            <select
                              value={delivery.deliveryStatus}
                              onChange={(e) => updateDeliveryInfo(ord.orderId, { deliveryStatus: e.target.value as DeliveryStatus })}
                              className="px-2 py-1 bg-slate-50 border border-sky-100 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer"
                            >
                              {DELIVERY_STATUSES.map((ds: DeliveryStatus) => (
                                <option key={ds} value={ds}>
                                  {ds}
                                </option>
                              ))}
                            </select>
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

        {/* ========================================================= */}
        {/* TAB 7: SETTINGS & POLICIES */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">GIFTORIA Business Configuration</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                  <span className="font-bold text-slate-800 block">WhatsApp Customer Concierge:</span>
                  <p className="font-mono text-sky-700 font-bold">+91 83568 29605</p>
                  <p className="text-[11px] text-slate-500">All customer inquiries &amp; customization photos route here.</p>
                </div>

                <div className="p-3 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                  <span className="font-bold text-slate-800 block">Delivery Region:</span>
                  <p className="text-slate-700">All valid 6-digit PIN codes across Maharashtra (Mumbai, Pune, Nagpur, Nashik, etc.)</p>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 text-emerald-900">
                  <span className="font-bold block">Strict Price Privacy Rule:</span>
                  <p className="text-[11px]">
                    Customer prices are deliberately hidden across the public catalog. Quotes are exclusively generated via WhatsApp consultation for maximum customization value.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Master Console PIN &amp; Data</h3>
              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">Current Admin PIN:</span>
                  <code className="font-mono text-sky-700 font-bold text-sm">giftoria2026</code>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Clear all sample data and restart fresh?')) {
                      localStorage.removeItem('giftoria_orders_records_v2');
                      window.location.reload();
                    }
                  }}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-2xl text-xs transition-colors border border-rose-200"
                >
                  Reset Local Storage Records
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================= */}
      {/* MODAL: ADD NEW PRODUCT */}
      {/* ========================================================= */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sky-100 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-base">Add Product to GIFTORIA Catalog</h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Customized Couple Lithophane Lamp"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-semibold cursor-pointer"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    min={1}
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost Price (₹ Internal) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={newProd.costPrice}
                    onChange={(e) => setNewProd({ ...newProd, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-bold text-sky-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProd.thumbnail}
                  onChange={(e) => setNewProd({ ...newProd, thumbnail: e.target.value })}
                  className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 text-[11px]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Description</label>
                <textarea
                  rows={2}
                  placeholder="Short details, materials, dimension..."
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="customizableCheck"
                  checked={newProd.customizable}
                  onChange={(e) => setNewProd({ ...newProd, customizable: e.target.checked })}
                  className="rounded text-sky-500 focus:ring-sky-400"
                />
                <label htmlFor="customizableCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Allows custom photo upload / text engraving
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Save to Catalog
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT PRODUCT */}
      {/* ========================================================= */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sky-100 max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-base">Edit Product #{editingProduct.id}</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-semibold cursor-pointer"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cost Price (₹ Internal)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.costPrice || Math.round(editingProduct.price * 0.5)}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 font-bold text-sky-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Thumbnail Image URL</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full p-2.5 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 text-[11px]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={editingProduct.isActive !== false}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                  className="rounded text-sky-500 focus:ring-sky-400"
                />
                <label htmlFor="activeCheck" className="font-semibold text-slate-700 cursor-pointer">
                  Active in Customer Catalog
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
