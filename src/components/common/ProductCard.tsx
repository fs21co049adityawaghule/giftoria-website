import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { Heart, Star, ShoppingBag, Zap, Check } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [, setLocation] = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleCardClick = () => {
    setLocation(`/product/${product.slug}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    addToCart(product, {}, 1);
    setJustAdded(true);

    setTimeout(() => {
      setJustAdded(false);
      setIsAdding(false);
    }, 1200);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdding) return;

    // If customization is required/supported, direct customer to product detail page to collect customization info
    if (product.customizable) {
      showToast(`Please specify your customization details for "${product.name}"`, 'info');
      setLocation(`/product/${product.slug}?customize=true`);
    } else {
      addToCart(product, {}, 1);
      setLocation('/checkout');
    }
  };

  const wishlisted = isWishlisted(product.id);

  return (
    <div 
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl border border-sky-100 shadow-xs hover:shadow-xl hover:shadow-sky-100/70 hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col overflow-hidden cursor-pointer hover:border-sky-300 motion-reduce:hover:transform-none motion-reduce:transition-none"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start pointer-events-none">
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
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 transform group-hover:scale-105 ${
          wishlisted 
            ? 'bg-rose-50 text-rose-500 shadow-sm' 
            : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white shadow-sm'
        }`}
      >
        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500' : ''}`} />
      </button>

      {/* Product Image with smooth 1.06 zoom on hover */}
      <div className="relative aspect-square w-full overflow-hidden bg-sky-50/50">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-350 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600';
          }}
        />
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Delivery notice tag */}
          <div className="text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-100 rounded-md px-2 py-0.5 inline-block mb-1.5">
            {product.deliveryLabel || 'Next-Day Dispatch'}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-slate-800 text-sm md:text-base line-clamp-2 leading-snug group-hover:text-sky-600 transition-colors duration-200">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
            </div>
            <span className="text-xs text-slate-500">({product.reviewsCount} reviews)</span>
          </div>
        </div>

        {/* Action: ADD TO CART (Secondary) + BUY NOW (Primary) */}
        <div className="pt-3 mt-3 border-t border-sky-50 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding || product.isComingSoon}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${
              justAdded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                : 'bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 hover:border-sky-300 shadow-xs'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="truncate">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-sky-600" />
                <span className="truncate">Add to Cart</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isAdding || product.isComingSoon}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 hover:shadow-sky-300 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
            aria-label={`Buy ${product.name} now`}
          >
            <Zap className="w-3.5 h-3.5 fill-white text-white" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
