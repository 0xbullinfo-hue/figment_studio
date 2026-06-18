import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../types.ts';
import { IMAGES } from '../constants.ts';

interface PortfolioProps {
  onViewAll: () => void;
}

// Map constants to local project view data
const signatureProjects = IMAGES.portfolio.map(p => ({
  id: p.id,
  title: p.title,
  category: p.category,
  location: p.location,
  imageUrl: p.url,
  type: (p as any).type || 'Static Render',
  hasPlay: (p as any).hasPlay || false
}));

const Portfolio: React.FC<PortfolioProps> = ({ onViewAll }) => {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const navigate = useNavigate();

  return (
    <section className="px-6 md:px-10 lg:px-16 py-24 bg-background" id="portfolio">
      <div className="flex items-end justify-between mb-16 wrap-lg">
        <div className="space-y-3 text-left">
          <span className="text-primary font-bold uppercase tracking-[0.25em] text-xs font-sans">Portfolio</span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-white leading-tight">Signature Projects</h2>
        </div>
        <button
          onClick={onViewAll}
          className="group text-primary hover:text-primary-hover font-bold text-xs flex items-center gap-2 mb-2 transition-all border-b border-primary/20 hover:border-primary pb-1 uppercase tracking-widest font-sans"
        >
          View All Projects
          <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left wrap-lg">
        {signatureProjects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="group relative overflow-hidden rounded-2xl aspect-[16/11] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-surface border border-border-ui hover:border-primary/20"
          >
            <img
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              src={project.imageUrl}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-70 group-hover:opacity-90 transition-opacity"></div>

            <div className="absolute top-6 right-6">
              {project.hasPlay && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-lg text-white">
                  <span className="material-symbols-outlined text-2xl font-bold">play_arrow</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 p-10 transform transition-transform duration-500">
              <p className="text-primary text-[10px] tracking-[0.25em] uppercase font-bold mb-3 font-sans">{project.category} • {project.location}</p>
              <h3 className="text-2xl md:text-3xl font-display font-light text-white mb-6 uppercase tracking-tight leading-none">{project.title}</h3>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="material-symbols-outlined">
                    {project.hasPlay ? 'play_arrow' : 'zoom_in'}
                  </span>
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity delay-100 font-sans">
                  {project.hasPlay ? 'Watch Animation' : 'View Full Render'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Watch View - strictly stays on landing */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-8 right-8 text-white hover:text-primary transition-all z-[110] active:scale-90"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          <div className="w-full max-w-6xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500">
            <img
              src={selectedProject.imageUrl}
              className="w-full h-full object-cover"
              alt={selectedProject.title}
            />
            {selectedProject.hasPlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group cursor-pointer transition-colors hover:bg-black/10">
                <span className="material-symbols-outlined text-white text-9xl opacity-40 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">play_circle</span>
                <p className="text-white font-bold uppercase tracking-[0.4em] text-xs mt-6 group-hover:text-primary transition-colors font-sans">Start Film Walkthrough</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </div>

          <div className="mt-10 text-center text-white space-y-4 max-w-2xl animate-in slide-in-from-bottom-4 duration-500">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-[10px] font-sans">
              {selectedProject.category} • {selectedProject.location} • {selectedProject.type}
            </p>
            <h3 className="text-3xl md:text-5xl font-display font-light uppercase tracking-tight leading-none">
              {selectedProject.title}
            </h3>
            <div className="flex justify-center gap-6 pt-6">
              <button
                onClick={() => setSelectedProject(null)}
                className="px-10 py-4 border border-white/20 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all font-sans"
              >
                Close Preview
              </button>
              <button
                onClick={() => { setSelectedProject(null); navigate('/contact'); }}
                className="px-10 py-4 bg-primary rounded-xl text-[10px] font-bold uppercase tracking-widest hover:brightness-110 shadow-xl shadow-primary/20 transition-all font-sans"
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
