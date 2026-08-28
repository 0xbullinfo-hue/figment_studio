
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';
import { logoutRequest } from '../services/apiClient.ts';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { auth, logout } = useStudioStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await logoutRequest(auth.refreshToken, auth.accessToken);
    logout();
    navigate('/');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navItems: { label: string; path: string; disabled?: boolean }[] = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/#services' },
    { label: 'Works', path: '/works' },
    { label: 'Academy', path: '/academy' },
    { label: 'Contact', path: '/contact' },
  ];

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (!el) {
      return false;
    }
    const headerOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    return true;
  };

  const isActive = (path: string) => {
    if (path === '/works') {
      return currentPath === '/portfolio' || currentPath === '/works' || currentPath.startsWith('/works/');
    }
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
        if (scrollToServices()) {
          return;
        }
      } else {
        navigate('/?scroll=services');
        return;
      }
      return;
    }

    if (item.label === 'Works') {
      navigate('/works');
      return;
    }

    navigate(item.path);
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

          {/* Logo  -  show wordmark + tagline consistently across all pages */}
          <button
            onClick={() => navigate('/')}
            className="flex-shrink-0 group focus:outline-none min-w-0"
            aria-label="Figment Creative Studio Home"
          >
            <Logo
              size={{ sm: 28, md: 32, lg: 38 }}
              showWordmark
              showTagline={false}
            />
          </button>

          {/* Center Nav - desktop */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item) => {
              if (item.disabled) {
                return (
                  <button
                    key={item.label}
                    disabled
                    className="relative flex items-center gap-2 px-4 py-2 text-[12px] tracking-[0.16em] uppercase font-medium text-text-muted/40 cursor-not-allowed"
                  >
                    {item.label}
                  </button>
                );
              }
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
          </nav>

          {/* Right CTA - desktop */}
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
                  onClick={handleSignOut}
                  className="text-[11px] tracking-[0.2em] uppercase border border-border-ui hover:border-primary/40 text-text-muted hover:text-primary transition-all px-4 py-2 font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  disabled
                  className="text-[11px] tracking-[0.2em] uppercase text-text-muted/40 cursor-not-allowed font-medium"
                >
                  Client (soon)
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
              if (item.disabled) {
                return (
                  <button
                    key={item.label}
                    disabled
                    className="w-full text-left flex items-center justify-between px-3 py-3.5 text-[12px] tracking-[0.2em] uppercase font-medium text-text-muted/40 cursor-not-allowed border-b border-border-ui last:border-none"
                  >
                    {item.label}
                  </button>
                );
              }
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
            <div className="pt-4 mt-2 space-y-2.5">
              {auth.isAuthenticated ? (
                <>
                  <button onClick={() => navigate(auth.role === 'admin' ? '/admin' : '/dashboard')} className="w-full bg-primary text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3">
                    Dashboard
                  </button>
                  <button onClick={handleSignOut} className="w-full border border-border-ui text-text-muted text-[11px] tracking-[0.2em] uppercase font-semibold py-3 hover:border-primary/40 hover:text-primary transition-colors">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button disabled className="w-full border border-border-ui/50 text-text-faint text-[11px] tracking-[0.2em] uppercase font-semibold py-3 cursor-not-allowed">
                    Client (soon)
                  </button>
                  <button onClick={() => { navigate('/estimator'); setMobileOpen(false); }} className="w-full bg-primary text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3">
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


