import React from 'react';
import { Link, useLocation } from 'wouter';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, FileText, CheckCircle } from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const CartPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { cart, removeFromCart, updateQuantity, subtotal, discount, shippingFee, grandTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-giftoria-cream-200 text-giftoria-wine-800 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
            Your cart is waiting for something special ❤️
          </h1>
          <p className="text-xs text-gray-500">
            Explore our personalized gifts, 3D printed lamps, and customized photo frames.
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-sm py-3.5 px-8 rounded-2xl shadow-wine transition-all"
        >
          <span>Explore Gifts</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-giftoria-wine-900">
          Shopping Cart ({cartCount} item{cartCount !== 1 ? 's' : ''})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            const { cartItemId, product, quantity, customization } = item;
            return (
              <div
                key={cartItemId}
                className="bg-white rounded-3xl p-4 sm:p-6 border border-giftoria-wine-800/10 shadow-sm flex flex-col sm:flex-row gap-4 justify-between"
              >
                {/* Item Image & Info */}
                <div className="flex gap-4">
                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-2xl bg-gray-100 shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-giftoria-wine-800">
                      {product.serviceName}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-giftoria-wine-900 leading-snug">
                      {product.name}
                    </h3>
                    <div className="text-xs font-bold text-giftoria-wine-900">
                      ₹{product.price}
                    </div>

                    {/* Customization Details attached to cart item */}
                    <div className="pt-2 text-[11px] text-gray-600 space-y-1">
                      {customization.selectedVariant && (
                        <div><strong className="text-gray-800">Variant:</strong> {customization.selectedVariant}</div>
                      )}
                      {customization.selectedSize && (
                        <div><strong className="text-gray-800">Size:</strong> {customization.selectedSize}</div>
                      )}
                      {customization.selectedColor && (
                        <div><strong className="text-gray-800">Color:</strong> {customization.selectedColor}</div>
                      )}

                      {customization.customMessage && (
                        <div className="bg-giftoria-cream-100 p-2 rounded-xl border border-giftoria-wine-800/10 text-giftoria-wine-900">
                          <strong>Message:</strong> "{customization.customMessage}"
                        </div>
                      )}

                      {customization.uploadedFileName && (
                        <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 p-1.5 rounded-lg">
                          <FileText className="w-3.5 h-3.5" />
                          <span><strong>Design File:</strong> {customization.uploadedFileName} ({customization.uploadedFileSizeFormatted})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex sm:flex-col items-center justify-between sm:items-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                  <button
                    onClick={() => removeFromCart(cartItemId)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                    <button
                      onClick={() => updateQuantity(cartItemId, quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 text-xs font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(cartItemId, quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="font-serif font-bold text-base text-giftoria-wine-900">
                    ₹{product.price * quantity}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-giftoria-wine-800/10 shadow-sm space-y-5">
          <h3 className="font-serif font-bold text-lg text-giftoria-wine-900 border-b pb-3">
            Order Summary
          </h3>

          <div className="space-y-2.5 text-xs text-giftoria-charcoal-800">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">₹{subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Savings Discount</span>
                <span>- ₹{discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-600 font-bold">FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            {subtotal < businessConfig.freeShippingThreshold && (
              <div className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                Add ₹{businessConfig.freeShippingThreshold - subtotal} more to qualify for <strong>FREE Shipping!</strong>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
            <span className="font-serif font-bold text-lg text-giftoria-wine-900">Grand Total</span>
            <span className="font-serif font-bold text-2xl text-giftoria-wine-900">₹{grandTotal}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full inline-flex items-center justify-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-wine transition-all"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-gray-500 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted &amp; Secure Checkout</span>
          </div>
        </div>

      </div>
    </div>
  );
};
