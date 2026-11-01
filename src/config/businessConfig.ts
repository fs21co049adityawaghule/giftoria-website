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
  uploadMaxSizeBytes: 5242880, // 5 MB for payment screenshots
  uploadMaxSizeMB: 5,
  upiId: "aditya15662-2@okaxis",
  qrCodeImage: "/assets/qr-code.jpeg",
  whatsappCustomMessage: "Hello GIFTORIA, I would like to enquire about customized gifts. Please share the available options and details.",
  get whatsappUrl() {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(this.whatsappCustomMessage)}`;
  },
  getWhatsappPaymentUrl(orderId: string, customerName: string, amount: number) {
    const text = `Hello GIFTORIA,\n\nI have completed the payment for my order.\n\nOrder ID: ${orderId}\nCustomer Name: ${customerName}\nPayment Amount: ₹${amount}\nUPI ID: ${this.upiId}\n\nI am sharing my payment screenshot for verification.\n\nPlease verify my payment and confirm my order.`;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },
  demoModeNotice: "Demo E-Commerce Mode: Client-side demonstration store.",
};
