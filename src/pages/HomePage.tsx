import React from 'react';
import { Link } from 'wouter';
import { 
  Sparkles, 
  ArrowRight, 
  Gift, 
  Box, 
  Shirt, 
  Printer, 
  Image as ImageIcon, 
  Heart, 
  ShieldCheck, 
  Truck, 
  Zap, 
  Star, 
  CheckCircle2, 
  MessageCircle,
  ChevronRight
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { useAdmin } from '../context/AdminContext';
import { businessConfig } from '../config/businessConfig';

export const HomePage: React.FC = () => {
  const { products } = useAdmin();

  // Filter featured & best sellers
  const featuredProducts = products.filter((p) => p.featured && !p.isComingSoon).slice(0, 8);
  const bestSellers = products.filter((p) => p.bestSeller && !p.isComingSoon).slice(0, 4);

  const quickServices = [
    {
      title: 'Customized Gifts',
      href: '/customized-gifts',
      icon: Gift,
      desc: 'Mugs, Insulated Bottles, Keychains, Standees, & Caps personalized with love.',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: '3D Printing',
      href: '/3d-printing',
      icon: Box,
      desc: 'Divine Ganesha idols, Moon Lamps, Lithophanes, & custom CAD prototypes.',
      image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'DTF Printing',
      href: '/dtf-printing',
      icon: Shirt,
      desc: 'Vibrant stretchable Direct-To-Film apparel prints for Polo & Round neck tees.',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Sublimation Printing',
      href: '/sublimation-printing',
      icon: Printer,
      desc: 'High gloss full-bleed photographic prints on ceramic mugs, keychains & sippers.',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=600',
    },
    {
      title: 'Photo Frames',
      href: '/photo-frames',
      icon: ImageIcon,
      desc: 'Customized 4x4, 4x6 & A4 wall & desk memory frames with crystal glass.',
      image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=600',
    },
  ];

  const howItWorksSteps = [
    { step: '01', title: 'Choose Your Product', desc: 'Select from our wide range of gift items, 3D models, photo frames, or custom apparel.' },
    { step: '02', title: 'Add Your Message', desc: 'Type names, special dates, quotes, or personalized instructions.' },
    { step: '03', title: 'Upload Design / Photo', desc: 'Upload your favorite high-resolution photo or design artwork (up to 1 MB).' },
    { step: '04', title: 'We Create Your Gift', desc: 'Our craft experts print, 3D manufacture, and deliver with emotional perfection.' },
  ];

  const whyChooseUs = [
    { title: 'Personalized Products', desc: 'Every piece is crafted uniquely to reflect your personal memories.' },
    { title: 'Advanced 3D Printing', desc: 'Precision PLA & PETG 3D printing using NASA lunar elevation data & fine layers.' },
    { title: 'High-Density DTF', desc: 'Apparel transfers that remain soft, stretchable, and washable.' },
    { title: 'Strict 1 MB Validation', desc: 'Clean, instant file preview & seamless customization workflow.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* SECTION 1 — HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-giftoria-cream-200 via-giftoria-bg to-white pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-giftoria-wine-800/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-giftoria-wine-800/10 text-giftoria-wine-800 text-xs font-extrabold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-giftoria-gold-600" />
                <span>Customized Gifts Made With Emotions</span>
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-giftoria-wine-900 leading-tight tracking-tight">
                Gifts Made Personal. <br />
                <span className="italic text-giftoria-gold-600 font-normal">Memories Made Forever.</span>
              </h1>

              <p className="text-sm sm:text-base text-giftoria-charcoal-700 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Customize gifts, 3D printed idols & moon lamps, DTF apparel, and memory photo frames specially crafted for your loved ones.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/products"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-sm py-4 px-8 rounded-2xl shadow-wine transition-all hover:scale-105"
                >
                  <Gift className="w-5 h-5" />
                  <span>Shop Gifts</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-giftoria-cream-100 text-giftoria-wine-800 font-bold text-sm py-4 px-8 rounded-2xl border-2 border-giftoria-wine-800/20 shadow-sm transition-all"
                >
                  <span>Explore Customization</span>
                </Link>
              </div>

              {/* Trust Micro Metrics */}
              <div className="pt-6 border-t border-giftoria-wine-800/10 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-giftoria-wine-900">100%</div>
                  <div className="text-[11px] text-gray-500 font-medium">Personalized Quality</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-giftoria-wine-900">5 Services</div>
                  <div className="text-[11px] text-gray-500 font-medium">Gifts, 3D, DTF, Sublimation, Frames</div>
                </div>
                <div>
                  <div className="font-serif font-bold text-xl sm:text-2xl text-giftoria-wine-900">4.9 ★</div>
                  <div className="text-[11px] text-gray-500 font-medium">Customer Love</div>
                </div>
              </div>
            </div>

            {/* Right Hero Image Showcase Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-giftoria-cream-300 transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800"
                    alt="GIFTORIA Customized Moon Lamp"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-giftoria-wine-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-bold uppercase tracking-widest text-giftoria-gold-400">Featured Creation</span>
                    <h3 className="font-serif text-xl font-bold">Custom Photo Lithophane Moon Lamp</h3>
                  </div>
                </div>

                {/* Floating Badge Card */}
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-giftoria-wine-800/10 flex items-center gap-3 hidden sm:flex">
                  <div className="p-2.5 rounded-xl bg-giftoria-gold-500 text-giftoria-charcoal-900">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-giftoria-charcoal-900">Upload Design (Max 1 MB)</div>
                    <div className="text-[10px] text-gray-500">Instant File Validation</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK SERVICE CATEGORY CARDS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif font-bold text-2xl sm:text-4xl text-giftoria-wine-900">
            Our 5 Customization Services
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Explore our specialized categories designed for every gift requirement
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {quickServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.href}
                className="group bg-white rounded-2xl border border-giftoria-wine-800/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video sm:aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 p-2 rounded-xl bg-white/90 text-giftoria-wine-800 backdrop-blur-md shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-giftoria-wine-900 group-hover:text-giftoria-wine-700 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {srv.desc}
                    </p>
                  </div>

                  <Link
                    href={srv.href}
                    className="mt-4 inline-flex items-center justify-between text-xs font-bold text-giftoria-wine-800 hover:text-giftoria-wine-900 group/btn"
                  >
                    <span>Explore Service</span>
                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED GIFTS PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
              Featured Gifts & Creations
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Handpicked personalized products loved by our customers
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-giftoria-wine-800 hover:text-giftoria-wine-900 bg-giftoria-wine-50 px-4 py-2 rounded-xl transition-colors"
          >
            <span>View All Products ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION (4 STEPS) */}
      <section className="bg-giftoria-wine-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-giftoria-gold-400">Simple 4-Step Process</span>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-white mt-1">
              How Customization Works
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              From your idea to your doorstep in four easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorksSteps.map((st) => (
              <div
                key={st.step}
                className="bg-giftoria-charcoal-900/60 border border-giftoria-wine-800/40 rounded-2xl p-6 relative flex flex-col justify-between"
              >
                <div>
                  <div className="font-serif text-3xl font-extrabold text-giftoria-gold-400 mb-3">
                    {st.step}
                  </div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-giftoria-wine-800">Top Trending</span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900 mt-1">
            Best Sellers & Customer Favorites
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE GIFTORIA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-giftoria-cream-100 rounded-3xl p-8 sm:p-12 border border-giftoria-wine-800/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-giftoria-wine-800">Why GIFTORIA</span>
            <h2 className="font-serif font-bold text-2xl sm:text-4xl text-giftoria-wine-900">
              Crafted With Emotion. Engineered With Precision.
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Whether it’s a laser-engraved steel bottle, a lithophane moon lamp, or a custom DTF t-shirt, we treat every single order as a unique memory.
            </p>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <div className="flex items-center gap-2 text-giftoria-wine-800">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-giftoria-gold-600" />
                  <h3 className="font-bold text-sm text-giftoria-wine-900">{item.title}</h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pl-7">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-giftoria-wine-900 via-giftoria-wine-800 to-giftoria-charcoal-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-serif font-bold text-3xl sm:text-5xl text-white">
              Make It Personal. Make It GIFTORIA.
            </h2>
            <p className="text-xs sm:text-base text-gray-200">
              Turn your ideas, memories and messages into something unforgettable.
            </p>
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-giftoria-gold-500 hover:bg-giftoria-gold-600 text-giftoria-charcoal-900 font-extrabold text-sm py-4 px-8 rounded-2xl shadow-lg transition-all hover:scale-105"
              >
                <Sparkles className="w-4 h-4" />
                <span>Start Customizing Now</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
