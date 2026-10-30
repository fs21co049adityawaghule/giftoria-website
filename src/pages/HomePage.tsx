import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Flame, 
  ChevronRight, 
  Send,
  Eye
} from 'lucide-react';
import { CATEGORIES_LIST, OCCASIONS_LIST, INITIAL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';

export const HomePage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { products } = useAdmin();
  const { showToast } = useToast();
  const [emailSub, setEmailSub] = useState('');

  // Live active catalog fallback to initial
  const activeCatalog = products && products.length > 0 
    ? products.filter(p => p.isActive !== false) 
    : INITIAL_PRODUCTS;

  // Selected trending product for interactive preview in trending image hover section
  const trendingCatalog = activeCatalog.filter(p => p.trending);
  const [activeTrendingIndex, setActiveTrendingIndex] = useState(0);
  const featuredTrendingProduct = trendingCatalog[activeTrendingIndex] || trendingCatalog[0] || activeCatalog[0];

  // Sliced lists for homepage sections
  const personalizedItems = activeCatalog.filter(p => p.category === 'Personalized Gifts').slice(0, 4);
  const threeDItems = activeCatalog.filter(p => p.category === '3D Arts').slice(0, 4);
  const frameItems = activeCatalog.filter(p => p.category === 'Frames').slice(0, 4);
  const foreverBloomsItems = activeCatalog.filter(p => p.category === 'Forever Blooms').slice(0, 4);
  const hamperItems = activeCatalog.filter(p => p.category === 'Gift Hampers').slice(0, 4);
  const jewelleryItems = activeCatalog.filter(p => p.category === 'Jewellery').slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim() && emailSub.includes('@')) {
      showToast('Thank you for subscribing! You will receive special GIFTORIA festive updates.', 'success');
      setEmailSub('');
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  };

  return (
    <div className="bg-[#F8FCFF] min-h-screen text-slate-800 pb-16">
      
      {/* 1. Promotional Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white py-12 md:py-18 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span>Customized Gifts Made With Emotions</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Make Every Celebration Unique With <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">GIFTORIA</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover personalized photo keepsakes, precision 3D arts, divine frames, forever blooms, luxury gift hampers, and timeless jewellery. Carefully crafted and delivered across Maharashtra.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 text-base group motion-reduce:hover:transform-none"
                >
                  <Gift className="w-5 h-5" />
                  Explore Catalog
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/category/personalized-gifts"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 font-bold px-7 py-3.5 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-base group motion-reduce:hover:transform-none"
                >
                  Personalized Gifts
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Card with Smooth Hover Zoom */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-sky-200 rounded-3xl opacity-30 blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-4 border-white bg-white group motion-reduce:hover:transform-none">
                  <img
                    src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800"
                    alt="Customized Gifting Showcase"
                    className="w-full h-80 sm:h-96 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/85 via-slate-900/50 to-transparent p-6 text-white">
                    <span className="bg-sky-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Featured Collection
                    </span>
                    <h3 className="text-xl font-bold mt-1">Personalized Keepsakes &amp; 3D Arts</h3>
                    <p className="text-xs text-sky-200 mt-1">Photo mugs, acrylic plaques, frames &amp; lithophanes</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Shop by Category Grid with smooth lift and image zoom */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Explore Collections</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link href="/products" className="group text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mt-2 md:mt-0 transition-colors">
            View All Categories <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES_LIST.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="group bg-white rounded-2xl p-3 border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col items-center text-center motion-reduce:hover:transform-none"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 bg-sky-50 shadow-inner">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-350 ease-out group-hover:scale-110 motion-reduce:group-hover:scale-100"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">
                {category.name}
              </h3>
              <span className="text-[10px] text-sky-600 mt-0.5">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Trending Product Showcase */}
      {trendingCatalog.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Trending Now
                </h2>
                <p className="text-xs text-slate-500">Interactive showcase of our most popular gift selections</p>
              </div>
            </div>
            <Link href="/products?filter=trending" className="group text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              Browse All Trending <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-sky-100 p-6 md:p-8 shadow-xs hover:shadow-md transition-shadow duration-300">
            
            {/* Main Visual with Smooth Hover Overlay */}
            <div 
              onClick={() => setLocation(`/product/${featuredTrendingProduct.slug}`)}
              className="lg:col-span-7 relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-sky-100 aspect-video sm:aspect-[16/10] bg-slate-900 cursor-pointer transition-all duration-300"
            >
              <img
                src={featuredTrendingProduct.thumbnail || featuredTrendingProduct.images?.[0]}
                alt={featuredTrendingProduct.name}
                className="w-full h-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800';
                }}
              />

              {/* Gradient Mask */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent transition-opacity duration-300" />

              {/* Hover Content */}
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white transition-all duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500 text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Trend
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {featuredTrendingProduct.name}
                </h3>
                
                <p className="text-xs sm:text-sm text-sky-100 mt-1 line-clamp-2 max-w-lg leading-relaxed">
                  {featuredTrendingProduct.description}
                </p>

                <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/20">
                  <span className="text-xs font-bold text-sky-200 bg-white/10 px-3 py-1 rounded-lg">
                    {featuredTrendingProduct.category}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/product/${featuredTrendingProduct.slug}`);
                    }}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-sky-50 text-sky-700 font-bold px-4 py-2 rounded-xl text-xs shadow-md hover:shadow-lg transition-all active:scale-95"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Details
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Item Selector List */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Select Trending Item to Preview:
              </h4>
              
              <div className="space-y-2.5">
                {trendingCatalog.slice(0, 4).map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveTrendingIndex(idx)}
                    className={`group p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 hover:-translate-y-0.5 ${
                      activeTrendingIndex === idx
                        ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-2 ring-sky-200'
                        : 'border-sky-100 hover:border-sky-300 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.thumbnail || item.images[0]}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-white border border-sky-100 shrink-0 transition-transform duration-200 group-hover:scale-105"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-sky-600 block">
                          {item.category}
                        </span>
                        <p className="text-xs font-bold text-slate-800 truncate group-hover:text-sky-600 transition-colors">{item.name}</p>
                        <span className="text-[10px] text-slate-500">{item.deliveryLabel || 'Fast Dispatch'}</span>
                      </div>
                    </div>

                    <Link
                      href={`/product/${item.slug}`}
                      className="p-2 text-sky-600 hover:text-sky-700 bg-white rounded-xl border border-sky-200 hover:bg-sky-50 transition-all shrink-0 group-hover:border-sky-300"
                      title="View Product"
                    >
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* 4. Personalized Gifts Section */}
      {personalizedItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Customized With Love</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Personalized Keepsakes
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Custom mugs, wooden keychains, mobile covers, standees &amp; caps</p>
            </div>
            <Link href="/category/personalized-gifts" className="group text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              See All Personalized <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {personalizedItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 5. 3D Arts Section */}
      {threeDItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Precision 3D Engineering</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                3D Arts &amp; Lithophanes
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Ganesha idols, skeleton keychains, lunar moon lamps &amp; couple statues</p>
            </div>
            <Link href="/category/3d-arts" className="group text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              See All 3D Arts <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {threeDItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 6. Frames Section (NEW) */}
      {frameItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Sacred &amp; Photo Keepsakes</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Handcrafted Frames (4x4)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Saraswati &amp; Ganpati artisan frames crafted for home altars and work desks</p>
            </div>
            <Link href="/category/frames" className="group text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              See All Frames <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {frameItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Forever Blooms Section */}
      {foreverBloomsItems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Everlasting Floral Art</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Forever Blooms — Handcrafted Flowers
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Handcrafted flowers that last: crochet, satin ribbon, and artificial bouquets</p>
            </div>
            <Link href="/category/forever-blooms" className="group text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors">
              See All Blooms <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {foreverBloomsItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Gifts for Every Occasion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Celebration Moments</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Gifts For Every Occasion
          </h2>
          <p className="text-xs text-slate-500 mt-1">Find the ideal gift tailored for your special milestone</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {OCCASIONS_LIST.map((occasion) => (
            <Link
              key={occasion}
              href={`/products?occasion=${encodeURIComponent(occasion)}`}
              className="bg-white hover:bg-sky-50 border border-sky-100 hover:border-sky-300 rounded-2xl p-4 text-center transition-all duration-300 shadow-xs hover:shadow-lg hover:-translate-y-1 flex flex-col items-center justify-center group motion-reduce:hover:transform-none"
            >
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-slate-800 group-hover:text-sky-600 transition-colors">{occasion}</span>
              <span className="text-[10px] text-slate-500 mt-0.5 group-hover:text-sky-700 font-medium">Explore →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 9. Newsletter Subscription Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Stay Connected with GIFTORIA
          </h3>
          <p className="text-sky-100 text-sm max-w-md mx-auto">
            Subscribe for festive gift previews, new 3D art drops, and personalized keepsakes inspiration across Maharashtra.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              className="bg-white text-slate-800 px-4 py-3 rounded-xl text-sm focus:outline-none flex-1 placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md hover:shadow-lg active:scale-95"
            >
              Subscribe
            </button>
          </form>
          <span className="block text-[11px] text-sky-200">
            No spam. Unsubscribe anytime with a single click.
          </span>
        </div>
      </section>

    </div>
  );
};
