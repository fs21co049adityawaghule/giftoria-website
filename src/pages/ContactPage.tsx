import React, { useState } from 'react';
import { MessageCircle, Mail, Instagram, Phone, MapPin, Upload, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';
import { useToast } from '../context/ToastContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'customized-gifts',
    message: '',
  });

  const [attachment, setAttachment] = useState<{ name: string; size: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > businessConfig.uploadMaxSizeBytes) {
        const err = 'Attachment must be 1 MB or smaller.';
        setUploadError(err);
        showToast(err, 'error');
        return;
      }
      setAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
      });
      showToast('Attachment uploaded successfully!', 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Inquiry sent successfully! We will contact you shortly.', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-24">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-giftoria-wine-900">
          Contact GIFTORIA Studio
        </h1>
        <p className="text-xs sm:text-sm text-gray-600">
          Have a bulk enquiry, custom 3D design, or special gifting request? Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Quick Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          <a
            href={`https://wa.me/${businessConfig.whatsappNumber}?text=${encodeURIComponent("Hello GIFTORIA, I would like to enquire about a customized product.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-emerald-900 text-white p-5 rounded-3xl shadow-md hover:bg-emerald-950 transition-all group"
          >
            <div className="p-3 rounded-2xl bg-emerald-800 text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">Instant WhatsApp Chat</div>
              <div className="font-serif font-bold text-base">{businessConfig.whatsappDisplay}</div>
            </div>
          </a>

          <a
            href={`mailto:${businessConfig.email}`}
            className="flex items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm hover:border-giftoria-wine-800 transition-all text-giftoria-charcoal-900"
          >
            <div className="p-3 rounded-2xl bg-giftoria-wine-50 text-giftoria-wine-800">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Support</div>
              <div className="font-serif font-bold text-sm text-giftoria-wine-900">{businessConfig.email}</div>
            </div>
          </a>

          <a
            href={businessConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white border border-gray-200 p-5 rounded-3xl shadow-sm hover:border-pink-500 transition-all text-giftoria-charcoal-900"
          >
            <div className="p-3 rounded-2xl bg-pink-50 text-pink-600">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-gray-500">Instagram Creation Showcase</div>
              <div className="font-serif font-bold text-sm text-pink-600">@{businessConfig.instagramUsername}</div>
            </div>
          </a>

          <div className="bg-giftoria-cream-100 p-5 rounded-3xl border border-giftoria-wine-800/15 space-y-2 text-xs text-giftoria-wine-900">
            <div className="font-bold flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-giftoria-wine-800" />
              <span>Studio Location &amp; Hours</span>
            </div>
            <p className="text-gray-600">{businessConfig.address}</p>
            <p className="text-gray-500 text-[11px] pt-1">{businessConfig.workingHours}</p>
          </div>
        </div>

        {/* Right Column: Inquiry Form with Attachment */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-xl text-giftoria-wine-900">
            Send an Inquiry Form
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-emerald-900">Inquiry Sent Successfully!</h3>
              <p className="text-xs text-emerald-800">Our custom print expert will respond to your email within 2 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-gray-700">Your Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-giftoria-wine-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-giftoria-wine-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-gray-700">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-giftoria-wine-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-gray-700">Service Category</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-giftoria-wine-800"
                  >
                    <option value="customized-gifts">Customized Gifts</option>
                    <option value="3d-printing">3D Printing</option>
                    <option value="dtf-printing">DTF Printing</option>
                    <option value="sublimation-printing">Sublimation Printing</option>
                    <option value="photo-frames">Photo Frames</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">Customization Requirements / Message *</label>
                <textarea
                  rows={4}
                  placeholder="Describe your design idea, required quantity, size, or special instructions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs focus:ring-2 focus:ring-giftoria-wine-800"
                />
              </div>

              {/* Attachment with 1 MB validation */}
              <div className="space-y-1">
                <label className="block font-bold text-gray-700">Attach Reference Design (Optional, Max 1 MB)</label>
                {attachment ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs text-emerald-900">
                    <span>{attachment.name} ({attachment.size})</span>
                    <button type="button" onClick={() => setAttachment(null)} className="text-rose-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 bg-gray-50 border border-dashed border-gray-300 hover:border-giftoria-wine-800 p-4 rounded-xl cursor-pointer text-gray-600">
                    <Upload className="w-4 h-4 text-giftoria-wine-800" />
                    <span>Upload image/file (Max 1 MB)</span>
                    <input type="file" onChange={handleFileUpload} className="hidden" />
                  </label>
                )}
                {uploadError && <p className="text-rose-600 text-[11px]">{uploadError}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-xs py-3.5 px-6 rounded-2xl shadow-wine transition-all"
              >
                Submit Inquiry
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
