import React from 'react';
import { IMAGES } from '../constants.ts';

interface HeroProps {
  onOpenVision: () => void;
  onStartProject: () => void;
  onOpenArcViz: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenVision, onStartProject, onOpenArcViz }) => {
  return (
    <section className="relative w-full min-h-screen flex flex-col bg-background select-none" id="hero">
      {/* Background image & overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url("${IMAGES.hero}")`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent lg:from-black/90 lg:via-black/75 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-between px-8 md:px-12 lg:px-16 pt-24 pb-16 min-h-[85vh]">
        {/* Top line detail */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-text-secondary font-medium">Abuja, Nigeria</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary font-medium">
            <span className="material-symbols-outlined text-[13px]">auto_awesome</span>
            AI Scene Planning
          </div>
        </div>

        {/* Center Main Text block */}
        <div className="max-w-4xl my-auto space-y-8 text-left">
          <p className="text-primary text-[11px] tracking-[0.3em] uppercase font-bold">
            Figment Studio Abuja
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-light text-white tracking-tighter leading-[0.98]">
            We Make<br />
            Blueprints <span className="text-primary font-normal">Breathe.</span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg font-light leading-relaxed max-w-2xl font-sans">
            Cinematic 3D renders, AI-guided scene planning, and private delivery workflows. Designed for discerning architects and developers.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={onStartProject}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-lg transition-all duration-300 shadow-[0_4px_14px_rgba(240,122,58,0.3)] hover:translate-y-[-2px]"
            >
              Start Project
            </button>
            <button 
              onClick={onOpenArcViz}
              className="border border-white/20 hover:border-primary text-white hover:text-primary text-xs font-bold uppercase tracking-[0.2em] px-8 py-4 rounded-lg bg-black/40 backdrop-blur-md transition-all duration-300 hover:translate-y-[-2px]"
            >
              ArcViz AI
            </button>
          </div>
        </div>

        {/* Bottom Editorial Bar (Taran Inspired) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-10 border-t border-white/10 mt-auto text-left">
          <div className="space-y-1.5">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-text-muted font-bold font-sans">Office Location</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">Plot 442, Central Business District<br />Abuja, FCT, Nigeria</p>
          </div>
          <div className="space-y-1.5">
            <h4 className="text-[10px] tracking-[0.2em] uppercase text-text-muted font-bold font-sans">Get In Touch</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">
              T. +234 813 900 0000<br />
              E. <a href="mailto:hello@figment.co" className="hover:text-primary transition-colors">hello@figment.co</a>
            </p>
          </div>
          <div className="space-y-1.5 flex items-center">
            {/* Play Intro Video button */}
            <button 
              onClick={onOpenArcViz}
              className="flex items-center gap-4 group focus:outline-none text-left"
            >
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white bg-black/40 group-hover:border-primary group-hover:bg-primary/20 transition-all duration-300">
                <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">play_arrow</span>
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.2em] uppercase text-white font-bold group-hover:text-primary transition-colors font-sans">Play Intro Film</h4>
                <p className="text-[10px] text-text-muted font-sans font-medium">Look How We Work</p>
              </div>
            </button>
          </div>
          <div className="hidden lg:flex items-center justify-end">
            {/* Scroll Down */}
            <a href="#services" className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-text-muted hover:text-primary transition-colors">
              <span>Scroll Down</span>
              <span className="material-symbols-outlined animate-bounce">arrow_downward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
