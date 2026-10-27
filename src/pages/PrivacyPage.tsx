import React from 'react';
import { businessConfig } from '../config/businessConfig';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Privacy Policy</h1>
          <p className="text-xs text-slate-500">Last updated: October 2026</p>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Customer Privacy Commitment</h3>
            <p>
              At GIFTORIA, we value the trust you place in us when sharing recipient addresses, celebratory greeting card messages, and personal memories for custom gifts.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">2. Information Collection & Usage</h3>
            <p>
              We collect customer name, contact number, delivery address, and greeting card messages solely for fulfilling your gift orders and sending dispatch tracking updates. We never sell or rent your personal information to third parties.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">3. Demonstration Disclaimer</h3>
            <p>
              {businessConfig.demoModeNotice}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
