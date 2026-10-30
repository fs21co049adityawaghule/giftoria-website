export type ServiceType = string;
export type CustomizationType = string;

export type ProductCategory = 
  | 'Personalized Gifts'
  | '3D Arts'
  | 'Forever Blooms'
  | 'Gift Hampers'
  | 'Birthday Gifts'
  | 'Anniversary Gifts'
  | 'Jewellery'
  | 'Frames'
  | string;

export interface ProductVariant {
  id: string;
  name: string;
  price: number;
  costPrice?: number;
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
  mobileModel?: string;
  tshirtSize?: string;
  printDesign?: string;
  referenceImages?: string[];
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
  category: ProductCategory;
  subCategory?: string;
  service?: string;
  serviceName?: string;
  description: string;
  price: number; // Selling price (managed by admin, confidential from public display)
  costPrice: number; // Internal making/acquisition cost (NEVER exposed to customer)
  compareAtPrice?: number;
  currency: string;
  images: string[];
  thumbnail: string;
  customizable?: boolean;
  customizationType?: string;
  customizationInstructions?: string;
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
  isStartingPrice?: boolean; // For products like 3D Couple Statues "Starting from ₹850"
  startingPriceAmount?: number;
  occasion?: string;
  createdAt?: string;
  updatedAt?: string;
  isComingSoon?: boolean;
  isActive?: boolean; // Visible on customer site if true
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  customization: CustomizationData;
  addedAt: number;
  unitPriceSnapshot?: number; // Snapshot of selling price
  unitCostSnapshot?: number; // Snapshot of cost price
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

export type PaymentMethod = 'razorpay' | 'upi' | 'card' | 'netbanking' | 'whatsapp_enquiry' | 'online_gateway';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 
  | 'PENDING PAYMENT'
  | 'PAYMENT FAILED'
  | 'PAID / CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED / REFUNDED'
  | 'New Order'
  | 'Confirmed'
  | 'Customization Pending'
  | 'In Production'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'PENDING PAYMENT',
  'PAYMENT FAILED',
  'PAID / CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED / REFUNDED'
];

export type DeliveryStatus =
  | 'Not Dispatched'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delivery Attempt Failed'
  | 'Returned';

export const DELIVERY_STATUSES: DeliveryStatus[] = [
  'Not Dispatched',
  'Ready for Dispatch',
  'Dispatched',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Delivery Attempt Failed',
  'Returned'
];

export interface DeliveryRecord {
  orderId: string;
  customerName: string;
  customerPhone: string;
  productSummary: string;
  quantity: number;
  deliveryAddress: string;
  pincode: string;
  dispatchDate?: string;
  expectedDeliveryDate?: string;
  courierPartner?: string;
  trackingId?: string;
  trackingUrl?: string;
  deliveryStatus: DeliveryStatus;
  adminNotes?: string;
  updatedAt: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  sellingPriceSnapshot: number;
  costPriceSnapshot: number;
  itemProfit: number;
  customization?: CustomizationData;
  thumbnail?: string;
}

export interface Order {
  orderId: string;
  customer: ShippingAddress;
  items: CartItem[];
  itemSnapshots?: OrderItemSnapshot[]; // Historical snapshots
  subtotal: number;
  discount: number;
  shippingFee: number;
  directExpenses?: number; // Direct expenses e.g. packaging/courier
  grandTotal: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryRecord?: DeliveryRecord;
  adminNotes?: string;
  isTestMode: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Razorpay Payment Gateway integration fields
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paymentVerifiedAt?: string;
  paymentFailureReason?: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}
