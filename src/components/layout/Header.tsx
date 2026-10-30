import React, { useState, useEffect, useRef } from 'react';
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
  Phone,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAdmin } from '../../context/AdminContext';
import { CATEGORIES_LIST } from '../../data/products';
import { businessConfig } from '../../config/businessConfig';
import { searchProducts } from '../../utils/searchUtils';
import { validateMaharashtraPincode, DEFAULT_PINCODE_LABEL } from '../../utils/pincodeUtils';

export const Header: React.FC = () => {
  const [location, setLocation] = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { products } = useAdmin();

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSearchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Pincode state
  const [selectedPincode, setSelectedPincode] = useState<string>(() => {
    return localStorage.getItem('giftoria_pincode') || DEFAULT_PINCODE_LABEL;
  });
  const [isPincodeModalOpen, setIsPincodeModalOpen] = useState(false);
  const [tempPincode, setTempPincode] = useState('');
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [pincodeSuccess, setPincodeSuccess] = useState<string | null>(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Suggestions search logic (NO prices shown in suggestions per Part 5)
  const searchSuggestions = React.useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) return [];
    return searchProducts(products, searchQuery).slice(0, 5);
  }, [searchQuery, products]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        desktopSearchRef.current && 
        !desktopSearchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current && 
        !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      setMobileMenuOpen(false);
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

  const handleSelectSuggestion = (slug: string) => {
    setShowSuggestions(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
    setLocation(`/product/${slug}`);
  };

  const handlePincodeVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError(null);
    setPincodeSuccess(null);

    const result = validateMaharashtraPincode(tempPincode);

    if (!result.isValid || !result.isMaharashtra) {
      setPincodeError(result.message);
      return;
    }

    const formattedLabel = `${result.pincode} (${result.region || 'Maharashtra'})`;
    setSelectedPincode(formattedLabel);
    localStorage.setItem('giftoria_pincode', formattedLabel);
    setPincodeSuccess(`Verified! ${result.message}`);

    setTimeout(() => {
      setIsPincodeModalOpen(false);
      setPincodeSuccess(null);
    }, 1200);
  };

  // Helper to determine active category from URL
  const isCategoryActive = (slug: string) => {
    if (location === `/category/${slug}`) return true;
    try {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const catParam = params.get('category');
      const matched = CATEGORIES_LIST.find(c => c.slug === slug);
      if (matched && catParam && catParam.toLowerCase() === matched.name.toLowerCase()) {
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const isAllGiftsActive = () => {
    if (location === '/products' || location === '/category/all') {
      try {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        return !params.get('category') || params.get('category') === 'All';
      } catch {
        return true;
      }
    }
    return false;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-sm">
        
        {/* A. Top Announcement Bar */}
        <div className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 text-white text-xs py-1.5 px-4 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide">
                GIFTORIA
              </span>
              <span className="hidden sm:inline">Customized Gifts Made With Emotions — </span>
              <span>Dispatched Across Maharashtra</span>
            </div>
            
            <div className="flex items-center gap-4 text-sky-100 text-[11px]">
              <a 
                href={businessConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-white transition-colors"
                title="Chat on WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                <span>WhatsApp: {businessConfig.rawPhone}</span>
              </a>
              <Link 
                href="/admin" 
                className="hidden md:flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2 py-0.5 rounded text-[10px] font-bold text-white transition-colors"
                title="Admin Portal"
              >
                <ShieldCheck className="w-3 h-3 text-amber-300" />
                Admin Panel
              </Link>
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
                  GIFTO<span className="text-sky-500">RIA</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-600 tracking-wider -mt-1 hidden sm:block">
                  Customized Gifting
                </span>
              </div>
            </Link>
          </div>

          {/* Location / Maharashtra Pincode Selector */}
          <button
            onClick={() => {
              setTempPincode('');
              setPincodeError(null);
              setPincodeSuccess(null);
              setIsPincodeModalOpen(true);
            }}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-100 hover:border-sky-300 bg-sky-50/60 hover:bg-sky-50 text-slate-700 text-xs font-medium transition-all group"
            title="Select Delivery Location (Maharashtra)"
          >
            <MapPin className="w-4 h-4 text-sky-500 group-hover:animate-bounce" />
            <div className="text-left">
              <div className="text-[10px] text-slate-500 leading-none">Deliver in MH</div>
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <span className="max-w-[140px] truncate">{selectedPincode}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </button>

          {/* Prominent Search Bar with Suggestions */}
          <div ref={desktopSearchRef} className="flex-1 max-w-xl relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search mugs, 3D printed, keychains, frames, t-shirts..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-sky-200 focus:border-sky-500 rounded-full py-2.5 pl-11 pr-24 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Suggestions Dropdown (NO price displayed) */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl border border-sky-100 shadow-xl overflow-hidden z-50">
                {searchSuggestions.length > 0 ? (
                  <div className="divide-y divide-sky-50">
                    <div className="px-4 py-2 bg-sky-50/50 text-[11px] font-bold text-sky-700 flex justify-between items-center">
                      <span>Matching Products</span>
                      <span>Press Enter to view all</span>
                    </div>
                    {searchSuggestions.map((prod) => (
                      <div
                        key={prod.id}
                        onClick={() => handleSelectSuggestion(prod.slug)}
                        className="p-3 flex items-center justify-between gap-3 hover:bg-sky-50/70 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.thumbnail || prod.images?.[0]}
                            alt={prod.name}
                            className="w-10 h-10 rounded-lg object-cover bg-sky-50 border border-sky-100 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate">{prod.name}</p>
                            <span className="text-[10px] text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                              {prod.category}
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-emerald-600 shrink-0 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          Enquire Details
                        </span>
                      </div>
                    ))}
                    <div className="p-2.5 text-center bg-slate-50">
                      <button
                        onClick={handleSearchSubmit}
                        className="text-xs font-bold text-sky-600 hover:underline"
                      >
                        See all results for "{searchQuery}" →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">No matching gifts found for "{searchQuery}"</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Try searching for "mug", "keychain", "3d printed", "frames", or "t-shirt".
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Action Icons */}
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
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link 
              href="/cart" 
              className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-full font-semibold text-xs transition-transform active:scale-95 shadow-sm shadow-sky-200"
              title="Enquiry / Order Cart"
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

        {/* Mobile Search Bar with Suggestions */}
        <div ref={mobileSearchRef} className="px-4 pb-2.5 sm:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search mugs, keychains, 3D, frames..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full bg-slate-50 border border-sky-200 rounded-full py-2 pl-9 pr-20 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-sky-500 absolute left-3 top-1/2 -translate-y-1/2" />
            
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-14 top-1/2 -translate-y-1/2 p-1 text-slate-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-sky-500 text-white text-[11px] font-bold px-3 py-1 rounded-full"
            >
              Find
            </button>
          </form>

          {/* Mobile Suggestions Dropdown */}
          {showSuggestions && searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-4 right-4 mt-1 bg-white rounded-2xl border border-sky-100 shadow-xl overflow-hidden z-50">
              {searchSuggestions.length > 0 ? (
                <div className="divide-y divide-sky-50">
                  {searchSuggestions.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectSuggestion(prod.slug)}
                      className="p-2.5 flex items-center justify-between gap-2.5 hover:bg-sky-50 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={prod.thumbnail || prod.images?.[0]}
                          alt={prod.name}
                          className="w-8 h-8 rounded-lg object-cover bg-sky-50 border border-sky-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">{prod.name}</p>
                          <span className="text-[10px] text-sky-600">{prod.category}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Enquire
                      </span>
                    </div>
                  ))}
                  <div className="p-2 text-center bg-slate-50">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-sky-600"
                    >
                      View all results →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  No matching gifts found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* C. Category Navigation Bar (All Gifts + 8 Categories including Frames) */}
        {/* Strictly responsive 1-click redirect with clean URLs & highlight per Part 2 */}
        <div className="bg-sky-50/70 border-t border-sky-100 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1.5 md:gap-2.5 py-2 whitespace-nowrap">
            <Link 
              href="/products" 
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
                isAllGiftsActive()
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                  : 'text-sky-700 hover:text-sky-900 hover:bg-sky-100/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              All Gifts
            </Link>

            {CATEGORIES_LIST.map((category) => {
              const active = isCategoryActive(category.slug);
              return (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                    active
                      ? 'bg-sky-500 text-white font-bold shadow-sm shadow-sky-200'
                      : 'text-slate-700 hover:text-sky-600 hover:bg-white'
                  }`}
                  title={category.description}
                >
                  {category.name}
                </Link>
              );
            })}
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
                <span className="font-bold text-slate-900">GIFTORIA Categories</span>
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
                  <span>Deliver in MH: <strong>{selectedPincode}</strong></span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 text-sm font-bold rounded-lg ${
                  isAllGiftsActive() ? 'bg-sky-500 text-white' : 'text-sky-600 hover:bg-sky-50'
                }`}
              >
                🎁 All Gifts Catalog
              </Link>

              {CATEGORIES_LIST.map((category) => {
                const active = isCategoryActive(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex flex-col px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      active
                        ? 'bg-sky-500 text-white font-bold'
                        : 'text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        active ? 'bg-white/20 text-white' : 'text-sky-600 bg-sky-50'
                      }`}>
                        {category.count}
                      </span>
                    </div>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-sky-100 mt-4 space-y-1">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-bold text-amber-700 bg-amber-50 rounded-lg"
                >
                  🛡️ Admin Dashboard
                </Link>
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
                  ℹ️ About GIFTORIA
                </Link>
                <Link
                  href="/faq"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-slate-600 hover:bg-sky-50 rounded-lg"
                >
                  ❓ FAQs
                </Link>
                <a
                  href={businessConfig.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block px-3 py-2 text-sm text-emerald-600 font-semibold hover:bg-emerald-50 rounded-lg"
                >
                  💬 WhatsApp Support: {businessConfig.rawPhone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maharashtra Pincode Verification Modal */}
      {isPincodeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-sky-100">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-base">Delivery in Maharashtra</h3>
              </div>
              <button 
                onClick={() => setIsPincodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              GIFTORIA delivers throughout Maharashtra. Enter your 6-digit Indian PIN code to verify serviceability in your district.
            </p>

            <form onSubmit={handlePincodeVerify} className="mt-4 space-y-3">
              <div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 400001, 411001, 440001"
                  value={tempPincode}
                  onChange={(e) => {
                    setTempPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeError(null);
                    setPincodeSuccess(null);
                  }}
                  className="w-full px-4 py-2.5 border border-sky-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm font-semibold tracking-wider text-slate-800"
                  autoFocus
                />
              </div>

              {pincodeError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pincodeError}</span>
                </div>
              )}

              {pincodeSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{pincodeSuccess}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPincode(DEFAULT_PINCODE_LABEL);
                    localStorage.setItem('giftoria_pincode', DEFAULT_PINCODE_LABEL);
                    setIsPincodeModalOpen(false);
                  }}
                  className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Default (Mumbai)
                </button>
                <button
                  type="submit"
                  disabled={tempPincode.length !== 6}
                  className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Check Service
                </button>
              </div>
            </form>
            
            <div className="mt-4 pt-3 border-t border-sky-100 text-[11px] text-slate-500 text-center">
              * Delivery is currently provided across all serviceable PIN codes in Maharashtra.
            </div>
          </div>
        </div>
      )}
    </>
  );
};
