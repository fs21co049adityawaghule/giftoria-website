import React from 'react';
import { Gift, Heart, Sparkles, ShieldCheck, Truck, Clock, Award, Users } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
            <span>About SkyGift</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Delivering Joy & Smiles Across India
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {businessConfig.tagline}. Every bouquet, freshly baked cake, and personalized surprise is crafted to make your moments truly memorable.
          </p>
        </div>

        {/* Narrative Box */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-sky-200">Our Story</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              From Fresh Blooms to Lasting Keepsakes
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Inspired by the warmth of Indian festivities and celebrations, SkyGift was created to make online gifting reliable, punctual, and delightfully effortless.
            </p>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Whether it's a midnight birthday cake delivery, a surprise bouquet of roses on an anniversary, or an eco-friendly desk plant, our network of master florists and artisanal bakers across 450+ cities guarantees farm-fresh excellence.
            </p>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-3 text-xs">
            <div className="font-bold text-base text-white">The SkyGift Promise</div>
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-sky-200 shrink-0" /><span>Handpicked Farm-Fresh Blooms Daily</span></div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-sky-200 shrink-0" /><span>2-Hour Express & 12 AM Midnight Delivery</span></div>
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-sky-200 shrink-0" /><span>Secure Encrypted Checkout</span></div>
            <div className="flex items-center gap-2"><Award className="w-4 h-4 text-sky-200 shrink-0" /><span>5-Point Freshness & Quality Assurance</span></div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Artisan Quality</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We collaborate with certified master patissiers and botanical growers to ensure peak taste, texture, and fragrance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Punctual Logistics</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our temperature-controlled fleet guarantees bouquets arrive crisp and cakes remain chilled until the moment of celebration.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Customer Centric</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Friendly customer care support available via phone and WhatsApp to help tailor custom orders and address delivery requests.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
