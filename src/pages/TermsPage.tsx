import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-24 text-xs leading-relaxed text-gray-700">
      <h1 className="font-serif font-bold text-3xl text-giftoria-wine-900 border-b pb-4">
        Terms &amp; Conditions
      </h1>
      <p>Last updated: March 2026</p>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">1. Acceptance of Terms</h2>
        <p>By placing an order on GIFTORIA, you agree to these Terms &amp; Conditions regarding custom merchandise, 3D printing manufacturing, and apparel printing.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">2. Customization Accuracy</h2>
        <p>Customers are responsible for reviewing uploaded photos and custom text messages before completing checkout. GIFTORIA prints exact customer instructions provided in the order payload.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">3. File Upload Restrictions</h2>
        <p>Uploads are strictly capped at 1 MB. Uploading illegal or unauthorized trademark artwork is prohibited.</p>
      </section>
    </div>
  );
};
