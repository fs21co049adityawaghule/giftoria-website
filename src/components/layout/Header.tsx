import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  ShoppingBag, 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  Gift,
  Printer,
  Shirt,
  Image as ImageIcon,
  Box,
  Layers,
  PhoneCall,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { businessConfig } from '../../config/businessConfig';

export const Header: React.FC = () => {
  const [location, navigate] = useLocation();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const categoryServices = [
    { name: 'Customized Gifts', href: '/customized-gifts', icon: Gift, desc: 'Mugs, Bottles, Standees, Caps' },
    { name: '3D Printing', href: '/3d-printing', icon: Box, desc: 'Idols, Moon Lamps, Prototypes' },
    { name: 'DTF Printing', href: '/dtf-printing', icon: Shirt, desc: 'T-Shirts, Polo, Carry Bags' },
    { name: 'Sublimation Printing', href: '/sublimation-printing', icon: Printer, desc: 'High gloss Mugs, Keychains, Sippers' },
    { name: 'Photo Frames', href: '/photo-frames', icon: ImageIcon, desc: '4x4, 4x6 & A4 Wall & Desk Frames' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-giftoria-wine-800/10 shadow-sm transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-giftoria-wine-800 text-white text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-giftoria-gold-400 animate-pulse" />
        <span>Customized Gifts Made With Emotions — Free Shipping Across India on Orders Above ₹{businessConfig.freeShippingThreshold}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-giftoria-wine-800 to-giftoria-wine-900 flex items-center justify-center text-giftoria-gold-400 shadow-md group-hover:scale-105 transition-transform">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-giftoria-wine-800 group-hover:text-giftoria-wine-700 transition-colors">
                GIFTORIA
              </span>
              <span className="text-[9px] font-semibold tracking-wider text-giftoria-gold-600 uppercase -mt-1 hidden sm:block">
                Made With Emotions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <Link 
              href="/" 
              className={`transition-colors hover:text-giftoria-wine-800 ${location === '/' ? 'text-giftoria-wine-800 font-bold border-b-2 border-giftoria-wine-800 pb-1' : 'text-giftoria-charcoal-700'}`}
            >
              Home
            </Link>

            {/* Category Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setCategoriesDropdownOpen(true)}
              onMouseLeave={() => setCategoriesDropdownOpen(false)}
            >
              <button 
                className="flex items-center gap-1 py-2 text-giftoria-charcoal-700 hover:text-giftoria-wine-800 transition-colors"
                aria-expanded={categoriesDropdownOpen}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesDropdownOpen ? 'rotate-180 text-giftoria-wine-800' : ''}`} />
              </button>

              {categoriesDropdownOpen && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-giftoria-wine-800/10 py-3 px-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="text-[10px] font-bold tracking-wider text-giftoria-wine-800 uppercase px-3 pb-2 border-b border-gray-100">
                    Our 5 Core Services
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {categoryServices.map((cat) => {
                      const IconComponent = cat.icon;
                      return (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-giftoria-wine-50 transition-colors text-giftoria-charcoal-900 group/item"
                        >
                          <div className="p-2 rounded-lg bg-giftoria-wine-50 text-giftoria-wine-800 group-hover/item:bg-giftoria-wine-800 group-hover/item:text-white transition-colors shrink-0">
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-giftoria-wine-900 group-hover/item:text-giftoria-wine-800">
                              {cat.name}
                            </div>
                            <div className="text-[11px] text-gray-500 line-clamp-1">
                              {cat.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/products" 
              className={`transition-colors hover:text-giftoria-wine-800 ${location === '/products' ? 'text-giftoria-wine-800 font-bold border-b-2 border-giftoria-wine-800 pb-1' : 'text-giftoria-charcoal-700'}`}
            >
              Shop All
            </Link>

            <Link 
              href="/services" 
              className={`transition-colors hover:text-giftoria-wine-800 ${location === '/services' ? 'text-giftoria-wine-800 font-bold border-b-2 border-giftoria-wine-800 pb-1' : 'text-giftoria-charcoal-700'}`}
            >
              Services
            </Link>

            <Link 
              href="/about" 
              className={`transition-colors hover:text-giftoria-wine-800 ${location === '/about' ? 'text-giftoria-wine-800 font-bold border-b-2 border-giftoria-wine-800 pb-1' : 'text-giftoria-charcoal-700'}`}
            >
              About
            </Link>

            <Link 
              href="/contact" 
              className={`transition-colors hover:text-giftoria-wine-800 ${location === '/contact' ? 'text-giftoria-wine-800 font-bold border-b-2 border-giftoria-wine-800 pb-1' : 'text-giftoria-charcoal-700'}`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center flex-1 max-w-xs relative">
            <input
              type="text"
              placeholder="Search gifts, 3D prints, mugs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-giftoria-cream-100 border border-giftoria-wine-800/15 rounded-full py-2 pl-4 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800 focus:bg-white transition-all text-giftoria-charcoal-900 placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="absolute right-3 p-1 text-gray-500 hover:text-giftoria-wine-800 transition-colors"
              aria-label="Search button"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Search Toggle Icon for mobile */}
            <Link
              href="/search"
              className="md:hidden p-2 rounded-full text-giftoria-charcoal-700 hover:text-giftoria-wine-800 hover:bg-giftoria-wine-50 transition-colors"
              aria-label="Search page"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="relative p-2 rounded-full text-giftoria-charcoal-700 hover:text-giftoria-wine-800 hover:bg-giftoria-wine-50 transition-colors"
              aria-label="View Favorites"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-giftoria-wine-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-giftoria-charcoal-700 hover:text-giftoria-wine-800 hover:bg-giftoria-wine-50 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-giftoria-gold-500 text-giftoria-charcoal-900 text-[10px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Account / Orders Link */}
            <Link
              href="/account"
              className="hidden sm:flex items-center p-2 rounded-full text-giftoria-charcoal-700 hover:text-giftoria-wine-800 hover:bg-giftoria-wine-50 transition-colors"
              aria-label="User Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-giftoria-charcoal-800 hover:bg-giftoria-wine-50 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Slide-out Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
          <div className="w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto p-5 animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-giftoria-wine-800 text-giftoria-gold-400 flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <span className="font-serif font-bold text-lg text-giftoria-wine-800">GIFTORIA</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                  aria-label="Close navigation drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search input in drawer */}
              <form onSubmit={handleSearchSubmit} className="mt-4 relative">
                <input
                  type="text"
                  placeholder="Search gifts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-4 pr-10 text-xs text-giftoria-charcoal-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Main Links */}
              <div className="mt-6 space-y-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-medium text-sm text-giftoria-charcoal-900 hover:bg-giftoria-wine-50 hover:text-giftoria-wine-800"
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-medium text-sm text-giftoria-charcoal-900 hover:bg-giftoria-wine-50 hover:text-giftoria-wine-800"
                >
                  Shop All Products
                </Link>
                <Link
                  href="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-medium text-sm text-giftoria-charcoal-900 hover:bg-giftoria-wine-50 hover:text-giftoria-wine-800"
                >
                  Services
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-medium text-sm text-giftoria-charcoal-900 hover:bg-giftoria-wine-50 hover:text-giftoria-wine-800"
                >
                  My Account & Orders
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl font-medium text-sm text-giftoria-gold-700 bg-giftoria-gold-50 hover:bg-giftoria-gold-100 flex items-center justify-between"
                >
                  <span>Admin Dashboard</span>
                  <SlidersHorizontal className="w-4 h-4" />
                </Link>
              </div>

              {/* Service Categories Accordion */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="px-3 text-xs font-bold text-giftoria-wine-800 uppercase tracking-wider mb-2">
                  Our Customized Services
                </div>
                <div className="space-y-1">
                  {categoryServices.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-giftoria-charcoal-800 hover:bg-giftoria-wine-50 hover:text-giftoria-wine-800"
                      >
                        <IconComponent className="w-4 h-4 text-giftoria-wine-800" />
                        <span>{cat.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Contact */}
            <div className="pt-4 border-t border-gray-100 mt-6 text-xs text-gray-500 space-y-2">
              <div className="font-semibold text-giftoria-wine-900">Need Customization Help?</div>
              <a
                href={`https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent("Hello GIFTORIA, I would like to enquire about a customized product.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-700 font-medium py-1.5 px-3 bg-emerald-50 rounded-lg"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>WhatsApp: {businessConfig.whatsappDisplay}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
