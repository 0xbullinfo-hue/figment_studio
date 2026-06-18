
import React, { useState, useMemo } from 'react';

interface ServiceCardProps {
  enabled: boolean;
  onToggle: () => void;
  title: string;
  priceLabel: string;
  icon: string;
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
    className={`flex flex-col gap-6 rounded-xl bg-white p-6 border transition-all relative cursor-pointer group ${enabled ? 'border-primary shadow-lg ring-1 ring-primary/10' : 'border-gray-100 opacity-60 grayscale hover:opacity-80'}`}
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
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-[9px] text-text-muted uppercase tracking-widest font-black">{priceLabel}</p>
      </div>
    </div>

    <div
      className={`space-y-4 ${!enabled ? 'opacity-20 pointer-events-none' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Configuration</span>
        <span className="text-base font-black text-primary">{val} {unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => setVal(parseInt(e.target.value))}
        className="w-full h-1.5 bg-gray-100 rounded-full appearance-none accent-primary cursor-pointer"
      />
      <div className="flex justify-between text-[8px] text-text-muted font-bold uppercase tracking-widest">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
    <div className="mt-auto border-t border-gray-100 pt-4 flex justify-between items-center">
      <span className="text-[10px] font-black uppercase text-text-muted tracking-widest">Sub-total</span>
      <span className={`text-xl font-black ${enabled ? 'text-text-main' : 'text-gray-300'}`}>
        ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </span>
    </div>
  </div>
);

interface NewProjectRequestProps {
  onBack: () => void;
  onSubmit: (data: { projectName: string; type: string; total: number; details: string }) => void;
}

const PRICE_PER_VIEW = 75;
const PRICE_PER_60S_ANIMATION = 300;
const PRICE_PER_300M2_MODEL = 500;

const NewProjectRequest: React.FC<NewProjectRequestProps> = ({ onBack, onSubmit }) => {
  const [projectName, setProjectName] = useState('');
  const [visionDescription, setVisionDescription] = useState('');
  const [priority, setPriority] = useState<'Standard' | 'Urgent'>('Standard');

  const [vizEnabled, setVizEnabled] = useState(true);
  const [animEnabled, setAnimEnabled] = useState(false);
  const [modelEnabled, setModelEnabled] = useState(false);

  const [views, setViews] = useState(8);
  const [animationSecs, setAnimationSecs] = useState(60);
  const [scale, setScale] = useState(300);

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
      items.push({ label: 'Urgent Priority (30%)', price: urgentSurcharge });
    }

    const total = subtotal + urgentSurcharge;
    const timeline = priority === 'Urgent' ? '3-6 Days' : '7-14 Days';

    return { total, items, timeline };
  }, [vizEnabled, animEnabled, modelEnabled, views, animationSecs, scale, priority]);

  const handleSubmit = () => {
    onSubmit({
      projectName: projectName || 'New Design Request',
      type: 'Architectural Visualization',
      total: pricing.total,
      details: `${visionDescription || 'No description provided.'} | Configuration: ${pricing.items.map(i => i.label).join(', ')}`
    });
  };

  return (
    <div className="bg-[#fcfaf8] text-[#1c140d] min-h-screen font-display flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-[#e8dbce] bg-white/80 backdrop-blur-md shrink-0">
        <div className="max-w-[1400px] mx-auto px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="text-primary hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl font-bold">arrow_back</span>
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Initiate Project Vision</h2>
          </div>
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button
              onClick={() => setPriority('Standard')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${priority === 'Standard' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Standard
            </button>
            <button
              onClick={() => setPriority('Urgent')}
              className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${priority === 'Urgent' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Urgent
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-10 text-left">
            <div className="space-y-4">
              <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Studio Briefing</h1>
              <p className="text-slate-500 font-medium text-lg">Define the technical scope and creative atmosphere of your next masterpiece.</p>
            </div>

            <section className="bg-white rounded-3xl border border-[#e8dbce] p-8 space-y-8 shadow-sm">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Project Identifier</label>
                <input
                  className="w-full bg-[#fcfaf8] border border-[#e8dbce] rounded-xl h-14 px-6 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-lg"
                  placeholder="e.g., Maitama Residence Expansion"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Atmospheric Vision Statement</label>
                <textarea
                  className="w-full bg-[#fcfaf8] border border-[#e8dbce] rounded-2xl p-6 min-h-[160px] focus:ring-2 focus:ring-primary/20 outline-none font-medium leading-relaxed"
                  placeholder="Describe the desired mood, lighting conditions, and material focus..."
                  value={visionDescription}
                  onChange={(e) => setVisionDescription(e.target.value)}
                />
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-900 border-l-4 border-primary pl-4">Deliverable Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ServiceCard
                  enabled={vizEnabled} onToggle={() => setVizEnabled(!vizEnabled)}
                  title="Visualization" priceLabel="$75 per view" icon="photo_camera"
                  val={views} setVal={setViews} min={1} max={50} unit="Views" subtotal={views * PRICE_PER_VIEW}
                />
                <ServiceCard
                  enabled={animEnabled} onToggle={() => setAnimEnabled(!animEnabled)}
                  title="Animation" priceLabel="$300 per 60s" icon="movie"
                  val={animationSecs} setVal={setAnimationSecs} min={30} max={600} step={30} unit="Sec" subtotal={(animationSecs / 60) * PRICE_PER_60S_ANIMATION}
                />
                <ServiceCard
                  enabled={modelEnabled} onToggle={() => setModelEnabled(!modelEnabled)}
                  title="3D Printing" priceLabel="$500 per 300m²" icon="print"
                  val={scale} setVal={setScale} min={100} max={2000} step={50} unit="m²" subtotal={(scale / 300) * PRICE_PER_300M2_MODEL}
                />
              </div>
            </section>

            <section className="bg-white rounded-3xl border border-dashed border-[#e8dbce] p-12 flex flex-col items-center justify-center gap-4 group hover:border-primary/50 transition-all cursor-pointer relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="size-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-3xl">upload_file</span>
              </div>
              <div className="text-center relative z-10">
                <p className="font-black text-xs uppercase tracking-widest text-slate-900">Attach Architectural Blueprints</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">CAD, PDF, or RVT (Max 50MB)</p>
              </div>
              <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" />
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-[#1c140d] text-white p-10 rounded-[2.5rem] shadow-2xl space-y-10 sticky top-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black uppercase text-primary tracking-widest">Inquiry Summary</h3>
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${priority === 'Urgent' ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-primary/10 border-primary text-primary'}`}>
                  {priority} Priority
                </span>
              </div>

              <div className="space-y-6">
                {pricing.items.length > 0 ? pricing.items.map((it, i) => (
                  <div key={i} className="flex justify-between items-center text-xs group">
                    <span className="text-gray-500 font-bold uppercase tracking-widest group-hover:text-white transition-colors">{it.label}</span>
                    <span className="font-black text-white">${it.price.toLocaleString()}</span>
                  </div>
                )) : (
                  <p className="text-[10px] text-gray-600 italic">No services selected yet.</p>
                )}
              </div>

              <div className="pt-10 border-t border-white/5 space-y-1">
                <p className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em]">Projected Investment</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">${pricing.total.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase">USD</span>
                </div>
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-4">Estimated Delivery: {pricing.timeline}</p>
              </div>

              <div className="pt-6 flex flex-col gap-4">
                <button
                  onClick={handleSubmit}
                  disabled={pricing.total === 0 || !projectName}
                  className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                >
                  Submit Project Request
                </button>
                <button onClick={onBack} className="w-full py-5 border border-white/10 text-gray-500 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:text-white hover:bg-white/5 transition-all">
                  Cancel & Return
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default NewProjectRequest;
