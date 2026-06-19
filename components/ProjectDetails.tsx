import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { useStudioStore } from '../store';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useStudioStore();

  const project = projects.find(p => p.id === id);

  const [activeSection, setActiveSection] = useState<'overview' | 'panorama' | 'timeline'>('overview');
  const [panOffset, setPanOffset] = useState(0);

  if (!project) {
    return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Project not found</div>;
  }

  const milestones = [
    { label: "Conceptual Massing", date: "Oct 05", status: "Completed", icon: "architecture" },
    { label: "Material Application", date: "Oct 12", status: "Completed", icon: "texture" },
    { label: "Cinematic Lighting Pass", date: "Oct 19", status: "In Progress", icon: "wb_sunny" },
    { label: "Final Render Export", date: "Est. Oct 26", status: "Pending", icon: "movie" }
  ];

  const handlePan = (e: React.MouseEvent | React.TouchEvent) => {
    // Simple mock logic for 360 scroller
    if ('buttons' in e && e.buttons === 1) {
      setPanOffset(prev => (prev + e.movementX) % 100);
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden font-display text-left">
      <Helmet>
        <title>{project.title} - Project Intelligence | Figment Studio</title>
        <meta name="description" content={`Monitor milestones, view interactive 360 previews, and manage revisions for ${project.title} directly in the Figment Studio portal.`} />
      </Helmet>
      <aside className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col justify-between p-8 shrink-0">
        <div className="space-y-12">
          <div className="space-y-2">
            <button onClick={() => window.history.back()} className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest hover:translate-x-[-4px] transition-all">
              <span className="material-symbols-outlined text-sm">arrow_back</span> Dashboard
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-all mt-4">
              <span className="material-symbols-outlined text-sm">home</span> Home
            </button>
          </div>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveSection('overview')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeSection === 'overview' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-xl">grid_view</span>
              <span className="font-bold text-xs uppercase tracking-widest">Overview</span>
            </button>
            <button
              onClick={() => setActiveSection('panorama')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeSection === 'panorama' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-xl">360</span>
              <span className="font-bold text-xs uppercase tracking-widest">360° Preview</span>
            </button>
            <button
              onClick={() => setActiveSection('timeline')}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${activeSection === 'timeline' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-primary'}`}
            >
              <span className="material-symbols-outlined text-xl">route</span>
              <span className="font-bold text-xs uppercase tracking-widest">Studio Pulse</span>
            </button>
            <div className="h-px bg-slate-200 my-4"></div>
            <button onClick={() => navigate(`/project/${project.id}/markup`)} className="w-full flex items-center gap-3 p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:border-primary hover:text-primary transition-all text-left">
              <span className="material-symbols-outlined text-xl">reviews</span>
              <span className="font-bold text-xs uppercase tracking-widest">Feedback Tool</span>
            </button>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-gray-100 flex items-center justify-between px-10 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">{project.title}</h1>
            <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-0.5">{project.id} • {project.location}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate(`/project/${project.id}/markup`)} className="px-6 py-2.5 bg-primary text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95">Request Revision</button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-gray-50/30">
          <div className="max-w-5xl mx-auto space-y-10">

            {activeSection === 'overview' && (
              <>
                <section className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">Revision Tracker</h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-primary/10 text-primary rounded border border-primary/20">Active Plan</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-600">Usage: {project.revUsed} of {project.revLimit} Credits</span>
                      <span className="text-primary font-black text-xs uppercase">{Math.round((project.revUsed! / project.revLimit!) * 100)}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(project.revUsed! / project.revLimit!) * 100}%` }}></div>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Deliverables</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <tr>
                          <th className="px-6 py-4">Asset</th>
                          <th className="px-6 py-4">Format</th>
                          <th className="px-6 py-4">Size</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {project.assets?.map((file, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-6 font-bold text-sm text-slate-900">{file.name}</td>
                            <td className="px-6 py-6 uppercase font-bold text-[10px] text-gray-500">{file.format}</td>
                            <td className="px-6 py-6 text-xs text-gray-400 font-bold">{file.size}</td>
                            <td className="px-6 py-6 text-right">
                              <button className="size-8 rounded-lg bg-white border border-gray-200 text-primary hover:bg-primary hover:text-white transition-all"><span className="material-symbols-outlined text-lg">download</span></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}

            {activeSection === 'panorama' && (
              <section className="bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden aspect-video relative group select-none">
                <div
                  className="absolute inset-0 bg-cover transition-transform duration-0 ease-linear cursor-grab active:cursor-grabbing"
                  style={{
                    backgroundImage: `url(${project.imageUrl})`,
                    backgroundPosition: `${panOffset}% center`,
                    transform: 'scale(1.2)'
                  }}
                  onMouseMove={handlePan}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.3em]">
                  360° Perspective Active
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                  <span className="material-symbols-outlined text-primary animate-pulse">drag_pan</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Drag to explore the space</span>
                </div>
              </section>
            )}

            {activeSection === 'timeline' && (
              <section className="bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-[0.05] pointer-events-none p-10">
                  <span className="material-symbols-outlined text-[200px] text-primary">history</span>
                </div>
                <div className="relative space-y-12">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black uppercase tracking-tight">Studio Pulse</h3>
                    <p className="text-slate-400 text-sm">Real-time journey from blueprint to legacy.</p>
                  </div>

                  <div className="space-y-8 relative">
                    <div className="absolute left-[23px] top-4 bottom-4 w-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-primary w-full transition-all duration-1000" style={{ height: '75%' }}></div>
                    </div>

                    {milestones.map((m, i) => (
                      <div key={i} className="flex gap-8 group">
                        <div className={`size-12 rounded-2xl flex items-center justify-center transition-all relative z-10 border-2 ${m.status === 'Completed' ? 'bg-primary border-primary text-white' : m.status === 'In Progress' ? 'bg-white border-primary text-primary shadow-lg shadow-primary/20' : 'bg-gray-50 border-gray-200 text-gray-300'}`}>
                          <span className="material-symbols-outlined text-2xl">{m.icon}</span>
                        </div>
                        <div className="flex-1 pt-1">
                          <div className="flex justify-between items-center">
                            <h4 className={`font-black uppercase tracking-tight ${m.status === 'Pending' ? 'text-gray-300' : 'text-slate-900'}`}>{m.label}</h4>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{m.date}</span>
                          </div>
                          <p className={`text-xs mt-1 font-bold uppercase tracking-widest ${m.status === 'Completed' ? 'text-emerald-500' : m.status === 'In Progress' ? 'text-primary' : 'text-gray-300'}`}>{m.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectDetails;
