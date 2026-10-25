import React from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Heart
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { businessConfig } from '../config/businessConfig';

export const CartPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    subtotal, 
    discount, 
    shippingFee, 
    grandTotal 
  } = useCart();

  const isFreeDeliveryEligible = subtotal >= businessConfig.freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, businessConfig.freeShippingThreshold - subtotal);

  if (cart.length === 0) {
    return (
      <div className="bg-[#F8FCFF] min-h-[70vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-12 text-center max-w-md w-full shadow-xs">
          <div className="w-20 h-20 rounded-full bg-sky-50 text-sky-500 mx-auto flex items-center justify-center mb-5">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500 mb-8 leading-relaxed">
            Looks like you haven't added any flowers, cakes, or gifts to your cart yet. Explore our handcrafted collections to brighten someone's day!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-sky-200 transition-all text-sm"
          >
            Start Gifting Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-sky-100">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h1>
            <p className="text-xs text-slate-500 mt-1">Review your selections before proceeding to checkout</p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Cart
          </button>
        </div>

        {/* Free delivery progress banner */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <div className="flex items-center gap-1.5 text-sky-700">
              <Truck className="w-4 h-4 text-sky-500" />
              <span>
                {isFreeDeliveryEligible 
                  ? '🎉 Congratulations! You have unlocked FREE Express Delivery' 
                  : `Add ₹${amountNeededForFreeShipping} more to qualify for FREE Delivery!`
                }
              </span>
            </div>
            <span className="text-slate-500 font-medium">Goal: ₹{businessConfig.freeShippingThreshold}</span>
          </div>
          <div className="w-full bg-sky-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-sky-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (subtotal / businessConfig.freeShippingThreshold) * 100)}%` }}
            />
          </div>
        </div>

        {/* Grid Layout: Cart Items & Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => {
              const product = item.product;
              return (
                <div 
                  key={item.cartItemId}
                  className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.thumbnail || product.images[0]}
                      alt={product.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-sky-50 bg-sky-50/50 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                        {product.name}
                      </h3>
                      
                      {/* Weight or customization notes if any */}
                      {item.customization.selectedWeight && (
                        <div className="text-xs text-slate-500">
                          Weight: <span className="font-semibold text-slate-700">{item.customization.selectedWeight}</span>
                        </div>
                      )}
                      {item.customization.recipientName && (
                        <div className="text-xs text-slate-500">
                          For: <span className="font-semibold text-slate-700">{item.customization.recipientName}</span>
                        </div>
                      )}
                      {item.customization.customMessage && (
                        <div className="text-[11px] text-sky-700 italic truncate max-w-xs">
                          "{item.customization.customMessage}"
                        </div>
                      )}

                      <div className="text-xs text-sky-600 font-medium">
                        {product.deliveryLabel}
                      </div>
                    </div>
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-sky-50">
                    <div className="text-base sm:text-lg font-black text-slate-900">
                      ₹{(product.price * item.quantity).toLocaleString('en-IN')}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-sky-200 rounded-xl bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2.5 py-1 text-slate-600 hover:text-sky-600 text-xs font-bold"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 py-1 text-xs font-bold text-slate-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2.5 py-1 text-slate-600 hover:text-sky-600 text-xs font-bold"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Link 
                href="/products" 
                className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
              >
                ← Continue Adding More Gifts
              </Link>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl border border-sky-100 p-6 shadow-xs space-y-4 sticky top-24">
              <h3 className="font-bold text-slate-900 text-base pb-3 border-b border-sky-100">
                Order Price Breakdown
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Delivery Charge</span>
                  <span className="font-bold text-slate-900">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Applied</span>
                    <span>-₹{discount}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-sky-100 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Grand Total</span>
                  <span className="font-black text-xl text-sky-600">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setLocation('/checkout')}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-sky-200 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-slate-400 space-y-1 text-center">
                <p>🔒 256-Bit SSL Encrypted & Secure Checkout</p>
                <p>⚡ Express delivery available on checkout step</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
