import React, { useState } from 'react';
import { useRoute, useLocation, Link } from 'wouter';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { CustomizationSection } from '../components/common/CustomizationSection';
import { ProductCard } from '../components/common/ProductCard';
import { CustomizationData } from '../types';
import { 
  Heart, 
  ShoppingBag, 
  Zap, 
  Star, 
  Check, 
  Truck, 
  ShieldCheck, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { businessConfig } from '../config/businessConfig';

export const ProductDetailPage: React.FC = () => {
  const [, params] = useRoute('/product/:slug');
  const [, navigate] = useLocation();
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const slug = params?.slug;
  const product = products.find((p) => p.slug === slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.availableSizes?.[0]
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product?.availableColors?.[0]
  );
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    product?.availableVariants?.[0]?.name
  );
  const [quantity, setQuantity] = useState<number>(1);

  const [customization, setCustomization] = useState<CustomizationData>({});

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white rounded-3xl border shadow-sm space-y-4">
        <h2 className="font-serif text-2xl font-bold text-giftoria-wine-900">Product Not Found</h2>
        <p className="text-xs text-gray-500">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="inline-block bg-giftoria-wine-800 text-white font-bold text-xs py-3 px-6 rounded-xl">
          Back to Shop
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Combine selections into customization payload
  const currentCustomizationPayload: CustomizationData = {
    ...customization,
    selectedSize: selectedSize || customization.selectedSize,
    selectedColor: selectedColor || customization.selectedColor,
    selectedVariant: selectedVariant || customization.selectedVariant,
  };

  const handleAddToCart = () => {
    addToCart(product, currentCustomizationPayload, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, currentCustomizationPayload, quantity);
    navigate('/cart');
  };

  const relatedProducts = products
    .filter((p) => p.service === product.service && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-24">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-500">
        <Link href="/" className="hover:text-giftoria-wine-800">Home</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href="/products" className="hover:text-giftoria-wine-800">Products</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <Link href={`/${product.service}`} className="hover:text-giftoria-wine-800">{product.serviceName}</Link>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="font-semibold text-giftoria-wine-900 truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout: Gallery Left, Controls Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[4/5] bg-giftoria-cream-200 rounded-3xl overflow-hidden border border-giftoria-wine-800/10 shadow-md">
            <img
              src={product.images[selectedImageIndex] || product.thumbnail}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md shadow-lg transition-transform active:scale-95 ${
                wishlisted ? 'bg-rose-500 text-white scale-110' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500'
              }`}
              aria-label="Save to favorites"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnail Selector */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-giftoria-wine-800 scale-105 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Personalization */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-giftoria-wine-800 bg-giftoria-wine-50 px-3 py-1 rounded-full">
              {product.serviceName}
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-4xl text-giftoria-wine-900 mt-2">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mt-3 text-xs">
              {product.rating && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg text-amber-800 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount} reviews)</span>
                </div>
              )}

              <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {product.stock > 0 ? `✓ In Stock (${product.stock} units left)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="flex items-baseline gap-3 p-4 bg-giftoria-cream-100 rounded-2xl border border-giftoria-wine-800/10">
            <span className="font-serif font-bold text-3xl text-giftoria-wine-900">
              ₹{product.price}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ₹{product.compareAtPrice}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Save ₹{product.compareAtPrice - product.price} ({Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Variant / Size / Color Selector Options */}
          {product.availableVariants && product.availableVariants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-giftoria-charcoal-900">Select Option / Pack:</label>
              <div className="flex flex-wrap gap-2">
                {product.availableVariants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v.name)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedVariant === v.name
                        ? 'border-giftoria-wine-800 bg-giftoria-wine-800 text-white shadow-sm'
                        : 'border-gray-300 bg-white text-giftoria-charcoal-800 hover:border-giftoria-wine-800'
                    }`}
                  >
                    {v.name} - ₹{v.price}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.availableSizes && product.availableSizes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-giftoria-charcoal-900">Select Size:</label>
              <div className="flex flex-wrap gap-2">
                {product.availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'border-giftoria-wine-800 bg-giftoria-wine-800 text-white shadow-sm'
                        : 'border-gray-300 bg-white text-giftoria-charcoal-800 hover:border-giftoria-wine-800'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.availableColors && product.availableColors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-giftoria-charcoal-900">Select Color / Finish:</label>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((clr) => (
                  <button
                    key={clr}
                    onClick={() => setSelectedColor(clr)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedColor === clr
                        ? 'border-giftoria-wine-800 bg-giftoria-wine-800 text-white shadow-sm'
                        : 'border-gray-300 bg-white text-giftoria-charcoal-800 hover:border-giftoria-wine-800'
                    }`}
                  >
                    {clr}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DEDICATED PERSONALIZATION ENGINE BLOCK */}
          {product.customizable && (
            <CustomizationSection
              product={product}
              value={customization}
              onChange={setCustomization}
            />
          )}

          {/* Quantity Controls */}
          <div className="flex items-center gap-4 pt-2">
            <label className="text-xs font-bold text-giftoria-charcoal-900">Quantity:</label>
            <div className="flex items-center border border-gray-300 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-xs font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold border-x text-giftoria-charcoal-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-xs font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.isComingSoon || product.stock <= 0}
              className="flex items-center justify-center gap-2 bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-wine transition-all active:scale-95 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.isComingSoon || product.stock <= 0}
              className="flex items-center justify-center gap-2 bg-giftoria-gold-500 hover:bg-giftoria-gold-600 text-giftoria-charcoal-900 font-bold text-sm py-4 px-6 rounded-2xl shadow-gold transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-giftoria-wine-800 shrink-0" />
              <span>Dispatches in 24 - 48 Hours</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-giftoria-wine-800 shrink-0" />
              <span>100% Quality Guaranteed</span>
            </div>
          </div>
        </div>

      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-giftoria-wine-800/10 space-y-6">
        <h3 className="font-serif font-bold text-xl text-giftoria-wine-900">
          Product Description &amp; Customization Notes
        </h3>
        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="bg-giftoria-cream-100 p-4 rounded-2xl border border-giftoria-wine-800/10">
            <div className="font-bold text-giftoria-wine-900 mb-1">Service Type</div>
            <div className="text-gray-600">{product.serviceName}</div>
          </div>
          <div className="bg-giftoria-cream-100 p-4 rounded-2xl border border-giftoria-wine-800/10">
            <div className="font-bold text-giftoria-wine-900 mb-1">Upload File Limit</div>
            <div className="text-gray-600">Max 1 MB (JPG, PNG, WEBP, PDF)</div>
          </div>
          <div className="bg-giftoria-cream-100 p-4 rounded-2xl border border-giftoria-wine-800/10">
            <div className="font-bold text-giftoria-wine-900 mb-1">Customization Included</div>
            <div className="text-gray-600">Custom Text &amp; Photo Printing</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-serif font-bold text-2xl text-giftoria-wine-900">
            More From {product.serviceName}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
