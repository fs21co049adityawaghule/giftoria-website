import crypto from 'crypto';

// In-memory set for webhook idempotency during serverless execution life
const processedWebhookEvents = new Set<string>();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!signature) {
      return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
    }

    // Convert payload to string representation
    const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

    if (webhookSecret && !webhookSecret.includes('PLACEHOLDER')) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      const sigBuffer = Buffer.from(signature as string, 'utf8');
      const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

      const isSigValid = 
        sigBuffer.length === expectedBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, expectedBuffer);

      if (!isSigValid) {
        console.warn('[Webhook Security] Invalid webhook signature detected.');
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventId = event?.id || `${event?.event}_${event?.payload?.payment?.entity?.id}`;

    // Idempotency check: prevent duplicate execution for identical event
    if (processedWebhookEvents.has(eventId)) {
      return res.status(200).json({ status: 'ok', message: 'Event already processed (idempotent)' });
    }
    processedWebhookEvents.add(eventId);

    const eventType = event.event;
    const paymentEntity = event.payload?.payment?.entity;

    if (eventType === 'payment.captured') {
      console.log(`[Razorpay Webhook] Payment Captured: ${paymentEntity?.id} for Order: ${paymentEntity?.order_id}`);
      // Return verified confirmation to Razorpay
      return res.status(200).json({
        status: 'ok',
        event: 'payment.captured',
        orderStatus: 'PAID / CONFIRMED',
        paymentId: paymentEntity?.id,
        orderId: paymentEntity?.notes?.orderId,
      });
    }

    if (eventType === 'payment.failed') {
      console.warn(`[Razorpay Webhook] Payment Failed: ${paymentEntity?.id} - Reason: ${paymentEntity?.error_description}`);
      return res.status(200).json({
        status: 'ok',
        event: 'payment.failed',
        orderStatus: 'PAYMENT FAILED',
        paymentId: paymentEntity?.id,
        reason: paymentEntity?.error_description,
      });
    }

    return res.status(200).json({ status: 'ok', received: eventType });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: error.message || 'Webhook internal error' });
  }
}
