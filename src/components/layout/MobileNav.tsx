import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Grid, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileNav: React.FC = () => {
  const [location] = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/products', icon: Grid },
    { label: 'Favorites', href: '/wishlist', icon: Heart, badge: wishlistCount },
    { label: 'Cart', href: '/cart', icon: ShoppingBag, badge: cartCount },
    { label: 'Account', href: '/account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-giftoria-wine-800/10 py-1.5 px-2 shadow-lg">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-giftoria-wine-800 font-bold scale-105'
                  : 'text-gray-500 hover:text-giftoria-wine-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-giftoria-wine-800 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
