
import React, { useState, useEffect, useRef } from 'react';
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
  const [aiDropdownOpen, setAiDropdownOpen] = useState(false);
  const aiDropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (aiDropdownTimer.current) clearTimeout(aiDropdownTimer.current);
    };
  }, []);

  const handleAiDropdownEnter = () => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    if (aiDropdownTimer.current) {
      clearTimeout(aiDropdownTimer.current);
      aiDropdownTimer.current = null;
    }
    setAiDropdownOpen(true);
  };

  const handleAiDropdownLeave = () => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    aiDropdownTimer.current = setTimeout(() => {
      setAiDropdownOpen(false);
    }, 350); // 350ms delay before closing so user has time to move to the dropdown
  };

  const handleAiToolsClick = (e: React.MouseEvent) => {
    if (window.matchMedia('(hover: hover)').matches) {
      e.preventDefault();
      return;
    }
    setAiDropdownOpen((v) => !v);
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/#services' },
    { label: 'Works', path: '/portfolio' },
    { label: 'Academy', path: '/academy' },
    { label: 'Estimates', path: '/estimator' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path.includes('#')) {
      return currentPath === path.split('#')[0] && window.location.hash === '#' + path.split('#')[1];
    }
    return currentPath === path || (path !== '/' && currentPath.startsWith(path));
  };

  const handleNavClick = (item: { label: string; path: string }, isMobile = false) => {
    if (isMobile) {
      setMobileOpen(false);
    }
    if (item.label === 'Services') {
      if (location.pathname === '/') {
        const el = document.getElementById('services');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        navigate('/?scroll=services');
      }
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-[#0E0E0E]/96 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_1px_24px_rgba(0,0,0,0.6)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-[72px] px-6 md:px-10 lg:px-16 max-w-[1600px] mx-auto">

          {/* Logo — show wordmark + tagline consistently across all pages */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 group focus:outline-none"
            aria-label="Figment Creative Studio Home"
          >
            <Logo
              size={36}
              showWordmark
              showTagline
            />
          </button>

          {/* Center Nav – desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item)}
                  className={`relative flex items-center gap-2 px-4 py-2 text-[12px] tracking-[0.16em] uppercase font-medium transition-all duration-300 focus:outline-none ${
                    active ? 'text-white' : 'text-text-muted hover:text-text-secondary'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                  {/* Active dot indicator (Minnaro style) */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                      active ? 'bg-primary scale-100 opacity-100' : 'bg-transparent scale-0 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
            
            {/* AI Tools Dropdown Menu — with delayed close */}
            <div
              className="relative"
              onMouseEnter={handleAiDropdownEnter}
              onMouseLeave={handleAiDropdownLeave}
            >
              <button
                onClick={handleAiToolsClick}
                className="relative flex items-center gap-1.5 px-4 py-2 text-[12px] tracking-[0.16em] uppercase font-medium text-text-muted hover:text-primary transition-all duration-300 focus:outline-none"
              >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                AI Tools
                <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>keyboard_arrow_down</span>
              </button>
              
              {aiDropdownOpen && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-44 rounded-xl bg-zinc-950 border border-white/5 shadow-2xl p-1.5 flex flex-col gap-0.5 z-50"
                  style={{ animation: 'fadeInDown 0.2s ease-out' }}
                  onMouseEnter={handleAiDropdownEnter}
                  onMouseLeave={handleAiDropdownLeave}
                >
                  <button
                    onClick={() => { onOpenVision(); setAiDropdownOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-[10px] tracking-wider uppercase text-text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-all focus:outline-none font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Vision AI
                  </button>
                  <button
                    onClick={() => { navigate('/arcviz'); setAiDropdownOpen(false); }}
                    className="w-full text-left flex items-center gap-2 px-3 py-2.5 text-[10px] tracking-wider uppercase text-text-muted hover:text-primary hover:bg-white/5 rounded-lg transition-all focus:outline-none font-semibold"
                  >
                    <span className="material-symbols-outlined text-[14px]">travel_explore</span>
                    ArcViz AI
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right CTA – desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {auth.isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')}
                  className="text-[11px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">dashboard</span>
                  Dashboard
                </button>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="text-[11px] tracking-[0.2em] uppercase border border-border-ui hover:border-primary/40 text-text-muted hover:text-primary transition-all px-4 py-2 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/auth')}
                  className="text-[11px] tracking-[0.2em] uppercase text-text-muted hover:text-text-secondary transition-colors font-medium"
                >
                  Client Portal
                </button>
                <button
                  onClick={() => navigate('/estimator')}
                  className="text-[11px] tracking-[0.2em] uppercase bg-primary hover:bg-primary-hover text-white px-5 py-2.5 font-semibold transition-all duration-300 hover:shadow-[0_4px_14px_rgba(240,122,58,0.3)]"
                >
                  Get Estimate
                </button>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden flex items-center justify-center w-9 h-9 text-text-muted hover:text-white transition-colors focus:outline-none"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 pt-[72px]">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative bg-[#0E0E0E] border-b border-border-ui shadow-2xl p-6 space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item, true)}
                  className={`w-full text-left flex items-center justify-between px-3 py-3.5 text-[12px] tracking-[0.2em] uppercase font-medium transition-all duration-200 border-b border-border-ui last:border-none ${
                    active ? 'text-primary' : 'text-text-muted hover:text-white'
                  }`}
                >
                  {item.label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              );
            })}
            
            {/* Mobile AI Tools Sub-menu */}
            <div className="border-t border-border-ui/50 pt-2 mt-2 text-left">
              <p className="px-3 py-1 text-[9px] tracking-[0.25em] uppercase text-text-faint font-bold font-sans">AI Tools</p>
              <div className="pl-3 space-y-0.5 mt-1">
                <button
                  onClick={() => { onOpenVision(); setMobileOpen(false); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-3 text-[12px] tracking-[0.2em] uppercase font-medium text-text-muted hover:text-white transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span>
                  Vision AI
                </button>
                <button
                  onClick={() => { navigate('/arcviz'); setMobileOpen(false); }}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-3 text-[12px] tracking-[0.2em] uppercase font-medium text-text-muted hover:text-white transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary">travel_explore</span>
                  ArcViz AI
                </button>
              </div>
            </div>
            <div className="pt-4 mt-2 space-y-2.5">
              {auth.isAuthenticated ? (
                <button onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')} className="w-full bg-primary text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3">
                  Dashboard
                </button>
              ) : (
                <>
                  <button onClick={() => navigate('/auth')} className="w-full border border-border-ui text-text-secondary text-[11px] tracking-[0.2em] uppercase font-semibold py-3">
                    Client Portal
                  </button>
                  <button onClick={() => navigate('/estimator')} className="w-full bg-primary text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3">
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
