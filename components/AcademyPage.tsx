import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudioStore } from '../store.ts';
import { AcademyRegistration } from '../types.ts';

// Dedicated Admin WhatsApp number (digits only, country code first, no plus/spaces)
const ADMIN_WHATSAPP_NUMBER = "2348168299111";
// Configurable Admin target WhatsApp link
const WHATSAPP_LINK = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}`;

const AcademyPage: React.FC = () => {
  const { addAcademyRegistration } = useStudioStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experienceLevel: 'Beginner' as AcademyRegistration['experienceLevel'],
    preferredFormat: 'Onsite Abuja Studio' as AcademyRegistration['preferredFormat'],
    courseInterest: 'Revit + D5 rendering (interior/exterior)',
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
      title: "The Obsidian Retreat",
      category: "Residential (Maitama)",
      url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
      software: "Revit + D5 Render + Post-Production"
    },
    {
      title: "Nexus Hub District",
      category: "Commercial (Wuse II)",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
      software: "Revit + D5 Render + D5 Animation"
    },
    {
      title: "Maitama Luxury Suite",
      category: "Interior (Abuja CBD)",
      url: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200",
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
      title: "Lighting & Atmosphere",
      description: "Master photorealism, environmental shadows, HDRI sky projection, volumetric sunset rays, and dusk light balance to create cinematic mood."
    },
    {
      num: "02",
      title: "PBR Material Texturing",
      description: "Understand architectural shaders, reflection maps, displacement grids, procedural weathering, and complex concrete/marble modeling."
    },
    {
      num: "03",
      title: "Real-Time D5 Engine",
      description: "Transition from stills to real-time image rendering and walk-through animation. Master the robust ArchViz power of D5 and accelerate your imagery workflow."
    },
    {
      num: "04",
      title: "Cinematic Post-Processing",
      description: "Enhance images via Integrated Ai tools to improve color grading, lookup tables (LUTs), camera raw adjustments, and composite editing."
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
      const submission: AcademyRegistration = {
        id: `REG-${Math.floor(Math.random() * 90000) + 10000}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        experienceLevel: formData.experienceLevel,
        preferredFormat: formData.preferredFormat,
        courseInterest: formData.courseInterest,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        message: formData.message,
        referralSource: formData.referralSource || undefined,
        referrerName: formData.referrerName || undefined,
        notes: 'New registration from website portal.'
      };

      addAcademyRegistration(submission);

      // Compose WhatsApp inquiry message with all selected data
      let waText = `Hello Figment Academy Admissions,

I want to declare my interest to subscribe for the architectural visualization sessions. Here are my registration details:

• Name: ${formData.name}
• Email: ${formData.email}
• WhatsApp Number: ${formData.phone}
• Experience Level: ${formData.experienceLevel}
• Mentorship Mode: ${formData.preferredFormat}
• Course Selection: ${formData.courseInterest}`;

      if (formData.referralSource) {
        waText += `\n• Referral Source: ${formData.referralSource}`;
      }
      if (formData.referrerName) {
        waText += `\n• Referrer Details: ${formData.referrerName}`;
      }
      if (formData.message.trim()) {
        waText += `\n• Cover Statement: "${formData.message.trim()}"`;
      }

      waText += `\n\nPlease let me know the next steps for cohort onboarding.`;

      const encodedText = encodeURIComponent(waText);
      const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodedText}`;

      // Open WhatsApp in a new tab
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
        courseInterest: 'Revit + D5 rendering (interior/exterior)',
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
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-4 block border-l-2 border-primary pl-4 font-sans">
              STUDIO COHORTS & MENTORSHIP
            </span>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 pt-4 font-sans"
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
              className="btn-fill text-center justify-center font-bold px-8 py-4 rounded-lg shadow-lg shadow-primary/10 transition-transform active:scale-95"
            >
              Declare Interest
            </button>
            <button 
              onClick={() => {
                const el = document.getElementById("curriculum-section");
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="btn-outline text-center justify-center font-bold px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-white/5 active:scale-95 text-white"
            >
              <span className="material-symbols-outlined text-lg">expand_more</span>
              Learn More
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted select-none">
          <span className="text-[9px] uppercase tracking-[0.25em] font-semibold">Explore Curriculums</span>
          <span className="material-symbols-outlined scroll-bounce text-lg text-primary">keyboard_arrow_down</span>
        </div>
      </section>

      {/* Academy Methodology / Key Modules */}
      <section id="curriculum-section" className="sec border-t border-border-ui bg-background-alt scroll-mt-[100px]">
        <div className="wrap space-y-16">
          <div className="space-y-4 max-w-xl text-left">
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">THE CURRICULUM</p>
            <h2 className="font-display font-light text-white uppercase tracking-tight leading-[1] text-4xl md:text-6xl">
              Core Skills<br />
              <span className="font-light text-white/30">For Master Renderers</span>
            </h2>
            <p className="text-text-muted text-sm font-light leading-relaxed">
              We focus on building creative visual artists, not just software operators. Our coursework is designed around industry production pipelines.
            </p>
          </div>

          {/* Curriculum card grids with animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors text-xl">architecture</span>
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
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">THE MENTORS</p>
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
                onClick={() => setActiveLightboxImg({ url: work.url, title: work.title, subtitle: `${work.category} • ${work.software}` })}
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
            <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold">STUDENT PORTFOLIOS</p>
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
                onClick={() => setActiveLightboxImg({ url: work.url, title: work.title, subtitle: `Rendered by ${work.student} (${work.cohort}) • ${work.software}` })}
                className="group border border-border-ui bg-surface rounded-2xl overflow-hidden flex flex-col justify-between h-full hover:border-primary/20 transition-all text-left cursor-pointer"
              >
                <div className="relative aspect-[4/5] bg-zinc-950 overflow-hidden">
                  <img 
                    src={work.url} 
                    alt={work.title} 
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-[1.03]" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                  
                  {/* Subtle info on hover/overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                    <span className="text-primary text-[8px] font-bold uppercase tracking-[0.2em] font-sans">{work.projectType}</span>
                    <h3 className="font-display text-white text-md uppercase leading-tight truncate mt-1">{work.title}</h3>
                    <p className="text-[9px] text-zinc-300 font-sans mt-0.5 font-light">{work.software}</p>
                  </div>
                </div>
                <div className="p-4 border-t border-border-ui/60 bg-black/15 flex items-center justify-between font-sans">
                  <div>
                    <p className="text-xs font-bold text-white leading-none">{work.student}</p>
                    <p className="text-[9px] text-text-muted mt-1 leading-none font-light">{work.cohort}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary/30 text-lg">workspace_premium</span>
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
            <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase block font-sans">ENROLLMENT INTAKE</span>
            <h2 className="font-display font-light text-white uppercase tracking-tight text-4xl md:text-6xl">
              Declare Interest
            </h2>
            <p className="text-text-muted text-sm font-light max-w-md mx-auto">
              Mentorship cohort slots are evaluated by our studio directors. Currently, we operate 100% online classes. Submit your request below.
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

                  {/* New Course Selector Section - What to Learn */}
                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">What do you want to learn? *</label>
                    <select 
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      <option value="Revit only" className="bg-[#1e1e1e] text-white">Revit only</option>
                      <option value="D5 Rendering Only (interior/exterior)" className="bg-[#1e1e1e] text-white">D5 Rendering Only (interior/exterior)</option>
                      <option value="Revit + D5 rendering (interior/exterior)" className="bg-[#1e1e1e] text-white">Revit + D5 rendering (interior/exterior)</option>
                      <option value="Revit + D5 rendering (interior/exterior) + Animation" className="bg-[#1e1e1e] text-white">Revit + D5 rendering (interior/exterior) + Animation</option>
                      <option value="D5 Rendering only (interior/exterior) + Animation" className="bg-[#1e1e1e] text-white">D5 Rendering only (interior/exterior) + Animation</option>
                    </select>
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
                          Registering Interest...
                        </>
                      ) : (
                        "Submit Subscription Declaration"
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
