import type { IncomingMessage, ServerResponse } from 'http';

// Trusted Server-Side Pricing Catalog (Never trust client-supplied prices)
const TRUSTED_PRODUCT_PRICES: Record<string, number> = {
  'pers-coffee-mug': 70,
  'pers-heat-sensitive-mug': 160,
  'pers-sublimation-bottle-250': 280,
  'pers-acrylic-keychain': 75,
  'pers-mdf-wooden-keychain': 70,
  'pers-acrylic-badge-golden': 75,
  'pers-customized-tshirt-a4': 400,
  'pers-woollen-cap': 100,
  'pers-acrylic-standee': 350,
  'pers-glass-mobile-cover': 250,
  'pers-plastic-mobile-cover': 70,
  'pers-rubber-mobile-cover': 160,
  '3d-ganesh-murti': 200,
  '3d-skeleton-keychain': 150,
  '3d-moon-lamp': 500,
  '3d-customized-moon-lamp': 600,
  '3d-couple-statue': 850,
  'frame-saraswati-4x4': 250,
  'frame-ganpati-4x4': 250,
};

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;

export default async function handler(req: any, res: any) {
  // CORS & Security headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { items, customer } = body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    if (!customer || !customer.fullName || !customer.mobile || !customer.pincode) {
      return res.status(400).json({ error: 'Valid customer delivery details are required' });
    }

    // Step 1: Calculate trusted order amount on the server
    let computedSubtotal = 0;
    for (const item of items) {
      const productId = item.product?.id || item.productId;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      
      // Look up trusted price from server catalog; fallback to item's price if custom product
      const unitPrice = TRUSTED_PRODUCT_PRICES[productId] !== undefined 
        ? TRUSTED_PRODUCT_PRICES[productId] 
        : (item.product?.price || 150);

      computedSubtotal += unitPrice * quantity;
    }

    const shippingFee = computedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
    const trustedGrandTotal = computedSubtotal + shippingFee;
    const amountInPaise = Math.round(trustedGrandTotal * 100);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    const receiptId = `rcpt_${Math.floor(100000 + Math.random() * 900000)}`;

    // Step 2: If Razorpay credentials are set in environment, create live/test order with Razorpay
    if (keyId && keySecret && !keyId.includes('PLACEHOLDER')) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      
      const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            customerName: customer.fullName,
            customerPhone: customer.mobile,
            customerEmail: customer.email || '',
            pincode: customer.pincode,
          },
        }),
      });

      const rzpData = await rzpResponse.json();

      if (!rzpResponse.ok) {
        console.error('Razorpay API error:', rzpData);
        return res.status(rzpResponse.status).json({
          error: rzpData.error?.description || 'Failed to create Razorpay order',
        });
      }

      return res.status(200).json({
        success: true,
        orderId: `GFT-${receiptId.replace('rcpt_', '')}`,
        razorpayOrderId: rzpData.id,
        amount: rzpData.amount,
        currency: rzpData.currency,
        keyId: keyId,
        isTestMode: keyId.startsWith('rzp_test_'),
      });
    }

    // Fallback: If environment variables are not yet configured on Vercel, report instruction clearly
    return res.status(200).json({
      success: true,
      orderId: `GFT-${receiptId.replace('rcpt_', '')}`,
      razorpayOrderId: `order_mock_${receiptId}`,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_placeholder',
      isMock: true,
      notice: 'Razorpay keys pending in Vercel Environment Variables. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.',
    });
  } catch (error: any) {
    console.error('Create order server error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error creating order' });
  }
}
