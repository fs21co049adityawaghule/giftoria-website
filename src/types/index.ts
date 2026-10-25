export type ServiceType = string;
export type CustomizationType = string;

export type ProductCategory = 
  | 'Flowers'
  | 'Cakes'
  | 'Plants'
  | 'Personalized Gifts'
  | 'Gift Hampers'
  | 'Chocolates'
  | 'Jewellery'
  | 'Home & Living'
  | 'Occasions'
  | 'Birthday Gifts'
  | 'Anniversary Gifts';

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
}

export interface CustomizationData {
  customMessage?: string;
  recipientName?: string;
  selectedWeight?: string;
  selectedVariant?: string;
  selectedSize?: string;
  selectedColor?: string;
  deliveryDate?: string;
  deliverySlot?: string;
  uploadedFileName?: string;
  uploadedFileType?: string;
  uploadedFileSizeFormatted?: string;
  uploadedFileUrl?: string;
  additionalNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subCategory?: string;
  service?: string;
  serviceName?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  customizable?: boolean;
  customizationType?: string;
  availableSizes?: string[];
  availableColors?: string[];
  availableVariants?: ProductVariant[];
  availableWeights?: string[];
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  trending?: boolean;
  newProduct?: boolean;
  tags: string[];
  rating: number;
  reviewsCount: number;
  deliveryLabel: string;
  isExpress?: boolean;
  isSameDay?: boolean;
  occasion?: string;
  createdAt?: string;
  updatedAt?: string;
  isComingSoon?: boolean;
}

export interface CartItem {
  cartItemId: string;
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
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  messageCard?: string;
}

export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'cod';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'demo_success' | 'test_mode_success';
export type OrderStatus = 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

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
