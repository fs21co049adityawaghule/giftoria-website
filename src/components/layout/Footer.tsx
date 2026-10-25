import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Gift, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Headphones, 
  Award,
  Send,
  Heart
} from 'lucide-react';
import { businessConfig } from '../../config/businessConfig';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      showToast('Thank you for subscribing! You will receive exclusive gifting offers.', 'success');
      setNewsletterEmail('');
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-sky-900/30">
      {/* 4 Feature Badges */}
      <div className="max-w-7xl mx-auto px-4 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">Express 2hr Delivery</h4>
              <p className="text-xs text-slate-400">Available across 450+ cities</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Freshness Guarantee</h4>
              <p className="text-xs text-slate-400">Handpicked farm-fresh blooms</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">100% Safe & Secure</h4>
              <p className="text-xs text-slate-400">Verified payment processing</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">24/7 Dedicated Care</h4>
              <p className="text-xs text-slate-400">Quick resolution & support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white shadow-sm">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Sky<span className="text-sky-400">Gift</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              SkyGift is India's leading online gifting destination, delighting celebrations with handcrafted flower arrangements, freshly baked artisanal cakes, curated hampers, and personalized keepsakes.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-2">
                Join our Celebration Circle
              </h5>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs px-3.5 py-2.5 rounded-xl flex-1 focus:outline-none focus:border-sky-400"
                />
                <button
                  type="submit"
                  className="bg-sky-500 hover:bg-sky-400 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Popular Gifts
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products?category=Flowers" className="hover:text-sky-400 transition-colors">
                  Fresh Flowers & Roses
                </Link>
              </li>
              <li>
                <Link href="/products?category=Cakes" className="hover:text-sky-400 transition-colors">
                  Artisanal Cakes & Bakery
                </Link>
              </li>
              <li>
                <Link href="/products?category=Plants" className="hover:text-sky-400 transition-colors">
                  Indoor & Lucky Plants
                </Link>
              </li>
              <li>
                <Link href="/products?category=Personalized+Gifts" className="hover:text-sky-400 transition-colors">
                  Personalized Keepsakes
                </Link>
              </li>
              <li>
                <Link href="/products?category=Gift+Hampers" className="hover:text-sky-400 transition-colors">
                  Luxury Gift Hampers
                </Link>
              </li>
              <li>
                <Link href="/products?category=Chocolates" className="hover:text-sky-400 transition-colors">
                  Chocolates & Bouquets
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Customer Support
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-sky-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-sky-400 transition-colors">
                  Delivery & Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-sky-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-sky-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Company
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About SkyGift
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sky-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sky-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-2 text-slate-400">
                <div className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-[11px]">{businessConfig.address}</span>
                </div>
              </li>
              <li className="text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="text-[11px]">{businessConfig.supportPhone}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © {new Date().getFullYear()} SkyGift Online Services India Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          Crafted with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 inline" /> for unforgettable Indian celebrations
        </div>
        <div className="text-[11px] text-sky-400/80">
          {businessConfig.demoModeNotice}
        </div>
      </div>
    </footer>
  );
};
