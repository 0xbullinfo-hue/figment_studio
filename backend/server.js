import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors({ origin: true, credentials: false }));
app.use(express.json({ limit: '1mb' }));

const PROVIDER_URLS = {
  paystack: process.env.PAYSTACK_CHECKOUT_URL || '',
  flutterwave: process.env.FLUTTERWAVE_CHECKOUT_URL || '',
};

const FX_RATES = {
  USD_NGN: Number(process.env.FX_USD_NGN || 1600),
};

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'figment-studio-backend', now: new Date().toISOString() });
});

app.get('/api/fx-rate', (req, res) => {
  const base = String(req.query.base || 'USD').toUpperCase();
  const quote = String(req.query.quote || 'NGN').toUpperCase();

  if (base === quote) {
    return res.json({ base, quote, rate: 1, source: 'local-config' });
  }

  if (`${base}_${quote}` === 'USD_NGN') {
    return res.json({ base, quote, rate: FX_RATES.USD_NGN, source: 'local-config' });
  }

  if (`${base}_${quote}` === 'NGN_USD') {
    return res.json({ base, quote, rate: 1 / FX_RATES.USD_NGN, source: 'local-config' });
  }

  return res.status(400).json({ error: 'Unsupported FX pair', supportedPairs: ['USD/NGN', 'NGN/USD'] });
});

app.post('/api/payments/initialize', (req, res) => {
  const {
    provider = 'paystack',
    amount,
    currency = 'USD',
    reference,
    project,
    email = 'client@figment.studio',
  } = req.body || {};

  const normalizedProvider = String(provider).toLowerCase();
  const baseUrl = PROVIDER_URLS[normalizedProvider];

  if (!baseUrl) {
    return res.status(400).json({
      error: 'Provider checkout URL is not configured',
      provider: normalizedProvider,
    });
  }

  if (!amount || !reference) {
    return res.status(400).json({ error: 'Missing amount or reference' });
  }

  const params = new URLSearchParams({
    amount: String(amount),
    currency: String(currency),
    tx_ref: String(reference),
    project: String(project || 'Architectural Project'),
    customer_email: String(email),
  });

  const checkoutUrl = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`;

  return res.json({
    ok: true,
    provider: normalizedProvider,
    checkoutUrl,
  });
});

app.post('/api/payments/webhook/:provider', (req, res) => {
  const provider = req.params.provider;
  const event = req.body;

  console.log(`[Webhook:${provider}]`, JSON.stringify(event).slice(0, 500));

  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Figment backend running on http://localhost:${port}`);
});
