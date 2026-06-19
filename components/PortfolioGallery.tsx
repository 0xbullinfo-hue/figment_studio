import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PortfolioItem } from '../types.ts';
import { useStudioStore } from '../store';

const PortfolioGallery: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioItems: items } = useStudioStore();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic filter categories based on actual items present
  const filterCategories = ['All', 'Exterior', 'Interior', 'Animation', 'Scale Models'];

  // Filter items based on selected category
  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Animation') return !!item.hasPlay;
    return item.type.toLowerCase() === activeFilter.toLowerCase();
  });

  // Reset scroll to 0 when filter changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [activeFilter]);

  // Bind desktop vertical wheel event to horizontal scroll translation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // Do not hijack scroll if detail viewer is open
      if (selectedItem) return;

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.2;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [selectedItem]);

  // Scroll controls for desktop arrows
  const scrollGallery = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollOffset = direction === 'left' ? -600 : 600;
      containerRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  // Helper to trigger file download of the rendering
  const handleDownloadFrame = (item: PortfolioItem) => {
    const link = document.createElement('a');
    link.href = item.url;
    link.target = '_blank';
    link.download = `${item.title.replace(/\s+/g, '_')}_Master.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sibling cycling logic inside the split-pane details overlay
  const handlePrevItem = () => {
    setIsPlayingVideo(false);
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem?.id);
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedItem(filteredItems[prevIndex]);
  };

  const handleNextItem = () => {
    setIsPlayingVideo(false);
    const currentIndex = filteredItems.findIndex(i => i.id === selectedItem?.id);
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedItem(filteredItems[nextIndex]);
  };

  // Generate dynamic contextual narrative and metadata fallbacks for details view
  const getProjectDetails = (title: string, type: string) => {
    const descriptions: Record<string, string> = {
      'Maitama Luxury Suite': 'A premium private estate masterwork in Maitama, Islamabad District. Formulated with low-angle warm volumetric lights, high-end Italian oak facade textures, and customized reflection parameters to showcase premium interior spaciousness.',
      'The Abuja Nexus Tower': 'A dynamic landmark high-rise rendering highlighting commercial facade glass detailing and atmospheric environment matching Abuja’s Central Business District skyline at sunset.',
      'CBD Flyover': 'A high-impact cinematic rendering representing municipal flyover structural paths. Captured under high ambient occlusion filters to showcase traffic light trails, road textures, and concrete structural elements.',
      'Lekki Masterplan': 'An scale-model visualization of Lagos coastal mixed-use expansions. Rendered with clean white clay materials alongside custom shoreline water refraction parameters to emphasize physical masterplan volume.'
    };

    return {
      description: descriptions[title] || `A premium master series visualization of the ${title} concept, illustrating high-fidelity architectural detailing, custom material rendering, and advanced spatial illumination.`,
      year: '2026',
      client: 'Private Visual Commission',
      resolution: '8K Master Render'
    };
  };

  return (
    <section className="relative w-full min-h-screen bg-background text-white overflow-hidden flex flex-col justify-between py-24 lg:py-32">
      <Helmet>
        <title>Portfolio | Figment Studio</title>
        <meta name="description" content="Browse Figment Studio's curated collection of premium 3D renderings, cinematic animations, and interior visualizations for real estate in Abuja and beyond." />
      </Helmet>

      {/* Header Info & Category Filters */}
      <div className="px-8 md:px-14 lg:px-20 max-w-[1600px] w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4 max-w-xl text-left">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans">WORKS GALLERY</p>
          <h1 className="font-display font-light text-white uppercase tracking-tight leading-[0.9] text-5xl lg:text-7xl">
            Selected<br />
            <em className="font-light not-italic text-white/30">Works</em>
          </h1>
        </div>

        {/* Minimalist Underlined Navigation Filters */}
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-b border-border-ui pb-4 md:pb-0 md:border-none self-start md:self-auto font-sans">
          {filterCategories.map(cat => {
            const isActive = cat === activeFilter;
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`relative text-[10px] md:text-xs font-semibold uppercase tracking-[0.2em] pb-1 transition-colors focus:outline-none ${
                  isActive ? 'text-primary' : 'text-text-muted hover:text-white'
                }`}
              >
                {cat}
                {isActive && (
                  <motion.div
                    layoutId="activeFilterUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Option 1: Horizontal Parallax Scrolling Container */}
      <div className="relative w-full flex-1 flex items-center justify-center my-6">
        {/* Navigation Boundary Arrows (Desktop Helper) */}
        <button
          onClick={() => scrollGallery('left')}
          className="absolute left-6 z-20 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 backdrop-blur-md hidden lg:flex group"
        >
          <span className="material-symbols-outlined text-white text-xl group-hover:-translate-x-0.5 transition-transform">arrow_back_ios_new</span>
        </button>

        <button
          onClick={() => scrollGallery('right')}
          className="absolute right-6 z-20 w-12 h-12 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300 backdrop-blur-md hidden lg:flex group"
        >
          <span className="material-symbols-outlined text-white text-xl group-hover:translate-x-0.5 transition-transform">arrow_forward_ios</span>
        </button>

        <div
          ref={containerRef}
          className="w-full flex items-center gap-12 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-none px-8 md:px-20 lg:px-44 py-8 select-none"
        >
          {filteredItems.map((item, index) => {
            const displayIndex = String(index + 1).padStart(2, '0');
            // Stagger layout aspect ratios for asymmetrical gallery design
            const isEven = index % 2 === 0;
            const containerClass = isEven
              ? 'min-w-[320px] md:min-w-[440px] aspect-[4/5] self-start mt-6'
              : 'min-w-[420px] md:min-w-[620px] aspect-video self-center';

            return (
              <motion.div
                key={item.id}
                layoutId={`card-container-${item.id}`}
                onClick={() => { setSelectedItem(item); setIsPlayingVideo(false); }}
                className={`snap-center relative group cursor-pointer border border-border-ui/40 hover:border-primary/50 bg-surface-alt/40 p-4 transition-all duration-500 overflow-hidden flex flex-col justify-between ${containerClass}`}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
              >
                {/* Visual Outline Number Index */}
                <span className="absolute bottom-16 right-4 font-display text-[12vw] lg:text-[10rem] font-bold text-white/5 leading-none select-none z-0">
                  {displayIndex}
                </span>

                {/* Main Render Card Frame */}
                <div className="relative w-full flex-1 overflow-hidden bg-background">
                  <div
                    className="w-full h-full bg-cover bg-center transition-all duration-[900ms] group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.url})` }}
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {item.hasPlay && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all duration-500 shadow-lg shadow-black/20">
                        <span className="material-symbols-outlined text-white text-3xl">play_arrow</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text Metadata */}
                <div className="mt-4 flex items-center justify-between relative z-10 text-left">
                  <div>
                    <span className="text-primary text-[9px] font-bold uppercase tracking-[0.25em] block mb-1 font-sans">{item.type}</span>
                    <h3 className="font-display text-white text-base lg:text-lg tracking-wide uppercase leading-snug">{item.title}</h3>
                  </div>
                  <span className="material-symbols-outlined text-white/20 group-hover:text-primary transition-colors text-2xl">arrow_outward</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Subtle bottom scroll timeline marker */}
      <div className="px-8 md:px-14 lg:px-20 max-w-[1600px] w-full mx-auto flex items-center justify-between text-text-muted text-[10px] tracking-widest font-sans">
        <span className="uppercase">Swipe or Scroll Wheel to Browse</span>
        <span className="font-semibold text-primary">{filteredItems.length} Series Items</span>
      </div>

      {/* Option 2: Split-Screen Immersive Detail Drawer Overlay */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col lg:flex-row overflow-hidden"
          >
            {/* Left Pane: Cinematic Visual Focus Frame */}
            <div className="w-full lg:w-[65%] h-[45vh] lg:h-full relative flex items-center justify-center bg-black/20 p-8 lg:p-16 border-b border-border-ui lg:border-none">
              <span className="absolute top-6 left-8 text-[9px] tracking-[0.3em] font-sans text-primary font-bold uppercase hidden md:block">
                Figment Studio • Master Series Visual
              </span>

              {/* Render Image or Animated Loop */}
              <div className="relative max-h-[85%] max-w-[90%] w-full h-full flex items-center justify-center overflow-hidden">
                {!isPlayingVideo ? (
                  <>
                    <img
                      src={selectedItem.url}
                      className="w-full h-full object-contain shadow-2xl rounded-2xl"
                      alt={selectedItem.title}
                    />
                    {selectedItem.hasPlay && (
                      <div
                        onClick={() => setIsPlayingVideo(true)}
                        className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 cursor-pointer group"
                      >
                        <span className="material-symbols-outlined text-white text-8xl opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500">play_circle</span>
                        <p className="text-white font-bold uppercase tracking-[0.4em] text-[10px] mt-4 font-sans group-hover:text-primary transition-colors">Start Animated Walkthrough</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative w-full h-full bg-zinc-950 flex flex-col items-center justify-center rounded-2xl p-6 text-center border border-white/10">
                    {/* Simulated Cinematic Loading state */}
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h4 className="text-lg uppercase tracking-widest font-display text-white font-semibold">Streaming Walkthrough Film</h4>
                    <p className="text-text-muted text-xs max-w-sm mt-2 font-sans">Connecting to rendering pipeline server. Frame buffers initializing...</p>
                    <button
                      onClick={() => setIsPlayingVideo(false)}
                      className="mt-8 px-6 py-2 border border-white/20 text-[9px] uppercase tracking-widest font-sans hover:border-primary hover:text-primary transition-all rounded-full"
                    >
                      Return to Still Image
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Premium Specification Detail Card */}
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="w-full lg:w-[35%] h-[55vh] lg:h-full bg-surface border-l border-border-ui p-8 md:p-12 lg:p-16 flex flex-col justify-between overflow-y-auto text-left relative z-20"
            >
              {/* Top Row: category and close button */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em] font-sans">
                  {selectedItem.type} Details
                </span>
                <button
                  onClick={() => { setSelectedItem(null); setIsPlayingVideo(false); }}
                  className="flex items-center gap-2 text-text-muted hover:text-white transition-colors text-[10px] uppercase font-bold tracking-widest font-sans focus:outline-none"
                >
                  Close <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              {/* Middle Section: Specs & Description */}
              <div className="flex-1 space-y-8">
                <div>
                  <h2 className="font-display font-light text-white text-3xl lg:text-4xl leading-tight uppercase tracking-tight mb-2">
                    {selectedItem.title}
                  </h2>
                  <div className="w-12 h-[2px] bg-primary"></div>
                </div>

                {/* Narrative Details */}
                <p className="text-text-secondary text-sm font-light leading-relaxed font-sans">
                  {getProjectDetails(selectedItem.title, selectedItem.type).description}
                </p>

                {/* Specs Table */}
                <div className="border-t border-border-ui pt-6 space-y-4 text-xs font-sans">
                  <div className="flex justify-between py-1 border-b border-border-ui/40">
                    <span className="text-text-muted">Client & Commission</span>
                    <span className="text-white font-medium">{getProjectDetails(selectedItem.title, selectedItem.type).client}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-ui/40">
                    <span className="text-text-muted">Visual Target Year</span>
                    <span className="text-white font-medium">{getProjectDetails(selectedItem.title, selectedItem.type).year}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border-ui/40">
                    <span className="text-text-muted">Resolution Asset</span>
                    <span className="text-white font-medium">{getProjectDetails(selectedItem.title, selectedItem.type).resolution}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Section: Inquiry / Downloads & Slider Navs */}
              <div className="pt-8 space-y-8 mt-6">
                {/* Core Action Callouts */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDownloadFrame(selectedItem)}
                    className="flex-1 py-3 border border-white/10 hover:border-white/30 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-all font-sans rounded-lg"
                  >
                    Download Frame
                  </button>
                  <button
                    onClick={() => { setSelectedItem(null); navigate('/contact'); }}
                    className="flex-1 py-3 bg-primary text-white hover:bg-primary-hover text-[10px] font-bold uppercase tracking-widest transition-all font-sans rounded-lg shadow-lg shadow-primary/10"
                  >
                    Project Inquiry
                  </button>
                </div>

                {/* Navigation Carousel Cycling Links */}
                <div className="flex items-center justify-between border-t border-border-ui/80 pt-6 text-[10px] uppercase font-bold tracking-widest font-sans text-text-muted">
                  <button
                    onClick={handlePrevItem}
                    className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span> Prev Work
                  </button>
                  <button
                    onClick={handleNextItem}
                    className="flex items-center gap-1 hover:text-primary transition-colors focus:outline-none"
                  >
                    Next Work <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioGallery;
