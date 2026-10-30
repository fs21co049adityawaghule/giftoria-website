import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdmin } from '../context/AdminContext';
import { CATEGORIES_LIST, OCCASIONS_LIST } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { Filter, SlidersHorizontal, Sparkles, MessageCircle, HeartHandshake } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

function resolveCategoryFromPath(pathname: string, searchParam: string | null): string {
  if (searchParam) return searchParam;

  const lower = pathname.toLowerCase();
  if (lower.startsWith('/category/')) {
    const slug = lower.replace('/category/', '').trim();
    const matched = CATEGORIES_LIST.find(c => c.slug === slug);
    if (matched) return matched.name;
  }

  if (lower.includes('personalized')) return 'Personalized Gifts';
  if (lower.includes('3d') || lower.includes('arts')) return '3D Arts';
  if (lower.includes('frame')) return 'Frames';
  if (lower.includes('forever') || lower.includes('bloom')) return 'Forever Blooms';
  if (lower.includes('hamper')) return 'Gift Hampers';
  if (lower.includes('birthday')) return 'Birthday Gifts';
  if (lower.includes('anniversary')) return 'Anniversary Gifts';
  if (lower.includes('jewel')) return 'Jewellery';

  return 'All';
}

export const ShopPage: React.FC = () => {
  const [location] = useLocation();
  const { products } = useAdmin();

  const getParam = (key: string) => {
    try {
      const search = window.location.search;
      return new URLSearchParams(search).get(key);
    } catch {
      return null;
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return resolveCategoryFromPath(location, getParam('category'));
  });

  const [selectedOccasion, setSelectedOccasion] = useState<string>(() => {
    return getParam('occasion') || 'All';
  });

  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state on location change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const cat = resolveCategoryFromPath(location, getParam('category'));
    setSelectedCategory(cat);

    const occ = getParam('occasion') || 'All';
    setSelectedOccasion(occ);

    if (getParam('filter') === 'bestsellers') setSortBy('bestseller');
    if (getParam('filter') === 'trending') setSortBy('trending');
  }, [location]);

  // Robust normalized category filter
  const filteredProducts = useMemo(() => {
    // Only display active products on customer site
    const activeCatalog = products.filter(p => p.isActive !== false);

    return activeCatalog.filter((product) => {
      if (selectedCategory !== 'All') {
        const prodCat = product.category.toLowerCase().replace(/[^\w]/g, '');
        const selCat = selectedCategory.toLowerCase().replace(/[^\w]/g, '');
        if (prodCat !== selCat) {
          const matchTag = product.tags?.some(t => t.toLowerCase().includes(selCat));
          if (!matchTag) return false;
        }
      }

      if (selectedOccasion !== 'All') {
        if (!product.occasion || product.occasion.toLowerCase() !== selectedOccasion.toLowerCase()) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'bestseller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      if (sortBy === 'trending') return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      return 0; // default featured
    });
  }, [products, selectedCategory, selectedOccasion, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedOccasion('All');
    setSortBy('featured');
  };

  const currentCategoryMeta = CATEGORIES_LIST.find(
    c => c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="text-xs text-slate-500 mb-1 flex items-center gap-1.5">
            <span>Home</span>
            <span>/</span>
            <span className="text-sky-600 font-semibold">
              {selectedCategory === 'All' ? 'All Gifts Catalog' : selectedCategory}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {selectedCategory === 'All' ? 'All Gifts' : selectedCategory}
              </h1>
              
              {selectedCategory === 'Forever Blooms' ? (
                <p className="text-xs font-semibold text-sky-600 mt-1">
                  Handcrafted flowers that last — handmade crochet, satin ribbon, paper and everlasting bouquets.
                </p>
              ) : currentCategoryMeta?.description ? (
                <p className="text-xs text-slate-500 mt-1">
                  {currentCategoryMeta.description} • {filteredProducts.length} items available
                </p>
              ) : (
                <p className="text-xs text-slate-500 mt-1">
                  Showing {filteredProducts.length} approved gift items
                </p>
              )}
            </div>

            {/* Mobile Filter toggle button & Desktop Sort dropdown */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-sky-200 text-xs font-bold text-slate-700 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4 text-sky-500" />
                Categories & Filters
              </button>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-medium shadow-xs">
                <span className="text-slate-500 hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="bestseller">Best Sellers</option>
                  <option value="trending">Trending Now</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-5 rounded-2xl border border-sky-100 shadow-xs space-y-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-sm">Browse Categories</h3>
              </div>
              {(selectedCategory !== 'All' || selectedOccasion !== 'All') && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-sky-600 font-semibold hover:underline"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Categories Filter (The Exact 8 Categories + All Gifts) */}
            <div>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === 'All'
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                      : 'text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                  }`}
                >
                  All Gifts ({products.filter(p => p.isActive !== false).length})
                </button>

                {CATEGORIES_LIST.map((cat) => {
                  const count = products.filter(
                    p => p.isActive !== false && p.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;
                  const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                          : 'text-slate-700 hover:bg-sky-50 hover:text-sky-600'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {count > 0 ? count : 'Soon'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasions Filter */}
            <div className="pt-3 border-t border-sky-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Shop By Occasion
              </h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedOccasion('All')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedOccasion === 'All'
                      ? 'bg-sky-100 text-sky-800 font-bold'
                      : 'text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  All Occasions
                </button>
                {OCCASIONS_LIST.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedOccasion === occ
                        ? 'bg-sky-100 text-sky-800 font-bold'
                        : 'text-slate-600 hover:bg-sky-50'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* WhatsApp Custom Enquiry Box */}
            <div className="pt-3 border-t border-sky-100">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                <p className="font-bold flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Looking for custom order?
                </p>
                <p className="text-[11px] text-emerald-700">
                  Chat directly with our design team on WhatsApp for bulk or unique requirements.
                </p>
                <a
                  href={businessConfig.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-center font-bold text-white bg-emerald-600 hover:bg-emerald-700 py-1.5 rounded-lg text-xs transition-colors"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>

          </aside>

          {/* Product Grid Area */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-sky-100 shadow-xs max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Products Coming Soon</h3>
                <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                  New handcrafted creations for <strong>{selectedCategory}</strong> are currently being curated and will be listed here soon.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="w-full sm:w-auto bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
                  >
                    View All Active Gifts
                  </button>
                  <a
                    href={businessConfig.whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Enquire Custom Order
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-sky-100">
              <h3 className="font-bold text-slate-900">Select Category</h3>
              <button 
                onClick={() => setMobileFilterOpen(false)}
                className="text-slate-500 p-1 text-base font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Categories</h4>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedCategory('All'); setMobileFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${selectedCategory === 'All' ? 'bg-sky-500 text-white font-bold' : 'text-slate-700'}`}
                  >
                    All Gifts
                  </button>
                  {CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.name); setMobileFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'bg-sky-500 text-white font-bold' : 'text-slate-700'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-sky-100 mt-auto flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-bold text-white bg-sky-500 rounded-xl"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
