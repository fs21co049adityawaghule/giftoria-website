import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-24 text-xs leading-relaxed text-gray-700">
      <h1 className="font-serif font-bold text-3xl text-giftoria-wine-900 border-b pb-4">
        Privacy Policy
      </h1>
      <p>Last updated: March 2026</p>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">1. Information Collection</h2>
        <p>GIFTORIA respects your privacy. We collect customer information such as name, mobile number, delivery address, custom text instructions, and uploaded design/photo files exclusively for processing your personalized order.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">2. Uploaded Customization Media Security</h2>
        <p>All design files and photos uploaded through our 1 MB upload system are used strictly for printing, 3D manufacturing, or photo frame assembly. We never sell or share customer artwork or personal photos with third parties.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">3. Data Protection</h2>
        <p>We use standard encryption protocols to protect order information and ensure clean payment handling.</p>
      </section>
    </div>
  );
};
