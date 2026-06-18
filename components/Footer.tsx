
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo.tsx';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const links = {
    Services: [
      { label: '3D Rendering', path: '/arcviz' },
      { label: 'Cinematic Animation', path: '/arcviz' },
      { label: 'Interior Design', path: '/arcviz' },
      { label: 'Scale Models', path: '/estimator' },
    ],
    Company: [
      { label: 'About Us', path: '/about' },
      { label: 'Portfolio', path: '/portfolio' },
      { label: 'Insights', path: '/insights' },
      { label: 'Contact', path: '/contact' },
    ],
    Portal: [
      { label: 'Client Login', path: '/auth' },
      { label: 'Get Estimate', path: '/estimator' },
      { label: 'ArcViz AI', path: '/arcviz' },
      { label: 'Support', path: '/support' },
    ],
  };

  return (
    <footer className="bg-canvas-dark text-white border-t border-white/5">
      <div className="content-max px-6 md:px-10 lg:px-16 py-16 md:py-20">
        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16 pb-12 border-b border-white/10">
          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <Logo className="h-10" variant="light" />
              <div className="leading-none">
                <p className="text-sm font-semibold text-white">Figment Studio</p>
                <p className="text-2xs text-primary" style={{ letterSpacing: '0.14em' }}>CREATIVE STUDIO</p>
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs">
              Nigeria's leading architectural visualization house. Cinematic renders, AI-guided design, and private delivery for world-class projects.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: 'photo_camera', label: 'Instagram', href: 'https://instagram.com' },
                { icon: 'work', label: 'LinkedIn', href: 'https://linkedin.com' },
                { icon: 'brush', label: 'Behance', href: 'https://behance.net' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="space-y-5">
              <p className="label-xs text-white/40">{section}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm text-white/55 hover:text-white hover-underline transition-colors duration-200"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {year} Figment Studio Ltd. Abuja, Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span className="hover:text-white/60 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white/60 cursor-pointer transition-colors">Terms of Service</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow"></span>
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
