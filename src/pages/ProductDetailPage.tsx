import React, { useState, useMemo } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  ChevronRight, 
  Upload, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/common/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const [, params] = useRoute('/product/:slug');
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = useMemo(() => {
    return INITIAL_PRODUCTS.find((p) => p.slug === params?.slug) || INITIAL_PRODUCTS[0];
  }, [params?.slug]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights?.[0] || '500g');
  
  // Customization fields
  const [customMessage, setCustomMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Pincode checker state
  const [pincode, setPincode] = useState('400001');
  const [isPincodeChecked, setIsPincodeChecked] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState('Standard Delivery (Free)');

  // Related products
  const relatedProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setIsPincodeChecked(true);
      showToast(`Pincode ${pincode} is serviceable for Express Delivery!`, 'success');
    } else {
      showToast('Please enter a valid 6-digit Indian PIN code.', 'error');
    }
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      {
        customMessage: customMessage || undefined,
        recipientName: recipientName || undefined,
        selectedWeight: product.availableWeights ? selectedWeight : undefined,
        uploadedFileName: uploadedFileName || undefined,
        deliverySlot: selectedSlot
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setLocation('/cart');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('File size exceeds 2MB limit.', 'error');
        return;
      }
      setUploadedFileName(file.name);
      showToast(`File "${file.name}" attached successfully!`, 'success');
    }
  };

  const wishlisted = isWishlisted(product.id);
  const discountPercent = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-8 text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-1.5 flex-wrap">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-sky-600">
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product Details Main Section */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 md:p-8 shadow-xs mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-sky-50 border border-sky-100 shadow-inner">
                <img
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-md backdrop-blur-md transition-all ${
                    wishlisted ? 'bg-rose-50 text-rose-500' : 'bg-white/80 text-slate-600 hover:text-rose-500 hover:bg-white'
                  }`}
                  aria-label="Add to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails list if multiple */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        selectedImage === idx ? 'border-sky-500 shadow-xs' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust Badges under image */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-sky-50 text-center">
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">100% Genuine</span>
                  <span className="text-[9px] text-slate-500">Premium Quality</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700">
                  <Truck className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Safe Delivery</span>
                  <span className="text-[9px] text-slate-500">Contactless & Sanitized</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700">
                  <Clock className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Timed Slots</span>
                  <span className="text-[9px] text-slate-500">Fixed & Midnight</span>
                </div>
              </div>
            </div>

            {/* Right: Product Meta & Customization Options */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  {product.category}
                </span>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2.5 leading-snug">
                  {product.name}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded">
                    <span>{product.rating.toFixed(1)}</span>
                    <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                  </div>
                  <span className="text-xs text-slate-500">{product.reviewsCount} verified customer reviews</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 p-4 bg-sky-50/60 rounded-2xl border border-sky-100">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <>
                    <span className="text-sm text-slate-600 line-through">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-bold bg-sky-500 text-white px-2 py-0.5 rounded-md">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
                <span className="text-xs text-slate-600 ml-auto font-medium">Inclusive of all taxes</span>
              </div>

              {/* Weight Selector for Cakes if available */}
              {product.availableWeights && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Select Cake Weight:</label>
                  <div className="flex gap-2">
                    {product.availableWeights.map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setSelectedWeight(weight)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                          selectedWeight === weight
                            ? 'bg-sky-500 text-white border-sky-500 shadow-xs'
                            : 'bg-white text-slate-700 border-sky-200 hover:bg-sky-50'
                        }`}
                      >
                        {weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pincode Availability Checker */}
              <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span>Check Delivery Availability</span>
                  </div>
                  <span className="text-[11px] text-slate-600">Sample Indian PIN Code</span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ''));
                      setIsPincodeChecked(false);
                    }}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-3.5 py-2 text-xs font-semibold tracking-wider text-slate-800 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                  >
                    Check
                  </button>
                </form>

                {isPincodeChecked && (
                  <div className="text-xs space-y-1.5 pt-1 text-slate-600">
                    <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Delivery available to PIN {pincode}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pl-5">
                      • Earliest Available Slot: <strong>Today (2:00 PM - 5:00 PM)</strong><br />
                      • Midnight surprise slot: Available between 11:30 PM - 12:30 AM
                    </div>
                  </div>
                )}
              </div>

              {/* Personalization Inputs if customized product */}
              {product.customizable && (
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-sky-800">
                    <Sparkles className="w-4 h-4 text-sky-600" />
                    <span>Customization Details</span>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Recipient Name / Inscription
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Happy Anniversary Rohit & Pooja"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Gift Card Message (Included Free)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Write your sweet message to be printed on greeting card..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="w-full bg-white px-3 py-2 text-xs border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-800 resize-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                      Upload Custom Photo (Optional, max 2MB)
                    </label>
                    <label className="flex items-center justify-center gap-2 p-3 bg-white border border-dashed border-sky-300 rounded-xl cursor-pointer hover:bg-sky-50/50 transition-colors">
                      <Upload className="w-4 h-4 text-sky-500" />
                      <span className="text-xs text-sky-700 font-medium">
                        {uploadedFileName || 'Choose image from device'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              )}

              {/* Quantity Counter & CTA Buttons */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-sky-200 rounded-xl bg-white shadow-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 text-slate-600 hover:text-sky-600 font-bold text-sm"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-3 py-1.5 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 text-slate-600 hover:text-sky-600 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xs transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-4 h-4 text-sky-600" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md shadow-sky-200 transition-all active:scale-95"
                  >
                    Buy Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Description */}
              <div className="pt-4 border-t border-sky-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Product Overview
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Care Instructions / Gifting Tips */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <h4 className="font-bold text-slate-800">Care & Gifting Instructions:</h4>
                <p>• For Flowers: Trim stems diagonally and place in clean cold water daily.</p>
                <p>• For Cakes: Keep refrigerated and consume within 24 hours of delivery.</p>
                <p>• For Plants: Keep in bright, indirect sunlight and water moderately.</p>
              </div>

            </div>

          </div>
        </div>

        {/* Similar & Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Pair & Complement</span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                  You May Also Like
                </h2>
              </div>
              <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                View More in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
