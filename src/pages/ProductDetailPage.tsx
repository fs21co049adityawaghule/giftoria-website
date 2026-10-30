import React, { useState, useMemo } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { 
  Heart, 
  ShoppingBag, 
  Star, 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Upload, 
  Sparkles,
  ArrowRight,
  AlertCircle,
  Zap
} from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { ProductCard } from '../components/common/ProductCard';
import { validateMaharashtraPincode } from '../utils/pincodeUtils';

export const ProductDetailPage: React.FC = () => {
  const [, params] = useRoute('/product/:slug');
  const [, setLocation] = useLocation();
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = useMemo(() => {
    return products.find((p) => p.slug === params?.slug) || INITIAL_PRODUCTS.find((p) => p.slug === params?.slug) || INITIAL_PRODUCTS[0];
  }, [params?.slug, products]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights?.[0] || '500g');
  
  // Customization fields
  const [customMessage, setCustomMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Maharashtra Pincode checker state
  const [pincode, setPincode] = useState('400001');
  const [pincodeResult, setPincodeResult] = useState(() => validateMaharashtraPincode('400001'));
  const [selectedSlot, setSelectedSlot] = useState('Standard Daytime Dispatch (9:00 AM - 6:00 PM)');

  // Related products
  const relatedProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [product]);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateMaharashtraPincode(pincode);
    setPincodeResult(result);
    if (result.isValid && result.isMaharashtra) {
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
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
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-sky-50 border border-sky-100 shadow-inner group">
                <img
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-350 ease-out group-hover:scale-[1.06] motion-reduce:group-hover:scale-100"
                />
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 p-3 rounded-full shadow-md backdrop-blur-md transition-all duration-200 transform group-hover:scale-105 ${
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
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 shrink-0 hover:scale-105 ${
                        selectedImage === idx ? 'border-sky-500 shadow-xs ring-2 ring-sky-200' : 'border-slate-200 opacity-70 hover:opacity-100'
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
                  <span className="text-[11px] font-bold block">100% Handcrafted</span>
                  <span className="text-[9px] text-slate-500">Quality Assured</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700">
                  <Truck className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Safe Packaging</span>
                  <span className="text-[9px] text-slate-500">Damage-Proof Transit</span>
                </div>
                <div className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 text-slate-700">
                  <Clock className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                  <span className="text-[11px] font-bold block">Next-Day Dispatch</span>
                  <span className="text-[9px] text-slate-500">Except Sundays</span>
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
                  <span className="text-xs text-slate-500">{product.reviewsCount} customer reviews</span>
                </div>
              </div>

              {/* Quality & Assurance Banner */}
              <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
                    GIFTORIA Assured
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900">
                    Handcrafted Perfection
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authentic materials, delicate craftsmanship, and secure doorstep delivery across Maharashtra.
                  </p>
                </div>
                <div className="shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 text-white text-xs font-bold shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    100% Quality Guarantee
                  </span>
                </div>
              </div>

              {/* Pincode Availability Checker for Maharashtra */}
              <div className="p-4 rounded-2xl bg-white border border-sky-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <span>Check Maharashtra Delivery Serviceability</span>
                  </div>
                  <span className="text-[11px] text-slate-500">6-Digit PIN Code</span>
                </div>

                <form onSubmit={handlePincodeCheck} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter Maharashtra PIN code"
                    className="flex-1 px-3.5 py-2 text-xs font-semibold tracking-wider text-slate-800 border border-sky-200 rounded-xl focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-xs"
                  >
                    Check
                  </button>
                </form>

                {pincodeResult && (
                  <div className="text-xs space-y-1.5 pt-1">
                    {pincodeResult.isMaharashtra ? (
                      <div className="flex items-start gap-1.5 text-emerald-700 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span>{pincodeResult.message}</span>
                          <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                            Orders are dispatched next day (except Sundays) between 9:00 AM and 6:00 PM.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-1.5 text-rose-700 font-semibold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{pincodeResult.message}</span>
                      </div>
                    )}
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
                      placeholder="e.g. Happy Birthday Rohit / Love Always"
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
                    type="button"
                    onClick={handleAddToCart}
                    className="flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-xs hover:border-sky-300 transition-all active:scale-95"
                    aria-label="Add product to cart"
                  >
                    <ShoppingBag className="w-4 h-4 text-sky-600" />
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-3.5 px-6 rounded-2xl font-bold text-sm shadow-md shadow-sky-200 hover:shadow-sky-300 transition-all active:scale-95"
                    aria-label="Buy product now"
                  >
                    <Zap className="w-4 h-4 fill-white" />
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
                <h4 className="font-bold text-slate-800">Care & Material Instructions:</h4>
                <p>• <strong>Forever Blooms:</strong> Keep dry in indoor ambient conditions. Dust with a soft dry brush; do not water.</p>
                <p>• <strong>Custom Mugs:</strong> Wash gently with a soft sponge. Do not use metal scrubbers on printed areas.</p>
                <p>• <strong>3D Arts & Lithophanes:</strong> Fabricated from durable PLA; keep away from open flames or high direct heat.</p>
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
