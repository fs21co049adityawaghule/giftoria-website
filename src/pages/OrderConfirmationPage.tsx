import React from 'react';
import { useRoute, Link } from 'wouter';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Phone, 
  ArrowRight, 
  Printer, 
  Share2,
  Gift
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { businessConfig } from '../config/businessConfig';

export const OrderConfirmationPage: React.FC = () => {
  const [, params] = useRoute('/order-confirmation/:orderId');
  const { orders } = useOrder();

  const orderId = params?.orderId;
  const order = orders.find(o => o.orderId === orderId) || orders[0];

  if (!order) {
    return (
      <div className="bg-[#F8FCFF] min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 text-center max-w-sm w-full shadow-xs">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">Could not retrieve order details.</p>
          <Link
            href="/"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-10 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Card */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-10 shadow-sm text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10 stroke-[2]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Order Confirmed (Demo Mode)
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
            Thank You For Your Celebration Order!
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
            Order reference: <strong className="text-sky-600 font-mono text-sm">{order.orderId}</strong>. A confirmation SMS & email have been simulated to {order.customer.email}.
          </p>

          {/* Demo disclaimer */}
          <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-sky-800 max-w-lg mx-auto">
            {businessConfig.demoModeNotice}
          </div>
        </div>

        {/* Tracking Timeline Simulation */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs mb-8">
          <h3 className="font-bold text-slate-900 text-base mb-6 flex items-center gap-2">
            <Package className="w-5 h-5 text-sky-500" />
            Live Delivery Journey
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center text-xs font-bold shadow-md shadow-sky-200 mb-2">
                ✓
              </div>
              <h4 className="text-xs font-bold text-slate-900">Order Placed</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Details confirmed</p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 border border-sky-300 flex items-center justify-center text-xs font-bold mb-2 animate-pulse">
                2
              </div>
              <h4 className="text-xs font-bold text-slate-900">Crafting & Baking</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Fresh preparation</p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold mb-2">
                3
              </div>
              <h4 className="text-xs font-bold text-slate-700">Out for Delivery</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">In temperature fleet</p>
            </div>

            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold mb-2">
                4
              </div>
              <h4 className="text-xs font-bold text-slate-700">Doorstep Delivery</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Smiles delivered</p>
            </div>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-sky-100">
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Recipient & Address
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1">{order.customer.fullName}</p>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {order.customer.addressLine}, {order.customer.city}, {order.customer.pincode}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">Phone: {order.customer.mobile}</p>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
                Scheduled Slot
              </span>
              <p className="font-bold text-slate-900 text-sm mt-1">
                {order.customer.deliveryDate || 'Today'}
              </p>
              <p className="text-xs text-slate-600 mt-0.5">
                {order.customer.deliveryTimeSlot || 'Standard Delivery'}
              </p>
              {order.customer.messageCard && (
                <div className="mt-2 p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 text-xs italic text-sky-800">
                  Card message: "{order.customer.messageCard}"
                </div>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400">
              Purchased Items ({order.items.length || order.itemSnapshots?.length || 0})
            </h4>
            <div className="divide-y divide-sky-50">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.cartItemId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.thumbnail || item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-sky-50"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{item.product.name}</p>
                        <span className="text-slate-500 text-[11px]">Quantity: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              ) : (
                order.itemSnapshots?.map((snap, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={snap.thumbnail || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'}
                        alt={snap.productName}
                        className="w-12 h-12 rounded-xl object-cover bg-sky-50"
                      />
                      <div>
                        <p className="font-semibold text-slate-800">{snap.productName}</p>
                        <span className="text-slate-500 text-[11px]">Quantity: {snap.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{(snap.sellingPriceSnapshot * snap.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-sky-100 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-bold text-slate-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-bold text-slate-900">
                {order.shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${order.shippingFee}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-sky-100">
              <span>Grand Total</span>
              <span className="text-sky-600">₹{order.grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-2xl shadow-sm transition-all text-xs"
          >
            <Gift className="w-4 h-4" />
            Continue Shopping
          </Link>
          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold py-3 px-6 rounded-2xl shadow-xs transition-all text-xs"
          >
            <Printer className="w-4 h-4" />
            Print Order Receipt
          </button>
        </div>

      </div>
    </div>
  );
};
