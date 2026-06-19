export interface RenderJobParams {
  roomType: string;
  lightingStyle: string;
  cameraAngle: string;
  cameraMovement: string;
  contextStyle: string;
  weather: string;
  lockGeometry: boolean;
  lockLighting: boolean;
  creativeDirection: string;
}

export interface RenderProgressUpdate {
  progress: number;
  message: string;
  logs: string[];
}

// Maps room categories to calibrated, high-fidelity unwatermarked renderings from the Unsplash index
const RENDER_OUTPUTS: Record<string, string> = {
  'Living Room': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop',
  'Bedroom': 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop',
  'Office': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1200&auto=format&fit=crop',
  'Exterior Facade': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
  'Landscape': 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_RENDER = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop';

// Realistic path-tracing logs printed by the simulated GPU engine
const PIPELINE_LOGS = [
  { threshold: 0, message: '[System] Port initialized. Initializing path tracing buffers.' },
  { threshold: 10, message: '[Engine] Analyzing blueprint lines. Extracting high-contrast contour meshes...' },
  { threshold: 25, message: '[Pipeline] Projecting depth maps and structural occlusion layers...' },
  { threshold: 40, message: '[RayTracer] Dispatching path tracing nodes: calculating GI passes (32/128)...' },
  { threshold: 55, message: '[RayTracer] Dispatching path tracing nodes: calculating GI passes (96/128)...' },
  { threshold: 70, message: '[Shader] Applying PBR concrete, oak, and low-E glass materials...' },
  { threshold: 82, message: '[Atmosphere] Simulating volumetric mist scatter and solar sunbeams...' },
  { threshold: 92, message: '[Filter] Running AI denoise kernels (Intel OIDN Filter Pass)...' },
  { threshold: 98, message: '[System] Compiling output matrix. Preparing 8K frame buffer.' }
];

/**
 * Runs a simulated high-end path-tracing render engine pipeline, calling the
 * onProgress callback over time, and returning the matched render output when complete.
 */
export const runSimulatedRenderEngine = (
  params: RenderJobParams,
  onProgress: (update: RenderProgressUpdate) => void
): Promise<string> => {
  return new Promise((resolve) => {
    let currentProgress = 0;
    const activeLogs: string[] = [];

    const interval = setInterval(() => {
      // Advance progress incrementally
      const increment = Math.floor(Math.random() * 8) + 4;
      currentProgress = Math.min(100, currentProgress + increment);

      // Check if new log updates are triggered at this progress index
      PIPELINE_LOGS.forEach((log) => {
        if (currentProgress >= log.threshold && !activeLogs.includes(log.message)) {
          activeLogs.push(log.message);
        }
      });

      // Send update callback
      onProgress({
        progress: currentProgress,
        message: activeLogs[activeLogs.length - 1] || 'Running render compiles...',
        logs: [...activeLogs]
      });

      if (currentProgress >= 100) {
        clearInterval(interval);
        // Resolve output image URL corresponding to Room type
        const resolvedImage = RENDER_OUTPUTS[params.roomType] || DEFAULT_RENDER;
        resolve(resolvedImage);
      }
    }, 450); // Updates every 450ms, compiling a full render in ~6-8 seconds
  });
};
