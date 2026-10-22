import React from 'react';
import { businessConfig } from '../config/businessConfig';

export const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-24 text-xs leading-relaxed text-gray-700">
      <h1 className="font-serif font-bold text-3xl text-giftoria-wine-900 border-b pb-4">
        Shipping Policy
      </h1>

      <div className="bg-giftoria-cream-100 p-4 rounded-2xl border border-giftoria-wine-800/10 font-bold text-giftoria-wine-900">
        Free Shipping across India on all orders over ₹{businessConfig.freeShippingThreshold}!
      </div>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">1. Production &amp; Dispatch Timeline</h2>
        <p>Customized gifts, DTF apparel, and photo frames are dispatched within 24–48 hours. Precision 3D printed items (such as lithophane moon lamps) dispatches within 48 hours following layer manufacturing.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">2. Delivery Partners &amp; Tracking</h2>
        <p>We partner with premier express courier networks across India. Once your order status reaches "Shipped", tracking updates are shared via SMS and email.</p>
      </section>
    </div>
  );
};
