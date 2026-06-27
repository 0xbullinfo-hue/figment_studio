
import React, { useState } from 'react';

const SERVICES = [
  {
    id: '01',
    title: '3D Architectural Rendering',
    short: '3D Rendering',
    description: 'High-fidelity photo-real stills at 4K+ resolution for marketing campaigns, investor decks, and stakeholder presentations. Every pixel tuned for maximum impact.',
    image: '/figment_media/3D-Rendering-Abuja 2.png',
    tags: ['Still Image', '4K+', 'Marketing'],
  },
  {
    id: '02',
    title: 'Cinematic Animation',
    short: 'Animation',
    description: 'Immersive architectural walkthroughs and fly-through films with cinematic lighting, camera choreography, and spatial audio design.',
    image: '/figment_media/3D-Apartment-Rendering-Lagos-state 2.png',
    tags: ['Film', 'Fly-Through', 'Sound'],
  },
  {
    id: '03',
    title: 'Interior Design Visualization',
    short: 'Interiors',
    description: 'Detailed interior styling and spatial planning rendered with tactile material accuracy, mood-specific lighting, and furniture placement precision.',
    image: '/figment_media/3D-Rendering-B2B-Abuja.png',
    tags: ['Materials', 'Lighting', 'Spatial'],
  },
  {
    id: '04',
    title: '3D Scale Models & Printing',
    short: 'Scale Models',
    description: 'Physical scale models with micro-detail precision — ideal for urban master-planning, property launch events, and client showrooms.',
    image: '/figment_media/3D-Printing.png',
    tags: ['Physical', 'Master-Planning', 'Events'],
  },
];

const Services: React.FC = () => {
  const [active, setActive] = useState(0);
  const svc = SERVICES[active];

  return (
    <section className="bg-[#0E0E0E]" id="services">

      {/* ── Section Header ── */}
      <div className="px-8 md:px-14 lg:px-20 pt-24 pb-16 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans">Our Expertise</p>
            <h2 className="font-display font-light text-white leading-tight" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.5rem)', lineHeight: 1.05 }}>
              Tailored Visualization<br />
              <em className="font-light not-italic" style={{ color: 'rgba(255,255,255,0.3)' }}>for Every Scale</em>
            </h2>
          </div>
          <p className="max-w-sm text-white/45 leading-relaxed text-sm font-sans md:text-right">
            We combine technical precision with artistic flair to produce results that captivate decision-makers and close deals.
          </p>
        </div>
      </div>

      {/* ── Interactive Service Viewer ── */}
      <div className="px-8 md:px-14 lg:px-20 pb-24 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border-ui overflow-hidden">

          {/* Left: Tab list */}
          <div className="flex flex-col border-r border-border-ui">
            {SERVICES.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(i)}
                  className={`group relative flex items-start gap-6 px-8 py-8 text-left transition-all duration-300 border-b border-border-ui last:border-none focus:outline-none ${
                    isActive ? 'bg-surface' : 'hover:bg-surface/50'
                  }`}
                >
                  {/* Active indicator line */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300 ${
                      isActive ? 'bg-primary' : 'bg-transparent'
                    }`}
                  />

                  <span
                    className={`font-display font-light text-3xl leading-none flex-shrink-0 pt-1 transition-colors duration-300 ${
                      isActive ? 'text-primary/50' : 'text-white/10 group-hover:text-white/20'
                    }`}
                  >
                    {s.id}
                  </span>

                  <div className="flex-1 space-y-2">
                    <h3
                      className={`text-sm font-semibold tracking-wide font-sans transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-white/50 group-hover:text-white/70'
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed font-sans transition-all duration-300 ${
                        isActive ? 'text-white/50 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      {s.description}
                    </p>
                    {isActive && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {s.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] tracking-[0.15em] uppercase border border-primary/25 text-primary/70 px-3 py-1 font-sans font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <span
                    className={`material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5 transition-all duration-300 ${
                      isActive ? 'text-primary rotate-45' : 'text-white/20 rotate-0 group-hover:text-white/40'
                    }`}
                  >
                    add
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Image panel */}
          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden bg-surface min-h-[320px]">
            {SERVICES.map((s, i) => (
              <img
                key={s.id}
                src={s.image}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans mb-2">
                {svc.short}
              </p>
              <h3 className="font-display font-light text-white text-2xl leading-tight">{svc.title}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-t border-border-ui">
        <div className="px-8 md:px-14 lg:px-20 py-12 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: '200+', label: 'Projects Delivered' },
              { num: '8+', label: 'Years of Excellence' },
              { num: '4K', label: 'Max Render Resolution' },
              { num: '98%', label: 'Client Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2 text-left">
                <p className="font-display font-light text-white" style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', lineHeight: 1 }}>
                  {stat.num}
                </p>
                <p className="text-[11px] tracking-[0.18em] uppercase text-white/35 font-sans font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
