import React from 'react';
import { Helmet } from 'react-helmet-async';

const PROCESS_GALLERY = [
  {
    id: 'modelling-01',
    step: '01',
    phase: '3D Modeling',
    title: 'Revit Base Model Setup',
    description:
      'Every project starts in Revit with strict layer control, parametric families, and dimensions aligned to the architectural brief before visualization begins.',
    media: '/asokoro-villa-front.jpg',
    tool: 'Autodesk Revit',
    caption: 'BIM skeleton with calibrated levels, walls, and massing.',
  },
  {
    id: 'modelling-02',
    step: '02',
    phase: '3D Modeling',
    title: 'Facade Detailing and Material Mapping',
    description:
      'We define cladding systems, glazing proportions, and key texture references so lighting simulations remain physically accurate in downstream rendering.',
    media: '/asokoro-villa-angle.jpg',
    tool: 'Revit + Material Library',
    caption: 'Exterior language locked before animation and print exports.',
  },
  {
    id: 'printing-01',
    step: '03',
    phase: '3D Printing',
    title: 'Scale Model Preparation',
    description:
      'Clean geometry is exported and sliced for printability, preserving critical architectural details while optimizing structural strength for model handling.',
    media: '/figment_media/3D-Printing.png',
    tool: 'Slicer Workflow',
    caption: 'Wall thickness, supports, and print tolerances tuned for fidelity.',
  },
  {
    id: 'painting-01',
    step: '04',
    phase: 'Painting',
    title: 'Hand Finishing and Weathering',
    description:
      'Printed elements are hand-finished with controlled paint layers to communicate tone, depth, and spatial hierarchy during investor presentations.',
    media: '/asokoro-villa-low-angle.jpg',
    tool: 'Studio Finishing Bench',
    caption: 'Manual finishing adds depth and presentation-grade realism.',
  },
  {
    id: 'animation-01',
    step: '05',
    phase: 'Animation',
    title: 'Camera Blocking and Storyboard',
    description:
      'We choreograph camera paths that reveal circulation, facade rhythm, and atmosphere in a narrative sequence designed for high-conversion pitch decks.',
    media: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg',
    tool: 'Cinematic Sequencer',
    caption: 'Keyframes mapped for reveal moments and pacing.',
  },
  {
    id: 'animation-02',
    step: '06',
    phase: 'Animation',
    title: 'Final Grade and Delivery',
    description:
      'Final passes are graded for consistency and exported for web, presentations, and client dashboards with quality checks on every frame.',
    media: '/maitama-villa-day.jpg',
    tool: 'Post Production Pipeline',
    caption: 'Final color grade and delivery formats for every channel.',
  },
];

const WorkProcessPage: React.FC = () => {
  return (
    <section className="bg-background text-white min-h-screen border-t border-border-ui">
      <Helmet>
        <title>Work Process | Figment Studio</title>
        <meta
          name="description"
          content="A behind-the-scenes look at Figment Studio's workflow from Revit modeling to 3D printing, painting, and cinematic animation delivery."
        />
      </Helmet>

      <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">
        <div className="max-w-4xl space-y-6 mb-14">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans">Works / Process</p>
          <h1
            className="font-display font-light text-white leading-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4.8rem)', lineHeight: 1.02 }}
          >
            How We Build Every
            <br />
            <em className="font-light not-italic text-white/35">Visualization Story</em>
          </h1>
          <p className="text-white/55 text-base md:text-lg leading-relaxed font-sans max-w-3xl">
            This is a private look into our internal production workflow, from BIM-accurate Revit modeling through printing,
            painting, and final animation output for client presentations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {PROCESS_GALLERY.map((item, index) => (
            <article
              key={item.id}
              className="group border border-border-ui bg-surface/30 overflow-hidden"
              style={{ animation: `fadeInUp 420ms ease ${index * 80}ms both` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={item.media}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <span className="absolute top-4 left-4 text-[9px] tracking-[0.2em] uppercase bg-black/55 border border-white/15 px-2.5 py-1 text-primary font-bold font-sans">
                  {item.phase}
                </span>
                <span className="absolute top-4 right-4 text-[10px] tracking-[0.22em] uppercase bg-black/55 border border-white/15 px-2.5 py-1 text-white/80 font-bold font-sans">
                  Step {item.step}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-white/45 font-semibold font-sans">{item.tool}</p>
                  <h2 className="text-white font-display text-2xl leading-tight mt-2">{item.title}</h2>
                </div>
                <p className="text-white/55 text-sm leading-relaxed font-sans">{item.description}</p>
                <p className="text-primary/75 text-[10px] tracking-[0.18em] uppercase font-semibold font-sans">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkProcessPage;
