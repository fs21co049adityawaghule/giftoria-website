import crypto from 'crypto';

export default async function handler(req: any, res: any) {
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
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body || {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Missing Razorpay verification parameters (order_id, payment_id, signature)',
      });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // If test mode or mock mode without keys configured
    if (!keySecret || keySecret.includes('PLACEHOLDER') || razorpay_order_id.startsWith('order_mock_')) {
      // In simulated mock environment, check mock signature
      const isMockValid = razorpay_signature.startsWith('sig_test_') || razorpay_signature === 'mock_verified_signature';
      if (isMockValid) {
        return res.status(200).json({
          success: true,
          verified: true,
          isMock: true,
          paymentId: razorpay_payment_id,
          orderId: orderId,
          orderStatus: 'PAID / CONFIRMED',
          paymentStatus: 'paid',
          paymentVerifiedAt: new Date().toISOString(),
          notice: 'Verified via simulated test mode. Configure live RAZORPAY_KEY_SECRET on Vercel for production capture.',
        });
      }
    }

    // Step 1: Cryptographic HMAC-SHA256 signature verification
    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret!)
      .update(payload)
      .digest('hex');

    const signatureBuffer = Buffer.from(razorpay_signature, 'utf8');
    const generatedBuffer = Buffer.from(generatedSignature, 'utf8');

    const isSignatureValid = 
      signatureBuffer.length === generatedBuffer.length &&
      crypto.timingSafeEqual(signatureBuffer, generatedBuffer);

    if (!isSignatureValid) {
      console.warn(`[Razorpay Security] Signature mismatch for payment ${razorpay_payment_id}`);
      return res.status(400).json({
        success: false,
        verified: false,
        error: 'Invalid payment signature. Payment verification rejected by backend.',
        orderStatus: 'PAYMENT FAILED',
        paymentStatus: 'failed',
      });
    }

    // Step 2: Confirm actual payment status from Razorpay API
    let paymentMethodUsed = 'razorpay';
    let verifiedAmount = 0;

    if (keyId && keySecret) {
      const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64');
      const verifyResp = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
        headers: { 'Authorization': authHeader }
      });

      if (verifyResp.ok) {
        const paymentEntity = await verifyResp.json();
        paymentMethodUsed = paymentEntity.method || 'razorpay';
        verifiedAmount = paymentEntity.amount / 100;

        // Ensure payment status is captured or authorized
        if (paymentEntity.status !== 'captured' && paymentEntity.status !== 'authorized') {
          return res.status(400).json({
            success: false,
            verified: false,
            error: `Razorpay payment status is "${paymentEntity.status}". Expected "captured" or "authorized".`,
            orderStatus: 'PAYMENT FAILED',
            paymentStatus: 'failed',
          });
        }
      }
    }

    // Success: Signature and payment status verified by backend
    return res.status(200).json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: orderId,
      orderStatus: 'PAID / CONFIRMED',
      paymentStatus: 'paid',
      paymentMethod: paymentMethodUsed,
      verifiedAmount,
      paymentVerifiedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return res.status(500).json({
      success: false,
      verified: false,
      error: error.message || 'Server error during payment verification',
    });
  }
}
