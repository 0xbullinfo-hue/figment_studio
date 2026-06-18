
import React from 'react';

const Studio: React.FC = () => {
  return (
    <section className="relative px-6 md:px-10 lg:px-40 py-32 bg-gray-50 overflow-hidden" id="studio">
      <div className="absolute inset-0 abuja-map-overlay"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-10">
          <div className="space-y-4">
            <span className="text-primary font-bold uppercase tracking-[0.25em] text-xs">Our Studio</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tighter text-text-main">Rooted in Abuja, <br />Serving the World.</h2>
          </div>
          <p className="text-text-muted text-lg leading-relaxed max-w-xl">
            From our studio in the heart of Nigeria's capital, Figment Studio captures the essence of modern African architecture and international contemporary design. We leverage the unique light and landscape of Abuja to bring an authentic perspective to every project.
          </p>
          <div className="flex items-center gap-5 group">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-primary transition-all">
              <span className="material-symbols-outlined text-3xl">map</span>
            </div>
            <div>
              <h4 className="font-bold text-text-main text-lg uppercase tracking-tight">Central Business District</h4>
              <p className="text-text-muted font-medium">Abuja, FCT, Nigeria</p>
            </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/10 translate-x-4 translate-y-4 rounded-2xl -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform"></div>
          <img
            alt="Modern Abuja Architecture"
            className="rounded-2xl object-cover w-full h-[500px] border border-white shadow-2xl"
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          />
        </div>
      </div>
    </section>
  );
};

export default Studio;
