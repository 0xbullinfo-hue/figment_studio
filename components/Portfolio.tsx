
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IMAGES } from '../constants.ts';

interface PortfolioProps {
  onViewAll: () => void;
}

const signatureProjects = IMAGES.portfolio.map(p => ({
  id: p.id,
  title: p.title,
  category: p.category,
  location: p.location,
  imageUrl: p.url,
  type: (p as any).type || 'Static Render',
  hasPlay: (p as any).hasPlay || false,
}));

// Expand with extra gallery images for a richer grid
const GALLERY_EXTRAS: any[] = [];

const ALL_PROJECTS = [...signatureProjects, ...GALLERY_EXTRAS];

const Portfolio: React.FC<PortfolioProps> = ({ onViewAll }) => {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  return (
    <section className="bg-background border-t border-border-ui" id="portfolio">
      <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans">Portfolio</p>
            <h2 className="font-display font-light text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: 1.06 }}>
              Signature<br />
              <em className="font-light not-italic" style={{ color: 'rgba(255,255,255,0.28)' }}>Projects</em>
            </h2>
          </div>
          <button
            onClick={onViewAll}
            className="group flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-primary font-semibold border-b border-primary/30 pb-1 hover:border-primary transition-colors self-start md:self-auto"
          >
            View All Works
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALL_PROJECTS.slice(0, 2).map((project, idx) => (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`group relative overflow-hidden cursor-pointer ${idx === 0 ? 'md:row-span-2 aspect-[3/4]' : 'aspect-[16/10]'}`}
            >
              <img
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                src={project.imageUrl}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

              {project.hasPlay && (
                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 p-2">
                  <span className="material-symbols-outlined text-white text-2xl">play_arrow</span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-primary text-[10px] tracking-[0.25em] uppercase font-bold mb-2 font-sans">
                  {project.category} · {project.location}
                </p>
                <h3 className="font-display font-light text-white text-2xl md:text-3xl leading-tight tracking-tight">
                  {project.title}
                </h3>
                <div className="flex items-center gap-3 mt-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white">
                    <span className="material-symbols-outlined text-base">{project.hasPlay ? 'play_arrow' : 'zoom_in'}</span>
                  </span>
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest font-sans">
                    {project.hasPlay ? 'Watch Animation' : 'View Full Render'}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Right column: 2 stacked items */}
          <div className="flex flex-col gap-4">
            {ALL_PROJECTS.slice(2, 4).map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="group relative overflow-hidden cursor-pointer aspect-[16/9]"
              >
                <img
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  src={project.imageUrl}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-primary text-[9px] tracking-[0.22em] uppercase font-bold mb-1.5 font-sans">
                    {project.category} · {project.location}
                  </p>
                  <h3 className="font-display font-light text-white text-xl leading-tight tracking-tight">
                    {project.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-black/97 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12">
          <button
            onClick={() => { setSelectedProject(null); setIsPlayingVideo(false); }}
            className="absolute top-8 right-8 text-white/40 hover:text-white transition-all z-[110] focus:outline-none"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          <div className="w-full max-w-6xl aspect-video overflow-hidden relative rounded-2xl border border-white/10 bg-black">
            {isPlayingVideo && selectedProject.videoUrl ? (
              <video 
                src={selectedProject.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <img src={selectedProject.imageUrl} className="w-full h-full object-cover" alt={selectedProject.title} />
                {selectedProject.hasPlay && (
                  <div 
                    onClick={() => setIsPlayingVideo(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/25 cursor-pointer hover:bg-black/15 transition-colors group"
                  >
                    <span className="material-symbols-outlined text-white text-9xl opacity-40 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">play_circle</span>
                    <p className="text-white font-bold uppercase tracking-[0.4em] text-xs mt-6 group-hover:text-primary transition-colors font-sans">Start Film Walkthrough</p>
                  </div>
                )}
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </div>

          <div className="mt-10 text-center text-white space-y-4 max-w-2xl">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] font-sans">
              {selectedProject.category} · {selectedProject.location} · {selectedProject.type}
            </p>
            <h3 className="font-display font-light text-3xl md:text-5xl leading-tight tracking-tight">
              {selectedProject.title}
            </h3>
            <div className="flex justify-center gap-4 pt-6">
              <button onClick={() => { setSelectedProject(null); setIsPlayingVideo(false); }} className="px-10 py-3.5 border border-white/15 text-[10px] font-bold uppercase tracking-widest hover:border-white/40 hover:text-white/90 transition-all font-sans text-white/50">
                Close Preview
              </button>
              <button onClick={() => { setSelectedProject(null); setIsPlayingVideo(false); navigate('/contact'); }} className="px-10 py-3.5 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all font-sans">
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
