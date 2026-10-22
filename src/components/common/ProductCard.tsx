import React from 'react';
import { Link, useLocation } from 'wouter';
import { Heart, ShoppingBag, Zap, Star, Check } from 'lucide-react';
import { Product } from '../../types';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [, navigate] = useLocation();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const wishlisted = isWishlisted(product.id);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {}, 1);
    navigate('/cart');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, {}, 1);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  // Badge picker
  const renderBadge = () => {
    if (product.isComingSoon) {
      return <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Coming Soon</span>;
    }
    if (product.bestSeller) {
      return <span className="bg-giftoria-gold-500 text-giftoria-charcoal-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">BEST SELLER</span>;
    }
    if (product.newProduct) {
      return <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>;
    }
    if (product.customizable) {
      return <span className="bg-giftoria-wine-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">CUSTOMIZABLE</span>;
    }
    return null;
  };

  return (
    <div className="group bg-white rounded-2xl border border-giftoria-wine-800/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      <Link href={`/product/${product.slug}`} className="block flex-1">
        {/* Top Product Image Container */}
        <div className="relative aspect-[4/5] bg-giftoria-cream-200 overflow-hidden">
          <img
            src={product.thumbnail || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Top Left Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            {renderBadge()}
          </div>

          {/* Top Right Favorite Overlay Button */}
          <button
            onClick={handleToggleFavorite}
            className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
              wishlisted
                ? 'bg-rose-500 text-white scale-110'
                : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500'
            }`}
            aria-label={wishlisted ? "Remove from favorites" : "Add to favorites"}
            title={wishlisted ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Product Details Section below image */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
          <div>
            {/* Category / Service name */}
            <div className="text-[10px] font-semibold uppercase tracking-wider text-giftoria-wine-800/80 mb-1">
              {product.serviceName}
            </div>

            {/* Product Title */}
            <h3 className="font-medium text-xs sm:text-sm text-giftoria-charcoal-900 line-clamp-2 group-hover:text-giftoria-wine-800 transition-colors leading-snug">
              {product.name}
            </h3>

            {/* Rating Stars */}
            {product.rating && (
              <div className="flex items-center gap-1 mt-1.5">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                </div>
                <span className="text-[11px] font-bold text-giftoria-charcoal-800">{product.rating}</span>
                {product.reviewsCount && (
                  <span className="text-[10px] text-gray-400">({product.reviewsCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Price Row */}
          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-baseline gap-2">
            <span className="font-bold text-sm sm:text-base text-giftoria-wine-900">
              ₹{product.price}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.compareAtPrice}
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* REQUIRED ACTION ROW DIRECTLY BELOW PRODUCT IMAGE / DETAILS */}
      <div className="p-2 sm:p-3 pt-0 grid grid-cols-3 gap-1.5 border-t border-gray-50 bg-gray-50/50">
        
        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={product.isComingSoon || product.stock <= 0}
          className="flex items-center justify-center gap-1 bg-giftoria-gold-500 hover:bg-giftoria-gold-600 disabled:opacity-50 text-giftoria-charcoal-900 text-[11px] font-bold py-2 px-1.5 rounded-xl transition-all shadow-sm active:scale-95"
          title="Buy Now"
        >
          <Zap className="w-3.5 h-3.5 shrink-0 fill-current" />
          <span className="truncate">Buy</span>
        </button>

        {/* Favorite Heart Toggle Button */}
        <button
          onClick={handleToggleFavorite}
          className={`flex items-center justify-center gap-1 border text-[11px] font-bold py-2 px-1.5 rounded-xl transition-all active:scale-95 ${
            wishlisted
              ? 'bg-rose-50 border-rose-300 text-rose-600'
              : 'bg-white border-gray-200 text-gray-700 hover:border-giftoria-wine-800 hover:text-giftoria-wine-800'
          }`}
          title={wishlisted ? "Saved in Wishlist" : "Save to Favorites"}
        >
          <Heart className={`w-3.5 h-3.5 shrink-0 ${wishlisted ? 'fill-current text-rose-600' : ''}`} />
          <span className="truncate hidden xs:inline">{wishlisted ? 'Saved' : 'Fav'}</span>
        </button>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.isComingSoon || product.stock <= 0}
          className="flex items-center justify-center gap-1 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 disabled:opacity-50 text-white text-[11px] font-bold py-2 px-1.5 rounded-xl transition-all shadow-sm active:scale-95"
          title="Add to Cart"
        >
          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Cart</span>
        </button>

      </div>
    </div>
  );
};
