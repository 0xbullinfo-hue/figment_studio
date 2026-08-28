import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useStudioStore } from '../store';
import Logo from './Logo.tsx';
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  HelpCircle,
  LogOut,
  Calendar,
  FolderKanban,
  MessageSquare,
  ChevronRight,
  Bell,
  CheckCircle2,
  Clock,
  Layers,
  X
} from 'lucide-react';

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'In Progress':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'Pending Approval':
      return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
    case 'Pending':
    default:
      return 'bg-white/5 text-white/60 border-white/10';
  }
};

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, auth, logout } = useStudioStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'assets' | 'support'>('overview');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ datetime: '', notes: '' });

  const clientName = auth.name || 'Client';
  const clientFirstName = clientName.split(' ')[0] || 'Client';
  const clientInitials = clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'CU';

  const activeProjects = useMemo(() => projects.filter(p => p.status !== 'Completed'), [projects]);
  const completedProjects = useMemo(() => projects.filter(p => p.status === 'Completed'), [projects]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    alert('Review request submitted. Our team will confirm your session shortly.');
    setScheduleForm({ datetime: '', notes: '' });
  };

  return (
    <div className="flex h-screen bg-[#0E0E0E] overflow-hidden font-sans text-left relative text-white">
      <Helmet>
        <title>Client Dashboard | Figment Studio</title>
        <meta name="description" content="Access your private project pipeline, review design deliverables, and communicate directly with the Figment Studio team." />
      </Helmet>

      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#121212] border-r border-white/5 flex-col justify-between p-8 shrink-0">
        <div className="space-y-10">
          <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity focus:outline-none">
            <Logo size={36} showWordmark showTagline textColor="#FFFFFF" />
          </button>
          
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                activeTab === 'overview'
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/billing')}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <Receipt className="w-4 h-4" />
              Invoices
            </button>
            <button
              onClick={() => navigate('/assets')}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <FolderOpen className="w-4 h-4" />
              Assets
            </button>
            <button
              onClick={() => navigate('/support')}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/50 hover:bg-white/5 hover:text-white transition-all text-left"
            >
              <HelpCircle className="w-4 h-4" />
              Support
            </button>
            
            <div className="h-px bg-white/5 my-4" />
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              Portal Exit
            </button>
          </nav>
        </div>

        <button onClick={() => navigate('/profile')} className="pt-6 border-t border-white/5 flex items-center gap-3 group text-left">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
            {clientInitials}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold uppercase truncate text-white">{clientName}</p>
            <p className="text-[10px] text-white/40 uppercase font-medium">Edit Profile</p>
          </div>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] relative">
        <header className="h-16 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="md:hidden hover:opacity-80 transition-opacity focus:outline-none">
              <Logo size={28} iconOnly textColor="#FFFFFF" />
            </button>
            <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">Client Portal / Overview</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/new-project')}
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              + New Project
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-8 gap-6">
              <div className="text-left">
                <h1 className="text-3xl md:text-4xl font-light tracking-tight text-white font-display">
                  Welcome back, <span className="font-bold text-primary">{clientFirstName}.</span>
                </h1>
                <p className="text-white/40 text-sm mt-1 font-sans">
                  You have {activeProjects.length} project{activeProjects.length !== 1 ? 's' : ''} in progress and {completedProjects.length} completed.
                </p>
              </div>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-3 bg-[#161616] border border-white/10 px-5 py-3 rounded-xl hover:border-primary/40 transition-all text-left group cursor-pointer"
              >
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest block text-white/40">Quick Action</span>
                  <span className="text-xs font-bold uppercase tracking-tight text-white group-hover:text-primary transition-colors">Schedule Review</span>
                </div>
              </button>
            </div>

            {/* Projects Grid */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Active Projects</h3>
                <span className="text-[10px] font-bold uppercase text-white/40 tracking-wider">{projects.length} Total</span>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-[#121212] rounded-2xl border border-white/5 overflow-hidden hover:border-primary/30 transition-all group cursor-pointer shadow-lg"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    <div
                      className="aspect-[16/9] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 relative"
                      style={{ backgroundImage: `url(${project.imageUrl})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="p-6 space-y-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-white font-display uppercase tracking-tight group-hover:text-primary transition-colors">
                            {project.title}
                          </h4>
                          <p className="text-[10px] text-white/40 uppercase font-medium tracking-wider mt-0.5">
                            {project.id} — {project.location}
                          </p>
                        </div>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${getStatusStyles(project.status)}`}>
                          {project.status === 'Pending Approval' ? 'Awaiting Feedback' : project.status}
                        </span>
                      </div>

                      {project.description && (
                        <p className="text-white/40 text-xs font-sans line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                      )}

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between text-xs text-white/40 font-sans">
                          <span>Progress</span>
                          <span className="text-primary font-bold">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-700 ${
                              project.status === 'Completed' ? 'bg-emerald-500' : 'bg-primary'
                            }`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <button className="w-full py-2.5 border border-white/10 text-white/60 hover:text-white hover:border-primary/40 text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg">
                        View Project Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <div className="space-y-4 pt-4 pb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/80">Studio Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    label: 'New Project',
                    desc: 'Start a new 3D visualization or animation',
                    icon: FolderKanban,
                    action: () => navigate('/estimator'),
                  },
                  {
                    label: 'Schedule Review',
                    desc: 'Book a live scene review with our lead artists',
                    icon: Calendar,
                    action: () => setShowScheduleModal(true),
                  },
                  {
                    label: 'Support & Inquiries',
                    desc: 'Get direct assistance from our operations desk',
                    icon: MessageSquare,
                    action: () => navigate('/support'),
                  },
                ].map((action) => (
                  <button
                    key={action.label}
                    onClick={action.action}
                    className="bg-[#121212] border border-white/5 rounded-2xl p-6 text-left hover:border-primary/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <action.icon className="w-5 h-5 text-white/30 group-hover:text-primary transition-colors" />
                      <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <h3 className="font-display font-bold text-white text-sm mb-1">{action.label}</h3>
                    <p className="text-white/40 text-xs font-sans leading-relaxed">{action.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Review Modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowScheduleModal(false);
          }}
        >
          <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight">Book a Review Call</h3>
                <p className="text-white/40 text-xs font-sans mt-1">Select your preferred date. We'll confirm within 2 hours.</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-white/40 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 font-sans text-left">
              <div>
                <label className="block text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleForm.datetime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, datetime: e.target.value })}
                  className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg px-4 py-3 text-white text-xs focus:border-primary focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/50 uppercase font-bold tracking-wider mb-2">Notes & Objectives (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="What specific angles, scenes, or lighting setups would you like to review?"
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full bg-[#0E0E0E] border border-white/10 rounded-lg px-4 py-3 text-white text-xs placeholder:text-white/20 focus:border-primary focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 py-3 border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs font-bold uppercase tracking-widest transition-all rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-widest transition-all rounded-lg shadow-lg shadow-primary/20"
                >
                  Request Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
