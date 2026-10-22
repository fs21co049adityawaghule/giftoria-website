import React from 'react';
import { Gift, Heart, Sparkles, ShieldCheck, Box, Shirt, Printer, Image as ImageIcon } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 pb-24">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-giftoria-wine-800/10 text-giftoria-wine-800 text-xs font-extrabold uppercase tracking-wider">
          <Heart className="w-4 h-4 text-rose-500 fill-current" />
          <span>Our Story &amp; Values</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-giftoria-wine-900">
          About GIFTORIA
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {businessConfig.tagline}
        </p>
      </div>

      {/* Craftsmanship Narrative Box */}
      <div className="bg-gradient-to-r from-giftoria-wine-900 to-giftoria-charcoal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-giftoria-gold-400">Craftsmanship &amp; Innovation</span>
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-white">
            Where Personal Memories Meet Precision Engineering
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            GIFTORIA was born out of a simple belief: a gift should not be a generic mass-produced item. It should carry an emotion, a story, a date, or a message that lasts forever.
          </p>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            We specialize in five core manufacturing techniques: Customized Gift Products, PLA/PETG 3D Printing, High-density DTF Apparel Transfers, Photographic Sublimation Dye, and Precision Photo Framing.
          </p>
        </div>

        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-3 text-xs">
          <div className="font-serif font-bold text-lg text-giftoria-gold-400">Core Principles</div>
          <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-giftoria-gold-400 shrink-0" /><span>100% Original Personalization</span></div>
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-giftoria-gold-400 shrink-0" /><span>Strict 1 MB File Upload Validation</span></div>
          <div className="flex items-center gap-2"><Gift className="w-4 h-4 text-giftoria-gold-400 shrink-0" /><span>Pan-India Safe Express Shipping</span></div>
        </div>
      </div>

      {/* 5 Core Pillars */}
      <div className="space-y-6">
        <h2 className="font-serif font-bold text-2xl text-giftoria-wine-900 text-center">
          Our 5 Craft Pillars
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-giftoria-wine-800/10 text-center space-y-2">
            <Gift className="w-8 h-8 text-giftoria-wine-800 mx-auto" />
            <div className="font-serif font-bold text-sm text-giftoria-wine-900">Custom Gifts</div>
            <p className="text-[11px] text-gray-500">Mugs, Bottles, Standees, Caps</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-giftoria-wine-800/10 text-center space-y-2">
            <Box className="w-8 h-8 text-giftoria-wine-800 mx-auto" />
            <div className="font-serif font-bold text-sm text-giftoria-wine-900">3D Printing</div>
            <p className="text-[11px] text-gray-500">Idols, Moon Lamps, Lithophanes</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-giftoria-wine-800/10 text-center space-y-2">
            <Shirt className="w-8 h-8 text-giftoria-wine-800 mx-auto" />
            <div className="font-serif font-bold text-sm text-giftoria-wine-900">DTF Apparel</div>
            <p className="text-[11px] text-gray-500">Polo Tees, Round Neck, Bags</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-giftoria-wine-800/10 text-center space-y-2">
            <Printer className="w-8 h-8 text-giftoria-wine-800 mx-auto" />
            <div className="font-serif font-bold text-sm text-giftoria-wine-900">Sublimation</div>
            <p className="text-[11px] text-gray-500">Gloss Mugs, Sippers, Keychains</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-giftoria-wine-800/10 text-center space-y-2">
            <ImageIcon className="w-8 h-8 text-giftoria-wine-800 mx-auto" />
            <div className="font-serif font-bold text-sm text-giftoria-wine-900">Photo Frames</div>
            <p className="text-[11px] text-gray-500">4x4, 4x6 &amp; A4 Memory Frames</p>
          </div>
        </div>
      </div>
    </div>
  );
};
