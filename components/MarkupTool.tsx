import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate } from 'react-router-dom';
import { Marker } from '../types';
import { useStudioStore } from '../store';

const MarkupTool: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, commitRevision } = useStudioStore();
  const project = projects.find(p => p.id === id);

  const [markers, setMarkers] = useState<Marker[]>([
    { id: 1, x: 45, y: 30, label: 'Lighting Area', comment: "Adjust the warm light intensity on the balcony." },
  ]);
  const [activeMarker, setActiveMarker] = useState<number | null>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!project) return <div className="flex h-screen items-center justify-center text-red-500 font-bold">Project not found</div>;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newMarker: Marker = {
      id: markers.length + 1,
      x,
      y,
      label: `New Feedback #${markers.length + 1}`,
      comment: ""
    };
    setMarkers([...markers, newMarker]);
    setActiveMarker(newMarker.id);
  };

  const handleFinalSubmit = () => {
    const allComments = markers
      .filter(m => m.comment.trim() !== '')
      .map(m => `[Pin ${m.id}]: ${m.comment}`)
      .join(' | ');

    if (allComments.length === 0) {
      alert("Please add at least one comment before submitting.");
      return;
    }

    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      commitRevision(project.id, allComments);
      navigate(`/project/${project.id}`);
    }, 1000);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-display text-left">
      <Helmet>
        <title>Design Feedback Canvas | Figment Studio</title>
        <meta name="description" content="Collaborate on architectural designs using Figment Studio's interactive markup canvas. Place revision pins and specify change requests directly on high-resolution renders." />
      </Helmet>
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-3 bg-white z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/project/${project.id}`)} className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary group-hover:translate-x-[-2px] transition-transform">arrow_back</span>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Project Details</span>
          </button>
          <div className="h-6 w-[1px] bg-gray-100 mx-2"></div>
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 group text-slate-400 hover:text-slate-900 transition-colors">
            <span className="material-symbols-outlined text-lg">home</span>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Home</span>
          </button>
          <h2 className="font-black uppercase text-sm tracking-widest ml-4 hidden md:block">{project.title} - Feedback Session</h2>
        </div>
        <button
          onClick={handleFinalSubmit}
          disabled={isSubmitting}
          className="bg-primary text-white px-8 py-2.5 rounded-lg font-black uppercase text-xs tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Revisions'}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-16 lg:w-64 border-r border-gray-100 p-4 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Active Tools</span>
            <button className="w-full flex items-center gap-3 p-3 bg-primary/10 text-primary border border-primary/20 rounded-xl">
              <span className="material-symbols-outlined fill">location_on</span>
              <span className="hidden lg:block font-bold text-sm">Drop Pin</span>
            </button>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest leading-relaxed">
              Click anywhere on the render to place a feedback marker.
            </p>
          </div>
        </aside>

        <section className="flex-1 bg-gray-100 flex items-center justify-center p-12 overflow-auto relative">
          <div className="relative shadow-2xl rounded-xl overflow-hidden cursor-crosshair group" onClick={handleImageClick}>
            <img src={project.imageUrl} className="max-w-full max-h-[80vh] block select-none pointer-events-none" alt={project.title} />
            {markers.map(marker => (
              <div
                key={marker.id}
                onClick={(e) => { e.stopPropagation(); setActiveMarker(marker.id); }}
                className={`absolute flex items-center justify-center size-8 md:size-10 rounded-full font-black text-sm shadow-xl transition-all ${activeMarker === marker.id ? 'bg-primary text-white scale-110 ring-4 ring-primary/20' : 'bg-white text-primary border-2 border-primary hover:scale-105'}`}
                style={{ top: `${marker.y}%`, left: `${marker.x}%`, transform: 'translate(-50%, -50%)' }}
              >
                {marker.id}
              </div>
            ))}
          </div>
        </section>

        <aside className="w-80 lg:w-96 border-l border-gray-100 flex flex-col bg-white">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-black uppercase tracking-tight">Revision Feed</h2>
            <p className="text-gray-400 text-xs mt-1">Select a pin to edit feedback</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {markers.length === 0 ? (
              <div className="p-10 text-center text-gray-400 italic">No feedback added yet.</div>
            ) : markers.map(marker => (
              <div
                key={marker.id}
                className={`p-5 rounded-2xl transition-all border ${activeMarker === marker.id ? 'bg-primary/5 border-primary shadow-sm' : 'border-gray-100 bg-white hover:border-primary/20'}`}
                onClick={() => setActiveMarker(marker.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`size-6 rounded-full flex items-center justify-center text-[10px] font-black ${activeMarker === marker.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>{marker.id}</div>
                  <div className="flex-1 text-left">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">{marker.label}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setMarkers(markers.filter(m => m.id !== marker.id)); }}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-xs">delete</span>
                      </button>
                    </div>
                    <textarea
                      className="w-full bg-transparent border-0 p-0 text-sm focus:ring-0 placeholder:text-gray-300 resize-none font-medium text-gray-600"
                      placeholder="Describe the requested change..."
                      rows={2}
                      value={marker.comment}
                      onChange={(e) => {
                        const newMarkers = [...markers];
                        newMarkers.find(m => m.id === marker.id)!.comment = e.target.value;
                        setMarkers(newMarkers);
                      }}
                    ></textarea>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MarkupTool;
