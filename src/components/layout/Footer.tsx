import React from 'react';
import { Link } from 'wouter';
import { Gift, MessageCircle, Mail, Instagram, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-giftoria-charcoal-900 text-white border-t border-giftoria-wine-800/20 pt-12 pb-24 md:pb-12">
      {/* Top Value Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-giftoria-charcoal-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 rounded-2xl bg-giftoria-wine-800/30 text-giftoria-gold-400 border border-giftoria-wine-800/40">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Emotional Personalization</div>
              <div className="text-xs text-gray-400">Crafted with care & accuracy</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 rounded-2xl bg-giftoria-wine-800/30 text-giftoria-gold-400 border border-giftoria-wine-800/40">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">Safe pan-India Shipping</div>
              <div className="text-xs text-gray-400">Free shipping on orders over ₹{businessConfig.freeShippingThreshold}</div>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 rounded-2xl bg-giftoria-wine-800/30 text-giftoria-gold-400 border border-giftoria-wine-800/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-sm text-white">100% Quality Guaranteed</div>
              <div className="text-xs text-gray-400">Premium 3D & printing technology</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Single Horizontal Footer Row Structure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-giftoria-wine-800 text-giftoria-gold-400 flex items-center justify-center font-bold">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                GIFTORIA
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-xs">
              {businessConfig.tagline}
            </p>
            <p className="text-[11px] text-gray-500">
              Transforming your ideas, memories, and messages into unforgettable personalized gifts and 3D creations.
            </p>
          </div>

          {/* Core Services Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-giftoria-gold-400">
              SERVICES
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/customized-gifts" className="hover:text-giftoria-gold-400 transition-colors">
                  Customized Gift Items
                </Link>
              </li>
              <li>
                <Link href="/3d-printing" className="hover:text-giftoria-gold-400 transition-colors">
                  3D Printing Services
                </Link>
              </li>
              <li>
                <Link href="/dtf-printing" className="hover:text-giftoria-gold-400 transition-colors">
                  DTF Apparel Printing
                </Link>
              </li>
              <li>
                <Link href="/sublimation-printing" className="hover:text-giftoria-gold-400 transition-colors">
                  Sublimation Printing
                </Link>
              </li>
              <li>
                <Link href="/photo-frames" className="hover:text-giftoria-gold-400 transition-colors">
                  Custom Photo Frames
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-giftoria-gold-400">
              ABOUT & POLICIES
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/about" className="hover:text-giftoria-gold-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-giftoria-gold-400 transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-giftoria-gold-400 transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-giftoria-gold-400 transition-colors">
                  Return & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-giftoria-gold-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-giftoria-gold-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Direct Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-giftoria-gold-400">
              CONNECT WITH US
            </h4>
            <div className="space-y-2.5 text-xs text-gray-300">
              <a
                href={`https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent("Hello GIFTORIA, I would like to enquire about a customized product.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-emerald-400 hover:text-emerald-300 transition-colors py-1.5 px-3 bg-emerald-950/40 rounded-xl border border-emerald-800/40 inline-flex w-full"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="font-medium">WhatsApp: {businessConfig.whatsappDisplay}</span>
              </a>

              <a
                href={`mailto:${businessConfig.email}`}
                className="flex items-center gap-2.5 text-gray-300 hover:text-white transition-colors py-1.5 px-3 bg-giftoria-charcoal-800 rounded-xl border border-gray-700/40 inline-flex w-full"
              >
                <Mail className="w-4 h-4 text-giftoria-gold-400 shrink-0" />
                <span className="truncate">{businessConfig.email}</span>
              </a>

              <a
                href={businessConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-pink-400 hover:text-pink-300 transition-colors py-1.5 px-3 bg-pink-950/30 rounded-xl border border-pink-800/40 inline-flex w-full"
              >
                <Instagram className="w-4 h-4 shrink-0" />
                <span>@{businessConfig.instagramUsername}</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-giftoria-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            © {currentYear} {businessConfig.brandName}. All rights reserved. Built with passion & precision.
          </div>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for custom gifting</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
