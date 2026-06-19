
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SupportCenterProps {
  onBack: () => void;
}

const SupportCenter: React.FC<SupportCenterProps> = ({ onBack }) => {
  return (
    <div className="bg-[#f8f7f5] min-h-screen text-[#1c140d] font-body">
      <Helmet>
        <title>Client Support Hub | Figment Studio</title>
        <meta name="description" content="Access Figment Studio's client support center. View active trouble tickets or search our architectural onboarding and delivery guides." />
      </Helmet>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e9dace]">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="flex items-center gap-2 group">
              <span className="material-symbols-outlined text-primary group-hover:translate-x-[-2px] transition-transform">arrow_back</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Back to Portal</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-lg text-primary">
              <span className="material-symbols-outlined text-xl">help</span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tighter uppercase">Support Hub</h1>
          </div>
          <div className="size-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center font-black text-primary">JT</div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12 space-y-12">
        <section className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tight text-[#1c140d] leading-tight uppercase">
              How can we help?
            </h2>
            <p className="text-lg text-[#9e7047] font-medium">Official help center for Figment Studio clients.</p>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-[#9e7047] group-focus-within:text-primary transition-colors">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input className="w-full h-16 pl-12 pr-6 bg-white border-2 border-[#f4ede6] rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-lg transition-all shadow-sm" placeholder="Search architectural guides..." type="text" />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-left">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  Knowledge Base
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'rocket_launch', title: 'Onboarding', desc: 'Understanding your dashboard and project workflow.' },
                  { icon: 'payments', title: 'Billing', desc: 'Managing payments, VAT, and international transfers.' },
                  { icon: 'tactic', title: 'Feedback Loop', desc: 'How to use the markup tool for precision revisions.' },
                  { icon: 'terminal', title: 'Deliverables', desc: 'Mastering our file formats and 360 viewer.' }
                ].map((item, i) => (
                  <div key={i} className="p-6 bg-white border border-[#f4ede6] rounded-xl hover:border-primary transition-all cursor-pointer group">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">{item.title}</h4>
                    <p className="text-sm text-[#9e7047] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6 px-2">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">confirmation_number</span>
                  Active Tickets
                </h3>
              </div>
              <div className="overflow-hidden rounded-xl border border-[#f4ede6] bg-white shadow-sm">
                <div className="divide-y divide-[#f4ede6]">
                  <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fcfaf8] transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black tracking-wider text-[#9e7047] uppercase">#FIG-4822</span>
                        <h5 className="font-bold">Revision on Terrace Render</h5>
                      </div>
                      <p className="text-sm text-[#9e7047]">Awaiting studio review • Oct 24</p>
                    </div>
                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase rounded-full">In Progress</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="sticky top-24">
            <div className="bg-white border-2 border-[#f4ede6] rounded-2xl p-8 shadow-xl shadow-[#f4ede6]/50">
              <h3 className="text-2xl font-black uppercase mb-2">New Inquiry</h3>
              <p className="text-sm text-[#9e7047] mb-6">Need expert eyes? Our team is online.</p>
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#1c140d] tracking-widest">Subject</label>
                  <input className="w-full bg-[#fcfaf8] border border-[#f4ede6] rounded-lg px-4 py-3 focus:ring-primary focus:border-primary outline-none text-sm" placeholder="How can we help?" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#1c140d] tracking-widest">Message</label>
                  <textarea className="w-full bg-[#fcfaf8] border border-[#f4ede6] rounded-lg px-4 py-3 focus:ring-primary focus:border-primary outline-none text-sm resize-none" rows={4}></textarea>
                </div>
                <button className="w-full py-4 bg-primary text-white font-black uppercase tracking-widest rounded-lg shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all" type="submit">
                  Open Ticket
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SupportCenter;
