import { put, get } from '@vercel/blob';

// Ensure large payloads (like screenshots) are accepted by Vercel serverless functions
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

const BLOB_ORDERS_PATH = 'giftoria-orders/orders.json';

// In-memory cache for fast response and read-after-write consistency
let cachedOrders: any[] = [];
let lastWriteTimestamp = 0;

async function getStoredOrders(): Promise<any[]> {
  // If written within last 3 seconds, memory cache is fresher than eventual storage replication
  if (Date.now() - lastWriteTimestamp < 3000 && cachedOrders.length > 0) {
    return cachedOrders;
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured, using memory fallback');
      return cachedOrders;
    }

    const blobResult = await get(BLOB_ORDERS_PATH, {
      access: 'public',
      useCache: false,
    });

    if (!blobResult || !blobResult.stream) {
      return cachedOrders;
    }

    const text = await new Response(blobResult.stream).text();
    if (!text || text.trim() === '') {
      return [];
    }

    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      // Merge: keep most recently updated records
      const orderMap = new Map<string, any>();
      for (const ord of parsed) {
        if (ord && ord.orderId) orderMap.set(ord.orderId.toLowerCase(), ord);
      }
      for (const ord of cachedOrders) {
        if (ord && ord.orderId) {
          const key = ord.orderId.toLowerCase();
          const existing = orderMap.get(key);
          if (!existing || (ord.updatedAt && (!existing.updatedAt || ord.updatedAt > existing.updatedAt))) {
            orderMap.set(key, ord);
          }
        }
      }
      cachedOrders = Array.from(orderMap.values()).sort((a, b) => 
        (new Date(b.createdAt || 0).getTime()) - (new Date(a.createdAt || 0).getTime())
      );
      return cachedOrders;
    }
    return [];
  } catch (err: any) {
    console.error('Error fetching orders from blob storage:', err?.message || err);
    return cachedOrders;
  }
}

async function saveOrdersToStorage(orders: any[]): Promise<boolean> {
  try {
    cachedOrders = orders;
    lastWriteTimestamp = Date.now();

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn('BLOB_READ_WRITE_TOKEN not configured, saved to memory fallback only');
      return true;
    }

    await put(BLOB_ORDERS_PATH, JSON.stringify(orders), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });

    return true;
  } catch (err: any) {
    console.error('Error saving orders to blob storage:', err?.message || err);
    return false;
  }
}

// Upload base64 payment screenshot to separate blob to keep orders.json fast and lightweight
async function uploadScreenshotIfBase64(screenshot: string | undefined, orderId: string): Promise<string | undefined> {
  if (!screenshot || !screenshot.startsWith('data:image/')) {
    return screenshot;
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return screenshot;

    const matches = screenshot.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return screenshot;

    const ext = matches[1].replace('jpeg', 'jpg');
    const buffer = Buffer.from(matches[2], 'base64');
    const filename = `giftoria-screenshots/${orderId}-${Date.now()}.${ext}`;

    const uploaded = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: `image/${matches[1]}`,
    });

    return uploaded.url;
  } catch (e) {
    console.warn('Screenshot upload to blob failed, keeping inline screenshot:', e);
    return screenshot;
  }
}

// Upload base64 customization files (images, PDFs, documents) to separate blob to keep orders.json fast and durable
async function uploadCustomizationFileIfBase64(
  fileDataUrl: string | undefined,
  orderId: string,
  filename = 'customization-file'
): Promise<string | undefined> {
  if (!fileDataUrl || !fileDataUrl.startsWith('data:')) {
    return fileDataUrl;
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) return fileDataUrl;

    const matches = fileDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!matches || matches.length < 3) return fileDataUrl;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const cleanFilename = (filename || 'customization-file').replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `giftoria-customizations/${orderId}-${Date.now()}-${cleanFilename}`;

    const uploaded = await put(storagePath, buffer, {
      access: 'public',
      addRandomSuffix: false,
      contentType: mimeType,
    });

    return uploaded.url;
  } catch (e) {
    console.warn('Customization file upload to blob failed, keeping inline:', e);
    return fileDataUrl;
  }
}

async function processCustomizationFiles(itemsList: any[], orderId: string): Promise<any[]> {
  if (!Array.isArray(itemsList)) return itemsList;
  const processed = [];
  for (const it of itemsList) {
    if (it?.customization?.uploadedFileUrl && it.customization.uploadedFileUrl.startsWith('data:')) {
      const permanentUrl = await uploadCustomizationFileIfBase64(
        it.customization.uploadedFileUrl,
        orderId,
        it.customization.uploadedFileName || 'customization-file'
      );
      processed.push({
        ...it,
        customization: {
          ...it.customization,
          uploadedFileUrl: permanentUrl,
        },
      });
    } else {
      processed.push(it);
    }
  }
  return processed;
}

export default async function handler(req: any, res: any) {
  // Global CORS headers for cross-origin access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // 1. GET: Fetch all active orders
    if (req.method === 'GET') {
      const orders = await getStoredOrders();
      return res.status(200).json({
        success: true,
        count: orders.length,
        orders,
      });
    }

    // 2. POST: Create a new order
    if (req.method === 'POST') {
      const body = req.body || {};
      const newOrderData = body.order || body;

      if (!newOrderData || (!newOrderData.orderId && !newOrderData.customer)) {
        return res.status(400).json({ success: false, message: 'Invalid order payload' });
      }

      const orderId = newOrderData.orderId || `GFT-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();

      // Optimize screenshot storage if base64
      let optimizedScreenshot = newOrderData.paymentScreenshot;
      if (optimizedScreenshot && optimizedScreenshot.startsWith('data:image/')) {
        optimizedScreenshot = await uploadScreenshotIfBase64(optimizedScreenshot, orderId);
      }

      // Process and offload customization files if base64
      const processedItems = await processCustomizationFiles(newOrderData.items || [], orderId);
      const processedSnapshots = await processCustomizationFiles(newOrderData.itemSnapshots || [], orderId);

      const orderToSave = {
        ...newOrderData,
        orderId,
        items: processedItems,
        itemSnapshots: processedSnapshots,
        paymentScreenshot: optimizedScreenshot,
        createdAt: newOrderData.createdAt || now,
        updatedAt: now,
      };

      const currentOrders = await getStoredOrders();

      // Check if order already exists (e.g. retry / idempotency)
      const existingIndex = currentOrders.findIndex(
        (o) => o.orderId?.toLowerCase() === orderId.toLowerCase()
      );

      let updatedOrders: any[];
      if (existingIndex >= 0) {
        updatedOrders = [...currentOrders];
        updatedOrders[existingIndex] = {
          ...updatedOrders[existingIndex],
          ...orderToSave,
          updatedAt: now,
        };
      } else {
        updatedOrders = [orderToSave, ...currentOrders];
      }

      await saveOrdersToStorage(updatedOrders);

      return res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order: orderToSave,
        count: updatedOrders.length,
      });
    }

    // 3. PATCH / PUT: Update existing order status, payment verification, delivery, etc.
    if (req.method === 'PATCH' || req.method === 'PUT') {
      const body = req.body || {};
      const orderId = body.orderId || req.query.orderId;

      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId is required for updates' });
      }

      const currentOrders = await getStoredOrders();
      const targetIndex = currentOrders.findIndex(
        (o) => o.orderId?.toLowerCase() === String(orderId).toLowerCase()
      );

      if (targetIndex < 0) {
        return res.status(404).json({ success: false, message: `Order #${orderId} not found` });
      }

      const now = new Date().toISOString();
      const existing = currentOrders[targetIndex];

      // Handle nested deliveryRecord merge
      let mergedDelivery = existing.deliveryRecord;
      if (body.deliveryRecord || body.deliveryUpdate) {
        mergedDelivery = {
          ...(existing.deliveryRecord || {}),
          ...(body.deliveryRecord || body.deliveryUpdate || {}),
          updatedAt: now,
        };
      }

      // Handle screenshot update if resubmitted
      let updatedScreenshot = body.paymentScreenshot !== undefined ? body.paymentScreenshot : existing.paymentScreenshot;
      if (updatedScreenshot && updatedScreenshot.startsWith('data:image/')) {
        updatedScreenshot = await uploadScreenshotIfBase64(updatedScreenshot, orderId);
      }

      // Handle customization files if updated
      let processedItems = body.items !== undefined ? await processCustomizationFiles(body.items, String(orderId)) : existing.items;
      let processedSnapshots = body.itemSnapshots !== undefined ? await processCustomizationFiles(body.itemSnapshots, String(orderId)) : existing.itemSnapshots;

      const updatedOrder = {
        ...existing,
        ...body,
        items: processedItems,
        itemSnapshots: processedSnapshots,
        paymentScreenshot: updatedScreenshot,
        deliveryRecord: mergedDelivery,
        updatedAt: now,
      };

      const updatedOrders = [...currentOrders];
      updatedOrders[targetIndex] = updatedOrder;

      await saveOrdersToStorage(updatedOrders);

      return res.status(200).json({
        success: true,
        message: `Order #${orderId} updated successfully`,
        order: updatedOrder,
      });
    }

    // 4. DELETE: Archive (soft delete) or permanently delete order
    if (req.method === 'DELETE') {
      const orderId = req.query?.orderId || req.body?.orderId;
      const isPermanent = req.query?.permanent === 'true' || req.body?.permanent === true;
      const isClearAll = req.query?.clearAll === 'true' || req.body?.clearAll === true;

      if (isClearAll) {
        await saveOrdersToStorage([]);
        return res.status(200).json({ success: true, message: 'All orders cleared' });
      }

      if (!orderId) {
        return res.status(400).json({ success: false, message: 'orderId is required for deletion' });
      }

      const currentOrders = await getStoredOrders();
      let updatedOrders: any[];

      if (isPermanent) {
        updatedOrders = currentOrders.filter(
          (o) => o.orderId?.toLowerCase() !== String(orderId).toLowerCase()
        );
      } else {
        const now = new Date().toISOString();
        updatedOrders = currentOrders.map((o) => {
          if (o.orderId?.toLowerCase() === String(orderId).toLowerCase()) {
            return {
              ...o,
              isDeleted: true,
              deletedAt: now,
              updatedAt: now,
            };
          }
          return o;
        });
      }

      await saveOrdersToStorage(updatedOrders);

      return res.status(200).json({
        success: true,
        message: isPermanent ? `Order #${orderId} permanently deleted` : `Order #${orderId} moved to trash`,
      });
    }

    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  } catch (err: any) {
    console.error('Unhandled API error in /api/orders:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error processing orders',
      error: err?.message || String(err),
    });
  }
}
