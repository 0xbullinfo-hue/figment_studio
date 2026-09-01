import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants.ts';
import { useStudioStore } from '../store.ts';
import { Invoice } from '../types.ts';
import DashboardShell from './DashboardShell.tsx';
import {
  Layers,
  Film,
  Box,
  Clock,
  ArrowRight,
  TrendingUp,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ServiceCardProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  priceLabel: string;
  tierBadge?: string;
  icon: any;
  img: string;
  val: number;
  setVal: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  subtotal: number;
  tiersDescription?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  enabled,
  onToggle,
  title,
  priceLabel,
  tierBadge,
  icon: Icon,
  img,
  val,
  setVal,
  min,
  max,
  step = 1,
  unit,
  subtotal,
  tiersDescription,
}) => (
  <div
    onClick={onToggle}
    className={`flex flex-col gap-5 rounded-2xl p-6 border transition-all relative cursor-pointer group ${
      enabled
        ? 'border-primary/60 bg-[#141414] shadow-xl ring-1 ring-primary/20'
        : 'border-white/5 bg-[#101010] opacity-50 grayscale hover:opacity-80'
    }`}
  >
    <div className="absolute right-6 top-6 z-10">
      <div
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${
          enabled ? 'bg-primary' : 'bg-white/10'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
          enabled ? 'bg-primary/15 text-primary' : 'bg-white/5 text-white/40 group-hover:text-primary'
        }`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-left">
        <h3 className="text-lg font-bold text-white tracking-tight font-display uppercase">{title}</h3>
        <div className="flex items-center gap-2 flex-wrap mt-0.5">
          <p className="text-[11px] text-primary uppercase tracking-wider font-bold">{priceLabel}</p>
          {tierBadge && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              {tierBadge}
            </span>
          )}
        </div>
      </div>
    </div>

    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-black/40 border border-white/5">
      <img
        src={img}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        alt={title}
      />
    </div>

    <div
      className={`space-y-3.5 ${!enabled ? 'opacity-20 pointer-events-none' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-white/50 flex-shrink-0">
          Quantity / Scope
        </label>
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] border border-white/10 rounded-xl px-3 py-1 focus-within:border-primary transition-all">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={isNaN(val) ? '' : val}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                setVal(min);
                return;
              }
              const num = parseInt(raw, 10);
              if (!isNaN(num)) {
                setVal(Math.max(0, Math.min(max, num)));
              }
            }}
            onBlur={() => {
              if (val < min) setVal(min);
              if (val > max) setVal(max);
            }}
            className="w-20 bg-transparent text-right font-sans font-bold text-sm text-primary outline-none"
            aria-label={`${title} quantity`}
          />
          <span className="text-xs font-bold text-white/40 select-none">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(parseInt(e.target.value, 10) || min)}
        className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-primary cursor-pointer"
      />

      <div className="flex justify-between text-[10px] text-white/30 font-bold uppercase tracking-wider">
        <span>{min.toLocaleString()} {unit}</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>

      {tiersDescription && (
        <p className="text-[10px] text-white/40 font-light border-t border-white/5 pt-2">
          {tiersDescription}
        </p>
      )}
    </div>

    <div className="mt-auto border-t border-white/5 pt-4 flex justify-between items-center">
      <span className="text-xs font-bold uppercase tracking-wider text-white/40">Subtotal</span>
      <span className={`text-xl font-bold font-display ${enabled ? 'text-white' : 'text-white/30'}`}>
        ₦{subtotal.toLocaleString('en-NG')}
      </span>
    </div>
  </div>
);

const TOP_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1500, flag: '🇺🇸', hub: 'Global ArchViz' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1920, flag: '🇬🇧', hub: 'London & Europe' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1630, flag: '🇪🇺', hub: 'Eurozone Architecture' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 408, flag: '🇦🇪', hub: 'Dubai & Gulf' },
];

const DashboardEstimator: React.FC = () => {
  const navigate = useNavigate();
  const { auth, addProposal, addInvoice } = useStudioStore();

  const [vizEnabled, setVizEnabled] = useState(true);
  const [animEnabled, setAnimEnabled] = useState(true);
  const [modelEnabled, setModelEnabled] = useState(true);

  const [views, setViews] = useState(4);
  const [animationSecs, setAnimationSecs] = useState(60);
  const [scale, setScale] = useState(500);
  const [priority, setPriority] = useState<'Standard' | 'Urgent'>('Standard');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState(auth.name || '');

  // Dynamic Tier Rates
  const vizRate = views <= 5 ? 100000 : 75000;
  const vizPriceLabel = views <= 5 ? '1–5 Views — ₦100,000 / view' : '6+ Views — ₦75,000 / view';
  const vizTierBadge = views >= 6 ? 'Volume Tier Applied' : undefined;

  const animRate = animationSecs <= 90 ? 300000 : 250000;
  const animPriceLabel = animationSecs <= 90 ? '30–90s — ₦300,000 / 30s' : '91s+ — ₦250,000 / 30s';
  const animTierBadge = animationSecs > 90 ? 'Long-Form Tier Applied' : undefined;

  const modelRate = scale <= 500 ? 100000 : scale <= 1000 ? 85000 : 50000;
  const modelPriceLabel =
    scale <= 500
      ? '100–500m² — ₦100,000 / 100m²'
      : scale <= 1000
      ? '501–1,000m² — ₦85,000 / 100m²'
      : '1,001m²+ — ₦50,000 / 100m²';
  const modelTierBadge =
    scale > 1000 ? 'Masterplan Tier Applied' : scale > 500 ? 'Mid-Scale Tier Applied' : undefined;

  const pricing = useMemo(() => {
    let subtotal = 0;
    const items: { label: string; price: number; rateLabel: string }[] = [];

    if (vizEnabled) {
      const p = views * vizRate;
      subtotal += p;
      items.push({
        label: `3D Visualization (${views} View${views > 1 ? 's' : ''})`,
        price: p,
        rateLabel: `₦${vizRate.toLocaleString('en-NG')} / view`,
      });
    }
    if (animEnabled) {
      const p = (animationSecs / 30) * animRate;
      subtotal += p;
      items.push({
        label: `3D Animation (${animationSecs}s Walkthrough)`,
        price: p,
        rateLabel: `₦${animRate.toLocaleString('en-NG')} / 30s`,
      });
    }
    if (modelEnabled) {
      const p = (scale / 100) * modelRate;
      subtotal += p;
      items.push({
        label: `Physical Scale Model (${scale.toLocaleString()}m²)`,
        price: p,
        rateLabel: `₦${modelRate.toLocaleString('en-NG')} / 100m²`,
      });
    }

    let urgentSurcharge = 0;
    if (priority === 'Urgent' && subtotal > 0) {
      urgentSurcharge = subtotal * 0.3;
      items.push({
        label: 'Urgent Fast-Track Priority (30%)',
        price: urgentSurcharge,
        rateLabel: '+30% Surcharge',
      });
    }

    const total = subtotal + urgentSurcharge;
    const timeline = priority === 'Urgent' ? '3-6 Days' : '7-14 Days';

    const conversions = TOP_CURRENCIES.map((curr) => ({
      ...curr,
      convertedAmount: Math.round(total / curr.rate),
    }));

    return { total, subtotal, items, timeline, conversions };
  }, [vizEnabled, animEnabled, modelEnabled, views, animationSecs, scale, priority, vizRate, animRate, modelRate]);

  const handlePayNow = () => {
    if (pricing.total === 0) {
      alert('Please enable at least one studio service to generate an invoice.');
      return;
    }

    const invoiceSuffix = Date.now().toString().slice(-6);
    const invoiceId = `INV-${invoiceSuffix}`;
    const cleanProjectName = projectName.trim() || 'Custom Architectural Visualization';
    const cleanClientName = clientName.trim() || auth.name || 'Valued Client';

    const proposalData = {
      id: `PROP-${invoiceSuffix}`,
      projectName: cleanProjectName,
      clientName: cleanClientName,
      type: 'Architectural Visualization',
      total: pricing.total,
      status: 'Received' as const,
      details: pricing.items.map((i) => i.label).join(', '),
      date: new Date().toLocaleDateString('en-NG'),
      attachments: [],
    };

    const invoiceData: Invoice = {
      id: invoiceId,
      projectName: cleanProjectName,
      amount: pricing.total,
      status: 'pending',
      date: new Date().toLocaleDateString('en-NG'),
      description: pricing.items.map((i) => `${i.label}: ₦${i.price.toLocaleString('en-NG')}`).join(' | '),
      clientName: cleanClientName,
    };

    addProposal(proposalData);
    addInvoice(invoiceData);

    // Direct routing to billing where invoice is loaded in active invoices & pending payments
    navigate('/billing');
  };

  return (
    <DashboardShell title="New Estimate" subtitle="Configure scope, calculate fees & generate live invoice">
      <Helmet>
        <title>New Estimate | Figment Studio Dashboard</title>
        <meta name="description" content="Configure a tailored architectural visualization package and generate an immediate project invoice." />
      </Helmet>

      <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
        {/* Top Header & Priority */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-light text-white font-display uppercase tracking-tight">
              Package & Scope <span className="font-bold text-primary">Estimator</span>
            </h1>
            <p className="text-xs text-white/40 mt-1 font-sans">
              Select desired deliverables to calculate investment and delivery timeline.
            </p>
          </div>

          {/* Priority Toggle */}
          <div className="bg-[#121212] p-1.5 rounded-xl border border-white/10 flex h-fit">
            <button
              onClick={() => setPriority('Standard')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                priority === 'Standard' ? 'bg-primary text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              Standard (7-14 Days)
            </button>
            <button
              onClick={() => setPriority('Urgent')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                priority === 'Urgent' ? 'bg-primary text-white shadow-md' : 'text-white/40 hover:text-white'
              }`}
            >
              Urgent (3-6 Days +30%)
            </button>
          </div>
        </div>

        {/* UNIFIED TOTAL PROJECT INVESTMENT & OVERVIEW CARD ABOVE SCOPE CARDS */}
        <div className="bg-[#141414] border border-primary/40 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: Total Investment + Project Name Inputs + Pay Button */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
            {/* Total Display */}
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-primary/15 rounded-2xl text-primary border border-primary/25 shrink-0">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    Total Project Investment
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white/60 px-2 py-0.5 rounded-full">
                    {pricing.items.length} Service{pricing.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <p className="text-3xl md:text-4xl font-black text-white font-display">
                    ₦{pricing.total.toLocaleString('en-NG')}
                  </p>
                  <span className="text-xs text-white/40 font-sans">
                    ≈ ${Math.round(pricing.total / 1500).toLocaleString('en-US')} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Project & Client Quick Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 max-w-lg">
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Maitama Commercial Tower"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase tracking-widest text-white/40 mb-1">
                  Client / Company
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Sterling Developments"
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Prominent PAY NOW Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2 shrink-0">
              <div className="text-right hidden lg:block">
                <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Est. Timeline: </span>
                <span className="text-xs font-bold text-white">{pricing.timeline}</span>
              </div>
              <button
                onClick={handlePayNow}
                disabled={pricing.total === 0}
                className="px-7 py-3.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-black uppercase tracking-[0.15em] shadow-xl shadow-primary/20 active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed group cursor-pointer"
              >
                <span>Pay Now (Proceed to Invoice)</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Middle Row: QUOTE SUMMARY BREAKDOWN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                Quote Summary Breakdown
              </span>
              <span className="text-[10px] text-white/40 uppercase">
                {pricing.items.length} Scope Item{pricing.items.length !== 1 ? 's' : ''} Selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {pricing.items.length === 0 ? (
                <div className="col-span-full p-4 text-center rounded-xl bg-[#0A0A0A] border border-white/5 text-xs text-white/30">
                  No services enabled. Toggle below to build your estimate package.
                </div>
              ) : (
                pricing.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0A0A0A] border border-white/5 hover:border-primary/20 transition-all text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-bold text-white truncate">{item.label}</p>
                      <p className="text-[10px] text-white/40 truncate">{item.rateLabel}</p>
                    </div>
                    <p className="font-bold text-primary font-display shrink-0">
                      ₦{item.price.toLocaleString('en-NG')}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bottom Row: INTERNATIONAL CURRENCY CONVERSIONS */}
          <div className="pt-2 border-t border-white/5 space-y-2.5">
            <div className="flex items-center gap-1.5 text-white/40">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Live Currency Conversions</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {pricing.conversions.map((curr) => (
                <div
                  key={curr.code}
                  className="p-2.5 rounded-xl bg-[#0A0A0A] border border-white/5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{curr.flag}</span>
                    <div>
                      <span className="text-[10px] font-bold text-primary block">{curr.code}</span>
                      <span className="text-[8px] text-white/30 block truncate">{curr.hub}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-white font-display">
                    {curr.symbol}{curr.convertedAmount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Main Service Scope Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">Customize Scope & Deliverables</h2>
            <span className="text-[10px] text-white/30 uppercase">Toggle and adjust quantities below</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ServiceCard
              enabled={vizEnabled}
              onToggle={() => setVizEnabled(!vizEnabled)}
              title="3D Renderings"
              priceLabel={vizPriceLabel}
              tierBadge={vizTierBadge}
              icon={Layers}
              img={IMAGES.exterior}
              val={views}
              setVal={setViews}
              min={1}
              max={20}
              unit="Views"
              subtotal={views * vizRate}
              tiersDescription="1–5 views at ₦100k/view; 6+ views discounted to ₦75k/view."
            />

            <ServiceCard
              enabled={animEnabled}
              onToggle={() => setAnimEnabled(!animEnabled)}
              title="Cinematic Animation"
              priceLabel={animPriceLabel}
              tierBadge={animTierBadge}
              icon={Film}
              img={IMAGES.interior}
              val={animationSecs}
              setVal={setAnimationSecs}
              min={30}
              max={180}
              step={30}
              unit="Secs"
              subtotal={(animationSecs / 30) * animRate}
              tiersDescription="30–90s at ₦300k/30s; 91s+ discounted to ₦250k/30s."
            />

            <ServiceCard
              enabled={modelEnabled}
              onToggle={() => setModelEnabled(!modelEnabled)}
              title="Physical Model"
              priceLabel={modelPriceLabel}
              tierBadge={modelTierBadge}
              icon={Box}
              img={IMAGES.commercial}
              val={scale}
              setVal={setScale}
              min={100}
              max={2500}
              step={50}
              unit="m²"
              subtotal={(scale / 100) * modelRate}
              tiersDescription="100–500m² @ ₦100k/100m²; 501–1000m² @ ₦85k; 1001m²+ @ ₦50k."
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default DashboardEstimator;
