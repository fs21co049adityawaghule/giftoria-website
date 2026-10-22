import React from 'react';
import { MessageCircle } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export const FloatingWhatsapp: React.FC = () => {
  const defaultPrompt = "Hello GIFTORIA, I would like to enquire about a customized product.";
  const whatsappUrl = `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(defaultPrompt)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-all duration-300 border-2 border-white/20"
      aria-label="Chat on WhatsApp"
      title="Chat with GIFTORIA on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 fill-white stroke-emerald-600" />
      <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap text-xs font-bold pl-0 group-hover:pl-2">
        Chat with Us
      </span>
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-300"></span>
      </span>
    </a>
  );
};
