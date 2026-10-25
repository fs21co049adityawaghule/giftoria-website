import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Search, 
  MapPin, 
  Heart, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Gift, 
  ChevronDown, 
  Clock, 
  Sparkles,
  Phone
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { CATEGORIES_LIST } from '../../data/products';
import { businessConfig } from '../../config/businessConfig';

export const Header: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPincode, setSelectedPincode] = useState('400001 (Mumbai)');
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handlePincodeSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempPincode.trim().length === 6 && /^\d+$/.test(tempPincode)) {
      setSelectedPincode(`${tempPincode} (Verified)`);
      setIsPincodeModalOpen(false);
    } else {
      setSelectedPincode(tempPincode.trim() || '400001 (Mumbai)');
      setIsPincodeModalOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
        {/* A. Top Announcement Bar */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white text-xs py-1.5 px-4 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">
                SPECIAL OFFER
              </span>
              <span className="hidden sm:inline">Make Every Moment Special — </span>
              <span>Free Delivery on orders above ₹799</span>
            </div>
            
            <div className="flex items-center gap-4 text-sky-100 text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sky-200" />
                Same Day & Midnight Delivery
              </span>
              <a 
                href={`tel:${businessConfig.supportPhone}`} 
                className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {businessConfig.supportPhoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* B. Main Header */}
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile menu toggle & Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 hover:bg-sky-50 lg:hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-sky-600" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-200 group-hover:scale-105 transition-transform">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
                  Sky<span className="text-sky-500">Gift</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider -mt-1 hidden sm:block">
                  Express Gifting
                </span>
              </div>
            </Link>
          </div>

          {/* Location / Pincode Selector */}
          <button
            onClick={() => setIsPincodeModalOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-100 hover:border-sky-300 bg-sky-50/60 hover:bg-sky-50 text-slate-700 text-xs font-medium transition-all group"
            title="Change Delivery Location"
          >
            <MapPin className="w-4 h-4 text-sky-500 group-hover:animate-bounce" />
            <div className="text-left">
              <div className="text-[10px] text-slate-600 leading-none">Deliver to</div>
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <span className="max-w-[110px] truncate">{selectedPincode}</span>
                <ChevronDown className="w-3 h-3 text-slate-600" />
              </div>
            </div>
          </button>

          {/* Prominent Search Bar */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex-1 max-w-xl relative hidden sm:block"
          >
            <input
              type="text"
              placeholder="Search flowers, cakes, personalized gifts, plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-sky-200 focus:border-sky-500 rounded-full py-2.5 pl-11 pr-24 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Actions: Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              href="/account" 
              className="flex items-center gap-1.5 text-slate-700 hover:text-sky-600 p-2 rounded-xl hover:bg-sky-50 transition-colors"
              title="My Account"
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-semibold hidden md:inline">Account</span>
            </Link>

            <Link 
              href="/wishlist" 
              className="relative p-2 text-slate-700 hover:text-rose-500 rounded-xl hover:bg-sky-50 transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link 
              href="/cart" 
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-full font-semibold text-xs transition-transform active:scale-95 shadow-sm shadow-sky-200"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search flowers, cakes, gifts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-sky-200 rounded-full py-2 pl-9 pr-20 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-sky-500 text-white text-[11px] font-bold px-3 py-1 rounded-full"
            >
              Find
            </button>
          </form>
        </div>

        {/* C. Category Navigation Bar */}
        <div className="bg-sky-50/70 border-t border-sky-100 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1 md:gap-3 py-2 whitespace-nowrap">
            <Link 
              href="/products" 
              className="text-xs font-bold text-sky-700 hover:text-sky-900 px-2.5 py-1 rounded-lg hover:bg-sky-100/80 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              All Gifts
            </Link>
            {CATEGORIES_LIST.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${encodeURIComponent(category.name)}`}
                className="text-xs font-semibold text-slate-700 hover:text-sky-600 hover:bg-white px-2.5 py-1 rounded-lg transition-all"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Side Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-sky-100 flex items-center justify-between bg-sky-50">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-sky-600" />
                <span className="font-bold text-slate-900">SkyGift Categories</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Pincode button */}
            <div className="p-3 border-b border-sky-100 bg-sky-50/40">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsPincodeModalOpen(true);
                }}
                className="w-full flex items-center justify-between text-xs text-slate-700 font-medium p-2 rounded-lg bg-white border border-sky-200"
              >
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  <span>Deliver to: <strong>{selectedPincode}</strong></span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-bold text-sky-600 hover:bg-sky-50 rounded-lg"
              >
                🎁 Explore All Products
              </Link>
              {CATEGORIES_LIST.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-600 rounded-lg"
                >
                  <span>{category.name}</span>
                  <span className="text-[11px] text-sky-500 bg-sky-50 px-2 py-0.5 rounded-full">
                    {category.count}
                  </span>
                </Link>
              ))}

              <div className="pt-4 border-t border-sky-100 mt-4 space-y-1">
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 rounded-lg"
                >
                  👤 My Profile & Orders
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 rounded-lg"
                >
                  ❤️ My Wishlist ({wishlistCount})
                </Link>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 rounded-lg"
                >
                  ℹ️ About SkyGift
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 rounded-lg"
                >
                  📞 Customer Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pincode Selector Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-base">Select Delivery Location</h3>
              </div>
              <button 
                onClick={() => setIsPincodeModalOpen(false)}
                className="text-slate-600 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3">
              Enter your 6-digit Indian PIN code to check express delivery availability, midnight slots, and accurate courier timelines.
            </p>

            <form onSubmit={handlePincodeSave} className="mt-4 space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 400001, 110001, 560001"
                  value={tempPincode}
                  onChange={(e) => setTempPincode(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2.5 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold tracking-wider text-slate-800"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPincode('400001 (Mumbai)');
                    setIsPincodeModalOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Reset Default
                </button>
                <button
                  type="submit"
                  disabled={tempPincode.length !== 6}
                  className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Save Pincode
                </button>
              </div>
            </form>
            
            <div className="mt-4 pt-3 border-t border-sky-100 text-[11px] text-slate-600 text-center">
              * Delivery dates and slots are calculated based on your destination pincode.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
