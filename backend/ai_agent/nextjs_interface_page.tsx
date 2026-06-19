// ====================================================================
# Step 3: Next.js App Router Page
# Location: app/ai-agent/page.tsx
# ====================================================================

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Upload, Layers, Sliders, Sun, Image as ImageIcon, ChevronDown, CheckCircle, Trash2, Key 
} from 'lucide-react';
import CompareSlider from './nextjs_compare_slider';

type DashboardTab = 'lighting' | 'camera' | 'environment' | 'context';

export default function AIAgentPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tierInfo, setTierInfo] = useState({ tier: 'Agent Tom (Visitor)', remaining: 5, max: 5 });
  const [activeTab, setActiveTab] = useState<DashboardTab>('lighting');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // UI Controls (Technical + Descriptive Nomenclature)
  const [lightingScenario, setLightingScenario] = useState('Natural: Golden Hour (Warm Sunrise/Sunset)');
  const [cameraPerspective, setCameraPerspective] = useState('Wide Shot (Expansive, Environmental)');
  const [architecturalStyle, setArchitecturalStyle] = useState('Style: Japandi Zen');
  const [materialOverride, setMaterialOverride] = useState('Material: Exposed Concrete');
  const [lockGeometry, setLockGeometry] = useState(true);
  const [lockLighting, setLockLighting] = useState(false);
  const [creativeDirection, setCreativeDirection] = useState('');
  
  // Brush Mask Canvas State
  const [brushSize, setBrushSize] = useState(25);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Active render states
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<'idle' | 'queued' | 'rendering' | 'completed' | 'failed'>('idle');
  const [renderedOutput, setRenderedOutput] = useState<string | null>(null);
  const [pollingLogs, setPollingLogs] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Initialize Drawing Canvas
  useEffect(() => {
    if (selectedImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(240, 122, 58, 0.4)'; // Semitransparent orange masking brush
        ctx.lineWidth = brushSize;
        contextRef.current = ctx;
      }
    }
  }, [selectedImage]);

  // Sync brush width changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.lineWidth = brushSize;
    }
  }, [brushSize]);

  // Mask drawing handlers
  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !contextRef.current) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    if (contextRef.current) contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearMask = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
      setIsUploading(false);
      setRenderedOutput(null);
      setJobStatus('idle');
      setPollingLogs([]);
    };
    reader.readAsDataURL(file);
  };

  // Submit Job
  const handleRenderSubmit = async () => {
    if (!selectedImage || jobStatus === 'rendering') return;

    setJobStatus('queued');
    setPollingLogs(['[System] Initializing layout coordinates...', '[System] Submitting limit reservation token...']);
    
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (isAuthenticated) {
        // Pass JWT token for paid subscribers
        headers['Authorization'] = 'Bearer [USER_JWT_TOKEN]';
      }

      const response = await fetch('/api/render', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          image_base64: selectedImage.split(',')[1],
          lighting_scenario: lightingScenario,
          camera_perspective: cameraPerspective,
          architectural_style: architecturalStyle,
          material_override: materialOverride,
          lock_geometry: lockGeometry,
          lock_lighting: lockLighting,
          creative_direction: creativeDirection
        })
      });

      const data = await response.json();
      if (response.ok && data.job_id) {
        setActiveJobId(data.job_id);
        setJobStatus('rendering');
      } else {
        throw new Error(data.detail || 'Limit check rejected.');
      }
    } catch (err: any) {
      setJobStatus('failed');
      setPollingLogs(prev => [...prev, `[Error] Generation blocked: ${err.message}`]);
    }
  };

  // Memory-Safe Polling loop
  useEffect(() => {
    if (!activeJobId || jobStatus !== 'rendering') return;

    let attempts = 0;
    const interval = setInterval(async () => {
      attempts += 1;
      
      // Stop polling after 2 minutes limit
      if (attempts > 40) {
        clearInterval(interval);
        setJobStatus('failed');
        setPollingLogs(prev => [...prev, '[System] Operation timed out.']);
        return;
      }

      try {
        const res = await fetch(`/api/status?job_id=${activeJobId}`);
        const data = await res.json();

        if (data.status === 'completed' && data.output_url) {
          clearInterval(interval);
          setRenderedOutput(data.output_url);
          setJobStatus('completed');
          // Deduce renders left
          setTierInfo(prev => ({ ...prev, remaining: Math.max(0, prev.remaining - 1) }));
        } else if (data.status === 'failed') {
          clearInterval(interval);
          setJobStatus('failed');
        } else {
          const logLines = [
            'Analyzing structural edges using ControlNet MLSD...',
            'Calculating ambient occlusion coordinates...',
            'Ray bounce calculation: tracing passes 64/128...',
            'Injecting volumetric atmospheric values...'
          ];
          setPollingLogs(prev => [...prev, `[GPU] ${logLines[attempts % logLines.length]}`]);
        }
      } catch (err) {
        console.error('Connection error during poll:', err);
      }
    }, 3000); // 3 Second Polling Rule

    return () => clearInterval(interval);
  }, [activeJobId, jobStatus]);

  // Helper to toggle auth states client side
  const handleUpgradeToggle = () => {
    if (isAuthenticated) {
      setIsAuthenticated(false);
      setTierInfo({ tier: 'Agent Tom (Visitor)', remaining: 5, max: 5 });
    } else {
      setIsAuthenticated(true);
      setTierInfo({ tier: 'Agent Ike (Pro Member)', remaining: 20, max: 20 });
    }
    // Clean workspace states
    setGeneratedRender(null);
    setRenderedOutput(null);
    setJobStatus('idle');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden font-sans">
      
      {/* Top Navbar */}
      <header className="border-b border-white/5 bg-[#0B0E11]/85 backdrop-blur-md px-8 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#F07A3A] flex items-center justify-center font-display text-white font-black text-sm">
            FS
          </div>
          <div className="text-left">
            <p className="text-[9px] uppercase font-bold tracking-[0.25em] text-[#F07A3A]">WHITE-LABEL AI AGENT</p>
            <h1 className="text-md font-bold uppercase tracking-wide text-white">Figment ArcViz Agent</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#BDBDBD] flex items-center gap-2 select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {tierInfo.tier}: <strong className="text-white">{tierInfo.remaining} / {tierInfo.max}</strong> RENDERS LEFT
          </div>
          <button 
            onClick={handleUpgradeToggle} 
            className="text-[10px] bg-white/5 border border-white/10 hover:border-primary/40 hover:text-primary transition-all px-4 py-1.5 rounded-full uppercase font-bold tracking-widest flex items-center gap-1.5"
          >
            <Key className="w-3 h-3" />
            {isAuthenticated ? 'Sign Out' : 'Sign In (Agent Ike)'}
          </button>
        </div>
      </header>

      {/* Main workspace Grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Dashboard Tabs Panel */}
        <aside className="w-80 h-full border-r border-white/5 bg-[#0B0E11]/45 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* 4-Tab Navigation Selector */}
            <div className="grid grid-cols-4 border-b border-white/5 bg-black/20 text-[9px] font-bold uppercase tracking-wider text-center select-none">
              {(['lighting', 'camera', 'environment', 'context'] as DashboardTab[]).map(t => {
                const isActive = activeTab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`py-3.5 border-b-2 transition-colors uppercase focus:outline-none ${
                      isActive ? 'border-[#F07A3A] text-white bg-[#12161A]/40' : 'border-transparent text-[#737373] hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            {/* Dashboard Fields container */}
            <div className="flex-1 p-6 overflow-y-auto space-y-6 text-left">
              
              {/* Lighting Options Tab */}
              {activeTab === 'lighting' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#737373] flex items-center gap-1.5">
                      <Sun className="w-3 h-3 text-[#F07A3A]" /> Lighting Scenario
                    </label>
                    <div className="relative">
                      <select 
                        value={lightingScenario} 
                        onChange={(e) => setLightingScenario(e.target.value)}
                        className="w-full bg-[#12161A] border border-white/10 rounded-lg py-2.5 px-3 text-xs appearance-none focus:outline-none focus:border-[#F07A3A] cursor-pointer"
                      >
                        <option value="Natural: Golden Hour (Warm Sunrise/Sunset)">Natural: Golden Hour (Warm Sunrise/Sunset)</option>
                        <option value="Natural: Noon Sunlight (High Contrast, 5500K)">Natural: Noon Sunlight (High Contrast, 5500K)</option>
                        <option value="Artificial: Studio Softbox (Bright, Airy)">Artificial: Studio Softbox (Bright, Airy)</option>
                        <option value="Mixed: Dusk (Cool Exterior + Warm Interior)">Mixed: Dusk (Cool Exterior + Warm Interior)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-[#737373] pointer-events-none" />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#737373] leading-relaxed font-sans font-light">Controls ambient light angles, solar scattering vectors, and volumetric fog weights.</p>
                </div>
              )}

              {/* Camera Perspective Tab */}
              {activeTab === 'camera' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#737373] flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-[#F07A3A]" /> Camera Perspective
                    </label>
                    <div className="relative">
                      <select 
                        value={cameraPerspective} 
                        onChange={(e) => setCameraPerspective(e.target.value)}
                        className="w-full bg-[#12161A] border border-white/10 rounded-lg py-2.5 px-3 text-xs appearance-none focus:outline-none focus:border-[#F07A3A] cursor-pointer"
                      >
                        <option value="Wide Shot (Expansive, Environmental)">Wide Shot (Expansive, Environmental)</option>
                        <option value="Close-up (Macro, Detail-Oriented)">Close-up (Macro, Detail-Oriented)</option>
                        <option value="Aerial View (Birds-Eye, Drone)">Aerial View (Birds-Eye, Drone)</option>
                        <option value="Dutch Angle (Tilted, Dynamic)">Dutch Angle (Tilted, Dynamic)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-[#737373] pointer-events-none" />
                    </div>
                  </div>
                  <p className="text-[10px] text-[#737373] leading-relaxed font-sans font-light">Sets camera focal distance parameters, tilting dynamics, and environmental scale context.</p>
                </div>
              )}

              {/* Environment Styles & Material Tab */}
              {activeTab === 'environment' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#737373] flex items-center gap-1.5">
                      <ImageIcon className="w-3 h-3 text-[#F07A3A]" /> Architectural Style
                    </label>
                    <div className="relative">
                      <select 
                        value={architecturalStyle} 
                        onChange={(e) => setArchitecturalStyle(e.target.value)}
                        className="w-full bg-[#12161A] border border-white/10 rounded-lg py-2.5 px-3 text-xs appearance-none focus:outline-none focus:border-[#F07A3A] cursor-pointer"
                      >
                        <option value="Style: Japandi Zen">Style: Japandi Zen</option>
                        <option value="Style: brutalist concrete">Style: Brutalist Concrete</option>
                        <option value="Style: Tropical Modernist">Style: Tropical Modernist</option>
                        <option value="Style: High-Tech Glass">Style: High-Tech Glass</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-[#737373] pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-[#737373] flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-[#F07A3A]" /> Material Overrides
                    </label>
                    <div className="relative">
                      <select 
                        value={materialOverride} 
                        onChange={(e) => setMaterialOverride(e.target.value)}
                        className="w-full bg-[#12161A] border border-white/10 rounded-lg py-2.5 px-3 text-xs appearance-none focus:outline-none focus:border-[#F07A3A] cursor-pointer"
                      >
                        <option value="Material: Exposed Concrete">Material: Exposed Concrete</option>
                        <option value="Material: 8K Marble Displacement">Material: Calacatta Marble</option>
                        <option value="Material: Tyrolean PBR">Material: Tyrolean Plaster</option>
                        <option value="Material: Brushed Aluminum">Material: Brushed Aluminum</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-3.5 text-[#737373] pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Constraint and Creative Text Tab */}
              {activeTab === 'context' && (
                <div className="space-y-5">
                  <div className="space-y-3">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#737373]">Fidelity Toggles</p>
                    <label className="flex items-center justify-between text-xs py-1.5 cursor-pointer group select-none">
                      <span className="text-[#BDBDBD] group-hover:text-white transition-colors">Lock Geometry & Structure</span>
                      <input 
                        type="checkbox" 
                        checked={lockGeometry} 
                        onChange={(e) => setLockGeometry(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-[#12161A] text-[#F07A3A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                    </label>
                    <label className="flex items-center justify-between text-xs py-1.5 cursor-pointer group select-none">
                      <span className="text-[#BDBDBD] group-hover:text-white transition-colors">Lock Original Shadows</span>
                      <input 
                        type="checkbox" 
                        checked={lockLighting} 
                        onChange={(e) => setLockLighting(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-[#12161A] text-[#F07A3A] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      />
                    </label>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <p className="text-[10px] uppercase font-bold tracking-widest text-[#737373]">Creative Direction</p>
                    <textarea
                      value={creativeDirection}
                      onChange={(e) => setCreativeDirection(e.target.value)}
                      placeholder="Add specific requirements (e.g. wet concrete reflections, morning fog)..."
                      className="w-full h-28 bg-[#12161A] border border-white/10 rounded-lg py-2 px-3 text-xs focus:outline-none focus:border-[#F07A3A] transition-colors resize-none placeholder:text-[#3E3E3E] font-sans font-light"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="p-6 border-t border-white/5 bg-black/10">
            <button
              onClick={handleRenderSubmit}
              disabled={!selectedImage || jobStatus === 'rendering'}
              className="w-full bg-[#F07A3A] hover:bg-[#FF8B4A] text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 transition-colors shadow-lg shadow-[#F07A3A]/10 focus:outline-none"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {jobStatus === 'rendering' ? 'Processing passes...' : 'Generate AI Render'}
            </button>
          </div>
        </aside>

        {/* Center Panel working viewport */}
        <main className="flex-1 flex flex-col bg-[#07090C] relative">
          <div className="flex-1 p-8 flex items-center justify-center relative">
            {!selectedImage ? (
              // 1. Drag & Drop Pre-Upload Blueprint frame
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-2xl aspect-[16/10] border-2 border-dashed border-white/10 rounded-[2rem] bg-white/[0.02] flex flex-col items-center justify-center gap-4 hover:bg-white/[0.04] hover:border-[#F07A3A]/30 transition-all duration-500 cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6 text-[#737373] group-hover:text-white transition-colors" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-xs uppercase font-bold tracking-widest">Upload sketch blueprint or facade photo</p>
                  <p className="text-[10px] text-[#737373] tracking-wide">Supports PNG, JPG images up to 10MB</p>
                </div>
              </div>
            ) : (
              // 2. Active Canvas workspace viewport
              <div className="w-full max-w-4xl aspect-[16/10] bg-[#0E1114] rounded-[2rem] border border-white/5 overflow-hidden relative shadow-2xl">
                
                {jobStatus === 'completed' && renderedOutput ? (
                  // Before after comparison slider mounts
                  <CompareSlider beforeImage={selectedImage} afterImage={renderedOutput} />
                ) : (
                  // Canvas painting mask viewport
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={selectedImage} 
                      className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
                      alt="Input facade sketch" 
                    />
                    
                    <canvas
                      ref={canvasRef}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      className="absolute inset-0 w-full h-full cursor-crosshair z-10"
                    />

                    {/* Mask Brush controls overlay panel */}
                    <div className="absolute bottom-6 left-6 z-20 bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/10 flex items-center gap-4 text-xs font-sans">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#BDBDBD]">Masking Brush</span>
                      <input 
                        type="range" 
                        min="5" 
                        max="80" 
                        value={brushSize} 
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-24 accent-[#F07A3A] cursor-pointer" 
                      />
                      <button 
                        onClick={clearMask} 
                        className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/15 text-[9px] uppercase font-bold rounded-lg tracking-wider focus:outline-none"
                      >
                        Reset Mask
                      </button>
                    </div>

                    <button 
                      onClick={() => setSelectedImage(null)}
                      className="absolute top-6 right-6 z-20 bg-black/60 border border-white/10 p-2 rounded-full hover:bg-red-950/60 hover:border-red-500/50 hover:text-red-400 transition-all focus:outline-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Progress bar and logs console overlay during active rendering */}
                <AnimatePresence>
                  {jobStatus === 'rendering' && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#07090C]/95 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-8 text-center"
                    >
                      <div className="w-16 h-16 border-4 border-[#F07A3A] border-t-transparent rounded-full animate-spin mb-6" />
                      <h3 className="text-sm font-bold uppercase tracking-widest font-sans mb-1 text-white">GPU Path-Tracing</h3>
                      <p className="text-[9px] text-[#F07A3A] uppercase font-bold tracking-[0.2em] mb-8 animate-pulse">Running ComfyUI cloud nodes</p>
                      
                      {/* Terminal Console output */}
                      <div className="w-full max-w-md h-32 rounded-xl bg-black border border-white/5 p-4 text-left font-mono text-[9px] text-emerald-500 overflow-y-auto space-y-1.5 scrollbar-none shadow-inner select-text">
                        {pollingLogs.map((log, idx) => (
                          <div key={idx} className="leading-relaxed">{log}</div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageFile} 
        className="hidden" 
        accept="image/*" 
      />
    </div>
  );
}
