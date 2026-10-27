import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin, Calendar, AlertCircle } from 'lucide-react';
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
            Delivery & Shipping Information
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Learn about GIFTORIA's dispatch schedule, delivery time windows, and serviceability across Maharashtra.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          
          {/* Section A: Delivery Time Slots */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Clock className="w-4 h-4 text-sky-500" />
              <h3>1. Delivery Time Slots & Dispatch Windows</h3>
            </div>
            
            <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 font-semibold text-sky-900">
              "Orders are dispatched between 9:00 AM and 6:00 PM on your selected date."
            </div>

            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                <strong>Dispatch Definition:</strong> Dispatch signifies that the parcel has been packaged, inspected, and handed over to courier carriers or left our dispatch facility; it does not automatically mean the parcel has arrived at the recipient's doorstep at that exact moment.
              </li>
              <li>
                <strong>Delivery Timing Variation:</strong> Actual transit and doorstep delivery timing can vary depending on destination distance, local route conditions, courier logistics, and product complexity.
              </li>
              <li>
                <strong>Personalized & 3D Arts Preparation:</strong> Customized items (laser-engraved keychains, photo mugs, custom standees, and 3D prints) require specialized fabrication and curing time prior to dispatch.
              </li>
              <li>
                <strong>Accurate Address Requirement:</strong> Customers are requested to ensure a complete delivery address, active contact phone number, and a valid Maharashtra PIN code are provided to prevent courier delays.
              </li>
              <li>
                <strong>Estimated Dates:</strong> Any delivery date shown during checkout should be understood in accordance with the actual order confirmation and regional service availability.
              </li>
              <li>
                <strong>Support Contact:</strong> For any delivery-related queries or urgent scheduling requests, please reach out to our team at +91 {businessConfig.rawPhone} or email {businessConfig.email}.
              </li>
            </ul>
          </div>

          {/* Section B: Order Confirmation and Next-Day Dispatch */}
          <div className="space-y-3 pt-6 border-t border-sky-50">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Calendar className="w-4 h-4 text-sky-500" />
              <h3>2. Order Confirmation and Next-Day Dispatch</h3>
            </div>

            <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 font-semibold text-sky-900">
              "Once an order is confirmed, it is scheduled for dispatch on the next day, except Sundays."
            </div>

            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                <strong>Weekend Scheduling:</strong> Orders confirmed on Saturday are scheduled for dispatch on Monday, subject to operational courier availability.
              </li>
              <li>
                <strong>Sunday Operations:</strong> Sunday is excluded from the standard dispatch schedule.
              </li>
              <li>
                <strong>Customized Orders:</strong> Intricate customized products may require additional preparation time as communicated during order confirmation.
              </li>
              <li>
                <strong>Actual Confirmation:</strong> Final dispatch schedules and estimated delivery timelines reflect the actual order confirmation details.
              </li>
            </ul>
          </div>

          {/* Section C: Delivery Serviceability Across Maharashtra */}
          <div className="space-y-3 pt-6 border-t border-sky-50">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <MapPin className="w-4 h-4 text-sky-500" />
              <h3>3. Delivery Serviceability Across Maharashtra</h3>
            </div>

            <div className="p-3 bg-sky-50/80 rounded-xl border border-sky-200 font-semibold text-sky-900">
              "GIFTORIA aims to serve customers across Maharashtra, India, including eligible PIN codes in cities, towns, and other delivery areas."
            </div>

            <ul className="space-y-1.5 list-disc pl-5">
              <li>
                <strong>Service Verification:</strong> Delivery eligibility should be checked using the PIN-code checker on the website.
              </li>
              <li>
                <strong>State-Wide Intent:</strong> GIFTORIA intends to cover all valid serviceable delivery PIN codes within Maharashtra.
              </li>
              <li>
                <strong>Location Differences:</strong> Delivery timing and transit hours may differ between metro regions (like Mumbai, Pune, Thane, Nashik, Nagpur) and interior talukas or rural districts.
              </li>
              <li>
                <strong>Remote Locations:</strong> Remote or hard-to-access locations may require additional courier coordination.
              </li>
              <li>
                <strong>Validated Verification:</strong> A successful PIN-code check relies on valid Maharashtra location data rather than a plain 6-digit format check.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-[11px]">
            {businessConfig.demoModeNotice}
          </div>

        </div>

      </div>
    </div>
  );
};
