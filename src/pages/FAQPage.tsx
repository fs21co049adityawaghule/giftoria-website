import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      q: "1. What products are available at GIFTORIA?",
      a: "GIFTORIA offers personalized gifts (custom ceramic and magic mugs, wooden, acrylic and metal keychains, mobile covers, photo frames, LED lamps, and nameplates), precision 3D Arts (Ganesha idols, lithophanes, moon lamps, and flexi figures), Forever Blooms (handmade artificial, crochet, satin ribbon, and paper flowers), curated Gift Hampers, specialized Birthday & Anniversary collections, and elegant jewellery."
    },
    {
      q: "2. Can I personalize a gift with a name, photo, or message?",
      a: "Yes! Many of our products can be personalized with recipient names, photographs, custom dates, or personal messages. On eligible product pages or during checkout, you can input your text, upload your picture, or add a complimentary gift card message."
    },
    {
      q: "3. How do I place an order?",
      a: "Select your desired gift, add any required personalization details (name, photo, or custom note), click 'Add to Cart', and proceed to Checkout. Enter your delivery address and valid Maharashtra PIN code, select your preferred delivery date, and choose your payment option to confirm your order."
    },
    {
      q: "4. Can I order customized 3D-printed products?",
      a: "Yes. Our 3D Arts range includes custom 3D-printed name keychains, lithophane photo lamps, custom nameplates, Ganesha idols, and desk figurines engineered from durable eco-friendly PLA filaments."
    },
    {
      q: "5. Are Forever Blooms fresh flowers?",
      a: "No, Forever Blooms are not fresh flowers. They are artfully handcrafted artificial, crochet, satin ribbon, and paper flower arrangements designed to last indefinitely without wilting or requiring maintenance."
    },
    {
      q: "6. Which locations do you deliver to?",
      a: "GIFTORIA currently delivers exclusively across Maharashtra, India, aiming to serve eligible PIN codes in cities, towns, and delivery zones throughout the state."
    },
    {
      q: "7. How do I check delivery availability using my PIN code?",
      a: "You can use the delivery location checker in the top header or on any product page. Enter your 6-digit PIN code to verify serviceability across Maharashtra."
    },
    {
      q: "8. When will my order be dispatched?",
      a: "Once an order is confirmed, it is scheduled for dispatch on the next day, except Sundays (orders confirmed on Saturday are scheduled for dispatch on Monday). Orders are dispatched between 9:00 AM and 6:00 PM. Personalized and 3D-printed products may require additional preparation time."
    },
    {
      q: "9. Do you accept customized orders?",
      a: "Yes, we specialize in customized gifting. If you require special customizations or bulk corporate orders not listed directly on the site, you can contact us directly on WhatsApp."
    },
    {
      q: "10. Can I cancel or modify an order?",
      a: "Because custom and personalized items undergo design, printing, or 3D fabrication soon after placement, please contact our support team on WhatsApp or email as early as possible if a modification or cancellation is needed. Once production has commenced, modifications may not be feasible."
    },
    {
      q: "11. What should I do if my product arrives damaged?",
      a: "If your parcel or item arrives damaged or with an issue, please reach out to GIFTORIA customer support promptly via WhatsApp at +91 83568 29605 or email us at support@giftoria.in with your order details and clear photos of the parcel so our team can assist you."
    },
    {
      q: "12. How can I contact GIFTORIA on WhatsApp?",
      a: "You can click the WhatsApp floating button on our website, or message us directly at +91 83568 29605. Our team is available Mon - Sat (9:30 AM - 6:30 PM IST) to assist with product enquiries and custom orders."
    },
    {
      q: "13. How can I track or enquire about my order?",
      a: "You can view your confirmed orders in the 'My Account' or 'Order History' section of the website. For specific dispatch updates or courier queries, contact our customer support with your Order ID on WhatsApp or email."
    },
    {
      q: "14. What payment methods are available?",
      a: "In this online store demonstration, you can test UPI / QR code, Credit/Debit Cards, and Cash on Delivery without incurring actual monetary charges."
    }
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
            Frequently Asked Questions
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
            Everything You Need to Know
          </h1>
          <p className="text-xs text-slate-500 max-w-lg mx-auto">
            Find clear answers about GIFTORIA's custom products, Maharashtra delivery, dispatch schedule, and support.
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
                <ChevronDown className={`w-4 h-4 text-sky-500 transition-transform shrink-0 ml-2 ${openIdx === idx ? 'rotate-180' : ''}`} />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-sky-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support callout */}
        <div className="p-6 bg-sky-50 rounded-3xl border border-sky-200 text-center space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Have more questions?</h3>
          <p className="text-xs text-slate-600">
            Our team is available on WhatsApp to assist with custom gifts, photo requirements, and order enquiries.
          </p>
          <a
            href={businessConfig.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Chat on WhatsApp: +91 {businessConfig.rawPhone}
          </a>
        </div>

      </div>
    </div>
  );
};
