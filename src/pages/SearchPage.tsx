import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Search, Sparkles, ArrowRight, Frown } from 'lucide-react';
import { INITIAL_PRODUCTS, CATEGORIES_LIST } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';

export const SearchPage: React.FC = () => {
  const [location, setLocation] = useLocation();

  const getQueryFromUrl = () => {
    const searchPart = window.location.search;
    return new URLSearchParams(searchPart).get('q') || '';
  };

  const [query, setQuery] = useState(getQueryFromUrl);

  useEffect(() => {
    setQuery(getQueryFromUrl());
  }, [location]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const clean = query.toLowerCase().trim();
    return INITIAL_PRODUCTS.filter((product) => {
      const matchName = product.name.toLowerCase().includes(clean);
      const matchCat = product.category.toLowerCase().includes(clean);
      const matchTags = product.tags.some((t) => t.toLowerCase().includes(clean));
      const matchDesc = product.description.toLowerCase().includes(clean);
      return matchName || matchCat || matchTags || matchDesc;
    });
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Input Box */}
        <div className="max-w-2xl mx-auto mb-10 text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Search SkyGift Store
          </h1>
          <p className="text-xs text-slate-500">
            Find fresh flowers, cakes, indoor plants, personalized photo keepsakes & gift hampers
          </p>

          <form onSubmit={handleSearchSubmit} className="relative mt-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by gift type, flower, cake flavour, occasion..."
              className="w-full bg-white border border-sky-200 focus:border-sky-500 rounded-2xl py-3.5 pl-12 pr-28 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-sky-100 shadow-sm"
              autoFocus
            />
            <Search className="w-5 h-5 text-sky-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Quick search suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
            <span className="text-slate-400 text-[11px]">Popular:</span>
            {['Roses', 'Truffle Cake', 'Money Plant', 'Personalized Mug', 'Hampers', 'Birthday'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  setLocation(`/search?q=${encodeURIComponent(tag)}`);
                }}
                className="bg-white hover:bg-sky-50 border border-sky-200 text-sky-700 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {query.trim() === '' ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-sky-100 p-8 max-w-xl mx-auto shadow-xs">
            <Sparkles className="w-10 h-10 text-sky-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">Start searching for gifts</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Type any keyword like "Red roses", "Chocolate cake", "Anniversary plaque" or "Gift basket" above to see matching products.
            </p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-sky-100 p-8 max-w-lg mx-auto shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
              <Frown className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              No gifts found for "{query}"
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find exact matches. Try searching for broader terms like <strong>Roses</strong>, <strong>Cakes</strong>, <strong>Plants</strong>, or browse our popular categories below.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all"
              >
                Browse All Gifts <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Found {searchResults.length} {searchResults.length === 1 ? 'gift' : 'gifts'} for "{query}"
              </h2>
              <span className="text-xs text-slate-500">Express delivery available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
