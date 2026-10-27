import React from 'react';
import { RotateCcw, MessageCircle, Mail } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const RefundPage: React.FC = () => {
  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Policies & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Guidelines regarding order modifications, customized gift production, and customer support assistance.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6 text-xs text-slate-600 leading-relaxed">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">1. Order Cancellation & Modifications</h3>
            <p>
              At GIFTORIA, we begin customizing and fabricating personalized products, 3D arts, and handcrafting Forever Blooms shortly after an order is confirmed.
            </p>
            <p>
              If you need to change personalization text, replace an uploaded photograph, adjust the recipient address, or request a cancellation, please contact our support team as early as possible. Once engraving, printing, or physical production has commenced, orders cannot be cancelled or modified.
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">2. Damaged or Discrepant Products</h3>
            <p>
              We take great care in packaging every gift parcel securely. If your parcel arrives damaged in transit or if there is a discrepancy with your customized order, please reach out to our customer care team promptly with your Order ID and clear photographs of the package and item.
            </p>
            <p>
              Our team will review your case directly through our official support channels to find an appropriate resolution.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-sky-50">
            <h3 className="font-bold text-slate-900 text-sm">3. Contacting Customer Support</h3>
            <p>
              For any clarification regarding order status, modifications, or assistance, please contact us through our existing customer channels:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <a
                href={businessConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: +91 {businessConfig.rawPhone}
              </a>
              <a
                href={`mailto:${businessConfig.email}`}
                className="inline-flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
              >
                <Mail className="w-4 h-4" />
                Email: {businessConfig.email}
              </a>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-500 text-[11px] mt-6">
            {businessConfig.demoModeNotice}
          </div>

        </div>

      </div>
    </div>
  );
};
