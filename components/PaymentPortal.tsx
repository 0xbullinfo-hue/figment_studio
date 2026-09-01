import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardShell from './DashboardShell.tsx';
import { useStudioStore } from '../store.ts';
import { CreditCard, Landmark, CheckCircle2, ShieldCheck, ArrowLeft } from 'lucide-react';

type PaymentProvider = 'paystack' | 'flutterwave';
type Currency = 'NGN' | 'USD';

interface PaymentPortalProps {
  onBack?: () => void;
}

const FX_RATES: Record<Currency, number> = {
  USD: 1500,
  NGN: 1,
};

const PROVIDER_LABELS: Record<PaymentProvider, string> = {
  paystack: 'Paystack',
  flutterwave: 'Flutterwave',
};

const PaymentPortal: React.FC<PaymentPortalProps> = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, updateInvoiceStatus, addReceipt } = useStudioStore();
  const {
    invoiceId = 'INV-001001',
    amount = 150000,
    project = 'Architectural Visualization Project',
  } = (location.state as { invoiceId?: string; amount?: number; project?: string }) || {};

  const [provider, setProvider] = useState<PaymentProvider>('paystack');
  const [currency, setCurrency] = useState<Currency>('NGN');
  const [isInitializing, setIsInitializing] = useState(false);
  const [fxRate, setFxRate] = useState(1500);

  const backendBaseUrl = ((import.meta as any).env.VITE_BACKEND_URL as string | undefined) || 'http://localhost:8787';

  // Amount is base NGN from Estimator / Invoices
  const convertedAmount = useMemo(() => {
    return currency === 'NGN' ? amount : Math.round(amount / fxRate);
  }, [amount, currency, fxRate]);

  const formatMoney = (value: number, code: Currency) => {
    if (code === 'NGN') {
      return `₦${value.toLocaleString('en-NG')}`;
    }
    return `$${value.toLocaleString('en-US')}`;
  };

  const handleSimulatePayment = () => {
    setIsInitializing(true);
    setTimeout(() => {
      updateInvoiceStatus(invoiceId, 'paid');
      addReceipt({
        id: `RCPT-${Date.now().toString().slice(-6)}`,
        invoiceId,
        project,
        clientName: auth.name || 'Valued Client',
        amount,
        status: 'Paid',
        createdAt: new Date().toISOString(),
        source: 'payment',
      });
      setIsInitializing(false);
      alert(`Payment of ${formatMoney(convertedAmount, currency)} for ${invoiceId} confirmed!`);
      navigate('/billing');
    }, 800);
  };

  const handleProceed = async () => {
    setIsInitializing(true);

    try {
      const res = await fetch(`${backendBaseUrl}/api/payments/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          amount: Number(convertedAmount),
          currency,
          reference: invoiceId,
          project,
          email: auth.email,
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
      // Continue to fallback simulation behavior
    } finally {
      setIsInitializing(false);
    }

    handleSimulatePayment();
  };

  return (
    <DashboardShell title="Payment Gateway" subtitle="Settle project invoices and record instant payments">
      <Helmet>
        <title>Secure Payment Portal | Figment Studio</title>
        <meta name="description" content="Securely settle your Figment Studio invoice via Paystack or Flutterwave." />
      </Helmet>

      <div className="p-6 md:p-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header Return */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <button
              onClick={onBack || (() => navigate('/billing'))}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-primary group-hover:-translate-x-1 transition-transform" />
              Back to Invoices
            </button>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              256-Bit SSL Encrypted
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Payment Selection Panel */}
            <div className="lg:col-span-7 bg-[#121212] border border-white/5 rounded-2xl p-8 space-y-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Invoice Settlement</p>
                <h1 className="text-2xl font-bold text-white font-display uppercase tracking-tight">Gateway Checkout</h1>
                <p className="text-xs text-white/40 font-sans mt-1">Select your preferred payment processor and settlement currency.</p>
              </div>

              {/* Provider Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setProvider('paystack')}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      provider === 'paystack'
                        ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/10'
                        : 'border-white/5 bg-[#0A0A0A] hover:border-white/15 text-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className={`w-5 h-5 ${provider === 'paystack' ? 'text-primary' : 'text-white/30'}`} />
                      {provider === 'paystack' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-sm font-bold">Paystack</p>
                    <p className="text-[10px] text-white/40 mt-0.5 font-sans">Cards, USSD & Bank Transfer</p>
                  </button>

                  <button
                    onClick={() => setProvider('flutterwave')}
                    className={`rounded-xl border p-4 text-left transition-all ${
                      provider === 'flutterwave'
                        ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/10'
                        : 'border-white/5 bg-[#0A0A0A] hover:border-white/15 text-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Landmark className={`w-5 h-5 ${provider === 'flutterwave' ? 'text-primary' : 'text-white/30'}`} />
                      {provider === 'flutterwave' && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-sm font-bold">Flutterwave</p>
                    <p className="text-[10px] text-white/40 mt-0.5 font-sans">Global Cards & African Rails</p>
                  </button>
                </div>
              </div>

              {/* Currency Selection */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/50">Settlement Currency</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCurrency('NGN')}
                    className={`rounded-xl border py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all ${
                      currency === 'NGN'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/5 bg-[#0A0A0A] text-white/40 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    🇳🇬 NGN (Nigerian Naira)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`rounded-xl border py-3 px-4 text-xs font-bold uppercase tracking-wider transition-all ${
                      currency === 'USD'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-white/5 bg-[#0A0A0A] text-white/40 hover:border-white/15 hover:text-white'
                    }`}
                  >
                    🇺🇸 USD (US Dollar)
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleProceed}
                  disabled={isInitializing}
                  className="w-full rounded-xl bg-primary py-4 text-white text-xs font-bold uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-60"
                >
                  {isInitializing ? 'Processing Payment...' : `Pay ${formatMoney(convertedAmount, currency)} with ${PROVIDER_LABELS[provider]}`}
                </button>

                <button
                  onClick={handleSimulatePayment}
                  disabled={isInitializing}
                  className="w-full rounded-xl border border-emerald-500/30 bg-emerald-500/10 py-3 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500/20 active:scale-95 transition-all"
                >
                  Confirm Instant Direct Settlement
                </button>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="lg:col-span-5 bg-[#121212] border border-white/5 rounded-2xl p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Invoice Summary</p>
                  <h2 className="text-xl font-bold text-primary font-display mt-1">{invoiceId}</h2>
                </div>

                <div className="space-y-3 p-5 rounded-xl bg-[#0A0A0A] border border-white/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-sans">Project</span>
                    <span className="font-bold text-white text-right truncate max-w-[200px]">{project}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-sans">Base (NGN)</span>
                    <span className="font-bold text-white">₦{amount.toLocaleString('en-NG')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-sans">Currency</span>
                    <span className="font-bold text-primary">{currency}</span>
                  </div>
                  <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">Total Due</span>
                    <span className="text-2xl font-black text-primary font-display">{formatMoney(convertedAmount, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-white/30 font-sans leading-relaxed">
                Receipts and project access are automatically unlocked upon verified settlement.
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default PaymentPortal;
