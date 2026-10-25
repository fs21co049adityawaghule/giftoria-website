import React from 'react';
import { businessConfig } from '../config/businessConfig';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Terms & Conditions</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Introduction</h3>
            <p>
              Welcome to SkyGift. By accessing or using our website, services, and online gifting catalog, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">2. Orders and Perishables</h3>
            <p>
              Because floral arrangements and baked goods are perishable items, delivery attempts are made once at the address provided. If the recipient is unavailable, our delivery associate may coordinate or leave with designated building security.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">3. Demo Mode Disclaimer</h3>
            <p>
              {businessConfig.demoModeNotice}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
