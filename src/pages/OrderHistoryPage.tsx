import React from 'react';
import { Link } from 'wouter';
import { Package, ArrowRight } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useOrder();

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-10 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Order History ({orders.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track and review your previous celebratory gift dispatches
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-sky-100 p-12 text-center shadow-xs">
            <Package className="w-12 h-12 text-sky-400 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Explore our fresh flowers, birthday cakes, and personalized hampers to place your first gift order.
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
            {orders.map((order) => (
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
                  <p className="text-xs text-slate-700 font-semibold mt-1">
                    Delivered to: {order.customer.fullName} ({order.customer.city})
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {order.items.length} items • Total: ₹{order.grandTotal.toLocaleString('en-IN')} • Date: {order.customer.deliveryDate || 'Today'}
                  </p>
                </div>

                <Link
                  href={`/order-confirmation/${order.orderId}`}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 border border-sky-200 px-4 py-2 rounded-xl hover:bg-sky-50 transition-colors shrink-0"
                >
                  Track Order →
                </Link>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
