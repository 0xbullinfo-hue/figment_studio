import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStudioStore } from '../store.ts';
import Logo from './Logo.tsx';
import {
  LayoutDashboard,
  Receipt,
  FolderOpen,
  HelpCircle,
  LogOut,
  Bell,
  Menu,
  X,
  Calculator,
} from 'lucide-react';

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'estimate', label: 'New Estimate', path: '/estimate', icon: Calculator },
  { id: 'billing', label: 'Invoices', path: '/billing', icon: Receipt },
  { id: 'assets', label: 'Assets', path: '/assets', icon: FolderOpen },
  { id: 'support', label: 'Support', path: '/support', icon: HelpCircle },
];

const DashboardShell: React.FC<DashboardShellProps> = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useStudioStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const clientName = auth.name || 'Client';
  const clientInitials = clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'CU';

  const activePath = location.pathname;
  const activeTab = navItems.find((n) => activePath.startsWith(n.path))?.id || 'dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-[#0E0E0E] overflow-hidden font-sans text-left relative text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#121212] border-r border-white/5 flex-col justify-between p-8 shrink-0">
        <div className="space-y-10">
          <button onClick={() => navigate('/')} className="hover:opacity-80 transition-opacity focus:outline-none">
            <Logo size={36} showWordmark showTagline={false} textColor="#FFFFFF" />
          </button>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-2 border-primary'
                      : 'text-white/50 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

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
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
            {clientInitials}
          </div>
          <div className="truncate min-w-0">
            <p className="text-xs font-bold uppercase truncate text-white">{clientName}</p>
            <p className="text-[10px] text-white/40 uppercase font-medium">Edit Profile</p>
          </div>
        </button>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#121212] border-r border-white/5 p-8 flex flex-col justify-between">
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <Logo size={32} showWordmark showTagline={false} textColor="#FFFFFF" />
                <button onClick={() => setMobileOpen(false)} className="text-white/40 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        navigate(item.path);
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all text-left ${
                        isActive
                          ? 'bg-primary/10 text-primary border-l-2 border-primary'
                          : 'text-white/50 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
                <div className="h-px bg-white/5 my-4" />
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Portal Exit
                </button>
              </nav>
            </div>
            <button onClick={() => navigate('/profile')} className="pt-6 border-t border-white/5 flex items-center gap-3 group text-left">
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                {clientInitials}
              </div>
              <div className="truncate min-w-0">
                <p className="text-xs font-bold uppercase truncate text-white">{clientName}</p>
                <p className="text-[10px] text-white/40 uppercase font-medium">Edit Profile</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0A0A0A] relative">
        {/* Header */}
        <header className="h-16 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 px-6 md:px-10 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-white/50 hover:text-white transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/')} className="md:hidden hover:opacity-80 transition-opacity">
              <Logo size={28} iconOnly textColor="#FFFFFF" />
            </button>
            <div className="hidden md:block">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-white/40">
                Client Portal {title ? `/ ${title}` : ''}
              </h2>
              {subtitle && <p className="text-[10px] text-white/30 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="size-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-primary transition-colors relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>
            <button
              onClick={() => navigate('/estimate')}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              + New Estimate
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardShell;
