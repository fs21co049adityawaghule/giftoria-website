import React from 'react';
import { useLocation } from 'wouter';
import { Heart, MessageCircle, Star, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { businessConfig } from '../../config/businessConfig';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [, setLocation] = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const handleCardClick = () => {
    setLocation(`/product/${product.slug}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleWhatsAppEnquiry = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `Hello GIFTORIA, I would like to enquire about "${product.name}" (ID: ${product.id}). Please share the customization options and details.`;
    const url = `https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer hover:border-sky-300"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {product.isComingSoon ? (
          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Coming Soon
          </span>
        ) : product.customizable ? (
          <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            Customizable
          </span>
        ) : null}
      </div>

      {/* Wishlist button */}
      <button
        onClick={handleWishlistToggle}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
          wishlisted 
            ? 'bg-rose-50 text-rose-500 shadow-sm' 
            : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white shadow-sm'
        }`}
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-sky-50/50">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Delivery notice tag */}
          <div className="text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-md px-2 py-0.5 inline-block mb-1.5">
            {product.deliveryLabel || 'Next-Day Dispatch'}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xs text-slate-600">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Action: Enquire on WhatsApp (NO customer prices as strictly requested in Part 5) */}
        <div className="pt-3 mt-3 border-t border-sky-50 flex items-center justify-between gap-2">
          <button
            onClick={handleWhatsAppEnquiry}
            className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
            aria-label="Enquire on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white stroke-emerald-600" />
            <span>Enquire on WhatsApp</span>
          </button>
          
          <button
            onClick={handleCardClick}
            className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors shrink-0"
            title="View Details"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
