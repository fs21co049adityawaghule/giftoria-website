import React from 'react';
import { useRoute, Link } from 'wouter';
import { useOrder } from '../context/OrderContext';
import { CheckCircle2, Heart, Package, ArrowRight, Printer, FileText, MapPin, Clock } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const [, params] = useRoute('/order-confirmation/:orderId');
  const { getOrderById } = useOrder();

  const orderId = params?.orderId;
  const order = orderId ? getOrderById(orderId) : undefined;

  if (!order) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border shadow-sm space-y-4">
        <h2 className="font-serif text-2xl font-bold text-giftoria-wine-900">Order Not Found</h2>
        <p className="text-xs text-gray-500 font-medium">We could not locate this order ID.</p>
        <Link href="/products" className="inline-block bg-giftoria-wine-800 text-white font-bold text-xs py-3 px-6 rounded-xl">
          Return to Shop
        </Link>
      </div>
    );
  }

  const statusSteps = [
    'Confirmed',
    'Customization Processing',
    'Printing',
    'Ready',
    'Shipped',
    'Delivered',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      {/* Thank You Header */}
      <div className="bg-gradient-to-r from-giftoria-wine-900 via-giftoria-wine-800 to-giftoria-charcoal-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 border-2 border-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="font-serif font-bold text-2xl sm:text-4xl text-white">
          Thank You for Shopping with GIFTORIA ❤️
        </h1>
        <p className="text-xs sm:text-sm text-gray-200">
          Your custom order has been received and sent to our printing studio!
        </p>
        <div className="inline-block bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-mono font-bold text-giftoria-gold-400 border border-white/20">
          Order ID: {order.orderId}
        </div>
      </div>

      {/* Live Order Status Tracker */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-giftoria-wine-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-giftoria-wine-800" />
          <span>Live Order Status Tracker</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs pt-2">
          {statusSteps.map((step, idx) => {
            const isCurrent = step === order.orderStatus;
            const isPassed = idx <= statusSteps.indexOf(order.orderStatus);
            return (
              <div
                key={step}
                className={`p-2.5 rounded-xl border text-[11px] font-semibold transition-all ${
                  isCurrent
                    ? 'bg-giftoria-wine-800 text-white border-giftoria-wine-800 shadow-md font-bold'
                    : isPassed
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-gray-50 text-gray-400 border-gray-200'
                }`}
              >
                <div>Step {idx + 1}</div>
                <div className="truncate mt-0.5">{step}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Order Items Recap & Customization Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-giftoria-wine-900 border-b pb-3">
          Customization &amp; Items Summary
        </h3>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div className="flex gap-4">
                <img src={item.product.thumbnail} alt="" className="w-16 h-20 object-cover rounded-xl shrink-0" />
                <div className="space-y-1 text-xs">
                  <div className="font-serif font-bold text-sm text-giftoria-wine-900">{item.product.name}</div>
                  <div className="text-gray-500">Qty: {item.quantity} × ₹{item.product.price}</div>

                  {item.customization.customMessage && (
                    <div className="bg-giftoria-cream-100 p-2 rounded-xl text-[11px] text-giftoria-wine-900 border border-giftoria-wine-800/10">
                      <strong>Custom Message:</strong> "{item.customization.customMessage}"
                    </div>
                  )}

                  {item.customization.uploadedFileName && (
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-1.5 rounded-lg flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span><strong>Design File:</strong> {item.customization.uploadedFileName} ({item.customization.uploadedFileSizeFormatted})</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="font-serif font-bold text-base text-giftoria-wine-900 self-end sm:self-center">
                ₹{item.product.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Address Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-xs">
          <div className="space-y-1">
            <h4 className="font-bold text-giftoria-wine-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-giftoria-wine-800" />
              <span>Delivery Address</span>
            </h4>
            <div className="text-gray-700 leading-relaxed pt-1">
              <strong>{order.customer.fullName}</strong><br />
              {order.customer.addressLine}, {order.customer.city}<br />
              {order.customer.state} - {order.customer.pincode}<br />
              Mobile: {order.customer.mobile}
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-giftoria-wine-900">Payment Breakdown</h4>
            <div className="text-gray-700 space-y-1 pt-1">
              <div className="flex justify-between"><span>Method:</span><span className="font-bold uppercase">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span>Status:</span><span className="font-bold text-emerald-700">{order.paymentStatus}</span></div>
              <div className="flex justify-between text-sm font-bold text-giftoria-wine-900 pt-2 border-t"><span>Total Paid:</span><span>₹{order.grandTotal}</span></div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-wine transition-all"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/orders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-giftoria-wine-900 border border-gray-300 font-bold text-xs py-3.5 px-6 rounded-2xl transition-all"
          >
            <Package className="w-4 h-4" />
            <span>View All Orders</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
