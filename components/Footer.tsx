
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
    Client: [
      { label: 'Client Login', path: '/auth' },
      { label: 'Get Estimate', path: '/estimator' },
      { label: 'ArcViz AI', path: '/arcviz' },
      { label: 'Support', path: '/support' },
    ],
  };

  return (
    <footer style={{ background: '#060402', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="px-8 md:px-14 lg:px-20 max-w-[1600px] mx-auto">

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 py-20" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

          {/* Brand */}
          <div className="lg:col-span-4 space-y-8">
            <Logo showWordmark size={32} color="#F07A3A" />
            <p className="text-sm leading-relaxed max-w-xs font-sans" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Nigeria's leading architectural visualization house. Cinematic renders, AI-guided design, and private delivery for world-class projects.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <div>
                <p className="text-[9px] tracking-[0.22em] uppercase font-semibold font-sans mb-1" style={{ color: 'rgba(255,255,255,0.18)' }}>Location</p>
                <p className="text-xs font-sans" style={{ color: 'rgba(255,255,255,0.35)' }}>Plot 442, Central Business District<br />Abuja, FCT, Nigeria</p>
              </div>
              <div>
                <p className="text-[9px] tracking-[0.22em] uppercase font-semibold font-sans mb-1" style={{ color: 'rgba(255,255,255,0.18)' }}>Contact</p>
                <p className="text-xs font-sans" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  T. +234 813 900 0000<br />
                  <a href="mailto:hello@figment.co" className="hover:text-[#F07A3A] transition-colors">hello@figment.co</a>
                </p>
              </div>
            </div>

            {/* Socials */}
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
                  className="w-9 h-9 flex items-center justify-center transition-all duration-300 group"
                  style={{ border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.25)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = '#F07A3A';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,122,58,0.35)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(240,122,58,0.06)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)';
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
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-10">
            {Object.entries(links).map(([section, items]) => (
              <div key={section} className="space-y-6">
                <p className="text-[9px] tracking-[0.25em] uppercase font-semibold font-sans" style={{ color: 'rgba(255,255,255,0.18)' }}>
                  {section}
                </p>
                <ul className="space-y-3.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <button
                        onClick={() => navigate(item.path)}
                        className="text-sm font-sans transition-colors duration-200"
                        style={{ color: 'rgba(255,255,255,0.35)' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
                        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* CTA strip */}
        <div className="py-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-display font-light text-white text-xl md:text-2xl">
              Ready to start your next project?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/contact')}
                className="text-[10px] tracking-[0.2em] uppercase bg-primary hover:bg-primary-hover text-white px-8 py-3 font-bold font-sans transition-all duration-300 hover:shadow-[0_4px_14px_rgba(240,122,58,0.3)]"
              >
                Contact Studio
              </button>
              <button
                onClick={() => navigate('/estimator')}
                className="text-[10px] tracking-[0.2em] uppercase border font-bold font-sans px-8 py-3 transition-all duration-300"
                style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.45)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.3)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
                }}
              >
                Get Estimate
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-sans" style={{ color: 'rgba(255,255,255,0.18)' }}>
            © {year} Figment Studio Ltd. Abuja, Nigeria. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs font-sans" style={{ color: 'rgba(255,255,255,0.18)' }}>
            <span className="cursor-pointer hover:text-white/50 transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-white/50 transition-colors">Terms of Service</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
