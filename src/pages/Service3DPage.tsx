import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/common/ProductCard';
import { Box, Sparkles } from 'lucide-react';

export const Service3DPage: React.FC = () => {
  const { products } = useAdmin();
  const serviceProducts = products.filter((p) => p.service === '3d-printing');

  return (
    <div className="space-y-12 pb-20">
      {/* Service Hero */}
      <section className="bg-gradient-to-b from-giftoria-wine-900 to-giftoria-charcoal-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-giftoria-gold-500 text-giftoria-charcoal-900 rounded-full text-xs font-bold uppercase tracking-wider">
              <Box className="w-4 h-4" />
              <span>Bring Ideas to Life</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white">
              3D Printing &amp; Sculptures
            </h1>
            <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
              Divine Ganesha &amp; Saraswati idols, flexible fidget keychains, Minecraft blocks, NASA elevation moon lamps, custom photo lithophanes, and STL prototyping services.
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-serif font-bold text-xl text-giftoria-wine-900">
            3D Printed Collection ({serviceProducts.length})
          </h2>
          <span className="text-xs text-gray-500">Precision PLA &amp; PETG multi-color printing</span>
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
