import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Package, ArrowRight, Search, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const OrderHistoryPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { orders } = useOrder();
  const [searchOrderId, setSearchOrderId] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchOrderId.trim()) {
      const cleanId = searchOrderId.trim().replace(/^#/, '');
      setLocation(`/order-confirmation/${cleanId}`);
    }
  };

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-10 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header & Quick Tracking Search */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Track &amp; Manage</span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Customer Order Tracking
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Check live payment verification and delivery status for your celebratory gifts.
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. GFT-8492)"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="w-full bg-slate-50 border border-sky-200 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0"
            >
              Track
            </button>
          </form>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-sky-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Explore our personalized coffee mugs, 3D prints, and divine frames to place your order.
            </p>
            <Link
              href="/products"
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-1.5 shadow-sm"
            >
              Start Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPending = order.paymentStatus === 'PAYMENT VERIFICATION PENDING';
              const isVerified = order.paymentStatus === 'PAYMENT VERIFIED';
              const isRejected = order.paymentStatus === 'PAYMENT REJECTED';

              const itemCount = (order.itemSnapshots && order.itemSnapshots.length > 0)
                ? order.itemSnapshots.length
                : order.items.length;

              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-2xl border border-sky-100 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-sky-300 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-black text-sky-600 font-mono">#{order.orderId}</span>
                      
                      {isVerified ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Payment Verified</span>
                        </span>
                      ) : isRejected ? (
                        <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-rose-200 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-rose-600" />
                          <span>Payment Rejected</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Verification Pending</span>
                        </span>
                      )}

                      <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                        {order.orderStatus}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-semibold">
                      Recipient: {order.customer.fullName} ({order.customer.city})
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {itemCount} distinct gift items • Total: <strong>₹{order.grandTotal.toLocaleString('en-IN')}</strong> • Placed: {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>

                  <Link
                    href={`/order-confirmation/${order.orderId}`}
                    className="text-xs font-bold text-sky-600 hover:text-white hover:bg-sky-500 border border-sky-300 px-4 py-2 rounded-xl transition-all shrink-0"
                  >
                    View Status &amp; Tracking →
                  </Link>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
