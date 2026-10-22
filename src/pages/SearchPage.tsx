import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/common/ProductCard';
import { Search, X } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [location] = useLocation();
  const { products } = useAdmin();

  // Read search query from URL query string if present
  const getQueryParam = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  };

  const [searchQuery, setSearchQuery] = useState(getQueryParam);

  useEffect(() => {
    setSearchQuery(getQueryParam());
  }, [location]);

  const searchResults = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.serviceName.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="border-b border-gray-200 pb-4 space-y-4">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
          Search Products &amp; Gifts
        </h1>

        <div className="relative max-w-xl">
          <input
            type="text"
            placeholder="Search by name, mug, 3D lamp, frame size, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-2xl py-3 pl-10 pr-10 text-xs text-giftoria-charcoal-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 mb-4">
          Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery || 'All'}"
        </div>

        {searchResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border max-w-md mx-auto space-y-3">
            <Search className="w-8 h-8 text-gray-400 mx-auto" />
            <h3 className="font-serif font-bold text-base text-giftoria-wine-900">No results found</h3>
            <p className="text-xs text-gray-500">Try searching for keywords like "mug", "3d", "frame", "bottle", or "t-shirt".</p>
          </div>
        )}
      </div>
    </div>
  );
};
