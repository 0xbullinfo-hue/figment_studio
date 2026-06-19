import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.tsx';
import { Project, ProjectProposal, PortfolioItem } from '../types.ts';
import { useStudioStore } from '../store';

interface ChatMessage {
  id: string;
  projectId: string;
  sender: 'admin' | 'client';
  content: string;
  timestamp: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    projects,
    proposals,
    portfolioItems,
    updateProject,
    updateProposalStatus,
    addPortfolioItem
  } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'proposals' | 'chat' | 'portfolio' | 'payments'>('overview');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewingProposal, setViewingProposal] = useState<ProjectProposal | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(projects[0]?.id || null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', projectId: 'FS-082', sender: 'client', content: "Hi, can we see the dusk lighting renders today?", timestamp: "10:30 AM" },
    { id: '2', projectId: 'FS-082', sender: 'admin', content: "Finalizing the export now, Julian.", timestamp: "10:35 AM" }
  ]);
  const [newMsg, setNewMsg] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChatId]);

  const handleSendMessage = () => {
    if (!newMsg.trim() || !activeChatId) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      projectId: activeChatId,
      sender: 'admin',
      content: newMsg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, msg]);
    setNewMsg('');
  };

  const renderOverview = () => (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: projects.filter(p => p.status !== 'Completed').length, icon: 'architecture', color: 'text-blue-500' },
          { label: 'Pending Proposals', value: proposals.filter(p => p.status === 'Received').length, icon: 'mark_as_unread', color: 'text-orange-500' },
          { label: 'Studio Revenue', value: `$${projects.reduce((acc, p) => acc + (p.status === 'Completed' ? 5000 : 0), 0) + 124000}`, icon: 'trending_up', color: 'text-emerald-500' },
          { label: 'Client Satisfaction', value: '4.9/5', icon: 'star', color: 'text-amber-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <span className={`material-symbols-outlined text-3xl ${stat.color}`}>{stat.icon}</span>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Real-time</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-4xl font-black text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase text-white">Recent Proposals</h3>
            <button onClick={() => setActiveTab('proposals')} className="text-xs font-black uppercase text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {proposals.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">No proposals in queue.</p>
            ) : (
              proposals.slice(0, 3).map(prop => (
                <div key={prop.id} onClick={() => { setViewingProposal(prop); setActiveTab('proposals'); }} className="p-4 bg-zinc-800/50 border border-zinc-800 rounded-2xl flex justify-between items-center cursor-pointer hover:bg-zinc-800 transition-colors">
                  <div>
                    <p className="text-white font-bold">{prop.projectName}</p>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase">{prop.clientName} • ${prop.total.toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${prop.status === 'Received' ? 'bg-primary/10 text-primary' : 'bg-zinc-700 text-zinc-400'}`}>{prop.status}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black uppercase text-white">Project Health</h3>
            <span className="text-xs text-zinc-500">Global Progress</span>
          </div>
          <div className="space-y-6">
            {projects.slice(0, 3).map(p => (
              <div key={p.id} className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase">
                  <span className="text-zinc-400">{p.title}</span>
                  <span className="text-primary">{p.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase text-white">Project Pipeline</h2>
        <div className="flex gap-2">
          {['All', 'In Progress', 'Completed'].map(f => (
            <button key={f} className="px-4 py-1.5 bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-zinc-700 transition-colors">{f}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col gap-6 group hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start">
              <div className="text-left">
                <h4 className="text-2xl font-black text-white uppercase leading-none">{p.title}</h4>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2">{p.id} • {p.location}</p>
              </div>
              <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/10' : 'bg-primary/10 text-primary border border-primary/10'}`}>
                {p.status}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase text-zinc-500">Studio Delivery Progress</span>
                <span className="text-lg font-black text-white">{p.progress}%</span>
              </div>
              <input
                type="range" min="0" max="100" value={p.progress}
                onChange={(e) => updateProject({ ...p, progress: parseInt(e.target.value) })}
                className="w-full h-1 bg-zinc-800 rounded-full accent-primary appearance-none cursor-pointer"
              />
            </div>
            <div className="flex gap-3 pt-4 border-t border-zinc-800">
              <button onClick={() => setSelectedProject(p)} className="flex-1 py-3 bg-zinc-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700">Edit Project</button>
              <button onClick={() => { setActiveChatId(p.id); setActiveTab('chat'); }} className="flex-1 py-3 border border-zinc-800 text-zinc-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white">Chat Client</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProposals = () => (
    <div className="space-y-8">
      <h2 className="text-3xl font-black uppercase text-white">Client Inquiries</h2>
      <div className="space-y-4">
        {proposals.length === 0 ? (
          <div className="p-20 text-center text-zinc-600 bg-zinc-900 rounded-3xl border border-dashed border-zinc-800">
            No inquiries received yet.
          </div>
        ) : (
          proposals.map(prop => (
            <div key={prop.id} className={`bg-zinc-900 border border-zinc-800 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 transition-all ${prop.status === 'Received' ? 'ring-1 ring-primary/20 bg-zinc-900' : 'opacity-60 bg-black/40'}`}>
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-2xl font-black text-white uppercase leading-none">{prop.projectName}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${prop.status === 'Approved' ? 'bg-emerald-500 text-white' : prop.status === 'Rejected' ? 'bg-red-500 text-white' : 'bg-primary text-white'}`}>{prop.status}</span>
                </div>
                <p className="text-zinc-400 font-bold">{prop.clientName} • <span className="text-primary">${prop.total.toLocaleString()}</span> • Received: {prop.date}</p>
                <p className="text-sm text-zinc-500 italic max-w-xl line-clamp-1">"{prop.details}"</p>
                {prop.attachments && prop.attachments.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-xs text-zinc-600">attach_file</span>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase">{prop.attachments.length} Document(s) Attached</span>
                  </div>
                )}
              </div>
              <div className="flex gap-4">
                <button onClick={() => setViewingProposal(prop)} className="px-6 py-3 border border-zinc-800 text-zinc-400 rounded-xl text-xs font-black uppercase tracking-widest hover:text-white transition-all">Review & Details</button>
                {prop.status === 'Received' && (
                  <div className="flex gap-2">
                    <button onClick={() => updateProposalStatus(prop.id, 'Approved')} className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500">Approve</button>
                    <button onClick={() => updateProposalStatus(prop.id, 'Rejected')} className="px-6 py-3 bg-red-900/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all">Decline</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderChat = () => {
    const activeProject = projects.find(p => p.id === activeChatId) || projects[0];
    const filteredMsgs = chatMessages.filter(m => m.projectId === activeChatId);

    return (
      <div className="h-[70vh] flex bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden">
        <aside className="w-80 border-r border-zinc-800 p-8 space-y-8 flex flex-col">
          <h3 className="text-xl font-black uppercase text-white">Channels</h3>
          <div className="space-y-2 overflow-y-auto">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveChatId(p.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all border ${activeChatId === p.id ? 'bg-primary/10 border-primary/40' : 'hover:bg-zinc-800 border-transparent'}`}
              >
                <p className={`font-bold text-sm uppercase truncate ${activeChatId === p.id ? 'text-primary' : 'text-white'}`}>{p.title}</p>
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Active Thread • {p.status}</p>
              </button>
            ))}
          </div>
        </aside>
        <section className="flex-1 flex flex-col p-8 bg-black/20">
          <div className="pb-6 border-b border-zinc-800 mb-6 flex justify-between items-center">
            <div className="text-left">
              <h3 className="text-xl font-black text-white uppercase">{activeProject?.title}</h3>
              <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Client Portal Chat</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 flex flex-col justify-end p-4">
            {filteredMsgs.length === 0 ? (
              <p className="text-zinc-600 text-center italic py-20">Start the project conversation here.</p>
            ) : (
              filteredMsgs.map(m => (
                <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-4 rounded-2xl ${m.sender === 'admin' ? 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10' : 'bg-zinc-800 text-zinc-300 rounded-tl-none border border-zinc-700'}`}>
                    <p className="text-sm font-medium text-left">{m.content}</p>
                    <p className={`text-[8px] font-black uppercase tracking-widest mt-2 ${m.sender === 'admin' ? 'text-white/60 text-right' : 'text-zinc-500 text-left'}`}>{m.timestamp}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="mt-8 flex gap-4">
            <input
              className="flex-1 bg-zinc-800 border-zinc-700 border rounded-2xl px-6 text-sm font-bold text-white focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="Studio response..."
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button onClick={handleSendMessage} className="bg-primary text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined font-bold">send</span>
            </button>
          </div>
        </section>
      </div>
    );
  };

  const renderPortfolioMgmt = () => (
    <div className="space-y-12">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl">
        <h3 className="text-xl font-black uppercase text-white mb-8">Push to Public Gallery</h3>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          addPortfolioItem({
            id: Date.now(),
            type: formData.get('type') as string,
            title: formData.get('title') as string,
            url: formData.get('url') as string,
            class: 'aspect-video'
          });
          (e.target as HTMLFormElement).reset();
        }}>
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Project Title</label>
            <input name="title" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white focus:ring-primary outline-none" placeholder="The Emerald Heights" />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Media Type</label>
            <select name="type" className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white focus:ring-primary outline-none">
              <option>Exterior</option>
              <option>Interior</option>
              <option>Animation</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2 text-left">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Image URL</label>
            <input name="url" required className="w-full bg-zinc-800 border border-zinc-700 rounded-xl p-4 text-white focus:ring-primary outline-none" placeholder="https://unsplash.com/..." />
          </div>
          <button type="submit" className="md:col-span-2 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-95 transition-all">
            Publish Content
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {portfolioItems.map(item => (
          <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800">
            <img src={item.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={item.title} />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
              <button className="p-2 bg-red-500 text-white rounded-lg hover:scale-110"><span className="material-symbols-outlined text-sm">delete</span></button>
              <button className="p-2 bg-white text-black rounded-lg hover:scale-110"><span className="material-symbols-outlined text-sm">edit</span></button>
            </div>
            <div className="absolute bottom-4 left-4 text-left">
              <p className="text-[8px] font-black text-primary uppercase tracking-widest">{item.type}</p>
              <p className="text-[10px] text-white font-bold uppercase truncate max-w-[120px]">{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPayments = () => {
    const pending = proposals.filter(p => p.status === 'Received');
    const approved = proposals.filter(p => p.status === 'Approved');
    const pendingValue = pending.reduce((sum, p) => sum + p.total, 0);
    const paidValue = approved.reduce((sum, p) => sum + p.total, 0);

    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pending Settlement</p>
            <p className="text-4xl font-black text-primary mt-2">${pendingValue.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Recorded Paid Value</p>
            <p className="text-4xl font-black text-emerald-500 mt-2">${paidValue.toLocaleString()}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Enabled Gateways</p>
            <p className="text-2xl font-black text-white mt-2">Paystack + Flutterwave</p>
          </div>
        </div>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black uppercase text-white">Payment Operations Queue</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Backend visibility</span>
          </div>
          <div className="space-y-3">
            {pending.length === 0 ? (
              <p className="text-zinc-500 text-sm">No pending invoices currently.</p>
            ) : (
              pending.map((p) => (
                <div key={p.id} className="rounded-2xl border border-zinc-800 bg-black/20 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-white font-bold uppercase text-sm">{p.projectName}</p>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{p.id} • {p.clientName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-black">${p.total.toLocaleString()}</span>
                    <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-primary/10 text-primary">Awaiting Payment</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    );
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'dashboard' },
    { id: 'projects', label: 'Projects', icon: 'architecture' },
    { id: 'proposals', label: 'Inquiries', icon: 'mark_as_unread' },
    { id: 'chat', label: 'Chat', icon: 'forum' },
    { id: 'portfolio', label: 'Portfolio', icon: 'gallery_thumbnail' },
    { id: 'payments', label: 'Payments', icon: 'payments' },
  ];

  return (
    <div className="flex h-screen bg-[#0c0c0c] font-display text-left overflow-hidden">
      <aside className="w-80 bg-zinc-950 border-r border-zinc-900 p-10 flex flex-col justify-between shrink-0">
        <div className="space-y-16">
          <Logo size={36} showWordmark showTagline />
          <nav className="space-y-4">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-4 font-black text-xs uppercase tracking-[0.2em] p-4 rounded-2xl transition-all ${activeTab === item.id ? 'text-primary bg-primary/5 border border-primary/20 shadow-lg shadow-primary/5' : 'text-zinc-600 hover:text-primary hover:bg-zinc-900/50 border border-transparent'}`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => navigate('/')} className="flex items-center gap-4 text-zinc-600 font-black text-xs uppercase tracking-[0.2em] p-4 hover:text-red-500 transition-all">
          <span className="material-symbols-outlined">logout</span>
          Studio Logout
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
        <div className="max-w-7xl mx-auto space-y-12">
          <header className="flex justify-between items-end border-b border-zinc-900 pb-12">
            <div className="text-left">
              <h1 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">Studio Control</h1>
              <p className="text-zinc-500 mt-4 text-xs font-bold uppercase tracking-[0.3em]">Backend / {activeTab}</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-3 bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800">
                <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active System</span>
              </div>
            </div>
          </header>

          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'portfolio' && renderPortfolioMgmt()}
          {activeTab === 'payments' && renderPayments()}
          {activeTab === 'proposals' && renderProposals()}
          {activeTab === 'chat' && renderChat()}
        </div>
      </main>

      {/* Proposal Detail Modal */}
      {viewingProposal && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-3xl rounded-[3rem] p-12 space-y-10 relative shadow-2xl animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <button onClick={() => setViewingProposal(null)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Inquiry ID: {viewingProposal.id}</span>
                <span className={`px-3 py-1 bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest rounded-full`}>{viewingProposal.status}</span>
              </div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter leading-[0.9]">{viewingProposal.projectName}</h3>
              <p className="text-zinc-500 font-bold uppercase tracking-widest">Submitted by {viewingProposal.clientName} on {viewingProposal.date}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-y border-zinc-800">
              <div className="text-left space-y-2">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Estimated Investment</p>
                <p className="text-4xl font-black text-white">${viewingProposal.total.toLocaleString()}</p>
              </div>
              <div className="text-left space-y-2">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Project Type</p>
                <p className="text-2xl font-bold text-zinc-300 uppercase">{viewingProposal.type}</p>
              </div>
            </div>

            <div className="text-left space-y-4">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Vision Requirements & Details</p>
              <div className="bg-zinc-800/50 p-6 rounded-2xl border border-zinc-800 text-zinc-400 font-medium leading-relaxed italic">
                "{viewingProposal.details}"
              </div>
            </div>

            {viewingProposal.attachments && viewingProposal.attachments.length > 0 && (
              <div className="text-left space-y-4">
                <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Client Documentation (Review before approval)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingProposal.attachments.map((file, i) => (
                    <div key={i} className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex items-center justify-between group hover:border-primary transition-all">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <span className="material-symbols-outlined text-primary">description</span>
                        <div className="truncate">
                          <p className="text-white font-bold text-xs truncate">{file.name}</p>
                          <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest">{file.size}</p>
                        </div>
                      </div>
                      <button className="p-2 bg-zinc-900 rounded-lg text-zinc-400 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              {viewingProposal.status === 'Received' ? (
                <>
                  <button
                    onClick={() => { updateProposalStatus(viewingProposal.id, 'Approved'); setViewingProposal(null); }}
                    className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    Approve Proposal
                  </button>
                  <button
                    onClick={() => { updateProposalStatus(viewingProposal.id, 'Rejected'); setViewingProposal(null); }}
                    className="flex-1 py-5 bg-zinc-800 text-zinc-400 rounded-2xl font-black uppercase tracking-widest hover:bg-red-900 hover:text-white transition-all"
                  >
                    Reject Inquiry
                  </button>
                </>
              ) : (
                <button className="w-full py-5 border border-zinc-800 text-zinc-600 rounded-2xl font-black uppercase tracking-widest cursor-default">
                  {viewingProposal.status} • Record Active
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Project Status & Details Edit Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl rounded-[3rem] p-12 space-y-10 relative animate-in zoom-in-95 duration-300 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-zinc-600 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-4xl">close</span>
            </button>
            <div className="space-y-4 text-left">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight">Post-Launch Management</h3>
              <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">ID: {selectedProject.id} • Real-time Sync Active</p>
            </div>
            <div className="space-y-6">
              {/* Project Metadata Edits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Project Title</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary"
                    value={selectedProject.title}
                    onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                  />
                </div>
                <div className="space-y-3 text-left">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Location</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary"
                    value={selectedProject.location}
                    onChange={(e) => setSelectedProject({ ...selectedProject, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Project Phase</label>
                <select
                  className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary"
                  value={selectedProject.status}
                  onChange={(e) => setSelectedProject({ ...selectedProject, status: e.target.value as any })}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Pending Approval</option>
                  <option>Completed</option>
                </select>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Manual Progress %</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    className="w-32 bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white font-black text-2xl text-center outline-none"
                    value={selectedProject.progress}
                    onChange={(e) => setSelectedProject({ ...selectedProject, progress: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) })}
                  />
                  <input
                    type="range" min="0" max="100"
                    className="flex-1 accent-primary"
                    value={selectedProject.progress}
                    onChange={(e) => setSelectedProject({ ...selectedProject, progress: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-3 text-left">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Studio Notes (Internal)</label>
                <textarea
                  className="w-full bg-zinc-800 border-zinc-700 rounded-xl p-4 text-white font-medium min-h-[100px] outline-none focus:ring-1 focus:ring-primary"
                  value={selectedProject.notes || ''}
                  placeholder="Add studio internal notes..."
                  onChange={(e) => setSelectedProject({ ...selectedProject, notes: e.target.value })}
                />
              </div>
            </div>
            <button
              onClick={() => { updateProject(selectedProject); setSelectedProject(null); }}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Save & Synchronize
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
