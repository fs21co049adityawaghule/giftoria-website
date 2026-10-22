import React from 'react';
import { Link } from 'wouter';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shadow-sm">
          <Heart className="w-10 h-10 fill-current" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
            Save the gifts you love ❤️
          </h1>
          <p className="text-xs text-gray-500">
            Tap the heart icon on any customized item to keep track of your favorite gifts.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-sm py-3.5 px-8 rounded-2xl shadow-wine transition-all"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
            My Favorites ({wishlistCount})
          </h1>
          <p className="text-xs text-gray-500">Your saved customized gifts and 3D creations</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
