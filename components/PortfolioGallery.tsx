import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PortfolioItem } from '../types.ts';
import { useStudioStore } from '../store';

const PortfolioGallery: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioItems: items } = useStudioStore();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter items based on selected category button
  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Animation') return item.hasPlay;
    return item.type.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleDownloadFrame = (item: PortfolioItem) => {
    // Simple helper to download or view the image
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.download = `${item.title.replace(/\s+/g, '_')}_Master.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="max-w-[1600px] mx-auto px-8 lg:px-16 py-20 bg-white min-h-screen">
      <div className="flex flex-col gap-6 mb-20 text-left">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight uppercase leading-[0.9] mb-8">Selected<br />Works</h1>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-zinc-500 text-xl font-light leading-relaxed">Pioneering architectural visualization in West Africa, transforming Nigeria's boldest conceptual designs into photographic reality.</p>
        </div>
      </div>

      {/* Stateful Filter Buttons */}
      <div className="flex flex-wrap gap-4 mb-20 border-b border-zinc-100 pb-12">
        {['All', 'Exterior', 'Interior', 'Animation'].map(f => {
          const isActive = f === activeFilter;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs font-bold uppercase tracking-[0.2em] px-8 py-3 border-2 transition-all focus:outline-none ${
                isActive
                  ? 'border-primary bg-primary text-white shadow-lg shadow-primary/10'
                  : 'border-zinc-200 text-zinc-400 hover:border-primary hover:text-primary'
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      <div className="masonry-grid">
        {filteredItems.map(item => (
          <div key={item.id} onClick={() => setSelectedItem(item)} className="masonry-item relative group cursor-pointer border border-transparent hover:border-primary p-2 transition-all duration-500 text-left">
            <div className={`${item.class} bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-700 relative overflow-hidden`} style={{ backgroundImage: `url(${item.url})` }}>
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {item.hasPlay && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6">
              <span className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] block mb-2">{item.type}</span>
              <h3 className="text-lg font-bold uppercase tracking-wide">{item.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-[110] focus:outline-none"
          >
            <span className="material-symbols-outlined text-4xl">close</span>
          </button>

          <div className="w-full max-w-6xl aspect-video bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-500">
            <img
              src={selectedItem.url}
              className="w-full h-full object-cover"
              alt={selectedItem.title}
            />
            {selectedItem.hasPlay && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 group cursor-pointer">
                <span className="material-symbols-outlined text-white text-9xl opacity-40 group-hover:opacity-100 transition-opacity">play_circle</span>
                <p className="text-white font-bold uppercase tracking-widest text-sm mt-4">Watch Animation</p>
              </div>
            )}
          </div>

          <div className="mt-10 text-center text-white space-y-3 animate-in slide-in-from-bottom-4 duration-500">
            <p className="text-primary font-bold uppercase tracking-[0.3em] text-xs font-sans">
              {selectedItem.type} • Master Series
            </p>
            <h3 className="text-2xl md:text-4xl font-bold uppercase tracking-tighter">
              {selectedItem.title}
            </h3>
            <div className="flex justify-center gap-6 pt-4">
              <button
                onClick={() => handleDownloadFrame(selectedItem)}
                className="px-6 py-2 bg-white/10 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all focus:outline-none"
              >
                Download Frame
              </button>
              <button
                onClick={() => { setSelectedItem(null); navigate('/contact'); }}
                className="px-6 py-2 bg-primary rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all focus:outline-none"
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

export default PortfolioGallery;
