import React from 'react';
import { Link } from 'wouter';
import { Gift, Box, Shirt, Printer, Image as ImageIcon, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const services = [
    {
      id: 'customized-gifts',
      title: 'Customized Gift Items',
      icon: Gift,
      desc: 'Mugs, Insulated Steel Bottles, Leather Keychains, LED Cutout Standees, Embroidered Caps, and Crewneck T-Shirts tailored with custom text & photo prints.',
      href: '/customized-gifts',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: '3d-printing',
      title: '3D Printing Services',
      icon: Box,
      desc: 'Eco-friendly PLA Lord Ganesha & Saraswati idols, articulated fidget keychains, Minecraft blocks, NASA elevation moon lamps, custom photo lithophanes, & STL prototyping.',
      href: '/3d-printing',
      image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'dtf-printing',
      title: 'DTF Apparel Printing',
      icon: Shirt,
      desc: 'High-density Direct-To-Film transfer printing on Polo collar t-shirts, round neck tees, canvas carry bags, caps, and bulk gang sheets.',
      href: '/dtf-printing',
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'sublimation-printing',
      title: 'Sublimation Printing',
      icon: Printer,
      desc: 'Full-bleed high gloss dye sublimation prints on AAA ceramic mugs, MDF wooden keychains, aluminum sippers, dry-fit jerseys, and metal photo easels.',
      href: '/sublimation-printing',
      image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=800',
    },
    {
      id: 'photo-frames',
      title: 'Custom Photo Frames',
      icon: ImageIcon,
      desc: 'Synthetic wooden frames with anti-glare glass in 4×4 inch, 4×6 inch, and A4 size wall frames featuring 300 GSM photo lab prints.',
      href: '/photo-frames',
      image: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-giftoria-wine-900">
          Our Customization Services
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Explore our five specialized manufacturing categories designed to transform your memories into physical keepsakes.
        </p>
      </div>

      <div className="space-y-8">
        {services.map((srv, idx) => {
          const Icon = srv.icon;
          const isEven = idx % 2 === 0;
          return (
            <div
              key={srv.id}
              className={`bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                !isEven ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-5 aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100">
                <img src={srv.image} alt={srv.title} className="w-full h-full object-cover" />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-giftoria-wine-50 text-giftoria-wine-800 rounded-full text-xs font-bold">
                  <Icon className="w-4 h-4" />
                  <span>Service 0{idx + 1}</span>
                </div>
                <h2 className="font-serif font-bold text-2xl text-giftoria-wine-900">{srv.title}</h2>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{srv.desc}</p>
                <Link
                  href={srv.href}
                  className="inline-flex items-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-wine transition-all"
                >
                  <span>Customize Yours</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
