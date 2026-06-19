import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { VisionChat } from '../types.ts';
import { streamArchitecturalAI } from '../services/geminiService.ts';
import { useStudioStore } from '../store.ts';
import BeforeAfterSlider from './BeforeAfterSlider.tsx';
import { runSimulatedRenderEngine } from '../services/renderEngine.ts';

type BuilderTab = 'lighting' | 'camera' | 'motion' | 'context';
type ArcVizStep = 'setup' | 'workspace';
type WorkspaceTab = 'canvas' | 'chat';

interface GuidedPromptState {
  lightingStyle: string;
  timeOfDay: string;
  cameraAngle: string;
  cameraMovement: string;
  videoDuration: string;
  contextStyle: string;
  weather: string;
  lockGeometry: boolean;
  lockLighting: boolean;
  creativeDirection: string;
}

const BUILDER_TABS: Array<{ id: BuilderTab; label: string }> = [
  { id: 'lighting', label: 'Lighting' },
  { id: 'camera', label: 'Camera' },
  { id: 'motion', label: 'Motion' },
  { id: 'context', label: 'Context' },
];

const LIGHTING_STYLES = [
  'No Preference (Keep Original)',
  'Natural: Bright Daylight (High Noon, 5500K)',
  'Natural: Golden Hour (Warm Sunrise/Sunset)',
  'Natural: Magic Hour (Soft Pink/Blue Hues)',
  'Natural: Overcast / Diffused (Soft Shadows)',
  'Natural: Foggy / Atmospheric Mist (Volumetric)',
  'Natural: Stormy / Dramatic (Dark Clouds)',
  'Natural: Dappled Sunlight (Filtered through Trees)',
  'Mixed: Blue Hour (Twilight + Warm Interior Glow)',
  'Mixed: Dusk (Cool Exterior + Artificial Street Lights)',
  'Mixed: Rainy Night (City Lights + Wet Reflections)',
  'Mixed: Indoor/Outdoor Balance (Daylight + Interior Fill)',
  'Mixed: Morning Sunbeams (God Rays through Openings)',
  'Artificial: Warm Interior Tungsten (3000K)',
  'Artificial: Modern Clinical (4000K-5000K)',
  'Artificial: Neon / Cyberpunk (Teal & Orange)',
  'Studio: Softbox High-Key (Bright & Airy)',
  'Studio: Low-Key / Chiaroscuro (Dramatic Contrast)',
];

const CAMERA_ANGLES = [
  'No Preference (Keep Original)',
  'Wide Shot (Expansive, Environmental)',
  'Close-up (Macro, Detail-oriented)',
  'Aerial View (Birds-eye, Drone shot)',
  'Dutch Angle (Tilted, Dynamic)',
  'Low Angle (Heroic, Imposing)',
  'Eye Level (Natural, Relatable)',
  'One-Point Perspective (Symmetrical)',
];

const CAMERA_MOVEMENTS = [
  'No Preference (Let AI Decide)',
  'Pan (Horizontal Rotation)',
  'Tilt (Vertical Rotation)',
  'Dolly In / Push In (Forward Movement)',
  'Dolly Out / Pull Back (Backward Movement)',
  'Truck (Lateral Movement)',
  'Pedestal (Vertical Translation)',
  'Crane / Boom Shot',
  'Orbit / Arc (Turntable)',
  'Fly-Through (Continuous Path)',
  'Fly-Over (Birds Eye)',
  'Tracking / Follow Shot',
  'Zoom (Lens-Based)',
  'Dolly Zoom (Vertigo / Zolly Effect)',
  'Roll (Dutch Angle Movement)',
  'Steadicam / Handheld',
  'Drone Shot (Aerial Path)',
  'Reveal Shot (Wipe / Sliding Reveal)',
  'Pull-Back Reveal',
  'Whip Pan / Swish Pan',
  'Static Shot (Locked-Off)',
  'Parallax Movement (Slow Dolly/Truck)',
  'Rack Focus (Depth Shift)',
  'POV (First Person Walk)',
];

const VIDEO_DURATIONS = ['8s', '10s', '15s', '20s', '30s'];
const CONTEXT_STYLES = ['Minimal', 'Urban Premium', 'Tropical Landscape', 'Studio Background'];
const WEATHER_STYLES = ['Keep Original', 'Clear', 'Overcast', 'After Rain', 'Harmattan Haze'];
const ROOMS = ['Living Room', 'Bedroom', 'Kitchen', 'Office', 'Exterior Facade', 'Landscape'];
const TRIAL_RENDER_LIMIT = 4;

const ArcVizPage: React.FC = () => {
  const navigate = useNavigate();
  const { auth, arcvizTrialUsed, incrementArcvizTrial } = useStudioStore();
  const isProPlan = auth.isAuthenticated && auth.plan === 'pro';
  
  // Workspace Stepper & Navigation Tabs
  const [step, setStep] = useState<ArcVizStep>('setup');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('canvas');
  
  // Parameter settings
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [qualityChecks, setQualityChecks] = useState({
    lighting: false,
    angle: false,
    coverage: false,
  });

  // Gemini Chat Logs
  const [messages, setMessages] = useState<VisionChat[]>([
    {
      role: 'assistant',
      content: 'ArcViz Agent online. Upload your sketch/brief and control camera, lighting, motion, and constraints for production-ready architectural visualization outputs.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [activeBuilderTab, setActiveBuilderTab] = useState<BuilderTab>('camera');
  
  // Upload photo states
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  
  // Form parameters
  const [guidedPrompt, setGuidedPrompt] = useState<GuidedPromptState>({
    lightingStyle: 'No Preference (Keep Original)',
    timeOfDay: 'No Preference (Keep Original)',
    cameraAngle: 'No Preference (Keep Original)',
    cameraMovement: 'No Preference (Let AI Decide)',
    videoDuration: '10s',
    contextStyle: 'Urban Premium',
    weather: 'Keep Original',
    lockGeometry: true,
    lockLighting: false,
    creativeDirection: '',
  });

  // Simulated Render Engine Telemetry States
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderLogs, setRenderLogs] = useState<string[]>([]);
  const [generatedRender, setGeneratedRender] = useState<{ before: string; after: string } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const consoleScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTrialPlan = !isProPlan;
  const trialRemaining = Math.max(0, TRIAL_RENDER_LIMIT - arcvizTrialUsed);
  const trialExceeded = isTrialPlan && trialRemaining <= 0;

  const isTabLockedForTrial = (tab: BuilderTab) => isTrialPlan && (tab === 'motion' || tab === 'context');

  // Auto scroll handles for chat and telemetry console logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent, isLoading]);

  useEffect(() => {
    if (consoleScrollRef.current) {
      consoleScrollRef.current.scrollTop = consoleScrollRef.current.scrollHeight;
    }
  }, [renderLogs, renderProgress]);

  const updateGuidedPrompt = <K extends keyof GuidedPromptState>(key: K, value: GuidedPromptState[K]) => {
    setGuidedPrompt((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const data = base64.split(',')[1];
      setSelectedImage({ data, mimeType: file.type, preview: base64 });
      // Reset generated results when swapping input photo
      setGeneratedRender(null);
    };
    reader.readAsDataURL(file);
  };

  const buildGuidedInstruction = () => {
    const lockRules: string[] = [];
    if (guidedPrompt.lockGeometry) {
      lockRules.push('Lock geometry and structure. Do not alter massing, footprint, or architectural components.');
    }
    if (guidedPrompt.lockLighting) {
      lockRules.push('Lock original lighting and shadows. Preserve lighting direction and intensity.');
    }

    const creativeDirection = guidedPrompt.creativeDirection.trim();

    return [
      'Architectural Visualization Direction Packet',
      `- Room Type: ${selectedRoom || 'Unspecified'}`,
      `- Lighting Style: ${guidedPrompt.lightingStyle}`,
      `- Time of Day: ${guidedPrompt.timeOfDay}`,
      `- Camera Angle: ${guidedPrompt.cameraAngle}`,
      `- Camera Movement: ${guidedPrompt.cameraMovement}`,
      `- Video Duration: ${guidedPrompt.videoDuration}`,
      `- Context Style: ${guidedPrompt.contextStyle}`,
      `- Weather: ${guidedPrompt.weather}`,
      ...lockRules.map((rule) => `- Constraint: ${rule}`),
      creativeDirection ? `- Creative Direction: ${creativeDirection}` : '- Creative Direction: None',
      'Preservation Rules: never deform sketch line-work, floor plan topology, facade rhythm, or structural proportions.',
      'Return output as: (1) concept summary, (2) shot list, (3) render settings, (4) negative prompts to avoid distortion.',
    ].join('\n');
  };

  // Run the core GPU Simulated Render Engine + Gemini chat logs analysis in parallel
  const handleGenerateRender = async () => {
    if (isRendering || !selectedImage) return;

    if (trialExceeded) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Trial limit reached. Upgrade to Studio Pro to continue generating renders and unlock advanced tools.'
      }]);
      setActiveWorkspaceTab('chat');
      return;
    }

    // Swaps output tab to visual rendering canvas
    setActiveWorkspaceTab('canvas');
    setIsRendering(true);
    setRenderProgress(0);
    setRenderLogs([]);

    const renderParams = {
      roomType: selectedRoom,
      lightingStyle: guidedPrompt.lightingStyle,
      cameraAngle: guidedPrompt.cameraAngle,
      cameraMovement: guidedPrompt.cameraMovement,
      contextStyle: guidedPrompt.contextStyle,
      weather: guidedPrompt.weather,
      lockGeometry: guidedPrompt.lockGeometry,
      lockLighting: guidedPrompt.lockLighting,
      creativeDirection: guidedPrompt.creativeDirection,
    };

    // 1. Kick off the parallel text analysis query to Gemini strategist in the background
    handleSend(buildGuidedInstruction(), true);

    // 2. Trigger core simulated render engine path-tracing loop
    try {
      const outputImageUrl = await runSimulatedRenderEngine(renderParams, (update) => {
        setRenderProgress(update.progress);
        setRenderLogs(update.logs);
      });

      // Save output pairs when complete
      setGeneratedRender({
        before: selectedImage.preview,
        after: outputImageUrl,
      });
    } catch (err) {
      console.error('Core render engine crash:', err);
    } finally {
      setIsRendering(false);
    }
  };

  const handleSend = async (messageText?: string, isBackgroundQuery = false) => {
    const outboundPrompt = messageText ?? input;
    if (!outboundPrompt.trim() && !selectedImage) return;

    const userMessage: VisionChat = {
      role: 'user',
      content: outboundPrompt.trim() ? outboundPrompt : '[Image analysis request]'
    };

    const currentHistory = [...messages];
    const imageToSend = selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined;

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    if (isTrialPlan && !isBackgroundQuery) {
      incrementArcvizTrial();
    }

    try {
      let fullResponse = '';
      const stream = streamArchitecturalAI(
        outboundPrompt.trim() ? outboundPrompt : 'Analyze this architectural reference and generate production-ready visualization guidance.',
        currentHistory,
        imageToSend
      );

      for await (const chunk of stream) {
        fullResponse += chunk;
        setStreamingContent(fullResponse);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullResponse }]);
      setStreamingContent('');
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'ArcViz processing failed. Please retry your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isSetupComplete = Boolean(
    selectedRoom &&
    selectedImage &&
    qualityChecks.lighting &&
    qualityChecks.angle &&
    qualityChecks.coverage
  );

  return (
    <div className="min-h-screen bg-background text-text-main font-sans overflow-x-hidden">
      <Helmet>
        <title>ArcViz Agent | Figment Studio</title>
        <meta name="description" content="Advanced architectural visualization agent for renders, animation direction, and controlled sketch-preserving output." />
      </Helmet>

      {/* Header Panel */}
      <header className="sticky top-0 z-40 border-b border-border-ui bg-background/95 backdrop-blur-md">
        <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6 text-left">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-primary">ArcViz Agent</p>
              <h1 className="text-lg md:text-xl font-display font-light text-white tracking-wide leading-none uppercase mt-1">
                Visual Workspace
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isTrialPlan && (
              <span className="hidden md:inline-flex rounded-full bg-primary/10 text-primary border border-primary/20 px-4 py-1 text-[10px] font-semibold uppercase tracking-widest font-sans">
                Trial: {trialRemaining}/{TRIAL_RENDER_LIMIT} Left
              </span>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-border-ui text-[10px] font-bold uppercase tracking-widest hover:border-white/30 hover:text-white transition-all font-sans"
            >
              Back To Home
            </button>
            <button
              onClick={() => navigate('/estimator')}
              className="px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest hover:brightness-110 transition-all font-sans"
            >
              Get Estimate
            </button>
          </div>
        </div>
      </header>

      {step === 'setup' ? (
        // Setup workflow
        <main className="max-w-[980px] mx-auto px-6 md:px-10 py-16 space-y-8">
          <div className="space-y-3 text-left">
            <p className="text-[10px] uppercase font-bold tracking-[0.25em] text-primary font-sans">AI REDIRECT SETUP</p>
            <h2 className="font-display font-light text-white text-3xl md:text-5xl uppercase leading-tight tracking-tight">Select Room & Upload Sketch</h2>
            <p className="text-text-secondary text-sm font-sans font-light">Confirm the category parameters and calibration checklist below to initiate the path-tracing pipeline.</p>
          </div>

          <section className="rounded-2xl border border-border-ui bg-surface p-8 space-y-8 text-left">
            {isTrialPlan && (
              <div className="rounded-xl border border-[#F07A3A]/20 bg-[#F07A3A]/5 p-4 text-xs text-[#F07A3A] font-sans flex items-start gap-3">
                <span className="material-symbols-outlined mt-0.5">info</span>
                <div>
                  <strong className="uppercase block mb-1">Trial Mode Active</strong>
                  Receive up to 4 renders with core parameters. Upgrade to a studio account to unlock continuous video walk cycles, environment context styling, and high-precision API rendering.
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">1. Category Selection</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROOMS.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoom(room)}
                    className={`rounded-xl border p-4 text-xs font-semibold uppercase tracking-wider text-left transition-all ${
                      selectedRoom === room 
                        ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/5' 
                        : 'border-border-ui hover:bg-background-alt text-text-secondary hover:text-white'
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">2. Image Upload (Sketch, Clay render or Facade)</p>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              {!selectedImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-2xl border-2 border-dashed border-border-ui/80 bg-background-alt py-16 text-xs uppercase tracking-widest font-bold text-text-muted hover:border-primary/40 hover:text-primary transition-all duration-300 flex flex-col items-center justify-center gap-4"
                >
                  <span className="material-symbols-outlined text-4xl">upload_file</span>
                  Click to select sketch or facade file
                </button>
              ) : (
                <div className="rounded-2xl border border-border-ui bg-background-alt p-5 flex flex-col sm:flex-row items-center gap-6">
                  <img src={selectedImage.preview} alt="Room preview" className="h-24 w-24 rounded-xl object-cover border border-border-ui" />
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-bold uppercase tracking-wide text-white font-display">Reference Image Active</p>
                    <p className="text-xs text-text-muted mt-1 font-sans">We will process this image asset to generate your high-fidelity, structure-preserving visual rendering.</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg border border-border-ui px-4 py-2 text-[10px] font-bold uppercase tracking-widest hover:border-white/30 hover:text-white transition-all font-sans bg-surface"
                  >
                    Change Photo
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">3. Quality Checklist</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-sans">
                <label className="rounded-xl border border-border-ui bg-background-alt p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-white flex items-center justify-between cursor-pointer transition-colors">
                  Good lighting details
                  <input
                    type="checkbox"
                    checked={qualityChecks.lighting}
                    onChange={(e) => setQualityChecks((prev) => ({ ...prev, lighting: e.target.checked }))}
                    className="h-4 w-4 rounded border-border-ui bg-surface text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
                <label className="rounded-xl border border-border-ui bg-background-alt p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-white flex items-center justify-between cursor-pointer transition-colors">
                  Straight perspective
                  <input
                    type="checkbox"
                    checked={qualityChecks.angle}
                    onChange={(e) => setQualityChecks((prev) => ({ ...prev, angle: e.target.checked }))}
                    className="h-4 w-4 rounded border-border-ui bg-surface text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
                <label className="rounded-xl border border-border-ui bg-background-alt p-4 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-white flex items-center justify-between cursor-pointer transition-colors">
                  Full spatial coverage
                  <input
                    type="checkbox"
                    checked={qualityChecks.coverage}
                    onChange={(e) => setQualityChecks((prev) => ({ ...prev, coverage: e.target.checked }))}
                    className="h-4 w-4 rounded border-border-ui bg-surface text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border-ui">
              <button
                onClick={() => navigate('/')}
                className="rounded-lg border border-border-ui px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:border-white/30 hover:text-white transition-all font-sans"
              >
                Back
              </button>
              <button
                onClick={() => setStep('workspace')}
                disabled={!isSetupComplete || trialExceeded}
                className="rounded-lg bg-primary hover:bg-primary-hover px-8 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-sans shadow-lg shadow-primary/10"
              >
                Continue to workspace
              </button>
            </div>
          </section>
        </main>
      ) : (
        // Active Workspace View
        <main className="max-w-[1600px] mx-auto px-6 md:px-10 py-10 grid grid-cols-1 xl:grid-cols-12 gap-8 text-left">
          {/* Left Parameter Panel */}
          <section className="xl:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border-ui bg-surface overflow-hidden">
              <div className="grid grid-cols-4 border-b border-border-ui font-sans">
                {BUILDER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => !isTabLockedForTrial(tab.id) && setActiveBuilderTab(tab.id)}
                    disabled={isTabLockedForTrial(tab.id)}
                    className={`py-3.5 text-[9px] uppercase tracking-[0.18em] font-semibold transition-colors ${
                      activeBuilderTab === tab.id ? 'bg-background-alt text-primary' : 'text-text-muted hover:text-white'
                    } disabled:opacity-30`}
                  >
                    {tab.label}
                    {isTabLockedForTrial(tab.id) && '*'}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-4 text-white">
                {activeBuilderTab === 'lighting' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Lighting Style</label>
                    <select
                      value={guidedPrompt.lightingStyle}
                      onChange={(e) => updateGuidedPrompt('lightingStyle', e.target.value)}
                      className="w-full rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      {LIGHTING_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                )}

                {activeBuilderTab === 'camera' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Camera Angle</label>
                    <select
                      value={guidedPrompt.cameraAngle}
                      onChange={(e) => updateGuidedPrompt('cameraAngle', e.target.value)}
                      className="w-full rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      {CAMERA_ANGLES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                )}

                {activeBuilderTab === 'motion' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Camera Movement</label>
                      <select
                        value={guidedPrompt.cameraMovement}
                        onChange={(e) => updateGuidedPrompt('cameraMovement', e.target.value)}
                        className="w-full rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {CAMERA_MOVEMENTS.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Video Duration</label>
                      <select
                        value={guidedPrompt.videoDuration}
                        onChange={(e) => updateGuidedPrompt('videoDuration', e.target.value)}
                        className="w-full rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {VIDEO_DURATIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {activeBuilderTab === 'context' && (
                  <div className="space-y-4 font-sans">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Context Style</label>
                      <select
                        value={guidedPrompt.contextStyle}
                        onChange={(e) => updateGuidedPrompt('contextStyle', e.target.value)}
                        className="w-full rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {CONTEXT_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Weather</label>
                      <select
                        value={guidedPrompt.weather}
                        onChange={(e) => updateGuidedPrompt('weather', e.target.value)}
                        className="w-full rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs focus:outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        {WEATHER_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-primary">Creative Direction</label>
                      <textarea
                        value={guidedPrompt.creativeDirection}
                        onChange={(e) => updateGuidedPrompt('creativeDirection', e.target.value)}
                        placeholder="Add specific requirements (e.g., biophilic elements, sunset mist)..."
                        className="w-full min-h-[90px] rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-3 py-3 text-xs placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border-ui space-y-3 font-sans">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Enhancement Constraints</p>
                  <label className="flex items-center justify-between rounded-lg border border-border-ui bg-background-alt px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary cursor-pointer hover:text-white transition-colors">
                    <span>Lock Geometry & Structure</span>
                    <input
                      type="checkbox"
                      checked={guidedPrompt.lockGeometry}
                      onChange={(e) => updateGuidedPrompt('lockGeometry', e.target.checked)}
                      className="h-4 w-4 rounded border-border-ui bg-surface text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between rounded-lg border border-border-ui bg-background-alt px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-text-secondary cursor-pointer hover:text-white transition-colors">
                    <span>Lock Original Lighting</span>
                    <input
                      type="checkbox"
                      checked={guidedPrompt.lockLighting}
                      onChange={(e) => updateGuidedPrompt('lockLighting', e.target.checked)}
                      className="h-4 w-4 rounded border-border-ui bg-surface text-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  </label>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={handleGenerateRender}
                    disabled={isRendering || trialExceeded}
                    className="w-full rounded-xl bg-primary hover:bg-primary-hover py-3.5 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all font-sans shadow-lg shadow-primary/10 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">auto_awesome</span>
                    {isRendering ? 'Processing Engine passes...' : 'Generate AI Render'}
                  </button>
                  {isTrialPlan && (
                    <button
                      onClick={() => navigate('/auth?upgrade=pro')}
                      className="w-full rounded-xl border border-primary text-primary py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/15 transition-all font-sans"
                    >
                      Upgrade To Studio Pro
                    </button>
                  )}
                  <button
                    onClick={() => setStep('setup')}
                    className="w-full rounded-xl border border-border-ui py-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:border-white/30 hover:text-white transition-all font-sans bg-background-alt"
                  >
                    Back To Setup
                  </button>
                </div>
              </div>
            </div>

            {/* Asset Input Preview Thumbnail */}
            <div className="rounded-2xl border border-border-ui bg-surface p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Active Asset Input</p>
              {selectedImage ? (
                <div className="rounded-xl border border-border-ui bg-background-alt p-3 flex items-center gap-3">
                  <img src={selectedImage.preview} alt="Reference" className="size-14 rounded-lg object-cover border border-border-ui" />
                  <div className="text-left font-sans">
                    <p className="text-[10px] font-semibold text-white uppercase tracking-wider">Reference Active</p>
                    <p className="text-[8px] text-text-muted uppercase tracking-widest mt-0.5">{selectedRoom}</p>
                  </div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="ml-auto text-[9px] font-bold uppercase tracking-wider text-text-muted hover:text-red-400 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-xl border border-dashed border-border-ui p-6 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:border-primary/45 hover:text-primary transition-all font-sans"
                >
                  Upload Sketch File
                </button>
              )}
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
          </section>

          {/* Right Workspace Tabs Container */}
          <section className="xl:col-span-8 rounded-2xl border border-border-ui bg-surface flex flex-col min-h-[72vh] overflow-hidden">
            {/* Dual Tab navigation bar */}
            <div className="flex border-b border-border-ui bg-background-alt font-sans">
              <button
                onClick={() => setActiveWorkspaceTab('canvas')}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative focus:outline-none ${
                  activeWorkspaceTab === 'canvas' ? 'text-primary bg-surface/30' : 'text-text-muted hover:text-white'
                }`}
              >
                AI Render View
                {activeWorkspaceTab === 'canvas' && (
                  <motion.div
                    layoutId="workspaceTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                onClick={() => setActiveWorkspaceTab('chat')}
                className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative focus:outline-none ${
                  activeWorkspaceTab === 'chat' ? 'text-primary bg-surface/30' : 'text-text-muted hover:text-white'
                }`}
              >
                Advisor Chat Logs
                {activeWorkspaceTab === 'chat' && (
                  <motion.div
                    layoutId="workspaceTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            {/* TAB CONTENT: AI Render View */}
            {activeWorkspaceTab === 'canvas' && (
              <div className="flex-1 flex flex-col justify-between p-6 md:p-8 min-h-[50vh]">
                {isRendering ? (
                  // Rendering Progress View
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto space-y-6">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <div className="space-y-2">
                      <h3 className="font-display text-white text-xl uppercase tracking-wider">Path-Tracing GPU Compile</h3>
                      <p className="text-[10px] text-primary uppercase font-bold tracking-[0.25em] animate-pulse">Running ComfyUI cloud nodes</p>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="w-full space-y-2 font-sans">
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-text-muted">
                        <span>Ray-Tracing progress</span>
                        <span className="text-primary">{renderProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-background-alt border border-border-ui rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full bg-primary"
                          animate={{ width: `${renderProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Real-time Telemetry Logs output */}
                    <div
                      ref={consoleScrollRef}
                      className="w-full h-44 rounded-xl bg-[#090C0E] border border-border-ui p-4 text-left font-mono text-[9px] text-emerald-500 overflow-y-auto space-y-1.5 scrollbar-none shadow-inner"
                    >
                      {renderLogs.map((log, idx) => (
                        <div key={idx} className="leading-relaxed">{log}</div>
                      ))}
                    </div>
                  </div>
                ) : generatedRender ? (
                  // Render output slider Comparison view
                  <div className="flex-1 flex flex-col justify-between space-y-6 animate-in fade-in duration-500">
                    <div className="flex-1 flex items-center justify-center">
                      <BeforeAfterSlider
                        beforeImage={generatedRender.before}
                        afterImage={generatedRender.after}
                      />
                    </div>
                    {/* Action buttons below render results */}
                    <div className="flex flex-col sm:flex-row gap-4 border-t border-border-ui/60 pt-6 font-sans">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = generatedRender.after;
                          link.target = '_blank';
                          link.download = `ArcViz_${selectedRoom}_AI_Render.jpg`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="flex-1 py-3 border border-white/10 hover:border-white/20 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-white transition-all bg-background-alt rounded-lg"
                      >
                        Download Master Render
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedRender(null);
                        }}
                        className="flex-1 py-3 bg-primary hover:bg-primary-hover text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg shadow-lg shadow-primary/10"
                      >
                        Start New Visual Target
                      </button>
                    </div>
                  </div>
                ) : (
                  // Blueprint Placeholder View
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto space-y-6">
                    <div className="w-16 h-16 rounded-full bg-background-alt border border-border-ui flex items-center justify-center text-text-muted group">
                      <span className="material-symbols-outlined text-4xl text-primary animate-pulse">grid_on</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-display text-white text-lg uppercase tracking-wider">AI Render Workspace Idle</h4>
                      <p className="text-text-secondary text-xs font-light leading-relaxed font-sans">
                        Configure the lighting, camera angle, and constraints in the settings panel, then click **Generate AI Render** to start structural translation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: Design Advisor Chat Logs */}
            {activeWorkspaceTab === 'chat' && (
              <div className="flex-1 flex flex-col h-full justify-between min-h-[50vh]">
                <div className="p-4 border-b border-border-ui/60 bg-background-alt/30 text-left font-sans flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-primary">Advisor Logs Thread</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-text-muted">{selectedRoom || 'Room'} analysis</span>
                </div>

                {/* Conversation list */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[55vh] custom-scrollbar">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] px-5 py-4 rounded-xl text-xs leading-relaxed text-left whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-primary text-white rounded-tr-none font-semibold shadow-lg shadow-primary/10'
                            : 'bg-background-alt border border-border-ui text-text-secondary rounded-tl-none font-light font-sans'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}

                  {(isLoading || streamingContent) && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] px-5 py-4 rounded-xl rounded-tl-none bg-background-alt border border-border-ui text-text-secondary text-xs whitespace-pre-wrap text-left font-light font-sans animate-pulse">
                        {streamingContent || 'Principal strategist writing concept notes...'}
                      </div>
                    </div>
                  )}
                </div>

                {/* Message input bar */}
                <div className="p-4 border-t border-border-ui bg-background-alt flex gap-3 font-sans">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Enter visual directions or detail overrides..."
                    className="flex-1 rounded-lg border border-border-ui bg-[#1A1A1A] text-white px-4 py-3 text-xs outline-none focus:border-primary placeholder:text-text-muted"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={isLoading || (!input.trim() && !selectedImage) || trialExceeded}
                    className="px-6 rounded-lg bg-primary hover:bg-primary-hover text-white text-[10px] font-bold uppercase tracking-widest disabled:opacity-35 disabled:cursor-not-allowed transition-all font-sans shadow-lg shadow-primary/10"
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
};

export default ArcVizPage;
