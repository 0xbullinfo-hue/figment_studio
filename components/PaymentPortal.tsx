import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Logo from './Logo.tsx';

type PaymentProvider = 'paystack' | 'flutterwave';
type Currency = 'USD' | 'NGN';

interface PaymentPortalProps {
  onBack: () => void;
}

const FX_RATES: Record<Currency, number> = {
  USD: 1,
  NGN: 1600,
};

const PROVIDER_LABELS: Record<PaymentProvider, string> = {
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
};

const PaymentPortal: React.FC<PaymentPortalProps> = ({ onBack }) => {
  const location = useLocation();
  const {
    invoiceId = 'FIG-00000',
    amount = 3700,
    project = 'Project Estimate',
  } = location.state || {};

  const [provider, setProvider] = useState<PaymentProvider>('paystack');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isInitializing, setIsInitializing] = useState(false);
  const [fxRate, setFxRate] = useState(FX_RATES.NGN);

  const backendBaseUrl = ((import.meta as any).env.VITE_BACKEND_URL as string | undefined) || 'http://localhost:8787';

  const convertedAmount = useMemo(() => {
    return currency === 'USD' ? amount : amount * fxRate;
  }, [amount, currency, fxRate]);

  const formatMoney = (value: number, code: Currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
      maximumFractionDigits: code === 'NGN' ? 0 : 2,
    }).format(value);
  };

  const checkoutUrl = useMemo(() => {
    const paystackBase = (import.meta as any).env.VITE_PAYSTACK_CHECKOUT_URL as string | undefined;
    const flutterwaveBase = (import.meta as any).env.VITE_FLUTTERWAVE_CHECKOUT_URL as string | undefined;
    const baseUrl = provider === 'paystack' ? paystackBase : flutterwaveBase;

    if (!baseUrl) {
      return '';
    }

    const params = new URLSearchParams({
      amount: convertedAmount.toFixed(currency === 'NGN' ? 0 : 2),
      currency,
      reference: invoiceId,
      project,
    });

    return `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}${params.toString()}`;
  }, [provider, currency, convertedAmount, invoiceId, project]);

  React.useEffect(() => {
    const fetchRate = async () => {
      if (currency === 'USD') {
        return;
      }

      try {
        const res = await fetch(`${backendBaseUrl}/api/fx-rate?base=USD&quote=NGN`);
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        if (typeof data.rate === 'number' && data.rate > 0) {
          setFxRate(data.rate);
        }
      } catch {
        // Keep fallback rate when backend is unavailable.
      }
    };

    fetchRate();
  }, [backendBaseUrl, currency]);

  const handleProceed = async () => {
    setIsInitializing(true);

    try {
      const res = await fetch(`${backendBaseUrl}/api/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          amount: convertedAmount.toFixed(currency === 'NGN' ? 0 : 2),
          currency,
          reference: invoiceId,
          project,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.checkoutUrl) {
          window.open(data.checkoutUrl, '_blank', 'noopener,noreferrer');
          return;
        }
      }
    } catch {
      // Continue to fallback behavior.
    } finally {
      setIsInitializing(false);
    }

    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    window.alert(
      `Checkout is not configured yet. Set backend .env provider URLs or VITE_* checkout URLs.\n\nSelected Provider: ${PROVIDER_LABELS[provider]}\nReference: ${invoiceId}`
    );
  };

  return (
    <div className="bg-background text-text-main min-h-screen font-body text-left">
      <header className="border-b border-border-ui bg-surface/95 backdrop-blur-md px-10 h-16 sticky top-0 z-50 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary group-hover:translate-x-[-2px] transition-transform">arrow_back</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Back to Billing</span>
        </button>
        <Logo size={30} iconOnly />
        <div className="size-8 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center font-semibold text-primary text-[10px] font-body">JT</div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="card-base rounded-3xl p-8 space-y-8">
          <div>
            <p className="label-xs text-text-muted">Payment Portal</p>
            <h1 className="font-display font-light text-3xl text-text-main mt-2">Gateway Checkout</h1>
            <p className="text-sm text-text-muted mt-2">Choose payment provider and billing currency. Designed for both USD and local settlement.</p>
          </div>

          <div className="space-y-3">
            <p className="label-xs text-text-muted">Provider</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProvider('paystack')}
                className={`rounded-xl border px-4 py-4 text-left transition-all ${provider === 'paystack' ? 'border-primary bg-primary/10 text-primary' : 'border-border-ui hover:border-border-strong text-text-secondary'}`}
              >
                <p className="text-sm font-semibold">Paystack</p>
                <p className="text-2xs font-semibold uppercase tracking-widest text-text-muted">Cards, transfer, local rails</p>
              </button>
              <button
                onClick={() => setProvider('flutterwave')}
                className={`rounded-xl border px-4 py-4 text-left transition-all ${provider === 'flutterwave' ? 'border-primary bg-primary/10 text-primary' : 'border-border-ui hover:border-border-strong text-text-secondary'}`}
              >
                <p className="text-sm font-semibold">Flutterwave</p>
                <p className="text-2xs font-semibold uppercase tracking-widest text-text-muted">Global + African payments</p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="label-xs text-text-muted">Billing Currency</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${currency === 'USD' ? 'border-primary bg-primary/10 text-primary' : 'border-border-ui hover:border-border-strong text-text-muted'}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('NGN')}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold uppercase tracking-widest transition-all ${currency === 'NGN' ? 'border-primary bg-primary/10 text-primary' : 'border-border-ui hover:border-border-strong text-text-muted'}`}
              >
                NGN
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Rate preview: {formatMoney(amount, 'USD')} ≈ {formatMoney(amount * fxRate, 'NGN')} · 1 USD = {fxRate.toLocaleString()} NGN
            </p>
          </div>

          <button
            onClick={handleProceed}
            disabled={isInitializing}
            className="w-full rounded-xl bg-primary py-4 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
          >
            {isInitializing ? 'Initializing Checkout...' : `Proceed with ${PROVIDER_LABELS[provider]}`}
          </button>

          {!checkoutUrl && (
            <p className="text-[11px] rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' }}>
              Live checkout URL is not configured yet. Set <strong>VITE_PAYSTACK_CHECKOUT_URL</strong> and <strong>VITE_FLUTTERWAVE_CHECKOUT_URL</strong>.
            </p>
          )}
        </section>

        <aside className="rounded-3xl p-8 space-y-8" style={{ background: '#0F0B07', border: '1px solid rgba(240,122,58,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div>
            <p className="label-xs text-text-muted">Invoice Reference</p>
            <h2 className="font-display font-light text-2xl text-primary mt-1">{invoiceId}</h2>
          </div>

          <div className="space-y-4 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="flex justify-between text-sm">
              <span className="text-text-faint font-semibold uppercase tracking-wide text-xs">Project</span>
              <span className="font-semibold text-text-secondary text-right text-sm">{project}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-faint font-semibold uppercase tracking-wide text-xs">Base (USD)</span>
              <span className="font-semibold text-text-secondary">{formatMoney(amount, 'USD')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-faint font-semibold uppercase tracking-wide text-xs">Paying In</span>
              <span className="font-semibold text-text-secondary">{currency}</span>
            </div>
            <div className="pt-4 flex justify-between items-end" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="label-xs text-text-muted">Total Due</span>
              <span className="font-display font-light text-3xl text-primary">{formatMoney(convertedAmount, currency)}</span>
            </div>
          </div>

          <div className="text-[11px] text-text-faint leading-relaxed">
            Currency conversion shown here is an estimate for client visibility. Final settlement uses provider exchange rates at checkout.
          </div>
        </aside>
      </main>
    </div>
  );
};

export default PaymentPortal;