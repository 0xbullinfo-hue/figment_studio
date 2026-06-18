
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';

interface HeaderProps {
  onOpenVision: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenVision }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { auth, logout } = useStudioStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'ArcViz AI', path: '/arcviz' },
    { label: 'Pricing', path: '/estimator' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-surface/95 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.06)] border-b border-border-ui'
            : 'bg-background/80 backdrop-blur-sm border-b border-transparent'
        }`}
      >
        <div className="content-max px-6 md:px-10 lg:px-16 flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group flex-shrink-0"
            aria-label="Figment Studio Home"
          >
            <Logo className="h-9" />
            <div className="hidden sm:block leading-none">
              <p className="text-sm font-semibold text-text-main tracking-tight group-hover:text-primary transition-colors">
                Figment Studio
              </p>
              <p className="label-xs text-primary" style={{ letterSpacing: '0.14em' }}>
                creative studio
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-light'
                    : 'text-text-secondary hover:text-text-main hover:bg-background-alt'
                }`}
              >
                {item.label}
                {item.label === 'ArcViz AI' && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={onOpenVision}
              className="px-3.5 py-2 rounded-lg text-[13px] font-medium text-text-secondary hover:text-primary hover:bg-primary-light transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
              Vision AI
            </button>
          </nav>

          {/* CTA actions */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="h-5 w-px bg-border-ui mx-1" />
            {auth.isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')}
                  className="btn-ghost text-[13px] flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">dashboard</span>
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-secondary text-[13px] py-2"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="btn-ghost text-[13px]"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/estimator')}
                  className="btn-primary text-[13px] py-2.5 shadow-none"
                >
                  Get Estimate
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-background-alt transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined text-[22px] text-text-main">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col pt-16">
          <div
            className="absolute inset-0 bg-text-main/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-surface border-b border-border-ui shadow-popup p-6 space-y-1.5">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-light'
                    : 'text-text-secondary hover:text-text-main hover:bg-background-alt'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onOpenVision(); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3 rounded-lg text-[15px] font-medium text-primary hover:bg-primary-light transition-all duration-200 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              Vision AI
            </button>
            <div className="pt-3 mt-3 border-t border-border-ui space-y-2">
              {auth.isAuthenticated ? (
                <button
                  onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')}
                  className="btn-primary w-full"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/auth')} className="btn-secondary w-full">
                    Sign In
                  </button>
                  <button onClick={() => navigate('/estimator')} className="btn-primary w-full">
                    Get Estimate
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
