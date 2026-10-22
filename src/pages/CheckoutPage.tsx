import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { ShippingAddress, PaymentMethod } from '../types';
import { ShieldCheck, Truck, Lock, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { cart, subtotal, shippingFee, grandTotal } = useCart();
  const { createOrder } = useOrder();
  const { showToast } = useToast();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: '',
    mobile: '',
    email: '',
    addressLine: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    country: 'India',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [formErrors, setFormErrors] = useState<Partial<ShippingAddress>>({});

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const validateForm = (): boolean => {
    const errors: Partial<ShippingAddress> = {};
    if (!address.fullName.trim()) errors.fullName = 'Full Name is required';
    if (!address.mobile.trim() || address.mobile.length < 10) errors.mobile = 'Valid 10-digit mobile number required';
    if (!address.email.trim() || !address.email.includes('@')) errors.email = 'Valid email address required';
    if (!address.addressLine.trim()) errors.addressLine = 'Street address is required';
    if (!address.city.trim()) errors.city = 'City is required';
    if (!address.pincode.trim() || address.pincode.length < 6) errors.pincode = 'Valid 6-digit Pincode required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Please fix the errors in the shipping form', 'error');
      return;
    }

    const order = createOrder(address, paymentMethod);
    if (order) {
      // Trigger celebration confetti
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        console.log('Confetti effect');
      }

      navigate(`/order-confirmation/${order.orderId}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Header & Test Mode Badge */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-4 gap-2">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
            Checkout &amp; Customization Review
          </h1>
          <p className="text-xs text-gray-500">Please provide delivery details and confirm your custom order</p>
        </div>

        <div className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-amber-300 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-700" />
          <span>TEST / DEV MODE PAYMENT</span>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Shipping Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Shipping Form Card */}
          <div className="bg-white rounded-3xl p-6 border border-giftoria-wine-800/10 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-giftoria-wine-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-giftoria-wine-800" />
              <span>1. Shipping &amp; Delivery Address</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="block font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                {formErrors.fullName && <p className="text-rose-600 text-[11px]">{formErrors.fullName}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">Mobile Number *</label>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={address.mobile}
                  onChange={(e) => setAddress({ ...address, mobile: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                {formErrors.mobile && <p className="text-rose-600 text-[11px]">{formErrors.mobile}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">Email Address *</label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                {formErrors.email && <p className="text-rose-600 text-[11px]">{formErrors.email}</p>}
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block font-bold text-gray-700">Street Address &amp; Landmark *</label>
                <input
                  type="text"
                  placeholder="House / Flat No, Street, Landmark"
                  value={address.addressLine}
                  onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                {formErrors.addressLine && <p className="text-rose-600 text-[11px]">{formErrors.addressLine}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">City *</label>
                <input
                  type="text"
                  placeholder="Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                {formErrors.city && <p className="text-rose-600 text-[11px]">{formErrors.city}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">State *</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">Pincode *</label>
                <input
                  type="text"
                  placeholder="400001"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-giftoria-wine-800"
                />
                {formErrors.pincode && <p className="text-rose-600 text-[11px]">{formErrors.pincode}</p>}
              </div>

              <div className="space-y-1">
                <label className="block font-bold text-gray-700">Country</label>
                <input
                  type="text"
                  disabled
                  value={address.country}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-xs text-gray-500 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Payment Architecture Selection */}
          <div className="bg-white rounded-3xl p-6 border border-giftoria-wine-800/10 shadow-sm space-y-4">
            <h2 className="font-serif font-bold text-lg text-giftoria-wine-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-giftoria-wine-800" />
              <span>2. Select Payment Method</span>
            </h2>

            <div className="space-y-2 text-xs">
              <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-giftoria-wine-800 bg-giftoria-wine-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-giftoria-wine-800 focus:ring-giftoria-wine-800"
                  />
                  <div>
                    <div className="font-bold text-giftoria-wine-900">UPI Instant Payment (GPay, PhonePe, Paytm)</div>
                    <div className="text-[11px] text-gray-500">Instant test verification</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Fastest</span>
              </label>

              <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-giftoria-wine-800 bg-giftoria-wine-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-giftoria-wine-800 focus:ring-giftoria-wine-800"
                  />
                  <div>
                    <div className="font-bold text-giftoria-wine-900">Credit / Debit Card</div>
                    <div className="text-[11px] text-gray-500">Visa, MasterCard, RuPay</div>
                  </div>
                </div>
              </label>

              <label className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-giftoria-wine-800 bg-giftoria-wine-50' : 'border-gray-200 bg-white'}`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-giftoria-wine-800 focus:ring-giftoria-wine-800"
                  />
                  <div>
                    <div className="font-bold text-giftoria-wine-900">Cash on Delivery (COD)</div>
                    <div className="text-[11px] text-gray-500">Pay cash upon item arrival</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Customization Review & Final Order Summary */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-giftoria-wine-800/10 shadow-sm space-y-6">
          <h2 className="font-serif font-bold text-lg text-giftoria-wine-900 border-b pb-3">
            3. Review Customized Items
          </h2>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                <img src={item.product.thumbnail} alt="" className="w-14 h-16 object-cover rounded-xl shrink-0" />
                <div className="space-y-1">
                  <div className="font-bold text-giftoria-wine-900 leading-snug">{item.product.name} (×{item.quantity})</div>
                  <div className="font-bold text-gray-700">₹{item.product.price * item.quantity}</div>
                  
                  {/* Customization Details preview */}
                  {item.customization.customMessage && (
                    <div className="text-[10px] text-giftoria-wine-900 bg-giftoria-cream-100 p-1.5 rounded-lg">
                      <strong>Text:</strong> "{item.customization.customMessage}"
                    </div>
                  )}
                  {item.customization.uploadedFileName && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 p-1 rounded flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>{item.customization.uploadedFileName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-giftoria-wine-900 pt-2 border-t">
              <span>Grand Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-giftoria-gold-500 hover:bg-giftoria-gold-600 text-giftoria-charcoal-900 font-extrabold text-sm py-4 px-6 rounded-2xl shadow-gold transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Place Order Now</span>
          </button>
        </div>

      </form>
    </div>
  );
};
