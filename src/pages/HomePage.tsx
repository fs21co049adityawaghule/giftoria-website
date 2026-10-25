import React, { useState } from 'react';
import { Link } from 'wouter';
import { 
  Sparkles, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Gift, 
  Heart, 
  CheckCircle, 
  Star,
  Award,
  Zap,
  ChevronRight,
  Flame,
  Send
} from 'lucide-react';
import { INITIAL_PRODUCTS, CATEGORIES_LIST, OCCASIONS_LIST } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { useToast } from '../context/ToastContext';

export const HomePage: React.FC = () => {
  const { showToast } = useToast();
  const [emailSub, setEmailSub] = useState('');

  // Sliced lists for homepage sections
  const bestSellers = INITIAL_PRODUCTS.filter(p => p.bestSeller).slice(0, 4);
  const flowerItems = INITIAL_PRODUCTS.filter(p => p.category === 'Flowers').slice(0, 4);
  const cakeItems = INITIAL_PRODUCTS.filter(p => p.category === 'Cakes' || p.category === 'Chocolates').slice(0, 4);
  const personalizedItems = INITIAL_PRODUCTS.filter(p => p.category === 'Personalized Gifts').slice(0, 4);
  const plantItems = INITIAL_PRODUCTS.filter(p => p.category === 'Plants').slice(0, 4);
  const trendingItems = INITIAL_PRODUCTS.filter(p => p.trending).slice(0, 4);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub.trim() && emailSub.includes('@')) {
      showToast('Thank you for subscribing! A 15% welcome voucher has been sent to your inbox.', 'success');
      setEmailSub('');
    } else {
      showToast('Please enter a valid email address.', 'error');
    }
  };

  return (
    <div className="bg-[#F8FCFF] min-h-screen text-slate-800 pb-16">
      
      {/* 1. Promotional Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-sky-50 to-white py-12 md:py-20 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-600 animate-pulse" />
                <span>India's Most Trusted Gifting Experience</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Celebrate Every Emotion With <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">SkyGift</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Handcrafted fresh bouquets, gourmet artisan cakes, personalized keepsakes, and lavish gift hampers. Delivered with care in under 2 hours.
              </p>

              {/* Delivery highlight pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-700 pt-1">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-sky-100 shadow-xs">
                  <Clock className="w-4 h-4 text-sky-500" />
                  <span>2-Hour Express Delivery</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-sky-100 shadow-xs">
                  <Truck className="w-4 h-4 text-sky-500" />
                  <span>Midnight Delivery Slots</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-sky-100 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                  <span>100% Freshness Assured</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-sky-200 hover:shadow-sky-300 transition-all active:scale-95 text-base"
                >
                  <Gift className="w-5 h-5" />
                  Shop Now
                </Link>
                <Link
                  href="/products?category=Birthday+Gifts"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-sky-50 text-sky-700 border border-sky-200 font-bold px-7 py-3.5 rounded-2xl shadow-xs transition-all text-base"
                >
                  Birthday Specials
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Hero Visual Cards */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-r from-sky-400 to-sky-200 rounded-3xl opacity-30 blur-2xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&q=80&w=800"
                    alt="Celebration Gifts"
                    className="w-full h-80 sm:h-96 object-cover"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent p-6 text-white">
                    <span className="bg-sky-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Today's Spotlight
                    </span>
                    <h3 className="text-xl font-bold mt-1">Roses & Dutch Chocolate Combos</h3>
                    <p className="text-xs text-sky-200 mt-1">Order before 5:00 PM for guaranteed same-day delivery</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Shop by Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Curated Collections</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Shop by Category
            </h2>
          </div>
          <Link href="/products" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mt-2 md:mt-0">
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CATEGORIES_LIST.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="group bg-white rounded-2xl p-3 border border-sky-100 hover:border-sky-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-3 bg-sky-50">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                {category.name}
              </h3>
              <span className="text-[11px] text-sky-600 mt-0.5">
                {category.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Popular Gifts / Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Flame className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Popular Gifts & Best Sellers
              </h2>
              <p className="text-xs text-slate-500">Most loved choices ordered by our customers</p>
            </div>
          </div>
          <Link href="/products?filter=bestsellers" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            Explore All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Birthday Gifts Promotional Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-r from-sky-600 via-sky-500 to-sky-700 p-8 md:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
            <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
              Make Birthdays Unforgettable
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">
              Midnight Birthday Surprises & Combos
            </h2>
            <p className="text-sky-100 text-sm leading-relaxed">
              Order fresh baked artisan cakes, personalized photo frames, and rose bouquets delivered right at 12:00 AM midnight.
            </p>
            <div className="pt-2">
              <Link
                href="/products?category=Birthday+Gifts"
                className="inline-flex items-center gap-2 bg-white text-sky-700 hover:bg-sky-50 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Explore Birthday Gifts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="z-10 shrink-0">
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500"
              alt="Birthday Cake"
              className="w-44 h-44 sm:w-56 sm:h-56 rounded-2xl object-cover shadow-2xl border-4 border-white/30"
            />
          </div>
        </div>
      </section>

      {/* 5. Flowers and Bouquets Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Farm-Fresh Blooms</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Flowers & Bouquets
            </h2>
          </div>
          <Link href="/products?category=Flowers" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            See All Flowers <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flowerItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 6. Cakes and Chocolates Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Freshly Baked & Confectionery</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Cakes & Chocolates
            </h2>
          </div>
          <Link href="/products?category=Cakes" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            See All Cakes <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cakeItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Personalized Gifts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Customized With Love</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Personalized Keepsakes
            </h2>
          </div>
          <Link href="/products?category=Personalized+Gifts" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            See All Personalized <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalizedItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 8. Plants and Green Gifts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Living Eco Gifts</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Plants & Green Gifts
            </h2>
          </div>
          <Link href="/products?category=Plants" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            See All Plants <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plantItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 9. Gifts for Every Occasion */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Celebrate Life's Milestones</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Gifts For Every Occasion
          </h2>
          <p className="text-xs text-slate-500 mt-1">Find the perfect gift curated specifically for your celebratory moment</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {OCCASIONS_LIST.map((occasion) => (
            <Link
              key={occasion}
              href={`/products?occasion=${encodeURIComponent(occasion)}`}
              className="bg-white hover:bg-sky-50 border border-sky-100 hover:border-sky-300 rounded-2xl p-4 text-center transition-all shadow-xs hover:shadow-md flex flex-col items-center justify-center group"
            >
              <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Gift className="w-5 h-5" />
              </div>
              <span className="font-bold text-sm text-slate-800 group-hover:text-sky-600">{occasion}</span>
              <span className="text-[11px] text-slate-600 mt-0.5">Explore Gifts →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 10. Same-Day & Express Delivery Promotional Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-sky-50 rounded-3xl border border-sky-200 p-8 sm:p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="space-y-2 md:col-span-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-200/60 text-sky-800 text-xs font-bold">
                <Zap className="w-3.5 h-3.5 text-sky-600" />
                <span>Express Courier & Direct Fleet</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Need Gifts in a Hurry? We Got You Covered!
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                With SkyGift's dedicated delivery hubs across India, enjoy <strong>2-Hour Express Delivery</strong>, fixed-time slots, and surprise <strong>Midnight Delivery</strong> right when the clock strikes 12.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <span className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-sky-200 font-semibold">
                  ⚡ 2-Hour Delivery
                </span>
                <span className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-sky-200 font-semibold">
                  🌙 12:00 AM Midnight Delivery
                </span>
                <span className="text-xs bg-white text-slate-700 px-3 py-1.5 rounded-lg border border-sky-200 font-semibold">
                  📍 450+ Cities in India
                </span>
              </div>
            </div>

            <div className="flex justify-center md:justify-end">
              <Link
                href="/products?filter=express"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-sky-200 transition-all flex items-center gap-2"
              >
                Browse Express Gifts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 11. Trending Gifts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">What's Hot</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Trending Gifts This Week
            </h2>
          </div>
          <Link href="/products?filter=trending" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
            See All Trending <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 12. Why Shop With Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">The SkyGift Promise</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            Why Choose SkyGift?
          </h2>
          <p className="text-xs text-slate-500 mt-1">Crafting moments of pure joy with exceptional quality and punctuality</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs hover:border-sky-300 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Premium Quality</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every flower petal, cake layer, and keepsake undergoes 5-point quality inspection before dispatch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs hover:border-sky-300 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">On-Time Guarantee</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Punctual delivery for your planned surprise slots including morning, evening, and midnight.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs hover:border-sky-300 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Secure Checkout</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              256-bit SSL encrypted checkout ensuring 100% private and protected shopping.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-xs hover:border-sky-300 transition-all text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center mb-4">
              <Heart className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base mb-1">Dedicated Support</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Real human assistance reachable on WhatsApp and phone for seamless gifting queries.
            </p>
          </div>
        </div>
      </section>

      {/* 13. Newsletter Subscription Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Never Miss a Special Celebration!
          </h3>
          <p className="text-sky-100 text-sm max-w-md mx-auto">
            Subscribe to get occasion reminders, exclusive VIP discounts, and festive gifting inspirations.
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
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shadow-md"
            >
              Get 15% Off
            </button>
          </form>
          <span className="block text-[11px] text-sky-200">
            No spam guaranteed. Unsubscribe anytime with a single click.
          </span>
        </div>
      </section>

    </div>
  );
};
