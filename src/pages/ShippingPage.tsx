import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const ShippingPage: React.FC = () => {
  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Logistics & Delivery
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Shipping & Delivery Information
          </h1>
          <p className="text-xs text-slate-500">
            Learn how SkyGift delivers freshness on time across 450+ Indian cities
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Delivery Time Slots</h3>
            <p>
              • <strong>Standard Delivery:</strong> Dispatched between 9:00 AM and 6:00 PM on your selected date. Free on orders above ₹{businessConfig.freeShippingThreshold}.
            </p>
            <p>
              • <strong>2-Hour Express Delivery:</strong> Available for select perishable items like cakes and floral bouquets in metro cities.
            </p>
            <p>
              • <strong>Midnight Surprise Delivery:</strong> Guaranteed handover between 11:30 PM and 12:30 AM right as the special day begins.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">2. Delivery Serviceability</h3>
            <p>
              We service over 450+ cities across India. Courier products such as personalized plaques, custom mugs, and gift hampers are shipped via prioritized air express courier partners with door-to-door tracking.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">3. Freshness & Temperature Fleet</h3>
            <p>
              Perishable items (flowers, cakes, luxury chocolates) travel in insulated carriers to preserve fresh aromas, delicate frostings, and petal moisture intact.
            </p>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200 text-sky-900 text-[11px]">
            {businessConfig.demoModeNotice}
          </div>
        </div>

      </div>
    </div>
  );
};
