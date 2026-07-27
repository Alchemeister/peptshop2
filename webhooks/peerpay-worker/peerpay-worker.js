// PeerPay Webhook Receiver — Cloudflare Worker
// Deploy: npx wrangler deploy peerpay-worker.js
// URL: https://peerpay-webhook.<your-subdomain>.workers.dev
// Paste this URL into the PeerPay webhook config panel

export default {
  async fetch(request, env) {
    if (request.method === 'GET') {
      return new Response(JSON.stringify({ ok: true, service: 'peptshop-peerpay-webhook' }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const rawBody = await request.text();
      const payload = JSON.parse(rawBody);
      const signature = request.headers.get('x-peerpay-signature') || '';
      const eventType = payload.type || payload.event || 'UNKNOWN';

      // Log the event
      console.log(`[PeerPay Webhook] Event: ${eventType}`, JSON.stringify(payload));

      // Store in KV if available
      if (env.PEERPAY_EVENTS) {
        const eventId = payload.id || payload.orderId || crypto.randomUUID();
        await env.PEERPAY_EVENTS.put(
          `event:${eventId}`,
          JSON.stringify({ type: eventType, payload, receivedAt: new Date().toISOString() }),
          { expirationTtl: 60 * 60 * 24 * 30 } // 30 days
        );
      }

      // Handle each event type
      switch (eventType) {
        case 'ORDER_CREATED':
          console.log(`Order created: ${payload.orderId || payload.id}`);
          break;
        case 'ORDER_FULFILLED':
          console.log(`Order fulfilled: ${payload.orderId || payload.id}`);
          break;
        case 'ORDER_CANCELLED':
          console.log(`Order cancelled: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_SETTLED':
          console.log(`Payment settled: ${payload.orderId || payload.id}, amount: ${payload.amount || 'N/A'}`);
          break;
        case 'ORDER_RESIZED':
          console.log(`Order resized: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_FAILED':
          console.log(`Payment failed: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_EXPIRED':
          console.log(`Payment expired: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_CANCELLED':
          console.log(`Payment cancelled: ${payload.orderId || payload.id}`);
          break;
        default:
          console.log(`Unknown event type: ${eventType}`);
      }

      // Forward to the backend owner backend if configured
      if (env.BACKEND_WEBHOOK_URL) {
        await fetch(env.BACKEND_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: rawBody,
        });
      }

      return new Response(JSON.stringify({ ok: true, eventType }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      console.error('[PeerPay Webhook] Error:', err.message);
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};