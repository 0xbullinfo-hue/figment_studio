
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
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'ArcViz AI', path: '/arcviz', live: true },
    { label: 'Pricing', path: '/estimator' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <header
        className={`lg:hidden sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border-ui shadow-[0_1px_0_rgba(255,255,255,0.03)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="content-max px-6 md:px-10 lg:px-16 flex items-center justify-between h-[68px]">

          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 group"
            aria-label="Figment Studio Home"
          >
            <Logo className="w-8 h-8" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-light'
                    : 'text-text-muted hover:text-text-main hover:bg-surface'
                }`}
              >
                {item.label}
                {item.live && (
                  <span className="flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-primary opacity-60" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                  </span>
                )}
              </button>
            ))}

            <button
              onClick={onOpenVision}
              className="px-3.5 py-2 rounded-lg text-[13.5px] font-medium text-text-muted hover:text-primary hover:bg-primary-light transition-all duration-200 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              Vision AI
            </button>
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="h-4 w-px bg-border-ui mx-1" />
            {auth.isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')}
                  className="btn-ghost text-[13px]"
                >
                  <span className="material-symbols-outlined text-[15px]">dashboard</span>
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn-secondary text-[13px] py-2 px-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/auth')} className="btn-ghost text-[13px]">
                  Sign In
                </button>
                <button onClick={() => navigate('/estimator')} className="btn-primary text-[13px] py-2.5 px-5">
                  Get Estimate
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-surface transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined text-[22px] text-text-muted">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex flex-col pt-[68px]">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-surface border-b border-border-ui shadow-popup p-5 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'text-primary bg-primary-light'
                    : 'text-text-secondary hover:text-text-main hover:bg-surface-alt'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onOpenVision(); setMobileOpen(false); }}
              className="w-full text-left px-4 py-3.5 rounded-xl text-[15px] font-medium text-primary hover:bg-primary-light transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[17px]">auto_awesome</span>
              Vision AI
            </button>
            <div className="pt-3 mt-2 border-t border-border-ui space-y-2">
              {auth.isAuthenticated ? (
                <button onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')} className="btn-primary w-full">
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/auth')} className="btn-secondary w-full">Sign In</button>
                  <button onClick={() => navigate('/estimator')} className="btn-primary w-full">Get Estimate</button>
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
