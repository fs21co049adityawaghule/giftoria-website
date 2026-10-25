import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Bell, 
  Edit3, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { businessConfig } from '../config/businessConfig';

export const AccountPage: React.FC = () => {
  const { orders } = useOrder();
  const { showToast } = useToast();

  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses'>('profile');

  // Login form state
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');

  // Demo user data
  const [profile, setProfile] = useState({
    name: 'Aditya Sharma',
    email: 'aditya.sharma@example.com',
    phone: '+91 98765 43210',
    savedAddress: 'Flat 402, Blue Mist Enclave, Bandra West, Mumbai, Maharashtra 400050'
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.includes('@') || authPassword.length < 6) {
      showToast('Please enter a valid email and minimum 6-character password.', 'error');
      return;
    }
    if (authMode === 'signup' && authName.trim()) {
      setProfile(prev => ({ ...prev, name: authName, email: authEmail }));
    }
    setIsLoggedIn(true);
    showToast(`Welcome back, ${profile.name}! (Demo Login)`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast('Logged out of demo session.', 'info');
  };

  if (!isLoggedIn) {
    return (
      <div className="bg-[#F8FCFF] min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-10 shadow-sm max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              {authMode === 'login' ? 'Sign In to SkyGift' : 'Create SkyGift Account'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Track delivery status, save recipient addresses & view order history
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aditya Sharma"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-xs shadow-md shadow-sky-200 transition-all active:scale-95"
            >
              {authMode === 'login' ? 'Sign In (Demo)' : 'Sign Up (Demo)'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-sky-100 text-center text-xs text-slate-600">
            {authMode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button
                  onClick={() => setAuthMode('signup')}
                  className="text-sky-600 font-bold hover:underline"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-sky-600 font-bold hover:underline"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 p-2 bg-sky-50 rounded-lg text-[10px] text-sky-800 text-center">
            * Demo Mode: Authentication state is stored locally for demonstration purposes.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Profile Welcome */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-sky-200">
              {profile.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{profile.name}</h1>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{profile.email} • {profile.phone}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
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
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'addresses'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-sky-50'
            }`}
          >
            Saved Delivery Addresses
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs max-w-2xl space-y-4">
            <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-sky-100">
              Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Full Name
                </span>
                <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{profile.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Contact Mobile
                </span>
                <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{profile.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Registered Email
                </span>
                <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{profile.email}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[10px]">
                  Default Delivery Location
                </span>
                <span className="text-slate-800 font-semibold text-sm mt-0.5 block">{profile.savedAddress}</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs max-w-md mx-auto">
                <Package className="w-12 h-12 text-sky-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-800 text-base">No Orders Yet</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Place an order for bouquets, cakes or personalized hampers to track them live.
                </p>
                <Link
                  href="/products"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-4 py-2 rounded-xl text-xs inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-sky-600 font-mono">#{order.orderId}</span>
                      <span className="bg-sky-50 text-sky-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Recipient: <strong>{order.customer.fullName}</strong> • Scheduled for {order.customer.deliveryDate || 'Today'}
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

        {/* Tab 3: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl border-2 border-sky-400 p-5 shadow-xs relative">
              <span className="absolute top-3 right-3 text-[10px] bg-sky-500 text-white px-2 py-0.5 rounded-full font-bold">
                Default
              </span>
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
                <MapPin className="w-4 h-4 text-sky-500" />
                Home Address
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {profile.savedAddress}
              </p>
              <p className="text-xs text-slate-500 mt-2">Mobile: {profile.phone}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
