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

  const backendBaseUrl = (import.meta.env.VITE_BACKEND_URL as string | undefined) || 'http://localhost:8787';

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
    const paystackBase = import.meta.env.VITE_PAYSTACK_CHECKOUT_URL as string | undefined;
    const flutterwaveBase = import.meta.env.VITE_FLUTTERWAVE_CHECKOUT_URL as string | undefined;
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
    <div className="bg-[#fcfaf8] text-[#1c140d] min-h-screen font-display text-left">
      <header className="border-b border-[#e8dbce] bg-white px-10 h-16 sticky top-0 z-50 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 group">
          <span className="material-symbols-outlined text-primary group-hover:translate-x-[-2px] transition-transform">arrow_back</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back to Billing</span>
        </button>
        <Logo className="h-8" />
        <div className="size-8 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center font-black text-primary text-[10px]">JT</div>
      </header>

      <main className="max-w-[1100px] mx-auto px-6 lg:px-20 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-3xl border border-[#e8dbce] shadow-sm p-8 space-y-8">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Payment Portal</p>
            <h1 className="text-3xl font-black tracking-tight uppercase mt-2">Gateway Checkout</h1>
            <p className="text-sm text-slate-500 mt-2">Choose payment provider and billing currency. Designed for both USD and local settlement.</p>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Provider</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setProvider('paystack')}
                className={`rounded-xl border px-4 py-4 text-left transition-all ${provider === 'paystack' ? 'border-primary bg-primary/5 text-primary' : 'border-[#e8dbce] hover:border-primary/40'}`}
              >
                <p className="text-sm font-black uppercase">Paystack</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cards, transfer, local rails</p>
              </button>
              <button
                onClick={() => setProvider('flutterwave')}
                className={`rounded-xl border px-4 py-4 text-left transition-all ${provider === 'flutterwave' ? 'border-primary bg-primary/5 text-primary' : 'border-[#e8dbce] hover:border-primary/40'}`}
              >
                <p className="text-sm font-black uppercase">Flutterwave</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Global + African payments</p>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Billing Currency</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrency('USD')}
                className={`rounded-xl border px-4 py-3 text-sm font-black uppercase tracking-widest transition-all ${currency === 'USD' ? 'border-primary bg-primary/5 text-primary' : 'border-[#e8dbce] hover:border-primary/40'}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('NGN')}
                className={`rounded-xl border px-4 py-3 text-sm font-black uppercase tracking-widest transition-all ${currency === 'NGN' ? 'border-primary bg-primary/5 text-primary' : 'border-[#e8dbce] hover:border-primary/40'}`}
              >
                NGN
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Conversion preview: {formatMoney(amount, 'USD')} ≈ {formatMoney(amount * fxRate, 'NGN')} (display rate: 1 USD = {fxRate.toLocaleString()} NGN)
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
            <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
              Live checkout URL is not configured yet. Set <strong>VITE_PAYSTACK_CHECKOUT_URL</strong> and <strong>VITE_FLUTTERWAVE_CHECKOUT_URL</strong>.
            </p>
          )}
        </section>

        <aside className="bg-[#1c140d] text-white rounded-3xl p-8 space-y-8 shadow-xl">
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Invoice Reference</p>
            <h2 className="text-2xl font-black text-primary uppercase tracking-tight mt-1">{invoiceId}</h2>
          </div>

          <div className="space-y-4 bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase">Project</span>
              <span className="font-black text-right">{project}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase">Base (USD)</span>
              <span className="font-black">{formatMoney(amount, 'USD')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400 font-bold uppercase">Paying In</span>
              <span className="font-black">{currency}</span>
            </div>
            <div className="pt-4 border-t border-white/10 flex justify-between items-end">
              <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Total Due</span>
              <span className="text-3xl font-black text-primary">{formatMoney(convertedAmount, currency)}</span>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 leading-relaxed">
            Currency conversion shown here is an estimate for client visibility. Final settlement uses provider exchange rates at checkout.
          </div>
        </aside>
      </main>
    </div>
  );
};

export default PaymentPortal;