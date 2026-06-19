import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { VisionChat } from '../types.ts';
import { streamArchitecturalAI } from '../services/geminiService.ts';
import { useStudioStore } from '../store.ts';

type BuilderTab = 'lighting' | 'camera' | 'motion' | 'context';
type ArcVizStep = 'setup' | 'workspace';

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
  const [step, setStep] = useState<ArcVizStep>('setup');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [qualityChecks, setQualityChecks] = useState({
    lighting: false,
    angle: false,
    coverage: false,
  });
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
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isTrialPlan = !isProPlan;
  const trialRemaining = Math.max(0, TRIAL_RENDER_LIMIT - arcvizTrialUsed);
  const trialExceeded = isTrialPlan && trialRemaining <= 0;

  const isTabLockedForTrial = (tab: BuilderTab) => isTrialPlan && (tab === 'motion' || tab === 'context');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent, isLoading]);

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

  const handleSend = async (message?: string) => {
    if (isLoading) return;

    if (trialExceeded) {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: 'Trial limit reached. Upgrade to Studio Pro to continue generating renders and unlock motion/context tools.'
      }]);
      return;
    }

    const outboundPrompt = message ?? input;
    if ((!outboundPrompt.trim() && !selectedImage)) return;

    const userMessage: VisionChat = {
      role: 'user',
      content: outboundPrompt.trim() ? outboundPrompt : '[Image analysis request]'
    };

    const currentHistory = [...messages];
    const imageToSend = selectedImage ? { data: selectedImage.data, mimeType: selectedImage.mimeType } : undefined;

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsLoading(true);
    setStreamingContent('');
    if (isTrialPlan) {
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
    <div className="min-h-screen bg-background text-text-main font-display">
      <Helmet>
        <title>ArcViz Agent | Figment Studio</title>
        <meta name="description" content="Advanced architectural visualization agent for renders, animation direction, and controlled sketch-preserving output." />
      </Helmet>

      <header className="sticky top-0 z-40 border-b border-border-ui bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">ArcViz Workspace</p>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Architectural Visualization Agent</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isTrialPlan && (
              <span className="hidden md:inline-flex rounded-full bg-primary/10 text-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
                Trial: {trialRemaining}/{TRIAL_RENDER_LIMIT} Left
              </span>
            )}
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-md border border-border-ui text-xs font-semibold tracking-wide hover:bg-background-alt transition-colors"
            >
              Back To Home
            </button>
            <button
              onClick={() => navigate('/estimator')}
              className="px-4 py-2 rounded-md bg-text-main text-white text-xs font-semibold tracking-wide hover:bg-[#2a2420] transition-colors"
            >
              Get Estimate
            </button>
          </div>
        </div>
      </header>

      {step === 'setup' ? (
        <main className="max-w-[980px] mx-auto px-6 md:px-10 py-10 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Select Room & Upload Reference</h2>
            <p className="text-text-muted">Prepare one clear image and confirm quality checks before running ArcViz generation.</p>
          </div>

          <section className="rounded-xl border border-border-ui bg-white p-6 md:p-8 space-y-6">
            {isTrialPlan && (
              <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                Trial mode: Up to 4 renders with core controls (Lighting + Camera). Upgrade to Studio Pro for motion, context, and advanced orchestration tools.
              </div>
            )}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Room Type</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ROOMS.map((room) => (
                  <button
                    key={room}
                    onClick={() => setSelectedRoom(room)}
                    className={`rounded-md border px-4 py-3 text-sm font-medium text-left transition-colors ${selectedRoom === room ? 'border-primary bg-primary/10 text-text-main' : 'border-border-ui hover:bg-background-alt'}`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Reference Image</p>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              {!selectedImage ? (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full rounded-lg border-2 border-dashed border-border-ui bg-background-alt py-10 text-sm font-medium hover:bg-[#ece7df] transition-colors"
                >
                  Click to upload room or facade image
                </button>
              ) : (
                <div className="rounded-lg border border-border-ui bg-background-alt p-4 flex items-center gap-4">
                  <img src={selectedImage.preview} alt="Room preview" className="h-20 w-20 rounded-md object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Image ready for ArcViz</p>
                    <p className="text-xs text-text-muted">Use a straight, well-lit, full-room frame for best results.</p>
                  </div>
                  <button onClick={() => fileInputRef.current?.click()} className="rounded-md border border-border-ui px-3 py-2 text-xs font-medium hover:bg-white transition-colors">Change Photo</button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Quality Checklist</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="rounded-md border border-border-ui bg-white p-4 text-sm font-medium flex items-center justify-between">
                  Good lighting
                  <input type="checkbox" checked={qualityChecks.lighting} onChange={(e) => setQualityChecks((prev) => ({ ...prev, lighting: e.target.checked }))} className="h-4 w-4 accent-primary" />
                </label>
                <label className="rounded-md border border-border-ui bg-white p-4 text-sm font-medium flex items-center justify-between">
                  Straight angle
                  <input type="checkbox" checked={qualityChecks.angle} onChange={(e) => setQualityChecks((prev) => ({ ...prev, angle: e.target.checked }))} className="h-4 w-4 accent-primary" />
                </label>
                <label className="rounded-md border border-border-ui bg-white p-4 text-sm font-medium flex items-center justify-between">
                  Full room view
                  <input type="checkbox" checked={qualityChecks.coverage} onChange={(e) => setQualityChecks((prev) => ({ ...prev, coverage: e.target.checked }))} className="h-4 w-4 accent-primary" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button onClick={() => navigate('/')} className="rounded-md border border-border-ui px-4 py-2 text-sm font-medium hover:bg-background-alt transition-colors">Back</button>
              <button
                onClick={() => setStep('workspace')}
                disabled={!isSetupComplete || trialExceeded}
                className="rounded-md bg-text-main px-5 py-2 text-sm font-semibold text-white hover:bg-[#2a2420] disabled:opacity-50 transition-colors"
              >
                Continue
              </button>
            </div>
          </section>
        </main>
      ) : (
      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        <section className="xl:col-span-4 space-y-6">
          <div className="rounded-xl border border-border-ui bg-white overflow-hidden">
            <div className="grid grid-cols-4 border-b border-border-ui">
              {BUILDER_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !isTabLockedForTrial(tab.id) && setActiveBuilderTab(tab.id)}
                  disabled={isTabLockedForTrial(tab.id)}
                  className={`py-3 text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors ${
                    activeBuilderTab === tab.id ? 'bg-background-alt text-text-main' : 'text-text-muted hover:text-text-main'
                  } disabled:opacity-40`}
                >
                  {tab.label}
                  {isTabLockedForTrial(tab.id) && ' (Pro)'}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-3 text-text-main">
              {activeBuilderTab === 'lighting' && (
                <>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Lighting Style</label>
                  <select value={guidedPrompt.lightingStyle} onChange={(e) => updateGuidedPrompt('lightingStyle', e.target.value)} className="w-full rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm">
                    {LIGHTING_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </>
              )}

              {activeBuilderTab === 'camera' && (
                <>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Camera Angle</label>
                  <select value={guidedPrompt.cameraAngle} onChange={(e) => updateGuidedPrompt('cameraAngle', e.target.value)} className="w-full rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm">
                    {CAMERA_ANGLES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </>
              )}

              {activeBuilderTab === 'motion' && (
                <>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Camera Movement</label>
                  <select value={guidedPrompt.cameraMovement} onChange={(e) => updateGuidedPrompt('cameraMovement', e.target.value)} className="w-full rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm">
                    {CAMERA_MOVEMENTS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Video Duration</label>
                  <select value={guidedPrompt.videoDuration} onChange={(e) => updateGuidedPrompt('videoDuration', e.target.value)} className="w-full rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm">
                    {VIDEO_DURATIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </>
              )}

              {activeBuilderTab === 'context' && (
                <>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Context Style</label>
                  <select value={guidedPrompt.contextStyle} onChange={(e) => updateGuidedPrompt('contextStyle', e.target.value)} className="w-full rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm">
                    {CONTEXT_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Weather</label>
                  <select value={guidedPrompt.weather} onChange={(e) => updateGuidedPrompt('weather', e.target.value)} className="w-full rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm">
                    {WEATHER_STYLES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <label className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Creative Direction</label>
                  <textarea value={guidedPrompt.creativeDirection} onChange={(e) => updateGuidedPrompt('creativeDirection', e.target.value)} placeholder="Add specific requirements..." className="w-full min-h-[90px] rounded-md border border-border-ui bg-white px-3 py-2.5 text-sm placeholder:text-text-muted" />
                </>
              )}

              <div className="pt-2 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">Enhancement Constraints</p>
                <label className="flex items-center justify-between rounded-md border border-border-ui bg-background-alt px-3 py-2.5 text-sm">
                  <span>Lock Geometry & Structure</span>
                  <input type="checkbox" checked={guidedPrompt.lockGeometry} onChange={(e) => updateGuidedPrompt('lockGeometry', e.target.checked)} className="h-4 w-4 accent-primary" />
                </label>
                <label className="flex items-center justify-between rounded-md border border-border-ui bg-background-alt px-3 py-2.5 text-sm">
                  <span>Lock Lighting & Shadows</span>
                  <input type="checkbox" checked={guidedPrompt.lockLighting} onChange={(e) => updateGuidedPrompt('lockLighting', e.target.checked)} className="h-4 w-4 accent-primary" />
                </label>
              </div>

              <button onClick={() => handleSend(buildGuidedInstruction())} disabled={isLoading || trialExceeded} className="w-full rounded-md bg-text-main py-3 text-[11px] font-semibold tracking-wide text-white hover:bg-[#2a2420] disabled:opacity-60 transition-colors">
                {isTrialPlan ? `Generate Trial Render (${trialRemaining} left)` : 'Generate From ArcViz Controls'}
              </button>
              {isTrialPlan && (
                <button onClick={() => navigate('/auth?upgrade=pro')} className="w-full rounded-md border border-primary text-primary py-2.5 text-[11px] font-semibold tracking-wide hover:bg-primary/10 transition-colors">
                  Upgrade To Studio Pro
                </button>
              )}
              <button onClick={() => setStep('setup')} className="w-full rounded-md border border-border-ui py-2.5 text-[11px] font-medium tracking-wide hover:bg-background-alt transition-colors">
                Back To Setup
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-border-ui bg-white p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Asset Input</p>
            {selectedImage ? (
              <div className="rounded-md border border-border-ui bg-background-alt p-3 flex items-center gap-3">
                <img src={selectedImage.preview} alt="Reference" className="size-14 rounded-md object-cover" />
                <button onClick={() => setSelectedImage(null)} className="ml-auto text-xs font-medium tracking-wide">Remove</button>
              </div>
            ) : (
              <button onClick={() => fileInputRef.current?.click()} className="w-full rounded-md border border-dashed border-border-ui p-6 text-xs font-medium tracking-wide hover:bg-background-alt transition-colors">
                Upload Brief / Sketch / Render
              </button>
            )}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
          </div>
        </section>

        <section className="xl:col-span-8 rounded-xl border border-border-ui bg-white flex flex-col min-h-[70vh]">
          <div className="p-5 border-b border-border-ui flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">ArcViz Conversation</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-text-muted">{selectedRoom || 'Room'} • Renders • Animations</p>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-text-main text-white rounded-tr-none font-medium' : 'bg-background-alt border border-border-ui text-text-main rounded-tl-none'}`}>
                  {msg.content}
                </div>
              </div>
            ))}

            {(isLoading || streamingContent) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] px-5 py-4 rounded-lg rounded-tl-none bg-background-alt border border-border-ui text-text-main text-sm whitespace-pre-wrap">
                  {streamingContent || 'Processing architectural response...'}
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-border-ui flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Add additional architectural instruction..."
              className="flex-1 rounded-md border border-border-ui bg-white px-4 py-3 text-sm text-text-main placeholder:text-text-muted outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || (!input.trim() && !selectedImage) || trialExceeded}
              className="px-6 rounded-md bg-text-main text-white text-xs font-semibold tracking-wide hover:bg-[#2a2420] disabled:opacity-50 transition-colors"
            >
              Send
            </button>
          </div>
        </section>
      </main>
      )}
    </div>
  );
};

export default ArcVizPage;
