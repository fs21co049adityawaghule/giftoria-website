import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Clock, 
  Package, 
  Phone, 
  ArrowRight, 
  Share2,
  AlertCircle,
  Upload,
  MessageCircle,
  Truck,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { businessConfig } from '../config/businessConfig';

export const OrderConfirmationPage: React.FC = () => {
  const [, params] = useRoute('/order-confirmation/:orderId');
  const { orders, resubmitPaymentScreenshot } = useOrder();

  const orderId = params?.orderId;
  const order = orders.find(o => o.orderId.toLowerCase() === orderId?.toLowerCase()) || orders[0];

  // Re-submission state for rejected payment
  const [newScreenshotDataUrl, setNewScreenshotDataUrl] = useState<string | null>(null);
  const [newScreenshotFileName, setNewScreenshotFileName] = useState('');
  const [reuploadError, setReuploadError] = useState<string | null>(null);
  const [isReuploading, setIsReuploading] = useState(false);

  if (!order) {
    return (
      <div className="bg-[#F8FCFF] min-h-[60vh] flex items-center justify-center py-16 px-4">
        <div className="bg-white rounded-3xl border border-sky-100 p-8 text-center max-w-sm w-full shadow-xs">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Order Not Found</h2>
          <p className="text-xs text-slate-500 mb-6">Could not retrieve details for Order ID: {orderId}</p>
          <Link
            href="/orders"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl text-xs shadow-sm transition-all inline-block"
          >
            View My Orders
          </Link>
        </div>
      </div>
    );
  }

  const isPending = order.paymentStatus === 'PAYMENT VERIFICATION PENDING';
  const isVerified = order.paymentStatus === 'PAYMENT VERIFIED';
  const isRejected = order.paymentStatus === 'PAYMENT REJECTED';

  // Steps progression index (1 to 6)
  let currentStep = 1;
  const statusStr = String(order.orderStatus).toUpperCase();
  if (statusStr.includes('DELIVERED')) currentStep = 6;
  else if (statusStr.includes('SHIPPED') || statusStr.includes('DISPATCHED')) currentStep = 5;
  else if (statusStr.includes('PROCESSING') || statusStr.includes('PRODUCTION')) currentStep = 4;
  else if (statusStr.includes('CONFIRMED')) currentStep = 3;
  else if (isVerified) currentStep = 2;
  else if (isPending) currentStep = 1;

  const handleReuploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setReuploadError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > businessConfig.uploadMaxSizeBytes) {
      setReuploadError(`Screenshot file size must be less than ${businessConfig.uploadMaxSizeMB}MB.`);
      return;
    }

    setReuploadError(null);
    setNewScreenshotFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setNewScreenshotDataUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleReuploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScreenshotDataUrl) {
      setReuploadError('Please select a payment screenshot to re-upload.');
      return;
    }

    resubmitPaymentScreenshot(
      order.orderId,
      newScreenshotDataUrl,
      newScreenshotFileName || 'resubmitted_payment.jpg'
    );
    setIsReuploading(false);
    setNewScreenshotDataUrl(null);
  };

  const whatsappMessageUrl = businessConfig.getWhatsappPaymentUrl(
    order.orderId,
    order.customer.fullName,
    order.grandTotal
  );

  return (
    <div className="bg-[#F8FCFF] min-h-screen py-10 text-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Status Banner */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-sm text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-sm font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
              #{order.orderId}
            </span>
            <span className="text-xs text-slate-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Conditional icon & badge based on status */}
          {isVerified ? (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                PAYMENT VERIFIED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                PAYMENT VERIFIED SUCCESSFULLY!
              </h1>
              <p className="text-xs sm:text-sm text-emerald-800 bg-emerald-50/70 p-3.5 rounded-2xl border border-emerald-200 max-w-xl mx-auto font-medium">
                Your payment has been verified successfully. Your order is confirmed and will be processed for delivery soon.
              </p>
            </div>
          ) : isRejected ? (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
                <AlertCircle className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-300">
                PAYMENT REJECTED
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Payment Verification Unsuccessful
              </h1>
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl max-w-xl mx-auto text-left space-y-2 text-xs sm:text-sm text-rose-800">
                <p>
                  <strong>Reason for rejection:</strong> {order.rejectionReason || 'Unable to match the transaction with the bank records or screenshot was unreadable.'}
                </p>
                <p className="text-xs text-rose-700">
                  Please review your transaction or upload a clear, full screenshot of your UPI payment to resubmit.
                </p>
              </div>

              {!isReuploading ? (
                <button
                  onClick={() => setIsReuploading(true)}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-200 transition-all inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload New Payment Screenshot</span>
                </button>
              ) : (
                <form onSubmit={handleReuploadSubmit} className="max-w-md mx-auto pt-4 space-y-3 text-left">
                  <div className="border-2 border-dashed border-rose-300 rounded-2xl p-4 bg-rose-50/40 text-center">
                    <input
                      type="file"
                      id="reupload-screenshot"
                      accept="image/*"
                      onChange={handleReuploadChange}
                      className="hidden"
                    />
                    <label htmlFor="reupload-screenshot" className="cursor-pointer block">
                      {newScreenshotDataUrl ? (
                        <div className="space-y-2">
                          <img
                            src={newScreenshotDataUrl}
                            alt="New preview"
                            className="max-h-36 mx-auto rounded-lg border border-rose-200"
                          />
                          <p className="text-xs font-bold text-rose-800">{newScreenshotFileName}</p>
                          <span className="text-[11px] text-sky-600 underline">Choose different image</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-8 h-8 text-rose-500 mx-auto" />
                          <p className="text-xs font-bold text-slate-800">Select new screenshot</p>
                          <p className="text-[10px] text-slate-400">JPEG, PNG up to 5MB</p>
                        </div>
                      )}
                    </label>
                  </div>

                  {reuploadError && (
                    <p className="text-xs text-rose-600 font-bold">{reuploadError}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsReuploading(false);
                        setNewScreenshotDataUrl(null);
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newScreenshotDataUrl}
                      className="flex-1 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white disabled:opacity-50"
                    >
                      Resubmit Screenshot
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
                <Clock className="w-9 h-9" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300">
                PAYMENT VERIFICATION PENDING
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Payment Verification in Progress
              </h1>
              <p className="text-xs sm:text-sm text-slate-700 bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 max-w-xl mx-auto font-medium">
                We have received your payment details. Our team is verifying your payment. Your order will be confirmed within 24 hours after successful verification.
              </p>
            </div>
          )}

          {/* WhatsApp share helper */}
          <div className="pt-2">
            <a
              href={whatsappMessageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Share / Enquire on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Status Progression Timeline (6 Steps) */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-sky-500" />
            Order Status Progression
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-2">
            {[
              { step: 1, title: 'Payment Submitted', label: 'Under Verification' },
              { step: 2, title: 'Payment Verified', label: 'Admin Verified' },
              { step: 3, title: 'Order Confirmed', label: 'Production Queue' },
              { step: 4, title: 'Order Processing', label: 'Crafting & Printing' },
              { step: 5, title: 'Order Shipped', label: 'In Transit' },
              { step: 6, title: 'Order Delivered', label: 'Doorstep Delivery' }
            ].map((st) => {
              const isPastOrCurrent = currentStep >= st.step;
              const isCurrent = currentStep === st.step;

              return (
                <div 
                  key={st.step} 
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent 
                      ? 'bg-sky-50 border-sky-400 shadow-sm' 
                      : isPastOrCurrent 
                        ? 'bg-emerald-50/60 border-emerald-200' 
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1.5 ${
                    isCurrent 
                      ? 'bg-sky-500 text-white shadow-xs' 
                      : isPastOrCurrent 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isPastOrCurrent && !isCurrent ? '✓' : st.step}
                  </div>
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">{st.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{st.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details & Products */}
        <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-sky-100 flex-wrap gap-2">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Order Reference
              </span>
              <p className="font-mono text-base font-black text-slate-900">#{order.orderId}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Amount Paid
              </span>
              <p className="text-base font-black text-emerald-700">₹{order.grandTotal}</p>
            </div>
          </div>

          {/* Delivery & UPI Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">
                Delivery Destination
              </span>
              <p className="font-bold text-slate-900">{order.customer.fullName}</p>
              <p className="mt-0.5">{order.customer.addressLine}, {order.customer.city} ({order.customer.pincode})</p>
              <p className="mt-0.5 text-slate-500">Phone: 📞 {order.customer.mobile} • Email: {order.customer.email}</p>
              <p className="mt-1 text-sky-700 font-medium">
                Slot: {order.customer.deliveryDate || 'Scheduled'} ({order.customer.deliveryTimeSlot || 'Standard Daytime'})
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5 font-mono">
              <div className="flex justify-between font-sans">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-bold text-slate-800">UPI Manual Transfer</span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-slate-500">UPI Beneficiary:</span>
                <span className="font-bold text-slate-900">{order.upiId || businessConfig.upiId}</span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-slate-500">Payment Status:</span>
                <span className={`font-bold ${isVerified ? 'text-emerald-700' : isRejected ? 'text-rose-700' : 'text-amber-700'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between font-sans">
                <span className="text-slate-500">Order Status:</span>
                <span className="font-bold text-sky-700">{order.orderStatus}</span>
              </div>
            </div>
          </div>

          {/* Delivery & Live Shipment Tracking Card */}
          {order.deliveryRecord && (
            <div className="bg-sky-50/60 rounded-2xl p-4 sm:p-5 border border-sky-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Shipment &amp; Delivery Tracking</h3>
                    <p className="text-[11px] text-slate-500">Real-time status managed by GIFTORIA Logistics</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500 text-white shadow-xs">
                  {order.deliveryRecord.deliveryStatus || 'Processing'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Delivery Status</span>
                  <span className="font-bold text-slate-900">{order.deliveryRecord.deliveryStatus}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Courier Partner</span>
                  <span className="font-bold text-slate-900">{order.deliveryRecord.courierPartner || 'Delhivery / Speed Post'}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tracking ID</span>
                  <span className="font-mono font-bold text-sky-700">
                    {order.deliveryRecord.trackingId ? order.deliveryRecord.trackingId : 'Awaiting Dispatch'}
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-sky-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Expected Delivery</span>
                  <span className="font-bold text-emerald-700">
                    {order.deliveryRecord.expectedDeliveryDate || order.customer.deliveryDate || 'Within 2-4 days'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ordered Products */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              Ordered Products
            </span>

            <div className="divide-y divide-sky-50 border border-sky-100 rounded-2xl overflow-hidden">
              {(order.itemSnapshots && order.itemSnapshots.length > 0 ? order.itemSnapshots : order.items.map(i => ({
                productName: i.product.name,
                category: i.product.category,
                quantity: i.quantity,
                sellingPriceSnapshot: i.product.price,
                thumbnail: i.product.thumbnail,
                customization: i.customization
              }))).map((item, idx) => (
                <div key={idx} className="p-4 flex items-start gap-3 bg-white hover:bg-sky-50/20 transition-colors">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600'}
                    alt={item.productName}
                    className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-sky-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-sky-600 block">{item.category}</span>
                    <h4 className="text-xs font-bold text-slate-900">{item.productName}</h4>
                    <p className="text-[11px] text-slate-500">
                      Quantity: <strong>{item.quantity}</strong> × ₹{item.sellingPriceSnapshot}
                    </p>
                    {item.customization && (
                      <div className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-1">
                        {item.customization.recipientName && <span>• Name: {item.customization.recipientName} </span>}
                        {item.customization.customMessage && <span>• Note: "{item.customization.customMessage}" </span>}
                        {item.customization.uploadedFileName && <span>• File: {item.customization.uploadedFileName}</span>}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">
                    ₹{item.sellingPriceSnapshot * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href="/orders"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              ← Back to My Orders
            </Link>
            <Link
              href="/products"
              className="text-xs font-bold bg-sky-500 text-white px-4 py-2 rounded-xl shadow-xs hover:bg-sky-600 transition-all"
            >
              Shop More Gifts
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
