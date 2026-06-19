
import React, { useState, useEffect, useCallback } from 'react';

interface HeroProps {
  onStartProject: () => void;
  onOpenArcViz: () => void;
}

const SLIDES = [
  {
    id: 0,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=90&w=2400&auto=format&fit=crop',
    category: 'Residential',
    location: 'Maitama, Abuja',
    headline: ['We Make', 'Blueprints', 'Breathe.'],
    accent: 2, // index of accented word
    sub: 'Cinematic 3D renders and AI-guided design for discerning architects.',
  },
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=90&w=2400&auto=format&fit=crop',
    category: 'Commercial',
    location: 'Wuse II, Abuja',
    headline: ['Vision', 'Made', 'Tangible.'],
    accent: 2,
    sub: 'From concept sketch to photorealistic render — precision without compromise.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=90&w=2400&auto=format&fit=crop',
    category: 'Interior Design',
    location: 'Asokoro, Abuja',
    headline: ['Space', 'Becomes', 'Story.'],
    accent: 2,
    sub: 'Tactile material accuracy and mood-specific lighting — crafted for impact.',
  },
];

const Hero: React.FC<HeroProps> = ({ onStartProject, onOpenArcViz }) => {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);

  const INTERVAL = 6000;

  const goTo = useCallback((idx: number) => {
    if (transitioning || idx === current) return;
    setTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrent(idx);
      setTransitioning(false);
    }, 600);
  }, [current, transitioning]);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length);
  }, [current, goTo]);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  // Progress bar
  useEffect(() => {
    setProgress(0);
    const startTime = Date.now();
    const raf = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
      if (elapsed < INTERVAL) requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(raf);
  }, [current]);

  const slide = SLIDES[current];

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[1100px] overflow-hidden select-none" id="hero">

      {/* Slide Images */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-[900ms] ease-in-out"
          style={{ opacity: i === current && !transitioning ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          <img
            src={s.image}
            alt={s.headline.join(' ')}
            className="w-full h-full object-cover object-center"
            style={{ transform: 'scale(1.06)', transition: 'transform 8s ease-out', ...(i === current ? { transform: 'scale(1)' } : {}) }}
          />
        </div>
      ))}

      {/* Dark overlays */}
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.22) 100%)' }} />
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 42%)' }} />
      <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 20%)' }} />

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col justify-between px-8 md:px-14 lg:px-20 py-10 max-w-[1600px] mx-auto w-full">

        {/* Top bar */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] tracking-[0.28em] uppercase text-white/60 font-medium">
              {slide.category} · {slide.location}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3 text-[10px] tracking-[0.22em] uppercase text-primary/80 font-medium">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            AI Scene Planning
          </div>
        </div>

        {/* Main headline */}
        <div
          className="space-y-6 text-left max-w-3xl"
          style={{ transition: 'opacity 0.5s ease', opacity: transitioning ? 0 : 1 }}
        >
          <h1 className="font-display font-light text-white leading-[0.95] tracking-[-0.025em]"
            style={{ fontSize: 'clamp(3.8rem, 9vw, 9rem)' }}>
            {slide.headline.map((word, wi) => (
              <span key={wi} className={wi === slide.accent ? 'text-primary' : ''}>
                {word}{wi < slide.headline.length - 1 ? <br /> : ''}
              </span>
            ))}
          </h1>
          <p className="text-white/55 text-base md:text-lg font-light leading-relaxed max-w-lg font-sans">
            {slide.sub}
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={onStartProject}
              className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 transition-all duration-300 shadow-[0_4px_20px_rgba(240,122,58,0.3)] hover:shadow-[0_4px_28px_rgba(240,122,58,0.45)] hover:translate-y-[-2px] focus:outline-none"
            >
              Start Project
            </button>
            <button
              onClick={onOpenArcViz}
              className="border border-white/20 hover:border-primary text-white hover:text-primary text-[11px] font-bold uppercase tracking-[0.2em] px-8 py-4 bg-black/30 backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px] focus:outline-none"
            >
              ArcViz AI
            </button>
          </div>
          {/* Progress + slide controls aligned under the buttons */}
          <div className="flex items-center gap-4 pt-4">
            {SLIDES.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className="group relative h-[2px] transition-all duration-300 focus:outline-none"
                style={{ width: i === current ? '4rem' : '1.5rem' }}
                aria-label={`Slide ${i + 1}`}
              >
                <span className="absolute inset-0 bg-white/20" />
                {i === current && (
                  <span
                    className="absolute inset-y-0 left-0 bg-primary transition-none"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </button>
            ))}
            <span className="text-[10px] text-white/30 tracking-widest ml-1 font-mono">
              {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="space-y-6">

          {/* Info bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/[0.08] pt-6">
            <div className="space-y-1.5">
              <h4 className="text-[10px] tracking-[0.22em] uppercase text-white/35 font-bold font-sans">Studio</h4>
              <p className="text-xs text-white/60 leading-relaxed font-sans">Plot 442, Central Business District<br />Abuja, FCT, Nigeria</p>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[10px] tracking-[0.22em] uppercase text-white/35 font-bold font-sans">Contact</h4>
              <p className="text-xs text-white/60 leading-relaxed font-sans">
                T. +234 813 900 0000<br />
                <a href="mailto:hello@figment.co" className="hover:text-primary transition-colors">hello@figment.co</a>
              </p>
            </div>
            <div className="space-y-1.5 flex items-center">
              <button
                onClick={onOpenArcViz}
                className="flex items-center gap-4 group focus:outline-none"
              >
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/40 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300">
                  <span className="material-symbols-outlined text-lg">play_arrow</span>
                </div>
                <div>
                  <h4 className="text-[10px] tracking-[0.22em] uppercase text-white/60 font-bold group-hover:text-primary transition-colors font-sans">Play Intro Film</h4>
                  <p className="text-[10px] text-white/30 font-sans font-medium">Look How We Work</p>
                </div>
              </button>
            </div>
            <div className="hidden md:flex items-center justify-end">
              <a href="#services" className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-white/35 hover:text-primary transition-colors">
                <span>Scroll Down</span>
                <span className="material-symbols-outlined animate-bounce text-base">arrow_downward</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
