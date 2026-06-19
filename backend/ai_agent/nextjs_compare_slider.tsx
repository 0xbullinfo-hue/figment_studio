// ====================================================================
# Step 3: Next.js Slider Comparison Component
# Location: app/ai-agent/components/CompareSlider.tsx
# ====================================================================

"use client";

import React, { useState } from 'react';

interface CompareSliderProps {
  beforeImage: string;
  afterImage: string;
}

export default function CompareSlider({ beforeImage, afterImage }: CompareSliderProps) {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="relative w-full h-full select-none overflow-hidden group">
      
      {/* After image render in background */}
      <img 
        src={afterImage} 
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
        alt="Compiled photorealistic visual" 
      />

      {/* Before image mask container */}
      <div 
        className="absolute inset-0 pointer-events-none select-none"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img 
          src={beforeImage} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none" 
          alt="Original sketch layout" 
        />
        <div className="absolute top-6 left-6 bg-black/60 border border-white/10 px-4 py-1.5 text-[9px] uppercase font-bold tracking-widest text-white rounded-full">
          Before: Line Sketch
        </div>
      </div>

      {/* Output tag */}
      <div className="absolute top-6 right-6 bg-[#F07A3A]/90 border border-white/10 px-4 py-1.5 text-[9px] uppercase font-bold tracking-widest text-white rounded-full">
        After: Photorealistic Render
      </div>

      {/* Slide bar handle indicator line */}
      <div 
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none"
        style={{ left: `${sliderPos}%` }}
      >
        <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-2xl absolute top-1/2 -translate-y-1/2 -translate-x-1/2 border border-white/20 select-none group-hover:scale-105 transition-transform pointer-events-none">
          <span className="material-symbols-outlined text-sm font-black text-black">sync_alt</span>
        </div>
      </div>

      {/* Slide dragging range listener */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderPos} 
        onChange={(e) => setSliderPos(Number(e.target.value))} 
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
      />
    </div>
  );
}
