
import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { IMAGES } from '../constants.ts';
import { useStudioStore } from '../store.ts';

// ... (remaining of the service card file above)
// I will import Helmet at top.
// Then inside return on line 199:

interface ServiceCardProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  priceLabel: string;
  icon: string;
  img: string;
  val: number;
  setVal: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  subtotal: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  enabled,
  onToggle,
  title,
  priceLabel,
  icon,
  img,
  val,
  setVal,
  min,
  max,
  step = 1,
  unit,
  subtotal
}) => (
  <div
    onClick={onToggle}
    className={`flex flex-col gap-6 rounded-xl bg-white p-6 border transition-all relative cursor-pointer group ${enabled ? 'border-primary shadow-lg ring-1 ring-primary/10' : 'border-gray-200 opacity-60 grayscale hover:opacity-80'}`}
  >
    <div className="absolute right-6 top-6 z-10">
      <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
        <input type="checkbox" checked={enabled} onChange={() => { }} className="sr-only peer" />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
      </label>
    </div>
    <div className="flex items-center gap-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-lg transition-colors ${enabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400 group-hover:text-primary/60'}`}>
        <span className="material-symbols-outlined text-2xl">{icon}</span>
      </div>
      <div className="text-left">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">{priceLabel}</p>
      </div>
    </div>
    <div className="relative h-44 w-full overflow-hidden rounded-lg bg-gray-100">
      <img src={img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
    </div>
    <div
      className={`space-y-4 ${!enabled ? 'opacity-20 pointer-events-none' : ''}`}
      onClick={(e) => e.stopPropagation()} // Prevent slider clicks from toggling card
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase text-text-muted">Settings</span>
        <span className="text-lg font-black text-primary">{val} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-100 rounded-full appearance-none accent-primary cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-text-muted font-bold uppercase">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
    <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center">
      <span className="text-xs font-black uppercase text-text-muted">Sub-total</span>
      <span className={`text-2xl font-black ${enabled ? 'text-slate-900' : 'text-gray-300'}`}>
        ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </div>
  </div>
);

interface EstimatorProps {
  onBack: () => void;
  onFinish: (data: { projectName: string; clientName: string; type: string; total: number; details: string }) => void;
}

const Estimator: React.FC<EstimatorProps> = ({ onBack, onFinish }) => {
  const addProposal = useStudioStore(state => state.addProposal);

  const [vizEnabled, setVizEnabled] = useState(true);
  const [animEnabled, setAnimEnabled] = useState(true);
  const [modelEnabled, setModelEnabled] = useState(true);

  const [views, setViews] = useState(12);
  const [animationSecs, setAnimationSecs] = useState(180);
  const [scale, setScale] = useState(600);
  const [priority, setPriority] = useState<'Standard' | 'Urgent'>('Standard');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const PRICE_PER_VIEW = 75;
  const PRICE_PER_60S_ANIMATION = 300;
  const PRICE_PER_300M2_MODEL = 500;

  const pricing = useMemo(() => {
    let subtotal = 0;
    const items: { label: string; price: number }[] = [];

    if (vizEnabled) {
      const p = views * PRICE_PER_VIEW;
      subtotal += p;
      items.push({ label: `3D Visualization (${views} views)`, price: p });
    }
    if (animEnabled) {
      const p = (animationSecs / 60) * PRICE_PER_60S_ANIMATION;
      subtotal += p;
      items.push({ label: `3D Animation (${animationSecs}s)`, price: p });
    }
    if (modelEnabled) {
      const p = (scale / 300) * PRICE_PER_300M2_MODEL;
      subtotal += p;
      items.push({ label: `Physical Model (${scale}m²)`, price: p });
    }

    let urgentSurcharge = 0;
    if (priority === 'Urgent' && subtotal > 0) {
      urgentSurcharge = subtotal * 0.3;
      items.push({ label: 'Urgent Priority Surcharge (30%)', price: urgentSurcharge });
    }

    const total = subtotal + urgentSurcharge;
    const timeline = priority === 'Urgent' ? '3-6 Days' : '7-14 Days';

    return { total, items, timeline };
  }, [vizEnabled, animEnabled, modelEnabled, views, animationSecs, scale, priority]);

  const handleDownloadQuote = () => {
    setIsDownloading(true);
    const content = `
FIGMENT STUDIO - INSTANT QUOTE PROPOSAL
----------------------------------------
Project: ${projectName || 'Untitled Design'}
Date: ${new Date().toLocaleDateString()}
Priority: ${priority}
Estimated Delivery: ${pricing.timeline}

Breakdown:
${pricing.items.map(i => `- ${i.label}: $${i.price.toLocaleString()}`).join('\n')}

----------------------------------------
TOTAL ESTIMATED INVESTMENT: $${pricing.total.toLocaleString()}
----------------------------------------
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Figment_Quote_${projectName.replace(/\s+/g, '_') || 'Studio'}.txt`;

    setTimeout(() => {
      link.click();
      URL.revokeObjectURL(url);
      setIsDownloading(false);
    }, 1000);
  };

  const handleRequestFinish = () => {
    const proposalData = {
      id: `PROP-${Math.floor(Math.random() * 1000 + 1000)}`,
      projectName: projectName || 'Instant Package',
      clientName: clientName || 'Anonymous Client',
      type: 'Architectural Visualization',
      total: pricing.total,
      status: 'Received' as const,
      details: pricing.items.map(i => i.label).join(', '),
      date: new Date().toISOString().split('T')[0],
      attachments: []
    };

    // Save to global admin store so it doesn't disappear
    addProposal(proposalData);

    // Continue to success screen
    onFinish(proposalData);
  };

  return (
    <div className="bg-white min-h-screen font-display text-left pb-16">
      <Helmet>
        <title>Instant Quote Estimator | Figment Studio</title>
        <meta name="description" content="Calculate your architectural rendering, cinematic 3D animation, or scale model project cost instantly with Figment Studio's transparent pricing tool." />
      </Helmet>
      <main className="mx-auto max-w-[1200px] px-6 pt-4 pb-12">
        <div className="mb-4 flex flex-col gap-2 text-left">
          <button onClick={onBack} className="flex items-center gap-2 text-primary font-bold text-sm hover:translate-x-[-4px] transition-all w-fit">
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
            Return to Homepage
          </button>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-4xl font-black tracking-tight lg:text-5xl text-slate-900 uppercase leading-tight">Instant Estimate</h2>
              <div className="bg-gray-100 p-1 rounded-xl flex h-fit">
                <button
                  onClick={() => setPriority('Standard')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${priority === 'Standard' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Standard
                </button>
                <button
                  onClick={() => setPriority('Urgent')}
                  className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${priority === 'Urgent' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Urgent
                </button>
              </div>
            </div>
            <p className="max-w-2xl text-lg text-text-muted font-medium leading-relaxed">
              Tailor your architectural visualization package. Select the services you need to build your custom bundle.
            </p>
          </div>
        </div>

        {/* Total Estimate Bar */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between py-5 px-8 rounded-2xl bg-gradient-to-r from-[#1c140d] via-[#14110f] to-[#121212] border border-[#F07A3A]/25 shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden backdrop-blur-xl">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-1 w-full md:w-auto text-left relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Selected Package • {pricing.timeline}</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-black text-primary">${pricing.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Excl. Taxes</span>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 relative z-10">
            <button
              onClick={handleDownloadQuote}
              className="flex items-center justify-center gap-2 flex-1 md:flex-initial rounded-xl border border-primary/30 text-primary px-6 py-2.5 text-[11px] font-bold uppercase tracking-widest hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-lg font-bold">picture_as_pdf</span>
              SAVE PDF
            </button>
            <button disabled className="flex items-center justify-center gap-2 flex-1 md:flex-initial rounded-xl bg-zinc-800 px-8 py-2.5 text-[11px] font-bold uppercase tracking-widest text-zinc-500 cursor-not-allowed transition-all duration-300">
              <span className="material-symbols-outlined text-lg font-bold">send</span>
              COMING SOON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            enabled={vizEnabled} onToggle={() => setVizEnabled(!vizEnabled)}
            title="3D Visualization" priceLabel="$75 per view" icon="camera_indoor"
            img={IMAGES.services.rendering}
            val={views} setVal={setViews} min={1} max={50} unit="Views" subtotal={views * PRICE_PER_VIEW}
          />
          <ServiceCard
            enabled={animEnabled} onToggle={() => setAnimEnabled(!animEnabled)}
            title="3D Animation" priceLabel="$300 per 60s" icon="movie_edit"
            img={IMAGES.services.animation}
            val={animationSecs} setVal={setAnimationSecs} min={30} max={600} step={30} unit="Sec" subtotal={(animationSecs / 60) * PRICE_PER_60S_ANIMATION}
          />
          <ServiceCard
            enabled={modelEnabled} onToggle={() => setModelEnabled(!modelEnabled)}
            title="Physical Model" priceLabel="$500 per 300m²" icon="layers"
            img={IMAGES.services.printing}
            val={scale} setVal={setScale} min={100} max={2000} step={50} unit="m²" subtotal={(scale / 300) * PRICE_PER_300M2_MODEL}
          />
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-16 text-left">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="text-3xl font-black text-slate-900 uppercase">Official Proposal</h3>
            <p className="text-text-muted font-medium">Upload your 2D CAD drawings or site plans. Our project managers will provide a formal invoice within 24 hours.</p>
            <div className="flex flex-col gap-5">
              <input
                className="rounded-xl bg-gray-50 border border-gray-200 p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                placeholder="Project Name"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="rounded-xl bg-gray-50 border border-gray-200 p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  placeholder="Full Name"
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                <input
                  className="rounded-xl bg-gray-50 border border-gray-200 p-4 focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                  placeholder="Work Email"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="group relative flex h-full min-h-[200px] cursor-pointer flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-primary/50 transition-all">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-3xl">cloud_upload</span>
              </div>
              <div className="text-center px-6">
                <p className="font-black text-slate-900 uppercase text-xs tracking-widest">Attach Drawings (PDF, DWG, RVT)</p>
                <p className="text-[10px] text-text-muted mt-1 uppercase tracking-widest font-bold">Max file size: 50MB</p>
              </div>
              <input className="absolute inset-0 cursor-pointer opacity-0" type="file" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#1c140d] text-white p-8 rounded-3xl shadow-2xl space-y-8 sticky top-32">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-black uppercase tracking-tight text-primary">Quote Summary</h4>
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{pricing.timeline} Est. Delivery</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${priority === 'Urgent' ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-primary/20 text-primary border border-primary/20'}`}>
                  {priority} Priority
                </div>
              </div>

              <div className="space-y-4">
                {pricing.items.length > 0 ? pricing.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400 font-medium">{item.label}</span>
                    <span className="font-bold">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )) : (
                  <p className="text-xs text-gray-500 italic">No services selected.</p>
                )}
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Total Projected Investment</p>
                  <p className="text-4xl font-black text-white">${pricing.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest">Timeline</p>
                  <p className="text-xl font-bold text-primary">{pricing.timeline}</p>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={handleDownloadQuote}
                  disabled={isDownloading || pricing.total === 0}
                  className="w-full py-4 border-2 border-primary text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">{isDownloading ? 'sync' : 'picture_as_pdf'}</span>
                  {isDownloading ? 'Generating Quote...' : 'Download Quote PDF'}
                </button>
                <button
                  disabled
                  className="w-full py-4 bg-zinc-800 text-zinc-500 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed transition-all"
                >
                  Coming Soon
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
