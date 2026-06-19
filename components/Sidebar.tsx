import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';

interface SidebarProps {
  onOpenVision: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onOpenVision }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, logout } = useStudioStore();

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'ArcViz AI', path: '/arcviz', live: true },
    { label: 'Estimates', path: '/estimator' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[#0E0E0E] border-r border-border-ui py-10 px-8 justify-between z-40 select-none">
      
      {/* Brand Top */}
      <div className="space-y-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 group focus:outline-none text-left"
          aria-label="Figment Studio Logo"
        >
          <Logo showWordmark showTagline size={32} />
        </button>

        <div className="h-px bg-border-ui w-full" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-5 py-4">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex items-center justify-between py-2.5 transition-all duration-300 group focus:outline-none text-left`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`text-[12px] tracking-[0.2em] uppercase transition-all duration-300 ${
                    active ? 'text-primary font-medium' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                >
                  {item.label}
                </span>
                {item.live && (
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                )}
              </div>

              {/* Editorial Circle Indicator */}
              <div className="flex items-center gap-3">
                {active && <span className="text-[10px] text-primary/40 font-mono">|</span>}
                <div
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all duration-500 ${
                    active
                      ? 'border-primary bg-primary/20 scale-110 shadow-[0_0_8px_rgba(240,122,58,0.2)]'
                      : 'border-text-faint group-hover:border-text-muted bg-transparent'
                  }`}
                >
                  {active && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
              </div>
            </button>
          );
        })}

        {/* Vision AI Trigger */}
        <button
          onClick={onOpenVision}
          className="flex items-center justify-between py-2.5 text-text-muted hover:text-primary transition-all duration-300 group focus:outline-none"
        >
          <span className="text-[12px] tracking-[0.2em] uppercase flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
            Vision AI
          </span>
          <div className="w-3.5 h-3.5 rounded-full border border-text-faint group-hover:border-primary/50 transition-all duration-300" />
        </button>
      </nav>

      {/* Portal Shortcut & Client Auth (Bottom) */}
      <div className="space-y-6">
        <div className="h-px bg-border-ui w-full" />

        <div className="space-y-2">
          {auth.isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')}
                className="w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase border border-border-ui hover:border-primary/30 hover:bg-primary-light text-text-secondary transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="w-full py-2 text-xs font-medium text-text-muted hover:text-primary transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate('/auth')}
                className="w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase border border-border-ui hover:border-primary/30 hover:bg-primary-light text-text-secondary transition-all"
              >
                Client Portal
              </button>
              <button
                onClick={() => navigate('/estimator')}
                className="w-full py-2.5 rounded-lg text-xs font-semibold tracking-wider uppercase bg-primary hover:bg-primary-hover text-white transition-all text-center"
              >
                Get Estimate
              </button>
            </div>
          )}
        </div>

        <p className="text-[10px] text-text-faint tracking-wide text-left">
          © Figment Studio Ltd.<br />Abuja, Nigeria.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
