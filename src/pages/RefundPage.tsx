import React from 'react';
import { RotateCcw, ShieldCheck } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const RefundPage: React.FC = () => {
  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Hassle-Free Policy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-slate-500">
            Transparent policies crafted to ensure customer delight and peace of mind
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Order Cancellation</h3>
            <p>
              • Same-day and perishable orders (Cakes & Fresh Flowers) can be cancelled up to 4 hours prior to the scheduled delivery slot.
            </p>
            <p>
              • Personalized and custom engraved items cannot be cancelled once production or laser engraving has begun.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">2. 100% Replacement or Refund</h3>
            <p>
              If your gift arrived damaged or in an unsatisfactory condition, please share a picture with our support team within 12 hours of delivery. We will issue an instant free replacement or 100% refund to your original payment method within 3 to 5 business days.
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
