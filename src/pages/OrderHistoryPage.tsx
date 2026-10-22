import React from 'react';
import { Link } from 'wouter';
import { useOrder } from '../context/OrderContext';
import { Package, ArrowRight, Clock, FileText, CheckCircle2 } from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders } = useOrder();

  if (orders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-giftoria-cream-200 text-giftoria-wine-800 flex items-center justify-center mx-auto shadow-sm">
          <Package className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
            No Order History Found
          </h1>
          <p className="text-xs text-gray-500">
            You haven't placed any custom orders yet.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-sm py-3.5 px-8 rounded-2xl shadow-wine transition-all"
        >
          <span>Start Customizing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
          Order History &amp; Customization Records ({orders.length})
        </h1>
      </div>

      <div className="space-y-6">
        {orders.map((ord) => (
          <div key={ord.orderId} className="bg-white rounded-3xl p-6 border border-giftoria-wine-800/10 shadow-sm space-y-4">
            {/* Header row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 text-xs gap-2">
              <div>
                <span className="font-mono font-bold text-giftoria-wine-900 text-sm">{ord.orderId}</span>
                <span className="text-gray-400 ml-2">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px]">
                  {ord.orderStatus}
                </span>
                <Link href={`/order-confirmation/${ord.orderId}`} className="text-giftoria-wine-800 font-bold hover:underline">
                  View Tracker
                </Link>
              </div>
            </div>

            {/* Items summary */}
            <div className="space-y-3">
              {ord.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                  <img src={item.product.thumbnail} alt="" className="w-12 h-14 object-cover rounded-xl shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-giftoria-wine-900">{item.product.name} (×{item.quantity})</div>
                    {item.customization.customMessage && (
                      <div className="text-[10px] text-gray-600">Message: "{item.customization.customMessage}"</div>
                    )}
                    {item.customization.uploadedFileName && (
                      <div className="text-[10px] text-emerald-800 flex items-center gap-1">
                        <FileText className="w-3 h-3" />
                        <span>{item.customization.uploadedFileName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex justify-between items-center text-xs font-bold text-giftoria-wine-900 pt-2 border-t">
              <span>Total Paid ({ord.paymentMethod.toUpperCase()})</span>
              <span className="text-base">₹{ord.grandTotal}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
