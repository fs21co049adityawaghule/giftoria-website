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
  CreditCard,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { ShippingAddress } from '../types';
import { businessConfig } from '../config/businessConfig';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { cart, subtotal, shippingFee, grandTotal, clearCart } = useCart();
  const { placeOrder } = useOrder();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400001');

  // Delivery preferences
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState('Standard Daytime (9:00 AM - 6:00 PM)');
  const [messageCard, setMessageCard] = useState('');

  // Payment method selection (Demo mode)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName.trim()) {
      showToast('Please enter recipient / sender full name.', 'error');
      return;
    }
    if (!mobile.trim() || mobile.replace(/\D/g, '').length < 10) {
      showToast('Please provide a valid 10-digit mobile number.', 'error');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('Please provide a valid email address for delivery updates.', 'error');
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

    setIsSubmitting(true);

    const customerAddress: ShippingAddress = {
      fullName,
      mobile,
      email,
      addressLine,
      city,
      state,
      pincode,
      country: 'India',
      deliveryDate,
      deliveryTimeSlot: deliverySlot,
      messageCard
    };

    setTimeout(() => {
      const newOrder = placeOrder(
        customerAddress,
        cart,
        subtotal,
        0,
        shippingFee,
        grandTotal,
        paymentMethod
      );

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if not supported
      }

      clearCart();
      setIsSubmitting(false);
      showToast('Your order has been placed successfully in Demo Mode! 🎉', 'success');
      setLocation(`/order-confirmation/${newOrder.orderId}`);
    }, 900);
  };

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Delivery Details
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete the delivery address and choose your convenient surprise time slot
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <strong>Demonstration Checkout Mode:</strong> No real money or card details will be charged. This completes a simulation flow matching FNP's gifting store standards.
          </div>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Delivery Address & Time Slot */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Recipient Information */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
                <MapPin className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  1. Delivery Address & Recipient
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Recipient / Customer Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Recipient Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Customer Email Address (for confirmation invoice) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Flat, House no., Building, Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 402, Sunshine Towers, MG Road"
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Bengaluru, Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    PIN Code (6 digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 400001"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-semibold tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Date & Slot Selection */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
                <Clock className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  2. Delivery Schedule & Slot Selection
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Delivery Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={deliverySlot}
                    onChange={(e) => setDeliverySlot(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 font-medium"
                  >
                    <option value="Standard Daytime (9:00 AM - 6:00 PM)">Standard Daytime (9:00 AM - 6:00 PM)</option>
                    <option value="Morning Surprise (7:00 AM - 9:00 AM)">Morning Surprise (7:00 AM - 9:00 AM)</option>
                    <option value="Evening Slot (5:00 PM - 9:00 PM)">Evening Slot (5:00 PM - 9:00 PM)</option>
                    <option value="Midnight Delivery (11:30 PM - 12:30 AM)">Midnight Surprise (11:30 PM - 12:30 AM)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Complimentary Message for Gift Greeting Card
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Wishing you a magical day full of happiness, sweet moments and cherished memories!"
                    value={messageCard}
                    onChange={(e) => setMessageCard(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-sky-200 rounded-xl text-xs focus:outline-none focus:border-sky-500 text-slate-800 resize-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Options (Demo Simulation) */}
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-sky-100">
                <CreditCard className="w-5 h-5 text-sky-500" />
                <h3 className="font-bold text-slate-900 text-base">
                  3. Payment Method (Demo Mode)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'upi' ? 'border-sky-500 bg-sky-50/50 text-sky-800 font-bold' : 'border-sky-100 bg-white text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="sr-only"
                  />
                  <span className="text-xs font-bold mb-1">📱 UPI / QR Code</span>
                  <span className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm</span>
                </label>

                <label className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-sky-500 bg-sky-50/50 text-sky-800 font-bold' : 'border-sky-100 bg-white text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <span className="text-xs font-bold mb-1">💳 Credit / Debit Card</span>
                  <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</span>
                </label>

                <label className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-sky-500 bg-sky-50/50 text-sky-800 font-bold' : 'border-sky-100 bg-white text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <span className="text-xs font-bold mb-1">💵 Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500">Pay upon delivery</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-sky-100">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items mini list */}
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <img
                        src={item.product.thumbnail || item.product.images[0]}
                        alt={item.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-sky-50"
                      />
                      <div className="truncate">
                        <span className="font-semibold text-slate-800 block truncate">{item.product.name}</span>
                        <span className="text-slate-500 text-[10px]">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900 shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="pt-3 border-t border-sky-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="pt-3 border-t border-sky-100 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Payable</span>
                  <span className="font-black text-xl text-sky-600">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-sky-200 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                {isSubmitting ? 'Placing Demo Order...' : 'Confirm & Place Order'}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock className="w-3.5 h-3.5 text-sky-500" />
                <span>Encrypted Demo Order Confirmation</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
