import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: "Can I get same-day delivery for flowers and cakes?",
      a: "Yes! SkyGift offers 2-hour express delivery and same-day delivery across 450+ Indian cities for orders placed before 5:00 PM."
    },
    {
      q: "How does midnight delivery work?",
      a: "Our midnight delivery fleet delivers surprise cakes and flowers directly between 11:30 PM and 12:30 AM right on the celebration eve."
    },
    {
      q: "Can I customize the cake flavor, message, or weight?",
      a: "Absolutely. On each cake product page, you can choose cake weight (500g, 1kg, 2kg) and type your personalized greeting card message during checkout."
    },
    {
      q: "How do I check if my pincode is serviceable?",
      a: "You can enter your 6-digit PIN code in the header or on any product page. It will instantly verify delivery availability and show exact delivery time slots."
    },
    {
      q: "Are the flowers delivered fresh?",
      a: "Yes, we source blooms directly from verified local growers every morning. Each bouquet is hand-tied with moisture wraps to guarantee farm-fresh presentation."
    },
    {
      q: "What payment options are available?",
      a: "In this demo mode, you can test UPI, Card, and Cash on Delivery without being charged real money."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Got Questions?
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs text-slate-500">
            Find quick answers about delivery timings, customization, and freshness
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-slate-800 text-sm hover:text-sky-600 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-sky-500 transition-transform ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-sky-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
