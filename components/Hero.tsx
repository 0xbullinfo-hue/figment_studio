
import React from 'react';
import { IMAGES } from '../constants.ts';

interface HeroProps {
  onOpenVision: () => void;
  onStartProject: () => void;
  onOpenArcViz: () => void;
}

const STATS = [
  { value: '200+', label: 'Projects Delivered' },
  { value: '98%',  label: 'Client Satisfaction' },
  { value: '4K+',  label: 'Render Resolution' },
  { value: '10 yrs', label: 'Studio Experience' },
];

const Hero: React.FC<HeroProps> = ({ onOpenVision, onStartProject, onOpenArcViz }) => {
  return (
    <section className="relative w-full overflow-hidden bg-background" id="hero">
      <div className="px-6 md:px-10 lg:px-16 pt-6 pb-10">

        {/* Main hero card */}
        <div
          className="relative w-full rounded-3xl overflow-hidden border border-border-ui bg-cover bg-center"
          style={{
            backgroundImage: `url("${IMAGES.hero}")`,
            minHeight: 'clamp(540px, 68vh, 820px)',
          }}
        >
          {/* Deep dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(115deg, rgba(10,8,5,0.96) 0%, rgba(10,8,5,0.78) 42%, rgba(10,8,5,0.15) 100%)',
            }}
          />

          {/* Subtle orange glow at top-left */}
          <div
            className="absolute -top-20 -left-20 w-[500px] h-[400px] opacity-30 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(240,122,58,0.35) 0%, transparent 65%)',
              filter: 'blur(50px)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">

            {/* Top badges */}
            <div className="flex items-start justify-between">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-2xs font-semibold tracking-widest uppercase"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(242,237,230,0.7)',
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#F07A3A', animation: 'pulse 3s ease-in-out infinite' }}
                />
                Abuja, Nigeria
              </div>
              <div
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-2xs font-semibold tracking-wide"
                style={{
                  background: 'rgba(240,122,58,0.12)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(240,122,58,0.25)',
                  color: '#F07A3A',
                }}
              >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                AI-Powered Visualization
              </div>
            </div>

            {/* Headline block */}
            <div className="max-w-3xl space-y-7 mt-auto">
              <div className="space-y-4">
                <p className="label-sm" style={{ color: 'rgba(240,122,58,0.8)', letterSpacing: '0.18em' }}>
                  Premium Architectural Visualization
                </p>
                <h1
                  className="font-display font-light text-white"
                  style={{ fontSize: 'clamp(3rem, 7.5vw, 6rem)', lineHeight: 1.04 }}
                >
                  We Make<br />
                  Blueprints{' '}
                  <span className="gradient-text">Breathe.</span>
                </h1>
                <p className="text-base md:text-lg leading-relaxed font-light max-w-xl" style={{ color: 'rgba(242,237,230,0.58)' }}>
                  Cinematic 3D renders, AI-guided scene planning, and private delivery workflows — built for discerning architects and developers.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={onStartProject} id="hero-start-project" className="btn-primary">
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  Start a Project
                </button>
                <button
                  onClick={onOpenArcViz}
                  id="hero-arcviz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#F2EDE6',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
                >
                  <span className="material-symbols-outlined text-[16px]">camera</span>
                  ArcViz AI
                </button>
                <button
                  onClick={onOpenVision}
                  id="hero-vision"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(242,237,230,0.55)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)';
                    e.currentTarget.style.color = '#F2EDE6';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(242,237,230,0.55)';
                  }}
                >
                  <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                  Vision AI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="card-base card-hover flex flex-col items-center justify-center py-5 px-4 text-center gap-1"
            >
              <span className="font-display text-2xl font-semibold text-primary">{stat.value}</span>
              <span className="label-xs">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
