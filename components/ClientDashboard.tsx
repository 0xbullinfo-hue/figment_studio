import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudioStore } from '../store';
import Logo from './Logo.tsx';

interface DashboardProps {
  onOpenVision: () => void;
}

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/10';
    case 'In Progress':
      return 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/10';
    case 'Pending Approval':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10';
    case 'Pending':
      return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Completed': return 'check_circle';
    case 'In Progress': return 'potted_plant';
    case 'Pending Approval': return 'clock_loader_60';
    default: return 'pending';
  }
};

const ClientDashboard: React.FC<DashboardProps> = ({ onOpenVision }) => {
  const navigate = useNavigate();
  const { projects } = useStudioStore();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-display text-left relative">
      <aside className="hidden md:flex w-64 bg-white border-r border-[#e8dbce] flex-col justify-between p-8 shrink-0">
        <div className="space-y-12">
          <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity focus:outline-none">
            <Logo size={36} showWordmark showTagline textColor="#1a1a1a" />
          </button>
          <nav className="space-y-4">
            <button className="w-full flex items-center gap-4 text-primary font-bold text-sm uppercase tracking-widest bg-primary/5 p-3 rounded-xl text-left">
              <span className="material-symbols-outlined fill">dashboard</span>
              Dashboard
            </button>
            <button onClick={() => navigate('/billing')} className="w-full flex items-center gap-4 text-gray-400 font-bold text-sm uppercase tracking-widest p-3 hover:text-primary transition-colors text-left">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
              Invoices
            </button>
            <button onClick={() => navigate('/assets')} className="w-full flex items-center gap-4 text-gray-400 font-bold text-sm uppercase tracking-widest p-3 hover:text-primary transition-colors text-left">
              <span className="material-symbols-outlined text-xl">folder_open</span>
              Assets
            </button>
            <button onClick={() => navigate('/support')} className="w-full flex items-center gap-4 text-gray-400 font-bold text-sm uppercase tracking-widest p-3 hover:text-primary transition-colors text-left">
              <span className="material-symbols-outlined text-xl">help</span>
              Support
            </button>
            <div className="h-px bg-gray-100 my-4"></div>
            <button onClick={() => navigate('/')} className="w-full flex items-center gap-4 text-gray-400 font-bold text-sm uppercase tracking-widest p-3 hover:text-slate-900 transition-colors text-left">
              <span className="material-symbols-outlined text-xl">home</span>
              Portal Exit
            </button>
          </nav>
        </div>
        <button onClick={() => navigate('/profile')} className="pt-8 border-t border-gray-100 flex items-center gap-3 group text-left">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">JT</div>
          <div className="truncate">
            <p className="text-xs font-bold uppercase truncate text-slate-900">Julian Thorne</p>
            <p className="text-[10px] text-gray-400 uppercase font-black">Edit Profile</p>
          </div>
        </button>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden bg-white relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#e8dbce] px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="md:hidden hover:opacity-80 transition-opacity focus:outline-none">
              <Logo size={28} iconOnly />
            </button>
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Client Portal / Overview</h2>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenVision}
              className="flex items-center gap-2 group text-primary hover:text-primary-hover transition-all"
            >
              <span className="material-symbols-outlined text-xl group-hover:rotate-12 transition-transform">auto_awesome</span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden lg:inline">Vision AI</span>
            </button>
            <button className="size-8 text-gray-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-xl">notifications</span></button>
            <button onClick={() => navigate('/new-project')} className="px-5 py-2 bg-primary text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all">+ New Project</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#fcfaf8]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#f4ede7] pb-8 gap-6">
              <div className="text-left">
                <h1 className="text-4xl font-light tracking-tighter text-slate-900">Hello, <span className="font-bold text-primary">Julian.</span></h1>
                <p className="text-slate-500 mt-2">Your architectural visions are currently taking shape in the studio.</p>
              </div>
              <button className="flex items-center gap-3 bg-white border border-[#e8dbce] px-6 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-left">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <span className="material-symbols-outlined text-xl">event_available</span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest block text-slate-400">Quick Action</span>
                  <span className="text-xs font-bold uppercase tracking-tight text-slate-900">Schedule Review</span>
                </div>
              </button>
            </div>

            <section className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Active Projects</h3>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{projects.length} Total</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">
                {projects.map(project => (
                  <div key={project.id} className="bg-white rounded-2xl border border-[#e8dbce] overflow-hidden shadow-sm hover:shadow-2xl transition-all group cursor-pointer" onClick={() => navigate(`/project/${project.id}`)}>
                    <div className="aspect-[16/9] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 relative" style={{ backgroundImage: `url(${project.imageUrl})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                        <span className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-3">View Project Intelligence <span className="material-symbols-outlined text-sm font-bold bg-primary p-1.5 rounded-full">arrow_forward</span></span>
                      </div>
                    </div>
                    <div className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h4 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{project.title}</h4>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{project.id} • {project.location}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-primary font-black text-xl">{project.progress}%</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ring-1 ${getStatusStyles(project.status)}`}>
                          <span className="material-symbols-outlined text-sm font-bold">
                            {getStatusIcon(project.status)}
                          </span>
                          {project.status}
                        </div>
                        <div className="h-px flex-1 bg-gray-100"></div>
                      </div>

                      <div className="space-y-3">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                          <div className={`h-full transition-all duration-1000 ease-out ${project.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${project.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <button
          onClick={onOpenVision}
          className="absolute bottom-8 right-8 size-16 bg-primary text-white rounded-full flex items-center justify-center shadow-[0_12px_24px_-8px_rgba(244,140,37,0.5)] hover:scale-110 active:scale-95 transition-all group z-50"
          title="Open Vision AI"
        >
          <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20 group-hover:animate-none"></div>
          <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">auto_awesome</span>
        </button>
      </main>
    </div>
  );
};

export default ClientDashboard;
