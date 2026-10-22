import React, { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';
import { ProductCard } from '../components/common/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { ServiceType } from '../types';

export const ShopPage: React.FC = () => {
  const { products } = useAdmin();

  const [selectedService, setSelectedService] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');
  const [filterCustomizableOnly, setFilterCustomizableOnly] = useState(false);

  const servicesList = [
    { id: 'all', label: 'All Products' },
    { id: 'customized-gifts', label: 'Customized Gifts' },
    { id: '3d-printing', label: '3D Printing' },
    { id: 'dtf-printing', label: 'DTF Printing' },
    { id: 'sublimation-printing', label: 'Sublimation' },
    { id: 'photo-frames', label: 'Photo Frames' },
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Service filter
        if (selectedService !== 'all' && p.service !== selectedService) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = p.name.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesCategory = p.category.toLowerCase().includes(q);
          const matchesTags = p.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesName && !matchesDesc && !matchesCategory && !matchesTags) return false;
        }
        // Customizable filter
        if (filterCustomizableOnly && !p.customizable) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedService, searchQuery, sortBy, filterCustomizableOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Page Title */}
      <div className="border-b border-giftoria-wine-800/10 pb-6">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-giftoria-wine-900">
          All Products & Custom Creations
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          Explore our complete catalog of personalized gifts, 3D printed items, DTF apparel, and memory photo frames.
        </p>
      </div>

      {/* Control Bar: Search, Category Pills, Filter Toggle, Sort */}
      <div className="space-y-4">
        
        {/* Top Control Bar Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-2xl py-2.5 pl-10 pr-10 text-xs text-giftoria-charcoal-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Customizable Checkbox */}
            <label className="inline-flex items-center gap-2 text-xs font-semibold text-giftoria-charcoal-800 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterCustomizableOnly}
                onChange={(e) => setFilterCustomizableOnly(e.target.checked)}
                className="rounded border-gray-300 text-giftoria-wine-800 focus:ring-giftoria-wine-800 w-4 h-4"
              />
              <span>Customizable Only</span>
            </label>

            {/* Sorting Select */}
            <div className="flex items-center gap-1.5 bg-white border border-gray-300 rounded-2xl px-3 py-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-giftoria-wine-800" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-giftoria-charcoal-900 font-medium focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured / Best</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>

        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
          {servicesList.map((srv) => (
            <button
              key={srv.id}
              onClick={() => setSelectedService(srv.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedService === srv.id
                  ? 'bg-giftoria-wine-800 text-white shadow-sm'
                  : 'bg-white text-giftoria-charcoal-800 border border-gray-200 hover:border-giftoria-wine-800'
              }`}
            >
              {srv.label}
            </button>
          ))}
        </div>

      </div>

      {/* Results Count & Product Grid */}
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-4">
          Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 max-w-md mx-auto space-y-4 my-12">
            <div className="w-12 h-12 rounded-full bg-giftoria-wine-50 text-giftoria-wine-800 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-giftoria-wine-900">
              No matching products found
            </h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search criteria or switching categories.
            </p>
            <button
              onClick={() => {
                setSelectedService('all');
                setSearchQuery('');
                setFilterCustomizableOnly(false);
              }}
              className="text-xs font-bold text-giftoria-wine-800 hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
