import React from 'react';
import { Link } from 'wouter';
import { User, Package, Heart, SlidersHorizontal, ShieldCheck, MapPin } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';

export const AccountPage: React.FC = () => {
  const { orders } = useOrder();
  const { wishlistCount } = useWishlist();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Account Overview Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 shadow-sm flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-giftoria-wine-800 text-giftoria-gold-400 font-serif font-bold text-3xl flex items-center justify-center shadow-md shrink-0">
          G
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Customer Account</span>
          </div>
          <h1 className="font-serif font-bold text-2xl text-giftoria-wine-900">GIFTORIA Customer Dashboard</h1>
          <p className="text-xs text-gray-500">Manage your past custom orders, saved favorites, and store settings.</p>
        </div>
      </div>

      {/* Account Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/orders" className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-giftoria-wine-800 transition-all flex items-center gap-4 group">
          <div className="p-3 rounded-xl bg-giftoria-wine-50 text-giftoria-wine-800 group-hover:bg-giftoria-wine-800 group-hover:text-white transition-colors">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif font-bold text-xl text-giftoria-wine-900">{orders.length}</div>
            <div className="text-xs text-gray-500 font-medium">Orders Placed</div>
          </div>
        </Link>

        <Link href="/wishlist" className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-giftoria-wine-800 transition-all flex items-center gap-4 group">
          <div className="p-3 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="font-serif font-bold text-xl text-giftoria-wine-900">{wishlistCount}</div>
            <div className="text-xs text-gray-500 font-medium">Saved Favorites</div>
          </div>
        </Link>

        <Link href="/admin" className="bg-giftoria-gold-50 p-5 rounded-2xl border border-giftoria-gold-200 hover:bg-giftoria-gold-100 transition-all flex items-center gap-4 group">
          <div className="p-3 rounded-xl bg-giftoria-gold-500 text-giftoria-charcoal-900">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="font-bold text-sm text-giftoria-charcoal-900">Admin Panel</div>
            <div className="text-xs text-gray-600">Product Management</div>
          </div>
        </Link>
      </div>

      {/* Recent Orders Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="font-serif font-bold text-lg text-giftoria-wine-900">Recent Orders</h2>
          <Link href="/orders" className="text-xs font-bold text-giftoria-wine-800 hover:underline">View All ({orders.length})</Link>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.slice(0, 3).map((ord) => (
              <div key={ord.orderId} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 text-xs border border-gray-100">
                <div>
                  <div className="font-bold text-giftoria-wine-900">{ord.orderId}</div>
                  <div className="text-gray-500">{ord.items.length} item(s) • ₹{ord.grandTotal}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-[10px]">
                    {ord.orderStatus}
                  </span>
                  <div className="text-[10px] text-gray-400 mt-1">{new Date(ord.createdAt).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-gray-500">
            No orders placed yet. Explore our custom catalog to get started!
          </div>
        )}
      </div>
    </div>
  );
};
