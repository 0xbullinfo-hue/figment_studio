
import React from 'react';
import { IMAGES } from '../constants.ts';

interface HeroProps {
  onOpenVision: () => void;
  onStartProject: () => void;
  onOpenArcViz: () => void;
}

const STATS = [
  { value: '200+', label: 'Projects Delivered' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '4K+', label: 'Render Resolution' },
  { value: '10 yrs', label: 'Studio Experience' },
];

const Hero: React.FC<HeroProps> = ({ onOpenVision, onStartProject, onOpenArcViz }) => {
  return (
    <section className="relative w-full overflow-hidden bg-background" id="hero">
      <div className="px-6 md:px-10 lg:px-16 pt-6 pb-10 md:pb-14">
        {/* Main hero card */}
        <div
          className="relative w-full rounded-3xl overflow-hidden border border-border-ui bg-cover bg-center"
          style={{
            backgroundImage: `url("${IMAGES.hero}")`,
            minHeight: 'clamp(520px, 65vh, 780px)',
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(110deg, rgba(15,13,11,0.88) 0%, rgba(15,13,11,0.65) 45%, rgba(15,13,11,0.10) 100%)'
          }} />

          {/* Noise texture overlay for depth */}
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
              backgroundSize: '200px 200px' }}
          />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-12 lg:p-16">
            <div className="flex items-start justify-between">
              {/* Location pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-2xs font-semibold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-slow" />
                Abuja, Nigeria
              </div>
              {/* AI pill */}
              <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary text-2xs font-semibold tracking-wide">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                AI-Powered Visualization
              </div>
            </div>

            {/* Headline */}
            <div className="max-w-3xl space-y-7 mt-auto">
              <div className="space-y-3">
                <p className="label-sm text-primary/90" style={{ letterSpacing: '0.18em' }}>Premium Architectural Visualization</p>
                <h1 className="font-display font-light text-white leading-[1.05]"
                  style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
                  We Make Blueprints<br />
                  <em className="not-italic text-transparent"
                    style={{ WebkitTextStroke: '1.5px rgba(240,122,58,0.8)' }}>Breathe.</em>
                </h1>
                <p className="text-white/60 text-base md:text-lg max-w-xl leading-relaxed font-light">
                  Cinematic 3D renders, AI-guided scene planning, and private delivery workflows — built for discerning architects and developers.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  onClick={onStartProject}
                  id="hero-start-project"
                  className="btn-primary shadow-lg shadow-primary/25 text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                  Start a Project
                </button>
                <button
                  onClick={onOpenArcViz}
                  id="hero-arcviz"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all duration-200"
                >
                  <span className="material-symbols-outlined text-[16px]">camera</span>
                  ArcViz AI
                </button>
                <button
                  onClick={onOpenVision}
                  id="hero-vision"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white/70 border border-white/10 text-sm font-medium hover:border-white/25 hover:text-white transition-all duration-200"
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
              className="card-base flex flex-col items-center justify-center py-5 px-4 text-center gap-1 card-hover"
            >
              <span className="font-display text-2xl font-semibold text-primary">{stat.value}</span>
              <span className="label-xs text-text-faint">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
