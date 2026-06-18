
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
    <footer
      className="border-t"
      style={{
        background: '#060402',
        borderColor: 'rgba(255,255,255,0.04)',
      }}
    >
      <div className="content-max px-6 md:px-10 lg:px-16 py-16 md:py-20">

        {/* Top row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 md:gap-16 pb-12"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>

          {/* Brand column */}
          <div className="lg:col-span-2 space-y-6">
            <Logo className="w-9 h-9" />
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(242,237,230,0.4)' }}>
              Nigeria's leading architectural visualization house. Cinematic renders, AI-guided design, and private delivery for world-class projects.
            </p>
            <div className="flex items-center gap-3">
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
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.07)',
                    color: 'rgba(255,255,255,0.28)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#F07A3A';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,122,58,0.3)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(240,122,58,0.06)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.28)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                    (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section} className="space-y-5">
              <p className="label-xs" style={{ color: 'rgba(255,255,255,0.22)' }}>{section}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => navigate(item.path)}
                      className="text-sm hover-underline transition-colors duration-200"
                      style={{ color: 'rgba(242,237,230,0.38)' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(242,237,230,0.75)')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(242,237,230,0.38)')}
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
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            © {year} Figment Studio Ltd. Abuja, Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
            <span
              className="cursor-pointer transition-colors duration-200"
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}
            >
              Privacy Policy
            </span>
            <span
              className="cursor-pointer transition-colors duration-200"
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.2)')}
            >
              Terms of Service
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
