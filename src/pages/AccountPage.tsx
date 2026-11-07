import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Edit3, 
  Plus, 
  Trash2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { validateMaharashtraPincode } from '../utils/pincodeUtils';
import { UserAddress } from '../types';

export const AccountPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    user, 
    isAuthenticated, 
    login, 
    signup, 
    logout, 
    updateProfile, 
    saveAddress, 
    deleteAddress, 
    setDefaultAddress 
  } = useAuth();
  const { orders } = useOrder();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  // Check URL params for redirect
  const queryParams = new URLSearchParams(window.location.search);
  const redirectTarget = queryParams.get('redirect') || '';

  // Auth Form State (For Guest View)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Address Modal/Form State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrFullName, setAddrFullName] = useState('');
  const [addrMobile, setAddrMobile] = useState('');
  const [addrHouse, setAddrHouse] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrLandmark, setAddrLandmark] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState] = useState('Maharashtra');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);
  const [addrError, setAddrError] = useState('');

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
    }
  }, [user]);

  // Handle Login / Registration Submit
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);

    if (authMode === 'login') {
      const result = await login(authEmail, authPassword);
      setIsSubmitting(false);
      if (!result.success) {
        setAuthError(result.message || 'Login failed. Please check credentials.');
        return;
      }
    } else {
      if (!authName.trim()) {
        setIsSubmitting(false);
        setAuthError('Please enter your full name.');
        return;
      }
      if (!authPhone.trim() || authPhone.replace(/\D/g, '').length < 10) {
        setIsSubmitting(false);
        setAuthError('Please enter a valid 10-digit mobile number.');
        return;
      }

      const result = await signup({
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword,
        phone: authPhone.trim(),
      });
      setIsSubmitting(false);

      if (!result.success) {
        setAuthError(result.message || 'Registration failed.');
        return;
      }
    }

    // If redirected from checkout, navigate back to complete purchase
    if (redirectTarget) {
      setLocation(redirectTarget);
    }
  };

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }
    if (!editPhone.trim() || editPhone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    updateProfile({ name: editName, phone: editPhone });
    setIsEditingProfile(false);
  };

  // Open Address Modal for New Address
  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddrFullName(user?.name || '');
    setAddrMobile(user?.phone || '');
    setAddrHouse('');
    setAddrStreet('');
    setAddrLandmark('');
    setAddrCity('Mumbai');
    setAddrPincode('');
    setAddrIsDefault((user?.savedAddresses.length || 0) === 0);
    setAddrError('');
    setIsAddressModalOpen(true);
  };

  // Open Address Modal for Editing
  const handleOpenEditAddress = (addr: UserAddress) => {
    setEditingAddressId(addr.id);
    setAddrFullName(addr.fullName);
    setAddrMobile(addr.mobile);
    setAddrHouse(addr.houseBuilding);
    setAddrStreet(addr.streetArea);
    setAddrLandmark(addr.landmark || '');
    setAddrCity(addr.city);
    setAddrPincode(addr.pincode);
    setAddrIsDefault(!!addr.isDefault);
    setAddrError('');
    setIsAddressModalOpen(true);
  };

  // Save Address Submit
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError('');

    if (!addrFullName.trim()) {
      setAddrError('Please provide the recipient full name.');
      return;
    }
    if (!addrMobile.trim() || addrMobile.replace(/\D/g, '').length < 10) {
      setAddrError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!addrHouse.trim()) {
      setAddrError('Please provide Flat/House No. and Building Name.');
      return;
    }
    if (!addrStreet.trim()) {
      setAddrError('Please provide Street, Area or Colony.');
      return;
    }
    if (!addrCity.trim()) {
      setAddrError('Please provide City.');
      return;
    }
    if (!addrPincode.trim() || addrPincode.trim().length !== 6 || !/^\d+$/.test(addrPincode.trim())) {
      setAddrError('Please enter a valid 6-digit PIN code.');
      return;
    }

    const pinCheck = validateMaharashtraPincode(addrPincode.trim());
    if (!pinCheck.isValid) {
      showToast(pinCheck.message, 'warning');
    }

    saveAddress(
      {
        fullName: addrFullName.trim(),
        mobile: addrMobile.trim(),
        houseBuilding: addrHouse.trim(),
        streetArea: addrStreet.trim(),
        landmark: addrLandmark.trim(),
        city: addrCity.trim(),
        state: addrState,
        pincode: addrPincode.trim(),
        isDefault: addrIsDefault,
      },
      editingAddressId || undefined
    );

    setIsAddressModalOpen(false);
  };

  // =========================================================================
  // GUEST STATE (NOT LOGGED IN) — BLANK STATE, NO HARDCODED NAMES OR DEMO
  // =========================================================================
  if (!isAuthenticated || !user) {
    return (
      <div className="bg-[#F8FCFF] min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-10 shadow-xs max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 border border-sky-100 shadow-inner">
              <User className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {authMode === 'login' ? 'Sign In to GIFTORIA' : 'Create Customer Account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {redirectTarget 
                ? 'Please sign in or create an account to proceed to checkout and payment.'
                : 'Manage your saved delivery addresses, track live gift orders, and personalize keepsakes.'}
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 bg-slate-50 focus:bg-white"
                  />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="youremail@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password *</label>
              <input
                type="password"
                required
                minLength={6}
                placeholder="At least 6 characters"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 bg-slate-50 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-sky-200 transition-all active:scale-95 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : authMode === 'login' ? (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-sky-100 text-center text-xs text-slate-600">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signup');
                    setAuthError('');
                  }}
                  className="text-sky-600 font-bold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setAuthError('');
                  }}
                  className="text-sky-600 font-bold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // LOGGED-IN CUSTOMER ACCOUNT PORTAL
  // =========================================================================
  const userOrders = orders.filter(
    (o) =>
      o.customer.email.toLowerCase() === user.email.toLowerCase() ||
      o.customer.mobile.replace(/\D/g, '') === user.phone.replace(/\D/g, '')
  );

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-sky-200">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  Welcome, {user.name}!
                </h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Customer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 rounded-xl text-xs font-bold text-slate-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-sky-100 pb-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Saved Delivery Addresses ({user.savedAddresses.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            My Orders ({userOrders.length})
          </button>
        </div>

        {/* Tab 1: Profile Information */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs max-w-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Personal Contact Details
              </h3>
              {!isEditingProfile && (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:text-sky-700"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-sky-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-sky-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Email Address (Registered)</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Account email is permanent for order history integrity.
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Full Name
                  </span>
                  <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{user.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Contact Mobile
                  </span>
                  <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{user.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                    Registered Email
                  </span>
                  <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{user.email}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Delivery Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Delivery Addresses</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage addresses for quick one-click selection at checkout.
                </p>
              </div>
              <button
                onClick={handleOpenAddAddress}
                className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Address</span>
              </button>
            </div>

            {/* Address List */}
            {user.savedAddresses.length === 0 ? (
              <div className="bg-white rounded-3xl border border-sky-100 p-8 text-center max-w-md mx-auto">
                <MapPin className="w-10 h-10 text-sky-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm">No Saved Addresses</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Add your primary delivery address so you can checkout smoothly.
                </p>
                <button
                  onClick={handleOpenAddAddress}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs"
                >
                  Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`bg-white rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-sky-500 shadow-sm'
                        : 'border-slate-200 hover:border-sky-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-sky-500" />
                          <span className="font-bold text-slate-900 text-sm">{addr.fullName}</span>
                        </div>
                        {addr.isDefault && (
                          <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Default Address
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {addr.houseBuilding}, {addr.streetArea}
                        {addr.landmark ? `, Near ${addr.landmark}` : ''}
                        <br />
                        {addr.city}, {addr.state} — <strong className="font-mono">{addr.pincode}</strong>
                      </p>
                      <p className="text-xs text-slate-500 mt-2">
                        Mobile: <strong>+91 {addr.mobile}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 text-xs">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOpenEditAddress(addr)}
                          className="font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>

                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-slate-500 hover:text-sky-600"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Crucial Note about Order Snapshot Integrity */}
            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl text-[11px] text-sky-800 leading-relaxed">
              <strong>Delivery Policy Notice:</strong> Updating your saved account addresses updates the default address for future orders. Previously confirmed or paid orders permanently retain the exact delivery address captured at the time of purchase.
            </div>
          </div>
        )}

        {/* Tab 3: My Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {userOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs max-w-md mx-auto">
                <Package className="w-12 h-12 text-sky-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">No Orders Placed Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Browse personalized mugs, 3D statues, and handcrafted keepsakes to make someone smile.
                </p>
                <Link
                  href="/products"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl text-xs inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              userOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-sky-600 font-mono">#{order.orderId}</span>
                      <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1">
                      Recipient: <strong>{order.customer.fullName}</strong> • Delivery: {order.customer.addressLine}, {order.customer.city}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {order.items.length} items • Total: ₹{order.grandTotal.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <Link
                    href={`/order-confirmation/${order.orderId}`}
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 border border-sky-200 px-3.5 py-1.5 rounded-xl hover:bg-sky-50 transition-colors"
                  >
                    View Order Details →
                  </Link>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Address Add / Edit Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {addrError && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                {addrError}
              </div>
            )}

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={addrFullName}
                    onChange={(e) => setAddrFullName(e.target.value)}
                    placeholder="e.g. Rahul Patil"
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addrMobile}
                    onChange={(e) => setAddrMobile(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Flat, House No., Building Name *
                </label>
                <input
                  type="text"
                  required
                  value={addrHouse}
                  onChange={(e) => setAddrHouse(e.target.value)}
                  placeholder="e.g. Flat 302, Sai Residency"
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Street, Area, Colony *
                </label>
                <input
                  type="text"
                  required
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="e.g. MG Road, Near Shivaji Park"
                  className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={addrLandmark}
                    onChange={(e) => setAddrLandmark(e.target.value)}
                    placeholder="Near temple/bank"
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    placeholder="City"
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full p-2.5 bg-slate-50 border border-sky-100 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="addrDefault"
                  checked={addrIsDefault}
                  onChange={(e) => setAddrIsDefault(e.target.checked)}
                  className="rounded text-sky-500 focus:ring-sky-400"
                />
                <label htmlFor="addrDefault" className="text-slate-600 font-medium cursor-pointer">
                  Set as default delivery address for future orders
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-sky-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
