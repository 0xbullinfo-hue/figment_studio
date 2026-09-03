import { buildBreadcrumbs } from '../lib/structuredData.ts';

import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { IMAGES } from '../constants.ts';
import { useStudioStore } from '../store.ts';
import { Invoice } from '../types.ts';
import DashboardShell from './DashboardShell.tsx';

interface ServiceCardProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  priceLabel: string;
  tierBadge?: string;
  icon: string;
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
  icon,
  img,
  val,
  setVal,
  min,
  max,
  step = 1,
  unit,
  subtotal,
  tiersDescription
}) => (
  <div
    onClick={onToggle}
    className={`flex flex-col gap-5 rounded-2xl bg-surface p-6 border transition-all relative cursor-pointer group ${
      enabled
        ? 'border-primary shadow-xl ring-1 ring-primary/20 bg-surface'
        : 'border-border-ui opacity-50 grayscale hover:opacity-75'
    }`}
  >
    <div className="absolute right-6 top-6 z-10">
      <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
        <input type="checkbox" checked={enabled} onChange={() => { }} className="sr-only peer" />
        <div className="w-11 h-6 bg-surface-alt border border-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>

    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${enabled ? 'bg-primary/15 text-primary' : 'bg-surface-alt text-text-muted group-hover:text-primary'}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="text-left">
        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
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

    <div className="relative h-40 w-full overflow-hidden rounded-xl bg-surface-alt border border-white/5">
      <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
    </div>

    <div
      className={`space-y-3.5 ${!enabled ? 'opacity-20 pointer-events-none' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between gap-3">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted flex-shrink-0">
          Quantity / Scope
        </label>
        
        {/* Editable input field for direct typing */}
        <div className="flex items-center gap-1.5 bg-surface-alt border border-white/10 rounded-xl px-3 py-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30 transition-all">
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
            className="w-20 sm:w-24 bg-transparent text-right font-sans font-bold text-base text-primary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label={`${title} quantity`}
          />
          <span className="text-xs font-bold text-text-muted select-none">{unit}</span>
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(parseInt(e.target.value, 10) || min)}
        className="w-full h-2 bg-surface-alt rounded-full appearance-none accent-primary cursor-pointer"
      />

      <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase tracking-wider">
        <span>{min.toLocaleString()} {unit}</span>
        <span>{max.toLocaleString()} {unit}</span>
      </div>

      {tiersDescription && (
        <p className="text-[10px] text-text-muted/80 font-light border-t border-white/5 pt-2">
          {tiersDescription}
        </p>
      )}
    </div>

    <div className="mt-auto border-t border-white/10 pt-4 flex justify-between items-center">
      <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Sub-total</span>
      <span className={`text-2xl font-bold font-sans ${enabled ? 'text-white' : 'text-text-muted'}`}>
        ₦{subtotal.toLocaleString('en-NG')}
      </span>
    </div>
  </div>
);

// Top 5 Global Currencies in Architectural Visualization
const TOP_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1500, flag: '🇺🇸', hub: 'Global ArchViz' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1920, flag: '🇬🇧', hub: 'London & Europe' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1630, flag: '🇪🇺', hub: 'Eurozone Architecture' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', rate: 408, flag: '🇦🇪', hub: 'Dubai & Gulf' },
  { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1100, flag: '🇨🇦', hub: 'North America' },
];

interface EstimatorProps {
  onBack?: () => void;
  onFinish?: (data: { projectName: string; clientName: string; type: string; total: number; details: string }) => void;
}

const Estimator: React.FC<EstimatorProps> = ({ onBack, onFinish }) => {
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
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Dynamic Tier Calculations
  // 1. 3D VISUALIZATION:
  // 1 to 5 Views -> ₦100,000 / view
  // 6 views and above -> ₦75,000 / view
  const vizRate = views <= 5 ? 100000 : 75000;
  const vizPriceLabel = views <= 5 ? '1–5 Views — ₦100,000 / view' : '6+ Views — ₦75,000 / view';
  const vizTierBadge = views >= 6 ? 'Volume Rate Applied' : undefined;

  // 2. ANIMATION:
  // 30sec to 90sec -> ₦300,000 per 30s
  // 91sec and above -> ₦250,000 per 30s
  const animRate = animationSecs <= 90 ? 300000 : 250000;
  const animPriceLabel = animationSecs <= 90 ? '30–90s — ₦300,000 / 30s' : '91s+ — ₦250,000 / 30s';
  const animTierBadge = animationSecs > 90 ? 'Long-Form Rate Applied' : undefined;

  // 3. PHYSICAL MODEL:
  // 100m² to 500m² -> ₦100,000 per 100m²
  // 501m² to 1000m² -> ₦85,000 per 100m²
  // 1001m² and above -> ₦50,000 per 100m²
  const modelRate = scale <= 500 ? 100000 : scale <= 1000 ? 85000 : 50000;
  const modelPriceLabel =
    scale <= 500
      ? '100–500m² — ₦100,000 / 100m²'
      : scale <= 1000
      ? '501–1,000m² — ₦85,000 / 100m²'
      : '1,001m²+ — ₦50,000 / 100m²';
  const modelTierBadge =
    scale > 1000 ? 'Masterplan Rate Applied' : scale > 500 ? 'Mid-Scale Rate Applied' : undefined;

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

    const conversions = TOP_CURRENCIES.map(curr => ({
      ...curr,
      convertedAmount: Math.round(total / curr.rate),
    }));

    return { total, subtotal, items, timeline, conversions };
  }, [vizEnabled, animEnabled, modelEnabled, views, animationSecs, scale, priority, vizRate, animRate, modelRate]);

  const handleDownloadQuote = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      // Header Banner
      doc.setFillColor(18, 18, 18);
      doc.rect(0, 0, pageWidth, 48, 'F');
      doc.setTextColor(240, 122, 58);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('FIGMENT STUDIO', margin, 22);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Premium Architectural Visualization | Abuja, Nigeria | hello@figmentstudio.ng', margin, 32);

      // Quote Info
      doc.setTextColor(24, 24, 24);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('INSTANT PROJECT ESTIMATE PROPOSAL', margin, 64);

      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.text(`Quote ID: FIG-${Date.now().toString().slice(-6)}`, margin, 74);
      doc.text(`Date: ${new Date().toLocaleDateString('en-NG')}`, margin, 80);
      doc.text(`Client: ${clientName || 'Valued Client'}`, margin, 86);
      doc.text(`Project: ${projectName || 'Architectural Design Package'}`, margin, 92);
      doc.text(`Delivery Mode: ${priority} Priority (${pricing.timeline})`, margin, 98);

      // Table
      const tableBody = pricing.items.map((item) => [
        item.label,
        item.rateLabel,
        `NGN ${item.price.toLocaleString('en-NG')}`,
      ]);

      autoTable(doc, {
        startY: 106,
        head: [['Service / Scope', 'Applied Rate Tier', 'Amount (NGN)']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [240, 122, 58], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { fontSize: 9.5 },
        alternateRowStyles: { fillColor: [250, 250, 250] },
      });

      // Total
      const finalY = ((doc as any).lastAutoTable?.finalY || 160) + 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(24, 24, 24);
      doc.text('TOTAL PROJECTED INVESTMENT:', margin, finalY);
      doc.setTextColor(240, 122, 58);
      doc.setFontSize(16);
      doc.text(`NGN ${pricing.total.toLocaleString('en-NG')}`, margin, finalY + 8);

      // International Currency Conversion Table
      const convY = finalY + 20;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(50, 50, 50);
      doc.text('INTERNATIONAL CURRENCY CONVERSIONS (ESTIMATED):', margin, convY);

      const convRows = pricing.conversions.map(c => [
        `${c.code} (${c.name})`,
        `${c.symbol}${c.convertedAmount.toLocaleString()}`,
        `1 ${c.code} = NGN ${c.rate.toLocaleString()}`
      ]);

      autoTable(doc, {
        startY: convY + 4,
        head: [['Currency Hub', 'Estimated Equivalent', 'Reference Rate']],
        body: convRows,
        theme: 'plain',
        headStyles: { fillColor: [240, 240, 240], textColor: [40, 40, 40], fontStyle: 'bold', fontSize: 8.5 },
        bodyStyles: { fontSize: 8.5, textColor: [70, 70, 70] },
      });

      // Bank Details Instructions
      const bankY = ((doc as any).lastAutoTable?.finalY || 240) + 10;
      doc.setFillColor(254, 243, 235);
      doc.rect(margin, bankY, pageWidth - margin * 2, 22, 'F');
      doc.setTextColor(212, 83, 22);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('OFFICIAL BANK PAYMENT DETAILS:', margin + 4, bankY + 7);
      doc.setTextColor(60, 60, 60);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.text('Please send this downloaded PDF proposal to our official WhatsApp at +234 816 829 9111', margin + 4, bankY + 13);
      doc.text('to receive studio invoice bank transfer details and commence production immediately.', margin + 4, bankY + 18);

      setTimeout(() => {
        doc.save(`Figment_Quote_${(projectName || 'Studio').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        setIsDownloading(false);
      }, 500);
    } catch {
      setIsDownloading(false);
    }
  };

  const handleSendToWhatsApp = () => {
    const summaryText = `*FIGMENT STUDIO - INSTANT ESTIMATE INQUIRY*
Project: ${projectName || 'Architectural Visualization'}
Client: ${clientName || 'Guest'}
Email: ${clientEmail || 'N/A'}
Priority: ${priority} (${pricing.timeline})

*Scope Selected:*
${pricing.items.map(i => `• ${i.label}: ₦${i.price.toLocaleString('en-NG')} (${i.rateLabel})`).join('\n')}

*Total Investment:* ₦${pricing.total.toLocaleString('en-NG')}
*USD Equivalent:* $${Math.round(pricing.total / 1500).toLocaleString()} USD

_I have generated this quote and would like to receive the official bank details to proceed._`;

    const whatsappUrl = `https://wa.me/2348168299111?text=${encodeURIComponent(summaryText)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleRequestFinish = () => {
    const invoiceSuffix = Date.now().toString().slice(-6);
    const invoiceId = `INV-${invoiceSuffix}`;
    const proposalData = {
      id: `PROP-${invoiceSuffix}`,
      projectName: projectName || 'Instant Package',
      clientName: clientName || 'Anonymous Client',
      type: 'Architectural Visualization',
      total: pricing.total,
      status: 'Received' as const,
      details: pricing.items.map(i => i.label).join(', '),
      date: new Date().toLocaleDateString('en-NG'),
      attachments: []
    };

    const invoiceData: Invoice = {
      id: invoiceId,
      projectName: projectName || 'Instant Package',
      amount: pricing.total,
      status: 'pending',
      date: new Date().toLocaleDateString('en-NG'),
      description: pricing.items.map(i => `${i.label}: ₦${i.price.toLocaleString('en-NG')}`).join(' | '),
      clientName: clientName || 'Anonymous Client',
    };

    addProposal(proposalData);
    addInvoice(invoiceData);
    if (onFinish) {
      onFinish(proposalData);
    } else {
      navigate('/billing');
    }
  };

  return (
    <div className="bg-background text-text-secondary min-h-screen text-left pb-20">
      <Helmet>
        <title>Instant Quote Estimator | Figment Studio</title>
        <meta name="description" content="Calculate your 3D architectural rendering, cinematic animation, or scale model project cost instantly with Figment Studio's tiered pricing tool." />
        <link rel="canonical" href="https://figmentstudio.ng/estimator" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              ...buildBreadcrumbs([{ name: 'Home', item: '/' }, { name: 'Cost Estimator', item: '/estimator' }])
            })}
          </script>
        </Helmet>

      <main className="mx-auto max-w-[1240px] px-6 pt-6 pb-12">
        {/* Top Return & Title */}
        <div className="mb-6 flex flex-col gap-3 text-left">
          <button onClick={onBack || (() => navigate(-1))} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-all w-fit">
            <span className="material-symbols-outlined text-base font-bold">arrow_back</span>
            Return to Homepage
          </button>

        <div className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold tracking-tight lg:text-5xl text-white uppercase leading-tight">Instant Estimate</h1>
              <p className="text-xs text-text-muted font-medium mt-1">Select your project requirements to calculate estimated investment and delivery timeline.</p>
            </div>

            {/* Priority Toggle */}
            <div className="bg-surface p-1 rounded-xl border border-border-ui flex h-fit">
              <button
                onClick={() => setPriority('Standard')}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  priority === 'Standard' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-white'
                }`}
              >
                Standard (7-14 Days)
              </button>
              <button
                onClick={() => setPriority('Urgent')}
                className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  priority === 'Urgent' ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:text-white'
                }`}
              >
                Urgent (3-6 Days +30%)
              </button>
            </div>
          </div>
        </div>
      </div>

        {/* Total Estimate Bar */}
        <div className="mb-10 flex flex-col lg:flex-row items-center justify-between py-6 px-8 rounded-3xl bg-surface border border-primary/30 shadow-2xl relative overflow-hidden backdrop-blur-xl gap-6">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col gap-1 w-full lg:w-auto text-left relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
              Selected Package • {pricing.timeline}
            </span>
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="text-3xl md:text-5xl font-bold font-sans text-white tracking-tight">
                ₦{pricing.total.toLocaleString('en-NG')}
              </span>
            </div>

            {/* Live conversion summary line */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mt-1">
              <span>Approx:</span>
              <span className="text-white font-semibold">${Math.round(pricing.total / 1500).toLocaleString()} USD</span>
              <span>•</span>
              <span className="text-white font-semibold">£{Math.round(pricing.total / 1920).toLocaleString()} GBP</span>
              <span>•</span>
              <span className="text-white font-semibold">€{Math.round(pricing.total / 1630).toLocaleString()} EUR</span>
              <span>•</span>
              <span className="text-white font-semibold">{Math.round(pricing.total / 408).toLocaleString()} AED</span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto relative z-10 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleDownloadQuote}
              disabled={isDownloading || pricing.total === 0}
              className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-xl border border-primary/40 text-primary px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">{isDownloading ? 'sync' : 'picture_as_pdf'}</span>
              {isDownloading ? 'Generating PDF...' : 'Download PDF Quote'}
            </button>
            <button
              onClick={handleSendToWhatsApp}
              disabled={pricing.total === 0}
              className="flex items-center justify-center gap-2 flex-1 sm:flex-initial rounded-xl bg-primary text-white px-6 py-3 text-xs font-bold uppercase tracking-wider hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-lg">chat</span>
              WhatsApp For Bank Details
            </button>
          </div>
        </div>

        {/* 3 Service Configurator Cards with Dynamic Tier Rates */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* 3D Visualization */}
          <ServiceCard
            enabled={vizEnabled}
            onToggle={() => setVizEnabled(!vizEnabled)}
            title="3D Visualization"
            priceLabel={vizPriceLabel}
            tierBadge={vizTierBadge}
            icon="camera_indoor"
            img={IMAGES.services.rendering}
            val={views}
            setVal={setViews}
            min={1}
            max={50}
            unit="Views"
            subtotal={views * vizRate}
            tiersDescription="Tiers: 1–5 Views: ₦100,000/view • 6+ Views: ₦75,000/view"
          />

          {/* 3D Animation */}
          <ServiceCard
            enabled={animEnabled}
            onToggle={() => setAnimEnabled(!animEnabled)}
            title="Animation"
            priceLabel={animPriceLabel}
            tierBadge={animTierBadge}
            icon="movie_edit"
            img={IMAGES.services.animation}
            val={animationSecs}
            setVal={setAnimationSecs}
            min={30}
            max={600}
            step={15}
            unit="Sec"
            subtotal={(animationSecs / 30) * animRate}
            tiersDescription="Tiers: 30–90s: ₦300,000/30s • 91s+: ₦250,000/30s"
          />

          {/* Physical Model */}
          <ServiceCard
            enabled={modelEnabled}
            onToggle={() => setModelEnabled(!modelEnabled)}
            title="Physical Model"
            priceLabel={modelPriceLabel}
            tierBadge={modelTierBadge}
            icon="layers"
            img={IMAGES.services.printing}
            val={scale}
            setVal={setScale}
            min={100}
            max={100000}
            step={100}
            unit="m²"
            subtotal={(scale / 100) * modelRate}
            tiersDescription="Tiers: 100–500m²: ₦100k/100m² • 501–1,000m²: ₦85k/100m² • 1,001m²+: ₦50k/100m²"
          />
        </div>

        {/* Official Proposal & Quote Summary Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-white/10 pt-16 text-left">
          {/* Left Column: Official Brief / Proposal */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white uppercase tracking-tight">Official Project Proposal</h2>
              <p className="text-text-muted text-sm font-light mt-1">Upload your drawings (CAD/DWG/PDF/Revit) or enter project details to receive a customized invoice proposal.</p>
            </div>

            <div className="flex flex-col gap-4">
              <input
                className="rounded-xl bg-surface border border-border-ui p-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium text-sm transition-all"
                placeholder="Project Name / Location (e.g. Maitama Luxury Duplex)"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="rounded-xl bg-surface border border-border-ui p-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium text-sm transition-all"
                  placeholder="Your Full Name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <input
                  className="rounded-xl bg-surface border border-border-ui p-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary outline-none font-medium text-sm transition-all"
                  placeholder="Email Address"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group relative flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border-ui bg-surface hover:border-primary/50 transition-all">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-alt text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
              </div>
              <div className="text-center px-6">
                <p className="font-bold text-white uppercase text-xs tracking-wider">Attach Architectural Drawings (PDF, DWG, RVT, SKP)</p>
                <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-medium">Max upload size: 50MB</p>
              </div>
              <input className="absolute inset-0 cursor-pointer opacity-0" type="file" />
            </div>

            <button
              onClick={handleRequestFinish}
              className="w-full py-4 rounded-xl bg-surface border border-primary/40 text-primary font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">task_alt</span>
              Submit Proposal Request to Studio
            </button>
          </div>

          {/* Right Column: Quote Summary with Currency Conversions & Bank Details Notice */}
          <div className="lg:col-span-5">
            <div className="bg-surface text-white p-7 rounded-3xl border border-primary/30 shadow-2xl space-y-6 sticky top-28">
              {/* Header */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white">Quote Summary</h3>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-0.5">{pricing.timeline} Est. Delivery</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                  priority === 'Urgent' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-primary/15 text-primary border border-primary/30'
                }`}>
                  {priority} Priority
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-3">
                {pricing.items.length > 0 ? pricing.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs py-1.5 border-b border-white/5 gap-2">
                    <div>
                      <span className="text-white font-medium block">{item.label}</span>
                      <span className="text-[10px] text-primary">{item.rateLabel}</span>
                    </div>
                    <span className="font-bold text-white flex-shrink-0">₦{item.price.toLocaleString('en-NG')}</span>
                  </div>
                )) : (
                  <p className="text-xs text-text-muted italic">No services selected.</p>
                )}
              </div>

              {/* Total Projected Investment */}
              <div className="pt-2 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Total Projected Investment</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary tracking-tight mt-1 font-sans">
                      ₦{pricing.total.toLocaleString('en-NG')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase text-text-muted tracking-widest">Timeline</p>
                    <p className="text-sm font-bold text-white">{pricing.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Bank Details Notice */}
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/25 space-y-2 text-left">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base">account_balance</span>
                  Bank Details Notice
                </div>
                <p className="text-xs text-text-secondary leading-relaxed font-light">
                  Users are to send downloaded PDF to WhatsApp number for bank details:
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://wa.me/2348168299111"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-white transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    +234 816 829 9111
                  </a>
                </div>
              </div>

              {/* Global Currency Conversion Rates for Top 5 Architectural Hubs */}
              <div className="p-4 rounded-2xl bg-surface-alt border border-white/5 space-y-3 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-primary">public</span>
                    International Currency Conversions
                  </span>
                  <span className="text-[9px] text-text-muted">Top 5 Arch Hubs</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {pricing.conversions.map((curr) => (
                    <div key={curr.code} className="p-2.5 rounded-xl bg-surface border border-white/5 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-xs">{curr.flag}</span>
                        <span className="text-[10px] font-bold text-primary">{curr.code}</span>
                      </div>
                      <span className="text-sm font-bold text-white mt-1">
                        {curr.symbol}{curr.convertedAmount.toLocaleString()}
                      </span>
                      <span className="text-[8px] text-text-muted truncate mt-0.5">{curr.hub}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-3">
                <button
                  onClick={handleDownloadQuote}
                  disabled={isDownloading || pricing.total === 0}
                  className="w-full py-3.5 border-2 border-primary text-primary rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">{isDownloading ? 'sync' : 'picture_as_pdf'}</span>
                  {isDownloading ? 'Generating Quote...' : 'Download PDF Quote'}
                </button>

                <button
                  onClick={handleSendToWhatsApp}
                  disabled={pricing.total === 0}
                  className="w-full py-3.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">chat</span>
                  Send PDF to WhatsApp for Bank Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Estimator;


