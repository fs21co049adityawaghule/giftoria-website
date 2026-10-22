import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is the maximum file size for photo or design uploads?',
      a: 'The file upload limit is strictly 1 MB per customized product. Allowed file formats include JPG, JPEG, PNG, WEBP, and PDF. If your file exceeds 1 MB, please compress it before uploading.',
    },
    {
      q: 'Can I add different custom text or photos to multiple items of the same product?',
      a: 'Yes! Every customized item in your cart stores its unique message and uploaded file reference. If you add two coffee mugs with different names, they will appear as separate cart items.',
    },
    {
      q: 'How long does 3D printing and custom order processing take?',
      a: 'Customized products dispatches within 24 to 48 working hours. Precision 3D printing (such as Lithophane Moon Lamps & Idols) takes approximately 24 hours for fine layer manufacturing.',
    },
    {
      q: 'What file resolution is recommended for photo frames?',
      a: 'For best results on 4x4, 4x6, and A4 photo frames, we recommend uploading sharp, high-resolution original digital photos without heavy blur.',
    },
    {
      q: 'What payment methods are supported on GIFTORIA?',
      a: 'We support UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). In test mode, all orders complete instantly.',
    },
    {
      q: 'How can I contact customer support regarding my custom order?',
      a: 'You can chat directly with our studio on WhatsApp (+91 83568 29605) or email us at support@giftoria.in.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-24">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="w-12 h-12 rounded-full bg-giftoria-wine-50 text-giftoria-wine-800 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-giftoria-wine-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Everything you need to know about custom ordering, 1 MB file upload rules, 3D printing, and delivery.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-giftoria-wine-800/10 overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-serif font-bold text-sm sm:text-base text-giftoria-wine-900 hover:text-giftoria-wine-700 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-giftoria-wine-800 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
