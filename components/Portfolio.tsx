import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants.ts';

interface PortfolioProps {
  onViewAll: () => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ onViewAll }) => {
  const navigate = useNavigate();
  const signatureWorks = IMAGES.portfolio;
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <section className="bg-background border-t border-border-ui" id="portfolio">
      <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="font-display font-light text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: 1.06 }}>
              Signature<br />
              <em className="font-light not-italic" style={{ color: 'rgba(255,255,255,0.28)' }}>Works</em>
            </h2>
            <p className="text-white/40 text-sm font-sans max-w-md">
              A curated selection of our finest architectural visualizations, animations, and luxury estate commissions.
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="group flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-primary font-semibold border-b border-primary/30 pb-1 hover:border-primary transition-colors self-start md:self-auto"
          >
            View All Works
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        {/* Signature Works Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Hero Card (Large Feature - Item 0: Abuja Luxury Villa) */}
          {signatureWorks[0] && (
            <div
              onClick={() => setSelectedProject(signatureWorks[0])}
              className="lg:col-span-7 group relative overflow-hidden aspect-[4/3] lg:aspect-[16/11] rounded-2xl border border-white/5 bg-[#0E0E0E] cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-xl"
            >
              <img
                alt={signatureWorks[0].title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src={signatureWorks[0].url}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/figment_media/3D-Rendering-Abuja.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {signatureWorks[0].hasPlay && (
                <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-lg">
                  <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 p-8 md:p-10 space-y-2 text-left">
                <div className="flex items-center gap-3">
                  <span className="text-primary text-[10px] tracking-[0.25em] uppercase font-bold font-sans bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                    {signatureWorks[0].category}
                  </span>
                  <span className="text-white/40 text-xs font-sans">
                    {signatureWorks[0].location}
                  </span>
                </div>
                <h3 className="font-display font-light text-white text-2xl md:text-4xl leading-tight tracking-tight pt-1">
                  {signatureWorks[0].title}
                </h3>
                <p className="text-white/60 text-xs md:text-sm font-sans line-clamp-2 max-w-xl leading-relaxed pt-1">
                  {signatureWorks[0].description}
                </p>
              </div>
            </div>
          )}

          {/* Secondary Stack (Items 1 & 2: Abuja Duplex & Lagos Luxury Apartments) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {signatureWorks.slice(1, 3).map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="flex-1 group relative overflow-hidden aspect-[16/10] rounded-2xl border border-white/5 bg-[#0E0E0E] cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-lg"
              >
                <img
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={project.url}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/figment_media/3D-Rendering-Abuja.png';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                {project.hasPlay && (
                  <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-lg">
                    <span className="material-symbols-outlined text-white text-xl">play_arrow</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 p-6 space-y-1.5 text-left">
                  <p className="text-primary text-[9px] tracking-[0.22em] uppercase font-bold font-sans">
                    {project.category} — {project.location}
                  </p>
                  <h3 className="font-display font-light text-white text-xl leading-tight tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-white/50 text-xs font-sans line-clamp-1 leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Row (Items 3 & 4: Abuja Modern Residence & Abuja Urban Villa) */}
          {signatureWorks.slice(3, 5).map((project) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="lg:col-span-6 group relative overflow-hidden aspect-[16/9] rounded-2xl border border-white/5 bg-[#0E0E0E] cursor-pointer hover:border-primary/40 transition-all duration-500 shadow-lg"
            >
              <img
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src={project.url}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/figment_media/3D-Rendering-Abuja.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {project.hasPlay && (
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-lg">
                  <span className="material-symbols-outlined text-white text-xl">play_arrow</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 p-6 md:p-8 space-y-1.5 text-left">
                <p className="text-primary text-[9px] tracking-[0.22em] uppercase font-bold font-sans">
                  {project.category} — {project.location}
                </p>
                <h3 className="font-display font-light text-white text-xl md:text-2xl leading-tight tracking-tight">
                  {project.title}
                </h3>
                <p className="text-white/50 text-xs md:text-sm font-sans line-clamp-2 max-w-lg leading-relaxed">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12">
          <button
            onClick={() => { setSelectedProject(null); setIsPlayingVideo(false); }}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[110] focus:outline-none p-2 rounded-full hover:bg-white/10"
            title="Close Preview"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>

          <div className="w-full max-w-5xl aspect-video overflow-hidden relative rounded-2xl border border-white/10 bg-black shadow-2xl">
            {isPlayingVideo && selectedProject.videoUrl ? (
              <video 
                src={selectedProject.videoUrl} 
                poster={selectedProject.url}
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <img
                  src={selectedProject.url}
                  className="w-full h-full object-cover"
                  alt={selectedProject.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/figment_media/3D-Rendering-Abuja.png';
                  }}
                />
                {selectedProject.hasPlay && (
                  <div 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 cursor-pointer hover:bg-black/20 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-white text-8xl opacity-70 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">play_circle</span>
                    <p className="text-white font-bold uppercase tracking-[0.4em] text-xs mt-4 group-hover:text-primary transition-colors font-sans">Start Film Walkthrough</p>
                  </div>
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          <div className="mt-8 text-center text-white space-y-3 max-w-2xl">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] font-sans">
              {selectedProject.category} — {selectedProject.location}
            </p>
            <h3 className="font-display font-light text-2xl md:text-4xl leading-tight tracking-tight">
              {selectedProject.title}
            </h3>
            <p className="text-white/60 text-xs md:text-sm font-sans leading-relaxed">
              {selectedProject.description}
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => { setSelectedProject(null); setIsPlayingVideo(false); }}
                className="px-8 py-3 border border-white/15 text-[10px] font-bold uppercase tracking-widest hover:border-white/40 hover:text-white transition-all font-sans text-white/60 rounded-lg"
              >
                Close Preview
              </button>
              <button
                onClick={() => { setSelectedProject(null); setIsPlayingVideo(false); navigate('/contact'); }}
                className="px-8 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:bg-primary-hover transition-all font-sans rounded-lg shadow-lg shadow-primary/20"
              >
                Project Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
