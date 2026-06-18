import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudioStore } from '../store';
import BeforeAfterSlider from './BeforeAfterSlider';

const DeliveryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useStudioStore();
  const project = projects.find(p => p.id === id);

  if (!project) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Project not found</div>;

  return (
    <div className="min-h-screen flex flex-col bg-white font-display">
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-xl shrink-0">
        <div className="max-w-[1280px] mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button onClick={() => navigate(`/project/${project.id}`)} className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:translate-x-[-4px] transition-all">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Dashboard
            </button>
            <div className="h-6 w-[1px] bg-slate-100"></div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 transition-all">
              <span className="material-symbols-outlined text-sm">home</span>
              Home
            </button>
            <div className="h-6 w-[1px] bg-slate-100"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
              <span className="material-symbols-outlined text-[14px] font-bold">check_circle</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Project Completed</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-primary">
            <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-white">
              <span className="material-symbols-outlined font-bold">architecture</span>
            </div>
            <h2 className="text-xl font-black tracking-tighter uppercase text-slate-900">FIGMENT</h2>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <section className="max-w-[1280px] mx-auto px-10 py-12">
          <div className="relative overflow-hidden rounded-[3rem] bg-slate-900 p-20 flex items-center justify-center text-center shadow-2xl">
            {/* Using project-specific image for the background */}
            <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale" style={{ backgroundImage: `url("${project.imageUrl}")` }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900"></div>
            <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="inline-block px-4 py-1.5 bg-primary/20 border border-primary/30 rounded-full text-primary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">Final Asset Package</div>
              {/* Using project title dynamically */}
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase leading-[0.9]">{project.title}</h1>
              <p className="text-xl text-slate-400 font-medium leading-relaxed">Production is complete. All high-fidelity master assets and legal releases are now active for your records.</p>
              <div className="flex justify-center gap-8 pt-8">
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Status</p>
                  <p className="text-white font-bold uppercase tracking-tight">Signed Off</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Completed</p>
                  <p className="text-white font-bold uppercase tracking-tight">Oct 24, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-[1280px] mx-auto px-10 py-20 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-10">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Master Output</span>
              <h2 className="text-3xl font-black tracking-tighter uppercase">Primary 8K Render</h2>
            </div>
            <div className="text-right">
              <button className="bg-primary text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                <span className="material-symbols-outlined font-bold">download</span>
                Download 8K Asset
              </button>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-gray-100 bg-gray-50">
            <BeforeAfterSlider
              beforeImage="https://images.unsplash.com/photo-1590494165264-1ebe3602eb80?q=80&w=2000&auto=format&fit=crop"
              afterImage={project.imageUrl}
            />
            <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between p-8 bg-white/90 backdrop-blur-xl border border-white rounded-3xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-2xl pointer-events-none">
              <div>
                <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight">Main Interior — Evening Composition</h4>
                <p className="text-sm text-slate-500 font-medium mt-1">Resolution: 7680 x 4320 • Format: Lossless PNG (48.5MB)</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase text-gray-300 tracking-widest">Verified Final</span>
                <div className="size-10 bg-green-500 text-white rounded-full flex items-center justify-center"><span className="material-symbols-outlined font-bold">check</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50/50 border-y border-gray-100 py-32">
          <div className="max-w-[1280px] mx-auto px-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">IP & Rights Transfer</h2>
              <p className="text-slate-500 max-w-xl mx-auto font-medium">Official legal documents confirming the transfer of ownership for all digital project assets.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-8 group hover:border-primary/40 transition-all">
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-4xl">gavel</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight">Copyright Assignment</h4>
                  <p className="text-sm text-gray-400 font-medium uppercase mt-1">Full IP Transfer Document</p>
                </div>
                <button className="size-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined font-bold">download</span>
                </button>
              </div>
              <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-8 group hover:border-primary/40 transition-all">
                <div className="size-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-4xl">verified_user</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-xl text-slate-900 uppercase tracking-tight">Certificate of Authenticity</h4>
                  <p className="text-sm text-gray-400 font-medium uppercase mt-1">Provenance & Render Metadata</p>
                </div>
                <button className="size-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                  <span className="material-symbols-outlined font-bold">download</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-32 bg-slate-900 text-center">
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">Ready for the next vision?</h3>
          <div className="flex justify-center gap-6">
            <button className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">Start New Project</button>
            <button onClick={() => navigate('/dashboard')} className="bg-transparent border border-white/20 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-white/5 transition-all">Return to Projects</button>
          </div>
          <div className="mt-24 text-[10px] font-black uppercase text-gray-600 tracking-[0.3em]">
            © 2024 Figment Studio Nigeria • Production Rights Released
          </div>
        </footer>
      </main>
    </div>
  );
};

export default DeliveryPage;
