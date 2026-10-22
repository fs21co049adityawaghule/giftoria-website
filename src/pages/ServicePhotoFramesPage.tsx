import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/common/ProductCard';
import { Image as ImageIcon, CheckCircle } from 'lucide-react';

export const ServicePhotoFramesPage: React.FC = () => {
  const { products } = useAdmin();
  const serviceProducts = products.filter((p) => p.service === 'photo-frames');

  return (
    <div className="space-y-12 pb-20">
      <section className="bg-gradient-to-b from-giftoria-wine-900 to-giftoria-charcoal-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-giftoria-wine-800 text-giftoria-gold-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <ImageIcon className="w-4 h-4" />
              <span>Service 5</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-5xl text-white">
              Customized Photo Frames
            </h1>
            <p className="text-xs sm:text-base text-gray-300 leading-relaxed">
              Memories preserved with crystal clarity. Choose from 4 × 4 inch square, 4 × 6 inch classic, and A4 size wall frames with synthetic wooden borders and photo lab 300 GSM prints.
            </p>
          </div>
        </div>
      </section>

      {/* Helpful Photo Quality Tip Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-giftoria-cream-100 border border-giftoria-wine-800/15 rounded-2xl p-4 sm:p-5 flex items-center gap-3 text-xs text-giftoria-wine-900">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="font-bold">Pro Tip for Best Frame Results:</strong> Upload a clear, high-resolution photograph (up to 1 MB). Our studio auto-enhances lighting before framing!
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-serif font-bold text-xl text-giftoria-wine-900">
            Photo Frame Sizes ({serviceProducts.length})
          </h2>
          <span className="text-xs text-gray-500">Anti-glare glass &amp; dual wall/desk hooks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {serviceProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
