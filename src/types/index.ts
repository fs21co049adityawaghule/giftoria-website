export type ServiceType = 
  | 'customized-gifts'
  | '3d-printing'
  | 'dtf-printing'
  | 'sublimation-printing'
  | 'photo-frames';

export type CustomizationType = 'text' | 'image' | 'image_text' | '3d_custom' | 'printing';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Collar", "Round Neck", "A4", "4x6 inch", "750ml"
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

export interface CustomizationData {
  customMessage?: string;
  uploadedFileName?: string;
  uploadedFileType?: string;
  uploadedFileSizeFormatted?: string;
  uploadedFileUrl?: string; // Data URL or Blob URL preview
  selectedVariant?: string;
  selectedSize?: string;
  selectedColor?: string;
  additionalNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  service: ServiceType;
  serviceName: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  customizable: boolean;
  customizationType: CustomizationType;
  availableSizes?: string[];
  availableColors?: string[];
  availableVariants?: ProductVariant[];
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  newProduct: boolean;
  tags: string[];
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  updatedAt: string;
  isComingSoon?: boolean;
}

export interface CartItem {
  cartItemId: string; // Composite unique key: product.id + JSON.stringify(customizationData)
  product: Product;
  quantity: number;
  customization: CustomizationData;
  addedAt: number;
}

export interface ShippingAddress {
  fullName: string;
  mobile: string;
  email: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'test_mode_success';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Customization Processing' | 'Printing' | 'Ready' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  orderId: string;
  customer: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  isTestMode: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
