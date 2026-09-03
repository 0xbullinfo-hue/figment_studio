import { buildBreadcrumbs } from '../lib/structuredData.ts';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '../store.ts';
import { AcademyRegistration } from '../types.ts';

// WhatsApp contact requirement is the local mobile number 08168299111.
// The WhatsApp API expects the international E.164 equivalent for the actual link target.
const ADMIN_WHATSAPP_NUMBER_LOCAL = '08168299111';
const ADMIN_WHATSAPP_NUMBER_E164 = '2348168299111';

const buildWhatsAppUrl = (text: string) => `https://wa.me/${ADMIN_WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(text)}`;

interface CourseTier {
  id: string;
  name: string;
  price: number;
  duration: string;
  highlight?: string;
  description: string;
}

const ACADEMY_COURSES: CourseTier[] = [
  {
    id: 'revit-only',
    name: 'Revit Only',
    price: 150000,
    duration: '2 Weeks',
    description: 'BIM architectural modeling, parameter setup & clean scene export workflows',
  },
  {
    id: 'd5-only',
    name: 'D5 Interior/Exterior Only',
    price: 250000,
    duration: '2 Weeks',
    description: 'PBR texturing, environmental lighting, HDRI skies, dusk renders & photorealistic still imagery.',
  },
  {
    id: 'revit-d5',
    name: 'Revit and D5 (Interior/Exterior)',
    price: 350000,
    duration: '4 Weeks',
    highlight: 'Most Popular',
    description: 'Complete studio pipeline from BIM modeling to photorealistic interior and exterior still renders.',
  },
  {
    id: 'revit-d5-anim',
    name: 'Revit and D5 (Interior/Exterior/Animation)',
    price: 600000,
    duration: '5 Weeks',
    highlight: 'Comprehensive Masterclass',
    description: 'Full end-to-end mastery: Revit BIM, D5 photorealism, camera sequencer & cinematic walkthrough animations.',
  },
  {
    id: 'd5-anim',
    name: 'D5 Interior/Exterior/Animation',
    price: 300000,
    duration: '3 Weeks',
    description: 'Advanced real-time lighting, dynamic camera pathing, video editing & architectural animation.',
  },
];

const buildAdmissionMessage = (formData: {
  name: string;
  email: string;
  phone: string;
  experienceLevel: AcademyRegistration['experienceLevel'];
  preferredFormat: AcademyRegistration['preferredFormat'];
  courseInterest: string;
  coursePrice: number;
  courseDuration: string;
  message: string;
  referralSource: string;
  referrerName: string;
}) => {
  const formattedPrice = `₦${formData.coursePrice.toLocaleString('en-NG')}`;

  let waText = `Hello Figment Academy Admissions,

I want to enroll for the upcoming October 2026 architectural visualization cohort. Here are my registration details:

 -  Name: ${formData.name}
 -  Email: ${formData.email}
 -  WhatsApp Number: ${formData.phone}
 -  Experience Level: ${formData.experienceLevel}
 -  Mentorship Mode: ${formData.preferredFormat}
 -  Course Selection: ${formData.courseInterest}
 -  Tuition / Price: ${formattedPrice}
 -  Duration: ${formData.courseDuration}`;

  if (formData.referralSource) {
    waText += `\n -  Referral Source: ${formData.referralSource}`;
  }
  if (formData.referrerName) {
    waText += `\n -  Referrer Details: ${formData.referrerName}`;
  }
  if (formData.message.trim()) {
    waText += `\n -  Cover Statement: "${formData.message.trim()}"`;
  }

  waText += `\n\nClasses start October 3rd, 2026. Please let me know the next steps for cohort onboarding.`;
  return waText;
};

const WHATSAPP_LINK = buildWhatsAppUrl(`Hello Figment Academy Admissions,\n\nI would like to enquire about the academy admissions process and learn the next steps for enrollment.`);

const AcademyPage: React.FC = () => {
  const { addAcademyRegistration } = useStudioStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experienceLevel: 'Beginner' as AcademyRegistration['experienceLevel'],
    preferredFormat: 'Live Online Interactive' as AcademyRegistration['preferredFormat'],
    courseInterest: ACADEMY_COURSES[0].name,
    message: '',
    referralSource: '',
    referrerName: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lightbox image state
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title: string; subtitle: string } | null>(null);

  // Instructor works (Admin portfolio items representing authority)
  const instructorWorks = [
    {
      title: "Edo Country Manor",
      category: "Residential (Edo State)",
      url: "/figment_media/3D-Country-home-Rendering-Edo-state 1.png",
      software: "Revit + D5 Render + Post-Production"
    },
    {
      title: "Abuja Corporate Complex",
      category: "Commercial (Abuja)",
      url: "/figment_media/3D-Rendering-B2B-Abuja 2.png",
      software: "Revit + D5 Render + D5 Animation"
    },
    {
      title: "Lagos Apartment Block",
      category: "Residential (Lagos State)",
      url: "/figment_media/3D-Apartment-Rendering-Lagos-state 2.png",
      software: "D5 Render + Photoshop + AI Enhancement"
    }
  ];

  // Student works showcase items - Cleaned from legacy rendering tools
  const studentWorks = [
    {
      student: "Amina Bello",
      cohort: "Spring Cohort 2026",
      title: "Asokoro Canopy House",
      url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800",
      software: "D5 Render",
      projectType: "Exterior Render"
    },
    {
      student: "Tunde Adebayo",
      cohort: "Winter Cohort 2025",
      title: "The Abuja Glass Pavilion",
      url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800",
      software: "Revit + D5 Render + Animation",
      projectType: "Walkthrough Video"
    },
    {
      student: "Fatima Musa",
      cohort: "Spring Cohort 2026",
      title: "Minimalist Concrete Loft",
      url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800",
      software: "D5 Render",
      projectType: "Interior Concept"
    },
    {
      student: "Ibrahim K.",
      cohort: "Autumn Cohort 2025",
      title: "Eko Atlantic Waterfront Concept",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800",
      software: "Revit + D5 Render + AI",
      projectType: "Masterplan Aerial"
    }
  ];

  // Curriculum training modules
  const trainingModules = [
    {
      num: "01",
      icon: "domain",
      title: "2D-to-3D Revit Modeling",
      description: "Transform 2D architectural drafts and plans into clean, production-ready 3D models serving as a seamless foundation for rendering tools and visual workflows."
    },
    {
      num: "02",
      icon: "light_mode",
      title: "Lighting & Atmosphere",
      description: "Master photorealism, environmental shadows, HDRI sky projection, volumetric sunset rays, and dusk light balance to create cinematic mood."
    },
    {
      num: "03",
      icon: "texture",
      title: "PBR Material Texturing",
      description: "Understand architectural shaders, reflection maps, displacement grids, procedural weathering, and complex concrete/marble modeling."
    },
    {
      num: "04",
      icon: "view_in_ar",
      title: "Real-Time D5 Engine",
      description: "Transition from basic modeling to real-time image rendering. Master the robust ArchViz power of D5 Render and accelerate your imagery workflow."
    },
    {
      num: "05",
      icon: "movie",
      title: "Animation Walkthroughs & AI",
      description: "Direct cinematic architectural walkthroughs using D5 Render and AI agents with precise prompting for camera sequencing, lifelike motion, and scene choreography."
    },
    {
      num: "06",
      icon: "auto_fix_high",
      title: "Cinematic Post-Processing",
      description: "Enhance imagery via integrated AI tools to refine color grading, lookup tables (LUTs), camera raw adjustments, and composite editing."
    }
  ];

  // Handle Form Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errors.phone = "WhatsApp number is required.";
    } else if (!/^\+?[0-9\s-]{8,20}$/.test(formData.phone.replace(/\s+/g, ''))) {
      errors.phone = "Please enter a valid phone/WhatsApp number.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const el = document.getElementById("declare-interest-form");
      el?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    // Simulate database write delay
    setTimeout(() => {
      const selectedCourse = ACADEMY_COURSES.find(c => c.name === formData.courseInterest) || ACADEMY_COURSES[0];
      const submission: AcademyRegistration = {
        id: `REG-${Math.floor(Math.random() * 90000) + 10000}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experienceLevel: formData.experienceLevel,
        preferredFormat: formData.preferredFormat,
        courseInterest: formData.courseInterest,
        coursePrice: selectedCourse.price,
        courseDuration: selectedCourse.duration,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        message: formData.message,
        referralSource: formData.referralSource || undefined,
        referrerName: formData.referrerName || undefined,
        notes: `New registration from website portal. Selected course: ${formData.courseInterest} (₦${selectedCourse.price.toLocaleString('en-NG')}, ${selectedCourse.duration})`
      };

      addAcademyRegistration(submission);

      const waText = buildAdmissionMessage({
        ...formData,
        coursePrice: selectedCourse.price,
        courseDuration: selectedCourse.duration,
      });
      const whatsappUrl = buildWhatsAppUrl(waText);

      // Open WhatsApp in a new tab with the full interest declaration payload
      window.open(whatsappUrl, '_blank');

      setIsSubmitting(false);
      setIsSubmitted(true);
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        experienceLevel: 'Beginner',
        preferredFormat: 'Live Online Interactive',
        courseInterest: ACADEMY_COURSES[0].name,
        message: '',
        referralSource: '',
        referrerName: ''
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background text-text-secondary overflow-x-hidden font-sans">
      <Helmet>
        <title>Academy | Figment Studio</title>
        <meta name="description" content="Join Figment Studio's Academy. Master architectural visualization, Revit integration, real-time D5 Rendering, and post-production with our expert instructors in Abuja." />
        <link rel="canonical" href="https://figmentstudio.ng/academy" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              ...buildBreadcrumbs([{ name: 'Home', item: '/' }, { name: 'Academy', item: '/academy' }])
            })}
          </script>
        </Helmet>

      {/* Cinematic Hero Section - High Contrast Readability */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-black overflow-hidden py-24">
        {/* Volumetric Render Backdrop - Low opacity to make text pop */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 select-none pointer-events-none scale-105 animate-[fadeInUp_1.5s_ease_forwards]"
          style={{ backgroundImage: `url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/85 to-black/60" />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />

        <div className="relative z-10 px-6 max-w-[1200px] w-full mx-auto text-left space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="font-display font-light text-white uppercase tracking-tight leading-[0.9] text-5xl md:text-8xl drop-shadow-md">
              FIGMENT<br />
              <span className="font-light not-italic text-white/30">ACADEMY</span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-lg md:text-xl font-light leading-relaxed max-w-xl font-sans drop-shadow-sm"
          >
            Master the art of high-end, cinematic architectural storytelling. Transition from basic models to world-class portfolios using Revit integration, D5 Render, and generative AI post-production workflows.
          </motion.p>

          {/* Quick Schedule Cards in Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl pt-2 font-sans"
          >
            <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-xl p-3.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">event_available</span>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Registration Opens</p>
                <p className="text-white text-sm font-semibold">Sept 4, 2026</p>
              </div>
            </div>
            <div className="bg-white/[0.04] border border-white/10 backdrop-blur-md rounded-xl p-3.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-red-400 text-xl">event_busy</span>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-text-muted font-bold">Registration Closes</p>
                <p className="text-white text-sm font-semibold">Sept 26, 2026</p>
              </div>
            </div>
            <div className="bg-primary/[0.08] border border-primary/30 backdrop-blur-md rounded-xl p-3.5 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">school</span>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-primary font-bold">Classes Start</p>
                <p className="text-white text-sm font-bold">October 3, 2026</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-2 font-sans"
          >
            <button 
              onClick={() => {
                const el = document.getElementById("subscribe-form");
                if (el) {
                  const offset = 90;
                  const bodyRect = document.body.getBoundingClientRect().top;
                  const elRect = el.getBoundingClientRect().top;
                  const elPosition = elRect - bodyRect;
                  const offsetPosition = elPosition - offset;
                  window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
              }}
              className="btn-fill text-center justify-center font-bold px-10 py-4 rounded-lg shadow-lg shadow-primary/20 transition-transform active:scale-95 text-xs tracking-widest uppercase flex items-center gap-2"
            >
              <span>ENROLL NOW</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById("curriculum-section");
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="btn-outline text-center justify-center font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-white/5 active:scale-95 text-white text-xs tracking-widest uppercase"
            >
              <span className="material-symbols-outlined text-lg">expand_more</span>
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted select-none">
          <span className="material-symbols-outlined scroll-bounce text-lg text-primary">keyboard_arrow_down</span>
        </div>
      </section>

      {/* Academy Methodology / Key Modules */}
      <section id="curriculum-section" className="sec border-t border-border-ui bg-background-alt scroll-mt-[100px]">
        <div className="wrap space-y-16">
          <div className="space-y-4 max-w-xl text-left">
            <h2 className="font-display font-light text-white uppercase tracking-tight leading-[1] text-4xl md:text-6xl">
              Core Skills<br />
              <span className="font-light text-white/30">For Master Renderers</span>
            </h2>
            <p className="text-text-muted text-sm font-light leading-relaxed">
              We focus on building creative visual artists, not just software operators. Our coursework is designed around industry production pipelines.
            </p>
          </div>

          {/* Curriculum card grids with animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingModules.map((mod, idx) => (
              <motion.div 
                key={mod.num} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-surface border border-border-ui/50 p-8 rounded-3xl space-y-6 flex flex-col justify-between text-left transition-all duration-300 hover:border-primary/20 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-black/40 group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-3xl font-display font-bold text-white/10 group-hover:text-primary/30 transition-colors">{mod.num}</span>
                  <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors text-xl">{mod.icon || 'architecture'}</span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-display text-white text-lg tracking-wide uppercase">{mod.title}</h3>
                  <p className="text-text-muted text-xs leading-relaxed font-sans font-light">{mod.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Instructor Works / Admin Portfolio */}
      <section className="sec bg-background">
        <div className="wrap space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
            <div className="space-y-4 max-w-xl">
              <h2 className="font-display font-light text-white uppercase tracking-tight leading-[1] text-4xl md:text-6xl">
                Studio Lead<br />
                <span className="font-light text-white/30">Portfolios</span>
              </h2>
            </div>
            <p className="text-text-muted text-sm font-light leading-relaxed max-w-sm">
              Learn from active visualization directors who construct commercial and residential models for leading developers across West Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {instructorWorks.map((work, idx) => (
              <div 
                key={idx} 
                onClick={() => setActiveLightboxImg({ url: work.url, title: work.title, subtitle: `${work.category}  -  ${work.software}` })}
                className="group relative border border-border-ui/30 bg-surface p-4 rounded-3xl overflow-hidden text-left transition-all hover:border-primary/30 hover:shadow-2xl cursor-pointer"
              >
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950">
                  <img 
                    src={work.url} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="mt-5 space-y-1">
                  <span className="text-[9px] text-primary font-bold uppercase tracking-widest block font-sans">{work.category}</span>
                  <h4 className="font-display text-white text-lg tracking-wide uppercase truncate">{work.title}</h4>
                  <p className="text-[10px] text-text-muted font-sans font-light truncate">{work.software}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Showcase Gallery */}
      <section className="sec bg-background-alt border-t border-border-ui">
        <div className="wrap space-y-16">
          <div className="space-y-4 max-w-xl text-left">
            <h2 className="font-display font-light text-white uppercase tracking-tight leading-[1] text-4xl md:text-6xl">
              Works From<br />
              <span className="font-light text-white/30">Past Cohorts</span>
            </h2>
            <p className="text-text-muted text-sm font-light leading-relaxed">
              Every rendering below was developed by a student with no prior advanced lighting experience, completed in a 6-week mentorship cycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studentWorks.map((work, idx) => (
              <div 
                key={idx} 
                className="group border border-border-ui bg-surface rounded-2xl overflow-hidden flex flex-col justify-between h-full hover:border-primary/20 transition-all text-left cursor-default select-none"
              >
                <div className="relative aspect-[4/5] bg-zinc-950/60 overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                  {/* Blurry mask */}
                  <div className="absolute inset-0 bg-zinc-900/50 backdrop-blur-md" />
                  
                  {/* Coming Soon badge */}
                  <div className="relative z-10 flex flex-col items-center space-y-3">
                    <span className="material-symbols-outlined text-primary/60 text-4xl animate-pulse">lock</span>
                    <span className="text-[10px] text-primary font-bold uppercase tracking-[0.3em] font-sans bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                      Coming Soon
                    </span>
                    <p className="text-zinc-400 text-xs mt-2 font-sans font-light">
                      {work.title}
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-border-ui/60 bg-black/15 flex items-center justify-between font-sans opacity-45">
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{work.student}</p>
                    <p className="text-[9px] text-text-muted mt-1 leading-none font-light">{work.cohort}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary/30 text-lg">lock</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe/Declaration Intake Form */}
      <section id="subscribe-form" className="sec bg-background relative overflow-hidden scroll-mt-[100px]">
        {/* Dynamic ambient lights */}
        <div className="absolute top-[20%] right-[-10%] size-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] size-96 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

        <div className="wrap-lg max-w-[860px] relative z-10">
          <div className="text-center space-y-4 mb-16">
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block font-sans">OCTOBER 2026 COHORT</span>
            <h2 className="font-display font-light text-white uppercase tracking-tight text-4xl md:text-6xl">
              Enroll Now
            </h2>
            <p className="text-text-muted text-sm font-light max-w-md mx-auto">
              Registration is open from <span className="text-white font-medium">September 4 – 26, 2026</span>. Classes begin <span className="text-primary font-medium">October 3, 2026</span>. Currently, we operate 100% online classes. Secure your spot below.
            </p>
          </div>

          <div id="declare-interest-form" className="relative bg-surface/50 backdrop-blur-xl border border-border-ui rounded-[2.5rem] p-8 md:p-14 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit} 
                  className="space-y-8 font-sans"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Full Name */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Full Name *</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="inp"
                        placeholder="Chinedu Okafor"
                      />
                      {formErrors.name && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Email Address *</label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="inp"
                        placeholder="chinedu@example.com"
                      />
                      {formErrors.email && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* WhatsApp Phone */}
                    <div className="space-y-2 text-left md:col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">WhatsApp Number *</label>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="inp"
                        placeholder="+234 803 123 4567"
                      />
                      {formErrors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{formErrors.phone}</p>}
                    </div>

                    {/* Experience Level */}
                    <div className="space-y-2 text-left md:col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Experience Level</label>
                      <select 
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors cursor-pointer animate-[fadeIn_0.3s_ease]"
                      >
                        <option value="Beginner" className="bg-[#1e1e1e] text-white">Beginner (New to 3D)</option>
                        <option value="Intermediate" className="bg-[#1e1e1e] text-white">Intermediate (Know 3D Modelling)</option>
                        <option value="Advanced" className="bg-[#1e1e1e] text-white">Advanced (Working Visualizer)</option>
                      </select>
                    </div>

                    {/* Training Mode - Onsite Coming Soon */}
                    <div className="space-y-2 text-left md:col-span-1">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Mentorship Mode</label>
                      <select 
                        name="preferredFormat"
                        value={formData.preferredFormat}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        <option value="Live Online Interactive" className="bg-[#1e1e1e] text-white">Live Online Interactive (Active)</option>
                        <option value="Onsite Abuja Studio" className="bg-[#1e1e1e] text-white">Onsite (Abuja Studio) - Coming Soon</option>
                      </select>
                    </div>
                  </div>

                  {/* Course Selector Section - What to Learn & Dynamic Price Tag */}
                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">What do you want to learn? *</label>
                    <select 
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      {ACADEMY_COURSES.map((course) => (
                        <option key={course.id} value={course.name} className="bg-[#1e1e1e] text-white">
                          {course.name} — ₦{course.price.toLocaleString('en-NG')} ({course.duration})
                        </option>
                      ))}
                    </select>

                    {/* Dynamic Price Tag Card reflecting active course under 'What do you want to learn' */}
                    {(() => {
                      const activeCourse = ACADEMY_COURSES.find(c => c.name === formData.courseInterest) || ACADEMY_COURSES[0];
                      return (
                        <motion.div
                          key={activeCourse.id}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-1.5 px-3.5 py-2.5 rounded-xl bg-primary/[0.06] border border-primary/25 flex flex-wrap items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <span className="text-white font-medium text-xs">
                              {activeCourse.name}
                            </span>
                            <span className="text-[10px] text-text-muted font-light hidden sm:inline truncate">
                              • {activeCourse.description}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <span className="text-base font-bold text-primary tracking-tight">
                              ₦{activeCourse.price.toLocaleString('en-NG')}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider font-medium text-text-secondary bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                              <span className="material-symbols-outlined text-[10px] text-primary">schedule</span>
                              {activeCourse.duration}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </div>

                  {/* Referral Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* How did you hear about us? */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">How did you hear about us?</label>
                      <select 
                        name="referralSource"
                        value={formData.referralSource}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors cursor-pointer"
                      >
                        <option value="" className="bg-[#1e1e1e] text-white/50">Select option</option>
                        <option value="Referral / Word of Mouth" className="bg-[#1e1e1e] text-white">Referral / Word of Mouth</option>
                        <option value="Search Engine / Internet" className="bg-[#1e1e1e] text-white">Search Engine / Internet</option>
                        <option value="Social Media (Instagram/LinkedIn)" className="bg-[#1e1e1e] text-white">Social Media (Instagram/LinkedIn)</option>
                        <option value="Other" className="bg-[#1e1e1e] text-white">Other</option>
                      </select>
                    </div>

                    {/* Referrer Details */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Referrer Name / Details (Optional)</label>
                      <input 
                        type="text" 
                        name="referrerName"
                        value={formData.referrerName}
                        onChange={handleChange}
                        className="inp"
                        placeholder="Name of person or platform..."
                      />
                    </div>
                  </div>

                  {/* Message requirements */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Why do you want to join? (Optional)</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full min-h-[100px] bg-transparent border-b border-white/15 py-3.5 text-xs text-white placeholder:text-zinc-650 outline-none focus:border-primary transition-all resize-none"
                      placeholder="Outline your background, specific targets, or goals for visual training..."
                    />
                  </div>

                  {/* Submission Button */}
                  <div className="pt-4 text-center">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full py-4 bg-primary text-white hover:bg-primary-hover font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting Enrollment...
                        </>
                      ) : (
                        "Enroll Now"
                      )}
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className="py-12 text-center space-y-6 font-sans"
                >
                  <div className="mx-auto size-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/5 animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-emerald-500">check_circle</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-display text-white text-3xl uppercase tracking-wider leading-none">Registration Buffered</h3>
                    <p className="text-text-secondary text-sm max-w-sm mx-auto font-light leading-relaxed">
                      Your interest declaration has been submitted to the dashboard system. An Academy Admissions Director will reach out to you via WhatsApp or Email within 48 hours to schedule your visual onboarding chat.
                    </p>
                  </div>

                  <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="px-8 py-3.5 border border-border-ui hover:border-white/20 text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-white rounded-lg transition-all"
                    >
                      Submit Another
                    </button>
                    <a 
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3.5 bg-primary text-white hover:bg-primary-hover text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined text-sm">chat</span>
                      Join Admission on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Admin WhatsApp Inquiry Sticky banner */}
      <section className="bg-background-alt border-y border-border-ui py-16 text-center relative overflow-hidden">
        <div className="wrap max-w-3xl px-6 space-y-8 text-center relative z-10 flex flex-col items-center">
          <span className="material-symbols-outlined text-5xl text-primary animate-pulse">forum</span>
          <div className="space-y-3">
            <h3 className="font-display text-white text-2xl md:text-3xl uppercase tracking-wide leading-tight">
              Have Questions Before Joining?
            </h3>
            <p className="text-text-muted text-sm font-sans font-light max-w-md mx-auto leading-relaxed">
              Connect directly with our training administrators on WhatsApp. Get answers regarding course structures, tuition schedules, hardware recommendations, and specific portfolio reviews.
            </p>
          </div>
          <a 
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-lg transition-all shadow-xl shadow-emerald-950/20 active:scale-95 font-sans"
          >
            <span className="material-symbols-outlined text-base">chat</span>
            Join Admission on WhatsApp
          </a>
        </div>
      </section>

      {/* Immersive Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 cursor-zoom-out"
            onClick={() => setActiveLightboxImg(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveLightboxImg(null)}
              className="absolute top-6 right-6 text-text-muted hover:text-white flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest font-sans focus:outline-none"
            >
              Close <span className="material-symbols-outlined text-lg">close</span>
            </button>

            {/* Lightbox Content Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="max-w-[90%] max-h-[80vh] flex flex-col items-center gap-6 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeLightboxImg.url} 
                alt={activeLightboxImg.title} 
                className="max-h-[70vh] object-contain rounded-2xl border border-white/10 shadow-2xl"
              />
              <div className="text-center space-y-1">
                <h3 className="font-display text-white text-xl uppercase tracking-wide leading-none">{activeLightboxImg.title}</h3>
                <p className="text-xs text-primary font-semibold tracking-wider font-sans">{activeLightboxImg.subtitle}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AcademyPage;


