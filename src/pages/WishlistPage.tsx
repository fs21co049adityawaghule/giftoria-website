import React from 'react';
import { Link } from 'wouter';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="bg-[#F8FCFF] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-12 text-center max-w-md w-full shadow-xs">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center mb-5">
            <Heart className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Wishlist is Empty</h2>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            Tap the heart icon on any bouquet, cake, plant, or personalized keepsake to save it here for upcoming birthdays and special occasions.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-sky-200 transition-all text-sm"
          >
            Discover Gifting Ideas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8 pb-4 border-b border-sky-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Saved Wishlist ({wishlist.length})
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Your favorite celebration items saved for quick gifting
            </p>
          </div>
          <Link href="/products" className="text-xs font-bold text-sky-600 hover:text-sky-700">
            Browse More Gifts →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

      </div>
    </div>
  );
};
