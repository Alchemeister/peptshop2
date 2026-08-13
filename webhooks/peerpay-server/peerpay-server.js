// PeerPay Webhook Receiver — Express Server
// Run: node peerpay-server.js
// Port: 8787 (or PORT env var)
// URL: http://the build server:8787/webhooks/peerpay
// Paste this URL into the PeerPay webhook config panel

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8787;
const EVENTS_DIR = path.join(__dirname, 'events');
const BACKEND_WEBHOOK_URL = process.env.BACKEND_WEBHOOK_URL || '';
const PEERPAY_WEBHOOK_SECRET = process.env.PEERPAY_WEBHOOK_SECRET || '';

// Ensure events directory exists
if (!fs.existsSync(EVENTS_DIR)) fs.mkdirSync(EVENTS_DIR, { recursive: true });

// Verify PeerPay webhook signature using HMAC-SHA256
function verifySignature(body, signature) {
  if (!PEERPAY_WEBHOOK_SECRET) {
    console.error('FATAL: PEERPAY_WEBHOOK_SECRET not set — rejecting all webhooks');
    return false;
  }
  if (!signature) return false;
  const crypto = require('crypto');
  const expected = crypto.createHmac('sha256', PEERPAY_WEBHOOK_SECRET).update(body).digest('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  // CORS + JSON helpers
  const json = (code, data) => {
    res.writeHead(code, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'none' });
    res.end(JSON.stringify(data));
  };

  // Health check
  if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
    return json(200, { ok: true, service: 'peptshop-peerpay-webhook', events: countEvents() });
  }

  // Events endpoint removed — webhook payloads contain payment data, not publicly readable
  if (req.method === 'GET' && (req.url === '/events' || req.url.startsWith('/events/'))) {
    return json(403, { error: 'Forbidden' });
  }

  // Webhook receiver endpoint
  if (req.method === 'POST' && req.url === '/webhooks/peerpay') {
    let body = '';
    for await (const chunk of req) body += chunk;

    try {
      const payload = JSON.parse(body);
      const signature = req.headers['x-peerpay-signature'] || '';

      // Verify webhook signature
      if (!verifySignature(body, signature)) {
        console.warn(`[${new Date().toISOString()}] PeerPay webhook: INVALID SIGNATURE — rejecting`);
        return json(401, { error: 'Invalid signature' });
      }

      const eventType = payload.type || payload.event || 'UNKNOWN';
      const eventId = payload.id || payload.orderId || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const timestamp = new Date().toISOString();

      const eventRecord = {
        id: eventId,
        type: eventType,
        payload,
        signature,
        receivedAt: timestamp,
      };

      // Store event to disk
      fs.writeFileSync(
        path.join(EVENTS_DIR, `${eventId}.json`),
        JSON.stringify(eventRecord, null, 2)
      );

      console.log(`[${timestamp}] PeerPay webhook: ${eventType} (id: ${eventId})`);

      // Handle each event type
      switch (eventType) {
        case 'ORDER_CREATED':
          console.log(`  → Order created: ${payload.orderId || payload.id}`);
          break;
        case 'ORDER_FULFILLED':
          console.log(`  → Order fulfilled: ${payload.orderId || payload.id}`);
          break;
        case 'ORDER_CANCELLED':
          console.log(`  → Order cancelled: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_SETTLED':
          console.log(`  → Payment settled: ${payload.orderId || payload.id}, amount: ${payload.amount || 'N/A'}`);
          break;
        case 'ORDER_RESIZED':
          console.log(`  → Order resized: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_FAILED':
          console.log(`  → Payment failed: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_EXPIRED':
          console.log(`  → Payment expired: ${payload.orderId || payload.id}`);
          break;
        case 'PAYMENT_CANCELLED':
          console.log(`  → Payment cancelled: ${payload.orderId || payload.id}`);
          break;
        default:
          console.log(`  → Unknown event: ${eventType}`);
      }

      // Forward to the backend owner backend if configured
      if (BACKEND_WEBHOOK_URL) {
        try {
          const resp = await fetch(BACKEND_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body,
          });
          console.log(`  → Forwarded to backend: ${resp.status}`);
        } catch (fwdErr) {
          console.error(`  → Forward failed: ${fwdErr.message}`);
        }
      }

      return json(200, { ok: true, eventType, eventId });
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Webhook error: ${err.message}`);
      return json(500, { ok: false, error: err.message });
    }
  }

  // 404
  json(404, { error: 'Not found', paths: {
    'GET /': 'Health check',
    'GET /events': 'List stored events',
    'GET /events/:id': 'View single event',
    'POST /webhooks/peerpay': 'PeerPay webhook receiver',
  }});
});

function countEvents() {
  try { return fs.readdirSync(EVENTS_DIR).filter(f => f.endsWith('.json')).length; } catch { return 0; }
}

function listEvents() {
  try {
    return fs.readdirSync(EVENTS_DIR)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        const data = JSON.parse(fs.readFileSync(path.join(EVENTS_DIR, f), 'utf8'));
        return { id: data.id, type: data.type, receivedAt: data.receivedAt };
      })
      .sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  } catch { return []; }
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`PeerPay webhook receiver running on http://0.0.0.0:${PORT}`);
  console.log(`  Webhook URL: http://the build server:${PORT}/webhooks/peerpay`);
  console.log(`  Events: http://the build server:${PORT}/events`);
  if (BACKEND_WEBHOOK_URL) console.log(`  Forwarding to: ${BACKEND_WEBHOOK_URL}`);
});