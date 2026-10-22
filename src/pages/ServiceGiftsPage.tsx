import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/common/ProductCard';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

export const ServiceGiftsPage: React.FC = () => {
  const { products } = useAdmin();
  const serviceProducts = products.filter((p) => p.service === 'customized-gifts');

  return (
    <div className="space-y-12 pb-20">
      {/* Service Hero */}
      <section className="bg-gradient-to-b from-giftoria-wine-900 to-giftoria-charcoal-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-giftoria-wine-800 text-giftoria-gold-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <Gift className="w-4 h-4" />
              <span>Service 1</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white">
              Customized Gift Items
            </h1>
            <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
              Personalized Magic Mugs, Insulated Steel Bottles, Leather Keychains, LED Standees, Embroidered Caps, and Crewneck T-Shirts tailored with your photos and text.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-serif font-bold text-xl text-giftoria-wine-900">
            Available Customized Gift Items ({serviceProducts.length})
          </h2>
          <span className="text-xs text-gray-500">Supports custom message &amp; 1 MB file upload</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {serviceProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
