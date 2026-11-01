import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ShieldCheck, 
  Truck, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Upload,
  MessageCircle,
  ArrowRight,
  QrCode,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { ShippingAddress, Order } from '../types';
import { businessConfig } from '../config/businessConfig';
import { validateMaharashtraPincode } from '../utils/pincodeUtils';

type CheckoutStage = 'details' | 'payment' | 'screenshot' | 'submitted';

export const CheckoutPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { cart, subtotal, shippingFee, grandTotal } = useCart();
  const { submitUpiOrder } = useOrder();
  const { showToast } = useToast();

  // Form State
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400001');

  // Delivery preferences
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState('Standard Daytime (9:00 AM - 6:00 PM)');
  const [messageCard, setMessageCard] = useState('');

  // Flow State
  const [checkoutStage, setCheckoutStage] = useState<CheckoutStage>('details');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(businessConfig.upiId);
    setCopiedUpi(true);
    showToast('UPI ID copied to clipboard: ' + businessConfig.upiId, 'success');
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      showToast('Please enter customer full name.', 'error');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      showToast('Please provide a valid 10-digit mobile number.', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please provide a valid email address.', 'error');
      return;
    }
    if (!addressLine.trim()) {
      showToast('Please specify the complete delivery address.', 'error');
      return;
    }
    if (!city.trim()) {
      showToast('Please specify the delivery city.', 'error');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6 || !/^\d+$/.test(pincode)) {
      showToast('Please provide a valid 6-digit Indian PIN code.', 'error');
      return;
    }

    const pinVal = validateMaharashtraPincode(pincode);
    if (!pinVal.isValid) {
      showToast(pinVal.message, 'warning');
    }

    setCheckoutStage('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > businessConfig.uploadMaxSizeBytes) {
      setUploadError(`Screenshot file size must be less than ${businessConfig.uploadMaxSizeMB}MB.`);
      return;
    }

    setUploadError(null);
    setScreenshotFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFinalSubmitPayment = () => {
    if (!screenshotDataUrl) {
      setUploadError('Please select and upload your payment screenshot before submitting.');
      showToast('Please upload your payment screenshot.', 'error');
      return;
    }

    const shippingAddress: ShippingAddress = {
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      addressLine: addressLine.trim(),
      city: city.trim(),
      state,
      pincode: pincode.trim(),
      country: 'India',
      deliveryDate,
      deliveryTimeSlot: deliverySlot,
      messageCard: messageCard.trim() || undefined
    };

    const newOrder = submitUpiOrder(
      shippingAddress,
      cart,
      subtotal,
      0,
      shippingFee,
      grandTotal,
      screenshotDataUrl,
      screenshotFileName || 'payment_screenshot.jpg'
    );

    setSubmittedOrder(newOrder);
    setCheckoutStage('submitted');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Payment submitted successfully! Verification pending.', 'success');
  };

  // If order is submitted, display Stage 9 & 10
  if (checkoutStage === 'submitted' && submittedOrder) {
    const whatsappUrl = businessConfig.getWhatsappPaymentUrl(
      submittedOrder.orderId,
      submittedOrder.customer.fullName,
      submittedOrder.grandTotal
    );

    return (
      <div className="bg-[#F8FCFF] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Success Banner */}
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
              <Clock className="w-8 h-8" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
              PAYMENT VERIFICATION PENDING
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Payment Submitted Successfully!
            </h1>

            <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs sm:text-sm text-slate-700 leading-relaxed max-w-xl mx-auto text-left space-y-2">
              <p>
                <strong>Thank you for your payment submission.</strong> Your payment is currently under verification.
              </p>
              <p>
                Please allow up to <strong>24 hours</strong> for our team to verify your payment. Your order will be confirmed once the payment has been successfully verified.
              </p>
            </div>

            {/* Order Reference Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Order ID:</span>
                <span className="font-bold text-sky-700">#{submittedOrder.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Customer Name:</span>
                <span className="font-semibold text-slate-900">{submittedOrder.customer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Amount Payable:</span>
                <span className="font-bold text-emerald-700">₹{submittedOrder.grandTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">UPI ID:</span>
                <span>{submittedOrder.upiId || businessConfig.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Current Status:</span>
                <span className="text-amber-700 font-bold">PAYMENT VERIFICATION PENDING</span>
              </div>
            </div>

            {/* WhatsApp Connection Button */}
            <div className="pt-2 space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 transition-all active:scale-98"
              >
                <MessageCircle className="w-5 h-5" />
                <span>SHARE PAYMENT DETAILS ON WHATSAPP</span>
              </a>
              <p className="text-[11px] text-slate-500 text-center">
                Send your screenshot to WhatsApp <strong className="text-slate-700">+91 {businessConfig.rawPhone}</strong> for priority admin verification.
              </p>
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-sky-100 flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setLocation('/orders')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 transition-all"
              >
                Track My Order Status
              </button>
              <button
                onClick={() => setLocation('/products')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and not submitted
  if (cart.length === 0) {
    return (
      <div className="bg-[#F8FCFF] min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 text-center max-w-sm w-full shadow-xs">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
          <p className="text-xs text-slate-500 mb-6">Please add items to proceed with gifting checkout.</p>
          <button
            onClick={() => setLocation('/products')}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all"
          >
            Explore Gifts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Checkout Header */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">GIFTORIA Express Checkout</span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {checkoutStage === 'details' && 'Step 1: Delivery Details'}
            {checkoutStage === 'payment' && 'Step 2: Scan QR & Pay via UPI'}
            {checkoutStage === 'screenshot' && 'Step 3: Upload Payment Screenshot'}
          </h1>
          <p className="text-xs text-slate-500">
            Secure manual UPI payment gateway with WhatsApp confirmation
          </p>
        </div>

        {/* Progress steps indicator */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto text-xs font-bold">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${checkoutStage === 'details' ? 'bg-sky-500 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
            <span>1</span>
            <span>Delivery</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${checkoutStage === 'payment' ? 'bg-sky-500 text-white' : checkoutStage === 'screenshot' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-400'}`}>
            <span>2</span>
            <span>Scan & Pay</span>
          </div>
          <span className="text-slate-300">→</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${checkoutStage === 'screenshot' ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
            <span>3</span>
            <span>Verify</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STAGE 1: DELIVERY DETAILS FORM */}
        {/* ========================================================================= */}
        {checkoutStage === 'details' && (
          <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Recipient Details */}
              <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-500" />
                  Delivery & Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aditya Waghule"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9820123456"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Email Address (For Updates) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aditya@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Complete Address (Flat, Street, Landmark) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="e.g. Flat 301, Sunshine Heights, Near Station"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">State</label>
                    <input
                      type="text"
                      disabled
                      value={state}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="400001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Timing & Greeting Card */}
              <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-500" />
                  Delivery Scheduling
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Preferred Time Slot</label>
                    <select
                      value={deliverySlot}
                      onChange={(e) => setDeliverySlot(e.target.value)}
                      className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    >
                      <option value="Standard Daytime (9:00 AM - 6:00 PM)">Standard Daytime (9:00 AM - 6:00 PM)</option>
                      <option value="Morning Slot (9:00 AM - 1:00 PM)">Morning Slot (9:00 AM - 1:00 PM)</option>
                      <option value="Evening Slot (5:00 PM - 9:00 PM)">Evening Slot (5:00 PM - 9:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Complimentary Greeting Message Card (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wishing you a very Happy Birthday! With love."
                    value={messageCard}
                    onChange={(e) => setMessageCard(e.target.value)}
                    className="w-full bg-slate-50 border border-sky-100 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="space-y-4">
              <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Order Summary ({cart.length} items)</h3>
                
                <div className="max-h-60 overflow-y-auto divide-y divide-sky-50 pr-1">
                  {cart.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 flex items-center gap-3">
                      <img
                        src={item.product.thumbnail || item.product.images?.[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-xl object-cover bg-sky-50 border border-sky-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                        <div className="text-[11px] text-slate-500">
                          Qty: {item.quantity} × ₹{item.unitPriceSnapshot || item.product.price}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        ₹{(item.unitPriceSnapshot || item.product.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-sky-100 pt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">FREE</strong> : `₹${shippingFee}`}</span>
                  </div>
                  <div className="border-t border-sky-200 pt-2 flex justify-between text-sm font-extrabold text-slate-900">
                    <span>Total Payable:</span>
                    <span className="text-sky-600 font-black">₹{grandTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 transition-all active:scale-98"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* STAGE 2: SCAN QR CODE & UPI PAYMENT */}
        {/* ========================================================================= */}
        {checkoutStage === 'payment' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-6 text-center">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">UPI Payment</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Scan QR Code to Pay</h2>
              <p className="text-xs text-slate-600">
                Scan the QR code using any supported UPI application and complete your payment.
              </p>
            </div>

            {/* Total Payable Amount Callout */}
            <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 max-w-sm mx-auto">
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
                Exact Payable Amount
              </span>
              <p className="text-3xl font-black text-slate-900 mt-0.5">
                ₹{grandTotal}
              </p>
              <span className="text-[11px] text-slate-500">Includes all taxes & delivery fees</span>
            </div>

            {/* QR Code Image Container */}
            <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 p-3 bg-white rounded-2xl border-2 border-sky-300 shadow-lg flex items-center justify-center overflow-hidden">
              <img
                src={businessConfig.qrCodeImage}
                alt="GIFTORIA Official UPI QR Code"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/qr-code.jpeg';
                }}
              />
            </div>

            {/* UPI ID with Copy Button */}
            <div className="max-w-sm mx-auto space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                UPI ID (Click to Copy)
              </label>
              <div className="flex items-center gap-2 bg-slate-50 border border-sky-200 rounded-2xl p-2 font-mono text-xs">
                <span className="flex-1 text-slate-900 font-bold truncate px-2 select-all">
                  {businessConfig.upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    copiedUpi 
                      ? 'bg-emerald-600 text-white shadow-xs' 
                      : 'bg-sky-500 hover:bg-sky-600 text-white'
                  }`}
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy UPI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Supported UPI Apps */}
            <div className="text-[11px] text-slate-400 font-medium">
              Supported Apps: GPay • PhonePe • Paytm • BHIM • Amazon Pay • Any Bank UPI
            </div>

            {/* Navigation buttons */}
            <div className="pt-4 border-t border-sky-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCheckoutStage('details')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ← Back to Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setCheckoutStage('screenshot');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 transition-all active:scale-98"
              >
                I HAVE COMPLETED PAYMENT →
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STAGE 3: UPLOAD PAYMENT SCREENSHOT */}
        {/* ========================================================================= */}
        {checkoutStage === 'screenshot' && (
          <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm max-w-xl mx-auto space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Verification Proof</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">Upload Payment Screenshot</h2>
              <p className="text-xs text-slate-600">
                Please attach the screenshot of your completed UPI transaction showing the payment to <strong className="text-slate-800">{businessConfig.upiId}</strong>.
              </p>
            </div>

            {/* Upload Area */}
            <div className="space-y-4">
              <label 
                htmlFor="screenshot-upload"
                className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                  screenshotDataUrl
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-sky-300 hover:border-sky-500 bg-sky-50/30 hover:bg-sky-50/60'
                }`}
              >
                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotChange}
                  className="hidden"
                />

                {screenshotDataUrl ? (
                  <div className="space-y-3 text-center">
                    <img
                      src={screenshotDataUrl}
                      alt="Payment screenshot preview"
                      className="max-h-56 mx-auto rounded-xl object-contain border border-emerald-300 shadow-sm"
                    />
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{screenshotFileName || 'Screenshot Selected'}</span>
                    </div>
                    <span className="text-[11px] text-sky-600 underline">Click to change screenshot</span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shadow-inner">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-slate-800">
                        Click here to select payment screenshot
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        JPEG, PNG, WebP up to {businessConfig.uploadMaxSizeMB}MB
                      </p>
                    </div>
                  </>
                )}
              </label>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>

            {/* Payment Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{fullName} ({mobile})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700">₹{grandTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">UPI Beneficiary:</span>
                <span className="font-mono text-slate-800">{businessConfig.upiId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCheckoutStage('payment')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                ← Back to QR
              </button>
              <button
                type="button"
                onClick={handleFinalSubmitPayment}
                disabled={!screenshotDataUrl}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-200 transition-all active:scale-98 disabled:opacity-50 disabled:pointer-events-none"
              >
                SUBMIT PAYMENT FOR VERIFICATION
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
