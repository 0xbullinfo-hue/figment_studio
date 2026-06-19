
import React from 'react';

const Studio: React.FC = () => {
  return (
    <section className="relative px-8 md:px-14 lg:px-20 py-28 bg-[#0E0E0E] border-t border-border-ui overflow-hidden" id="studio">
      {/* Decorative diagonal line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-border-ui hidden lg:block" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-[1600px] mx-auto">
        <div className="space-y-10 text-left">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans">Our Studio</p>
            <h2
              className="font-display font-light text-white leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: 1.06 }}
            >
              Rooted in Abuja,<br />
              <em className="font-light not-italic" style={{ color: 'rgba(255,255,255,0.28)' }}>Serving the World.</em>
            </h2>
          </div>
          <p className="text-white/45 text-base leading-relaxed max-w-xl font-sans">
            From our studio in the heart of Nigeria's capital, Figment Studio captures the essence of modern African architecture and international contemporary design. We leverage the unique light and landscape of Abuja to bring an authentic perspective to every project.
          </p>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 border border-primary/20 bg-primary/8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-2xl">map</span>
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm uppercase tracking-wider font-sans">Central Business District</h4>
              <p className="text-white/35 text-sm font-sans mt-0.5">Abuja, FCT, Nigeria</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -top-4 -right-4 w-full h-full border border-border-ui -z-10 group-hover:-top-6 group-hover:-right-6 transition-all duration-500 hidden lg:block" />
          <img
            alt="Modern Abuja Architecture"
            className="relative z-10 w-full h-[480px] object-cover border border-border-ui"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          />
          <div className="absolute bottom-0 right-0 z-20 p-6 bg-background/90 backdrop-blur-sm border-l border-t border-border-ui">
            <p className="text-[9px] tracking-[0.22em] uppercase text-primary/70 font-sans font-semibold">Est.</p>
            <p className="font-display font-light text-white text-2xl leading-none">2016</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Studio;
