import React from 'react';

export const RefundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pb-24 text-xs leading-relaxed text-gray-700">
      <h1 className="font-serif font-bold text-3xl text-giftoria-wine-900 border-b pb-4">
        Return &amp; Refund Policy
      </h1>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">1. Personalized Products Policy</h2>
        <p>Because each GIFTORIA item is custom-made with your personalized text or uploaded photograph, returns are accepted in cases of manufacturing damage or printing error on our end.</p>
      </section>

      <section className="space-y-2">
        <h2 className="font-serif font-bold text-base text-giftoria-wine-900">2. Damaged Item Replacement</h2>
        <p>If your 3D print or glass photo frame arrives damaged during transit, please inform us within 48 hours with an unboxing video via WhatsApp (+91 83568 29605). We will immediately dispatch a replacement.</p>
      </section>
    </div>
  );
};
