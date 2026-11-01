import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { 
  Product, 
  ProductCategory, 
  OrderStatus, 
  PaymentStatus, 
  ORDER_STATUSES, 
  DELIVERY_STATUSES 
} from '../types';
import { CATEGORIES_LIST } from '../data/products';
import { businessConfig } from '../config/businessConfig';
import { 
  ShieldCheck, 
  Package, 
  Truck, 
  Settings, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Search, 
  Lock, 
  Unlock, 
  AlertCircle,
  Eye,
  MessageCircle,
  X,
  QrCode,
  Image as ImageIcon,
  Check,
  Save
} from 'lucide-react';

type AdminTab = 'verification' | 'orders' | 'products' | 'delivery' | 'settings';

export const AdminDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useAdmin();
  const { 
    orders, 
    adminVerifyPayment, 
    adminRejectPayment, 
    updateOrderStatus, 
    updateDeliveryInfo 
  } = useOrder();
  const { showToast } = useToast();

  // Authentication PIN Gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('giftoria_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab: Default to 'verification' per Section 4 & 6
  const [activeTab, setActiveTab] = useState<AdminTab>('verification');

  // Search & Filter State for Payment Verification
  const [verificationSearch, setVerificationSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');

  // Modal State for Viewing Payment Screenshot
  const [viewingScreenshotOrder, setViewingScreenshotOrder] = useState<{
    orderId: string;
    customerName: string;
    screenshotUrl?: string;
    screenshotName?: string;
    submittedAt?: string;
  } | null>(null);

  // Modal State for Rejecting Payment
  const [rejectingOrder, setRejectingOrder] = useState<{
    orderId: string;
    customerName: string;
  } | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('Transaction reference not found in bank account.');

  // Orders Tab filters & state
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [editingNotesOrderId, setEditingNotesOrderId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState('');

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
      setPinError('Invalid security PIN. Please enter authorized admin PIN.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('giftoria_admin_auth');
    setIsAuthenticated(false);
    setPinInput('');
    showToast('Logged out of admin panel', 'info');
  };

  // Payment submissions list
  const filteredSubmissions = useMemo(() => {
    return orders.filter((ord) => {
      const q = verificationSearch.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        ord.orderId.toLowerCase().includes(q) ||
        ord.customer.fullName.toLowerCase().includes(q) ||
        ord.customer.mobile.includes(q) ||
        (ord.customer.email && ord.customer.email.toLowerCase().includes(q)) ||
        (ord.upiId && ord.upiId.toLowerCase().includes(q));

      let matchesFilter = true;
      if (verificationFilter === 'pending') {
        matchesFilter = ord.paymentStatus === 'PAYMENT VERIFICATION PENDING' || ord.paymentStatus === 'pending';
      } else if (verificationFilter === 'verified') {
        matchesFilter = ord.paymentStatus === 'PAYMENT VERIFIED' || ord.paymentStatus === 'paid';
      } else if (verificationFilter === 'rejected') {
        matchesFilter = ord.paymentStatus === 'PAYMENT REJECTED' || ord.paymentStatus === 'failed';
      }

      return matchesSearch && matchesFilter;
    });
  }, [orders, verificationSearch, verificationFilter]);

  const pendingPaymentsCount = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'PAYMENT VERIFICATION PENDING' || o.paymentStatus === 'pending').length;
  }, [orders]);

  const verifiedPaymentsCount = useMemo(() => {
    return orders.filter(o => o.paymentStatus === 'PAYMENT VERIFIED' || o.paymentStatus === 'paid').length;
  }, [orders]);

  // Handle Add Product Submission
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name.trim() || newProd.price <= 0) {
      showToast('Please enter a valid product name and price', 'error');
      return;
    }

    const slug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const productPayload: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: newProd.name.trim(),
      slug: `${slug}-${Math.floor(100 + Math.random() * 900)}`,
      category: newProd.category,
      description: newProd.description || `Handcrafted ${newProd.name} by GIFTORIA.`,
      price: Number(newProd.price),
      costPrice: Number(newProd.costPrice),
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
  };

  // If not authenticated, render PIN lock gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#F8FCFF]">
        <div className="bg-white rounded-3xl border border-sky-100 shadow-xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">Secure Access</span>
            <h1 className="text-2xl font-black text-slate-900 mt-1">GIFTORIA Owner Console</h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter authorized PIN to verify customer payments and manage products.
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
                className="w-full text-center text-lg tracking-widest bg-slate-50 border-2 border-sky-100 focus:border-sky-500 rounded-2xl py-3 px-4 focus:outline-none font-mono"
              />
              {pinError && <p className="text-xs text-rose-500 font-semibold mt-2">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-sky-200 transition-all text-sm active:scale-98"
            >
              Authenticate &amp; Enter
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Authorized admin PIN: <span className="font-mono text-slate-600">8356829605</span> or <span className="font-mono text-slate-600">giftoria2026</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

        {/* Top Header Bar */}
        <div className="bg-white rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-sky-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">GIFTORIA Admin Control Center</h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  Live Admin
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

        {/* Navigation Tabs (Per Section 4 & 6: Report sections removed; Verification is independent) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { 
              id: 'verification', 
              label: 'PAYMENT VERIFICATION', 
              icon: ShieldCheck,
              badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined
            },
            { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
            { id: 'products', label: `Products (${products.length})`, icon: QrCode },
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
        {/* TAB 1: PAYMENT VERIFICATION (PRIMARY CONSOLE) */}
        {/* ========================================================================= */}
        {activeTab === 'verification' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl border border-sky-100 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-sky-50">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Manual UPI Payment Submissions</h2>
                  <p className="text-xs text-slate-500">
                    Review uploaded payment screenshots, verify UPI transactions, and confirm customer orders.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setVerificationFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      verificationFilter === 'all'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    All Submissions ({orders.length})
                  </button>
                  <button
                    onClick={() => setVerificationFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      verificationFilter === 'pending'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Pending ({pendingPaymentsCount})
                  </button>
                  <button
                    onClick={() => setVerificationFilter('verified')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      verificationFilter === 'verified'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified ({verifiedPaymentsCount})
                  </button>
                  <button
                    onClick={() => setVerificationFilter('rejected')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      verificationFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    Rejected ({orders.filter(o => o.paymentStatus === 'PAYMENT REJECTED' || o.paymentStatus === 'failed').length})
                  </button>
                </div>
              </div>

              {/* Search input */}
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Phone, Email..."
                  value={verificationSearch}
                  onChange={(e) => setVerificationSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.length === 0 ? (
                <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center text-slate-400 space-y-2">
                  <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold">No payment submissions match the selected filter.</p>
                </div>
              ) : (
                filteredSubmissions.map((ord) => {
                  const isPending = ord.paymentStatus === 'PAYMENT VERIFICATION PENDING' || ord.paymentStatus === 'pending';
                  const isVerified = ord.paymentStatus === 'PAYMENT VERIFIED' || ord.paymentStatus === 'paid';
                  const isRejected = ord.paymentStatus === 'PAYMENT REJECTED' || ord.paymentStatus === 'failed';

                  const itemsList = (ord.itemSnapshots && ord.itemSnapshots.length > 0)
                    ? ord.itemSnapshots
                    : ord.items.map(i => ({
                        productName: i.product.name,
                        category: i.product.category,
                        quantity: i.quantity,
                        sellingPriceSnapshot: i.product.price,
                        thumbnail: i.product.thumbnail,
                        customization: i.customization
                      }));

                  return (
                    <div 
                      key={ord.orderId}
                      className="bg-white rounded-3xl border border-sky-100 shadow-xs overflow-hidden hover:border-sky-300 transition-all"
                    >
                      {/* Top Bar with Order ID & Status */}
                      <div className="bg-slate-50/70 p-4 sm:p-5 border-b border-sky-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                              #{ord.orderId}
                            </span>

                            {/* Status badge */}
                            {isVerified ? (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                <span>PAYMENT VERIFIED</span>
                              </span>
                            ) : isRejected ? (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>PAYMENT REJECTED</span>
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>PAYMENT VERIFICATION PENDING</span>
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400 font-medium">
                              📅 Submitted: {new Date(ord.paymentSubmittedAt || ord.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-600 pt-1 flex-wrap">
                            <span className="font-bold text-slate-900">{ord.customer.fullName}</span>
                            <span>•</span>
                            <span>📞 {ord.customer.mobile}</span>
                            {ord.customer.email && (
                              <>
                                <span>•</span>
                                <span>✉️ {ord.customer.email}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Top Right Controls & Actions */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* View Screenshot Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setViewingScreenshotOrder({
                                orderId: ord.orderId,
                                customerName: ord.customer.fullName,
                                screenshotUrl: ord.paymentScreenshot,
                                screenshotName: ord.paymentScreenshotName,
                                submittedAt: ord.paymentSubmittedAt || ord.createdAt
                              });
                            }}
                            className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-sky-600" />
                            <span>VIEW SCREENSHOT</span>
                          </button>

                          {/* Admin Verification Actions (if pending) */}
                          {isPending && (
                            <>
                              <button
                                type="button"
                                onClick={() => adminVerifyPayment(ord.orderId)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>VERIFY PAYMENT</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setRejectingOrder({
                                    orderId: ord.orderId,
                                    customerName: ord.customer.fullName
                                  });
                                }}
                                className="px-3.5 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>REJECT PAYMENT</span>
                              </button>
                            </>
                          )}

                          {/* WhatsApp Customer Connection */}
                          <a
                            href={`https://wa.me/91${ord.customer.mobile.replace(/\D/g, '')}?text=${encodeURIComponent(
                              `Hello ${ord.customer.fullName}! Update from GIFTORIA regarding Order #${ord.orderId}: Your payment status is currently "${ord.paymentStatus}".`
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

                      {/* Payment & Products Body */}
                      <div className="p-4 sm:p-5 space-y-4">
                        {/* Financial summary bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Amount</span>
                            <span className="text-base font-extrabold text-emerald-700">₹{ord.grandTotal}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">UPI ID</span>
                            <span className="font-mono font-semibold text-slate-800 text-[11px] truncate block">
                              {ord.upiId || businessConfig.upiId}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Order Status</span>
                            <span className="font-bold text-sky-700">{ord.orderStatus}</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase block">Verification Time</span>
                            <span className="text-slate-600 text-[11px] block">
                              {ord.paymentVerifiedAt ? new Date(ord.paymentVerifiedAt).toLocaleString('en-IN') : 'Pending Verification'}
                            </span>
                          </div>
                        </div>

                        {/* Rejection reason notice if rejected */}
                        {isRejected && ord.rejectionReason && (
                          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block">Rejection Reason recorded for customer:</strong>
                              <p className="mt-0.5">{ord.rejectionReason}</p>
                            </div>
                          </div>
                        )}

                        {/* Ordered Products block */}
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                            Ordered Products ({itemsList.length} items)
                          </span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {itemsList.map((item, idx) => (
                              <div key={idx} className="p-3 bg-sky-50/30 border border-sky-100 rounded-2xl flex items-start gap-3 text-xs">
                                <img
                                  src={item.thumbnail || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'}
                                  alt={item.productName}
                                  className="w-12 h-12 rounded-xl object-cover bg-white border border-sky-200 shrink-0"
                                />
                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <span className="text-[10px] font-bold text-sky-600 uppercase block">{item.category}</span>
                                  <h4 className="font-bold text-slate-900 truncate">{item.productName}</h4>
                                  <p className="text-slate-500 text-[11px]">Qty: {item.quantity} × ₹{item.sellingPriceSnapshot}</p>
                                  {item.customization && (
                                    <p className="text-[10px] text-slate-600 bg-white p-1 rounded border border-slate-100">
                                      {item.customization.recipientName || item.customization.customMessage || item.customization.uploadedFileName}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
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

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Order ID, Customer, Phone..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-100 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] font-bold text-slate-400 shrink-0">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-sky-100 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  {ORDER_STATUSES.map((st: OrderStatus) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {orders
                .filter((ord) => {
                  const q = orderSearchQuery.toLowerCase();
                  const matchesSearch =
                    q === '' ||
                    ord.orderId.toLowerCase().includes(q) ||
                    ord.customer.fullName.toLowerCase().includes(q) ||
                    ord.customer.mobile.includes(q);
                  const matchesStatus = orderStatusFilter === 'all' || ord.orderStatus === orderStatusFilter;
                  return matchesSearch && matchesStatus;
                })
                .map((ord) => (
                  <div key={ord.orderId} className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-black text-sky-600 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200">
                          #{ord.orderId}
                        </span>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{ord.customer.fullName}</h3>
                          <span className="text-[11px] text-slate-500">📍 {ord.customer.city} • 📞 {ord.customer.mobile}</span>
                        </div>
                      </div>

                      {/* Status selector */}
                      <div className="flex items-center gap-2">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.orderId, e.target.value as OrderStatus)}
                          className="bg-slate-50 border border-sky-200 rounded-xl py-1.5 px-3 text-xs font-bold text-sky-700"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 pt-2 border-t border-sky-50 flex items-center justify-between">
                      <span>Total Amount: <strong className="text-slate-900">₹{ord.grandTotal}</strong></span>
                      <span>Payment Status: <strong className={ord.paymentStatus === 'PAYMENT VERIFIED' ? 'text-emerald-600' : 'text-amber-600'}>{ord.paymentStatus}</strong></span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Product Catalog Management</h2>
                <p className="text-xs text-slate-500">
                  Manage live prices, stock levels, and customization options for active gifting items.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="bg-white rounded-3xl border border-sky-100 p-4 shadow-xs flex flex-col justify-between space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={prod.thumbnail || prod.images?.[0]}
                      alt={prod.name}
                      className="w-16 h-16 rounded-2xl object-cover bg-sky-50 border border-sky-100 shrink-0"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-sky-600 block">{prod.category}</span>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-slate-900">₹{prod.price}</span>
                        {prod.costPrice && (
                          <span className="text-[10px] text-slate-400 font-semibold">Cost: ₹{prod.costPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-sky-50 flex items-center justify-between text-xs">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prod.isActive !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {prod.isActive !== false ? 'Active Live' : 'Hidden'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setEditingProduct(prod)}
                        className="p-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                            deleteProduct(prod.id);
                          }
                        }}
                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DELIVERY & LOGISTICS TRACKING */}
        {/* ========================================================================= */}
        {activeTab === 'delivery' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Logistics &amp; Courier Tracking</h2>
              <p className="text-xs text-slate-500">
                Manage dispatch statuses, courier partners, and tracking IDs for confirmed orders.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-sky-100">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">City &amp; PIN</th>
                    <th className="p-3">Courier</th>
                    <th className="p-3">Tracking ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50 text-slate-700">
                  {orders.map((ord) => {
                    const delivery = ord.deliveryRecord || {
                      courierPartner: 'Delhivery',
                      trackingId: ''
                    };
                    return (
                      <tr key={ord.orderId}>
                        <td className="p-3 font-mono font-bold text-sky-600">#{ord.orderId}</td>
                        <td className="p-3 font-semibold text-slate-900">{ord.customer.fullName}</td>
                        <td className="p-3">{ord.customer.city} ({ord.customer.pincode})</td>
                        <td className="p-3">
                          <input
                            type="text"
                            defaultValue={delivery.courierPartner || 'Delhivery'}
                            onBlur={(e) => updateDeliveryInfo(ord.orderId, { courierPartner: e.target.value })}
                            className="bg-slate-50 border border-sky-100 rounded-lg p-1.5 text-xs w-28"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            defaultValue={delivery.trackingId || ''}
                            placeholder="e.g. DLV983712"
                            onBlur={(e) => updateDeliveryInfo(ord.orderId, { trackingId: e.target.value })}
                            className="bg-slate-50 border border-sky-100 rounded-lg p-1.5 text-xs font-mono w-32"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SYSTEM SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">System &amp; Payment Configuration</h2>
              <p className="text-xs text-slate-500">Current active UPI and WhatsApp gateway settings</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">Primary UPI Beneficiary</span>
                <p className="text-base font-black text-slate-900">{businessConfig.upiId}</p>
                <span className="text-[11px] text-slate-500 font-sans block">Bank: Axis Bank (aditya15662-2@okaxis)</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">WhatsApp Verification Contact</span>
                <p className="text-base font-black text-emerald-700">+91 {businessConfig.rawPhone}</p>
                <span className="text-[11px] text-slate-500 font-sans block">Pre-filled dynamic verification link active on checkout.</span>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 font-mono">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-sans block">Owner Security PIN</span>
                <p className="text-base font-black text-slate-900">8356829605 / giftoria2026</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: VIEW PAYMENT SCREENSHOT LIGHTBOX */}
      {/* ========================================================================= */}
      {viewingScreenshotOrder && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setViewingScreenshotOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div>
                <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">Payment Proof</span>
                <h3 className="font-mono text-base font-black text-slate-900">
                  Order #{viewingScreenshotOrder.orderId}
                </h3>
                <p className="text-xs text-slate-500">Customer: {viewingScreenshotOrder.customerName}</p>
              </div>
              <button 
                onClick={() => setViewingScreenshotOrder(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-2 bg-slate-100 rounded-2xl flex items-center justify-center">
              {viewingScreenshotOrder.screenshotUrl ? (
                <img
                  src={viewingScreenshotOrder.screenshotUrl}
                  alt={`Payment proof for ${viewingScreenshotOrder.orderId}`}
                  className="max-h-[60vh] rounded-xl object-contain shadow-sm"
                />
              ) : (
                <div className="py-16 text-center text-slate-400">
                  <ImageIcon className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">No screenshot preview available</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setViewingScreenshotOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: REJECT PAYMENT WITH REASON */}
      {/* ========================================================================= */}
      {rejectingOrder && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setRejectingOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-rose-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">Reject Payment Submission</h3>
              </div>
              <button onClick={() => setRejectingOrder(null)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Rejecting payment for Order <strong className="font-mono text-slate-900">#{rejectingOrder.orderId}</strong> ({rejectingOrder.customerName}). Please provide a clear rejection reason to display to the customer:
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Reason for Rejection *</label>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="e.g. UTR reference not credited, screenshot blurred, amount mismatch..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-rose-500"
              />
              <div className="flex gap-1.5 flex-wrap">
                {[
                  'UTR not credited in Axis Bank',
                  'Screenshot unclear / blur',
                  'Amount mismatch',
                  'Duplicate screenshot'
                ].map((quick) => (
                  <button
                    key={quick}
                    type="button"
                    onClick={() => setRejectionReasonInput(quick)}
                    className="text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md"
                  >
                    {quick}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  adminRejectPayment(rejectingOrder.orderId, rejectionReasonInput.trim() || 'Payment details could not be verified.');
                  setRejectingOrder(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD PRODUCT MODAL */}
      {/* ========================================================================= */}
      {isAddProductModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsAddProductModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Product to Catalog</h3>
              <button onClick={() => setIsAddProductModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Personalized Wooden Keychain"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value as ProductCategory })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 font-semibold"
                  >
                    {CATEGORIES_LIST.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={newProd.costPrice}
                    onChange={(e) => setNewProd({ ...newProd, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Available Stock</label>
                  <input
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={newProd.thumbnail}
                  onChange={(e) => setNewProd({ ...newProd, thumbnail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="customizable-toggle"
                  checked={newProd.customizable}
                  onChange={(e) => setNewProd({ ...newProd, customizable: e.target.checked })}
                  className="rounded text-sky-600"
                />
                <label htmlFor="customizable-toggle" className="font-bold text-slate-700">
                  Allow Customer Photo &amp; Text Customization
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDIT PRODUCT MODAL */}
      {/* ========================================================================= */}
      {editingProduct && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setEditingProduct(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900 text-base">Edit Product: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.costPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Live Status</label>
                  <select
                    value={editingProduct.isActive !== false ? 'active' : 'inactive'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.value === 'active' })}
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingProduct.thumbnail}
                  onChange={(e) => setEditingProduct({ ...editingProduct, thumbnail: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-sm"
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
