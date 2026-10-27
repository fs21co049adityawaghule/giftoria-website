import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  ExternalLink, 
  Map, 
  Layers, 
  Globe
} from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const AboutPage: React.FC = () => {
  const [mapView, setMapView] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  // Google Maps embed URL using the existing address
  const encodedAddress = encodeURIComponent(businessConfig.address);
  
  // Google Maps embed supports maptype via t parameter: 'm' (roadmap), 'k' (satellite), 'p' (terrain)
  const mapTypeParam = mapView === 'satellite' ? 'k' : mapView === 'terrain' ? 'p' : 'm';
  const iframeSrc = `https://maps.google.com/maps?q=${encodedAddress}&t=${mapTypeParam}&z=14&ie=UTF8&iwloc=&output=embed`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-12 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-sky-600 fill-sky-600" />
            <span>Our Story & Studio</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            About GIFTORIA
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {businessConfig.tagline}. Handcrafting lasting memories through personalized keepsakes, 3D printing arts, forever blooms, and luxury gifting across Maharashtra.
          </p>
        </div>

        {/* Two-Column Layout: Left (Company Info) | Right (Google Maps) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Company Information */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sky-600">Company Profile</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                Where Personal Memories Meet Creative Craftsmanship
              </h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              GIFTORIA was born out of a simple belief: a gift should not be a generic mass-produced item. It should carry an emotion, a story, a date, or a message that lasts forever.
            </p>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              From our studio in Mumbai, we specialize in personalized photo mugs and mobile covers, precision 3D-printed arts (Ganesha idols, lithophane photo lamps, and flexi figures), Forever Blooms (everlasting handcrafted crochet, satin, and artificial flowers), custom hampers, and fine jewellery.
            </p>

            {/* Contact Details Card */}
            <div className="pt-4 border-t border-sky-100 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Business & Contact Details
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Registered Studio Address:</span>
                    <span className="text-slate-600 block mt-0.5">{businessConfig.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Email Address:</span>
                    <a 
                      href={`mailto:${businessConfig.email}`}
                      className="text-sky-600 hover:underline block mt-0.5"
                    >
                      {businessConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Phone Support:</span>
                    <a 
                      href={`tel:+91${businessConfig.rawPhone}`}
                      className="text-sky-600 hover:underline block mt-0.5"
                    >
                      +91 {businessConfig.rawPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">WhatsApp Enquiries:</span>
                    <a 
                      href={businessConfig.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-600 font-semibold hover:underline block mt-0.5"
                    >
                      Chat on WhatsApp (+91 {businessConfig.rawPhone})
                    </a>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Call to Action Button */}
              <div className="pt-2">
                <a
                  href={businessConfig.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enquire About Customized Gifts on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Google Maps Location */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sky-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Studio Location</h3>
                <p className="text-xs text-slate-500 mt-0.5">Giftoria Studio, Mumbai, Maharashtra</p>
              </div>

              {/* Map View Switcher (Roadmap / Satellite / Terrain) */}
              <div className="inline-flex rounded-xl bg-sky-50 p-1 text-xs border border-sky-100">
                <button
                  onClick={() => setMapView('roadmap')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    mapView === 'roadmap' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-sky-600'
                  }`}
                  title="Standard Roadmap View"
                >
                  <Map className="w-3 h-3" />
                  <span>Map</span>
                </button>
                <button
                  onClick={() => setMapView('satellite')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    mapView === 'satellite' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-sky-600'
                  }`}
                  title="Satellite Aerial View"
                >
                  <Globe className="w-3 h-3" />
                  <span>Satellite</span>
                </button>
                <button
                  onClick={() => setMapView('terrain')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all flex items-center gap-1 ${
                    mapView === 'terrain' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600 hover:text-sky-600'
                  }`}
                  title="Terrain Topographical View"
                >
                  <Layers className="w-3 h-3" />
                  <span>Terrain</span>
                </button>
              </div>
            </div>

            {/* Embedded Google Maps Container */}
            <div className="relative aspect-square sm:aspect-[4/3] w-full rounded-2xl overflow-hidden border border-sky-200 shadow-inner bg-slate-100">
              <iframe
                title="GIFTORIA Studio Location"
                src={iframeSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>

            {/* External Map Action */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 text-[11px]">
                Coordinates & Pin: Craft Street, Mumbai 400001
              </span>
              <a
                href={directMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-sky-600 hover:text-sky-700 hover:underline"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
