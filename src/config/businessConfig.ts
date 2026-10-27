export const businessConfig = {
  brandName: "GIFTORIA",
  tagline: "Customized Gifts Made With Emotions",
  supportPhone: "+91 83568 29605",
  supportPhoneDisplay: "+91 83568 29605",
  rawPhone: "8356829605",
  whatsappNumber: "918356829605",
  whatsappDisplay: "+91 83568 29605",
  email: "support@giftoria.in",
  currencySymbol: "₹",
  freeShippingThreshold: 999,
  standardShippingFee: 49,
  flatShippingFee: 49,
  address: "Giftoria Studio, Craft Street, Mumbai, Maharashtra 400001",
  workingHours: "Mon - Sat: 9:30 AM - 6:30 PM IST",
  uploadMaxSizeBytes: 2097152, // 2 MB
  uploadMaxSizeMB: 2,
  whatsappCustomMessage: "Hello GIFTORIA, I would like to enquire about customized gifts. Please share the available options and details.",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappCustomMessage)}`;
  },
  demoModeNotice: "Demo E-Commerce Mode: Client-side demonstration store.",
};
