
import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import Services from './Services';
import Portfolio from './Portfolio';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const TEAM = [
  { name: 'Ikechukwu Onuegbu', role: 'Managing Director', specialty: 'Architectural Vision & Strategy', img: '/ikechukwu-onuegbu.jpg' },
  { name: 'Loveth', role: 'Admin', specialty: 'Studio Operations & Client Success', img: '/avatar-silhouette.svg' },
  { name: 'Chinedu', role: 'Developer', specialty: 'Technical Pipeline & Web Systems', img: '/avatar-silhouette.svg' },
  { name: 'Amara', role: 'Media Manager', specialty: 'Brand Identity & Media Outreach', img: '/avatar-silhouette.svg' },
];

const PROCESS = [
  { n: '01', title: 'Brief & Sketch Upload', body: 'Submit your project brief and reference images. We lock geometry constraints early to prevent costly revisions.' },
  { n: '02', title: 'AI Scene Planning', body: 'Use our guided camera, motion, and context tools to direct the scene output. Our AI co-pilot helps find the best angles.' },
  { n: '03', title: 'Payment Settlement', body: 'Pay in USD or NGN via Paystack or Flutterwave with full SSL security. Transparent pricing, no hidden fees.' },
  { n: '04', title: 'Private Delivery', body: 'Access assets, revisions, and handoff via your secure dashboard. Every file encrypted and watermark-free.' },
];


const INSIGHTS = [
  {
    category: 'Industry',
    date: 'June 2025',
    title: 'The Future of Architectural Rendering in Sub-Saharan Africa',
    excerpt: 'How AI tools are democratizing photorealistic visualization for architecture firms across Nigeria and beyond.',
    img: '/figment_media/3D-Rendering-B2B-Abuja 2.png',
    readTime: '5 min read',
  },
  {
    category: 'Technology',
    date: 'May 2025',
    title: 'Why Cinematic Walkthroughs Close More Property Deals',
    excerpt: 'Data from 200+ projects reveals the compelling correlation between animation quality and investor conversion rates.',
    img: '/figment_media/3D-Apartment-Rendering-Lagos-state.png',
    readTime: '4 min read',
  },
  {
    category: 'Studio',
    date: 'April 2025',
    title: 'Inside Figment: Our 4K Rendering Pipeline Explained',
    excerpt: 'A behind-the-scenes look at the hardware, software, and creative workflow that produces our signature renders.',
    img: '/figment_media/3D-Rendering-Abuja 2.png',
    readTime: '6 min read',
  },
];

const PLANS = [
  {
    tier: 'Starter',
    price: 'Free',
    sub: 'For explorers',
    features: ['Public AI teaser tools', '1 concept brief export', 'Community support', 'Portfolio access'],
    cta: 'Try Instant Estimate',
    ctaPath: '/arcviz',
    featured: false,
  },
  {
    tier: 'Studio Pro',
    price: '$149',
    sub: 'per month',
    features: ['Guided AI (camera, motion, lighting)', 'Sketch-preserving enhancement', 'Private project dashboard', 'Paystack & Flutterwave checkout', '20 AI credits / month'],
    cta: 'Upgrade to Pro',
    ctaPath: '/auth?upgrade=pro',
    featured: true,
  },
];

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] tracking-[0.3em] uppercase text-primary font-semibold font-sans mb-4">{children}</p>
);

import { useStudioStore } from '../store.ts';
import { ClientReview } from '../types.ts';

const SectionHeading: React.FC<{ children: React.ReactNode; dim?: string }> = ({ children, dim }) => (
  <h2 className="font-display font-light text-white leading-tight" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 4rem)', lineHeight: 1.06 }}>
    {children}
    {dim && <><br /><em className="font-light not-italic" style={{ color: 'rgba(255,255,255,0.28)' }}>{dim}</em></>}
  </h2>
);

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { reviews, addReview, deleteReview, auth } = useStudioStore();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [openProcess, setOpenProcess] = useState<number | null>(0);

  const [newReview, setNewReview] = useState({
    name: '',
    role: '',
    company: '',
    rating: 5 as 1 | 2 | 3 | 4 | 5,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim() || !newReview.role.trim()) {
      alert("Please fill in your name, professional role, and comments.");
      return;
    }
    const submittedReview: ClientReview = {
      id: `REV-${Date.now()}`,
      name: newReview.name,
      role: newReview.role,
      company: newReview.company || undefined,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      approved: true
    };
    addReview(submittedReview);
    setReviewSubmitted(true);
    setNewReview({ name: '', role: '', company: '', rating: 5, comment: '' });
    setTimeout(() => {
      setReviewSubmitted(false);
      setShowForm(false);
    }, 3000);
  };

  useEffect(() => {
    const scrollTarget = searchParams.get('scroll');
    if (scrollTarget) {
      const scrollToTarget = () => {
        const el = document.getElementById(scrollTarget);
        if (!el) return false;

        const headerOffset = 96;
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
        return true;
      };

      if (scrollToTarget()) {
        return;
      }

      const timeouts = [120, 260, 420, 650].map((delay) =>
        setTimeout(() => {
          scrollToTarget();
        }, delay)
      );

      return () => timeouts.forEach(clearTimeout);
    }
  }, [searchParams]);

  return (
    <>
      <Helmet>
        <title>Figment Studio | Premium Architectural Visualization</title>
        <meta name="description" content="Figment Studio provides world-class architectural rendering, cinematic 3D animation, and real estate visualization across Nigeria and globally." />
      </Helmet>

      <Hero
        onStartProject={() => navigate('/estimator')}
        onOpenArcViz={() => navigate('/arcviz')}
        onOpenWorkProcess={() => navigate('/works/process')}
      />
      <Services />
      <Portfolio onViewAll={() => navigate('/portfolio')} />

      {/* ── WHO WE ARE ── */}
      <section className="bg-background" id="about-intro">
        <div className="px-8 md:px-14 lg:px-20 py-28 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <div className="space-y-8">
              <div>
                <SectionLabel>Who We Are</SectionLabel>
                <SectionHeading dim="for Every Ambition">
                  Rooted in Abuja,<br />Built
                </SectionHeading>
              </div>
              <p className="text-white/50 text-base leading-relaxed max-w-lg font-sans">
                From our studio in the heart of Nigeria's capital, Figment Studio captures the essence of modern African architecture and international contemporary design. We leverage the unique light and landscape of Abuja to bring an authentic perspective to every project.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                {[
                  { num: '200+', label: 'Projects' },
                  { num: '8+', label: 'Years' },
                  { num: '40+', label: 'Clients' },
                  { num: '4K', label: 'Max Res.' },
                ].map((s) => (
                  <div key={s.label} className="border-l-2 border-primary/30 pl-5 space-y-1">
                    <p className="font-display font-light text-white text-3xl">{s.num}</p>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-white/35 font-sans font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/about')} className="group flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-primary font-semibold border-b border-primary/30 pb-1 hover:border-primary transition-colors mt-2">
                Our Full Story
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>

            <div className="relative">
              <div className="absolute -top-4 -right-4 w-3/4 h-[110%] border border-border-ui -z-0 hidden lg:block" />
              <img
                alt="Figment Studio Abuja"
                className="relative z-10 w-full h-[520px] object-cover"
                src="/figment_media/3D-Rendering-Abuja.png"
              />

              <div className="absolute bottom-0 left-0 z-20 p-6 bg-background/80 backdrop-blur-sm border-r border-t border-border-ui">
                <p className="text-[10px] tracking-[0.22em] uppercase text-primary/70 font-sans font-semibold">Location</p>
                <p className="text-white font-sans text-sm font-medium mt-1">Central Business District<br />Abuja, FCT, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESS ACCORDION ── */}
      <section className="bg-[#0E0E0E] border-t border-border-ui" id="process">
        <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            <div className="space-y-6 lg:sticky lg:top-28 self-start">
              <SectionLabel>Private Workflow</SectionLabel>
              <SectionHeading dim="& Confidential Jobs">
                Built For<br />Professional
              </SectionHeading>
              <p className="text-white/45 text-sm leading-relaxed max-w-md font-sans">
                Every premium project moves through a secure, auditable flow designed for serious developers and architects — from intake to final asset handoff.
              </p>
              <button onClick={() => navigate('/estimator')} className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase bg-primary hover:bg-primary-hover text-white px-7 py-3.5 font-semibold transition-all duration-300 hover:shadow-[0_4px_14px_rgba(240,122,58,0.3)] mt-2">
                <span className="material-symbols-outlined text-base">calculate</span>
                Get Your Estimate
              </button>
            </div>

            <div className="divide-y divide-border-ui">
              {PROCESS.map((step, i) => {
                const isOpen = openProcess === i;
                return (
                  <div key={step.n}>
                    <button
                      onClick={() => setOpenProcess(isOpen ? null : i)}
                      className="w-full flex items-center justify-between py-7 text-left group focus:outline-none"
                    >
                      <div className="flex items-center gap-6">
                        <span className={`font-display font-light text-2xl transition-colors duration-300 ${isOpen ? 'text-primary/60' : 'text-white/15 group-hover:text-white/25'}`}>{step.n}</span>
                        <span className={`text-sm font-semibold tracking-wide font-sans transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/55 group-hover:text-white/80'}`}>{step.title}</span>
                      </div>
                      <span className={`material-symbols-outlined text-[18px] flex-shrink-0 transition-all duration-300 ${isOpen ? 'text-primary rotate-45' : 'text-white/20 rotate-0 group-hover:text-white/40'}`}>add</span>
                    </button>
                    <div className={`overflow-hidden transition-all duration-500 ${isOpen ? 'max-h-32 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-white/45 text-sm leading-relaxed font-sans pl-16">{step.body}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="bg-background border-t border-border-ui" id="team">
        <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <SectionLabel>Our Team</SectionLabel>
              <SectionHeading dim="Behind the Work">
                The People
              </SectionHeading>
            </div>
            <button onClick={() => navigate('/about')} className="group flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-primary font-semibold border-b border-primary/30 pb-1 hover:border-primary transition-colors">
              Meet the Studio
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TEAM.map((member) => (
              <div key={member.name} className="group space-y-4">
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                  <div className="absolute bottom-0 left-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-primary/80 font-sans font-semibold">{member.specialty}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white font-sans">{member.name}</p>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-white/35 font-sans">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT STORIES / REVIEWS ── */}
      <section className="bg-[#0E0E0E] border-t border-border-ui" id="testimonials">
        <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            
            <div className="space-y-6 text-left">
              <div>
                <SectionLabel>Client Stories</SectionLabel>
                <SectionHeading dim="from Our Clients">
                  Feedback
                </SectionHeading>
              </div>
              
              <div className="flex flex-wrap gap-4 pt-4 font-sans">
                {reviews.length > 0 && (
                  <div className="flex gap-2">
                    {reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveTestimonial(i)}
                        className={`h-[2px] transition-all duration-300 focus:outline-none ${i === activeTestimonial ? 'bg-primary w-10' : 'bg-white/15 w-4 hover:bg-white/30'}`}
                      />
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="px-6 py-2.5 bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer font-sans"
                >
                  {showForm ? "Cancel Review" : "Write a Review"}
                </button>
              </div>
            </div>

            <div className="relative min-h-[260px] text-left">
              {reviews.length === 0 ? (
                <p className="text-zinc-600 italic text-sm font-sans pt-12">No client reviews posted yet. Be the first to share your experience!</p>
              ) : (
                reviews.map((rev, i) => {
                  const isActive = i === (activeTestimonial % reviews.length);
                  return (
                    <div
                      key={rev.id}
                      className="absolute inset-0 flex flex-col justify-between transition-all duration-500"
                      style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? 'auto' : 'none' }}
                    >
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="font-display text-6xl text-primary/20 leading-none select-none">"</span>
                          <span className="text-primary font-bold text-xs tracking-wider">
                            {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                          </span>
                        </div>
                        <p className="text-white/70 text-lg font-light leading-relaxed font-sans italic">
                          {rev.comment}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-8 border-t border-border-ui mt-6 font-sans">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-primary text-sm font-bold font-display uppercase">
                            {rev.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white font-sans">{rev.name}</p>
                            <p className="text-[11px] text-white/35 font-sans">{rev.role} {rev.company ? `· ${rev.company}` : ''}</p>
                          </div>
                        </div>

                        {auth.role === 'admin' && (
                          <button
                            onClick={() => {
                              deleteReview(rev.id);
                              setActiveTestimonial(0);
                            }}
                            className="text-red-500 border border-red-950/20 hover:border-red-700 bg-red-950/10 hover:bg-red-950/20 px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-xs">delete</span>
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Form to submit review */}
          {showForm && (
            <div className="max-w-2xl mx-auto bg-surface/50 border border-border-ui/60 p-8 md:p-12 rounded-[2.5rem] backdrop-blur-md text-left transition-all animate-in slide-in-from-top-6 duration-300">
              {reviewSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                    <span className="material-symbols-outlined">done</span>
                  </div>
                  <h3 className="font-display text-white text-xl uppercase tracking-widest">Review Published!</h3>
                  <p className="text-zinc-400 text-xs font-sans font-light">Thank you for sharing your feedback with the Figment Studio community.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6 font-sans">
                  <h3 className="font-display text-white text-xl uppercase tracking-wider mb-6">Write a Client Review</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Your Name *</label>
                      <input
                        type="text"
                        required
                        className="inp"
                        placeholder="John Doe"
                        value={newReview.name}
                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Professional Role *</label>
                      <input
                        type="text"
                        required
                        className="inp"
                        placeholder="Lead Architect / Developer"
                        value={newReview.role}
                        onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Company (Optional)</label>
                      <input
                        type="text"
                        className="inp"
                        placeholder="e.g. Pinnacle Homes"
                        value={newReview.company}
                        onChange={(e) => setNewReview({ ...newReview, company: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Rating *</label>
                      <select
                        className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors cursor-pointer"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) as any })}
                      >
                        <option value="5" className="bg-[#1e1e1e]">5 Stars (Excellent)</option>
                        <option value="4" className="bg-[#1e1e1e]">4 Stars (Very Good)</option>
                        <option value="3" className="bg-[#1e1e1e]">3 Stars (Good)</option>
                        <option value="2" className="bg-[#1e1e1e]">2 Stars (Fair)</option>
                        <option value="1" className="bg-[#1e1e1e]">1 Star (Poor)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-text-muted">Your Comment *</label>
                    <textarea
                      required
                      className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white outline-none focus:border-primary transition-colors resize-none min-h-[100px]"
                      placeholder="Share your detailed feedback on our design, renderings, animations, or workflow..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg shadow-primary/10 transition-all cursor-pointer"
                  >
                    Submit Review Live
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="bg-background border-t border-border-ui" id="pricing">
        <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <SectionLabel>Service Plans</SectionLabel>
              <SectionHeading dim="for Architectural Teams">
                Premium Tiers
              </SectionHeading>
            </div>
            <p className="max-w-sm text-white/40 leading-relaxed text-sm font-sans md:text-right">
              Scale from instant previews to private production workflows with studio-grade AI visualization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-ui max-w-4xl mx-auto">
            {PLANS.map((plan) => (
              <article
                key={plan.tier}
                className={`relative flex flex-col gap-8 p-10 ${plan.featured ? 'bg-surface border-t-2 border-t-primary' : 'bg-[#0E0E0E]'}`}
              >
                {plan.featured && (
                  <div className="absolute top-0 right-8 -translate-y-1/2">
                    <span className="text-[9px] tracking-[0.2em] uppercase bg-primary text-white px-4 py-1.5 font-bold font-sans">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-primary font-sans font-semibold">{plan.tier}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-light text-4xl text-white">{plan.price}</span>
                    <span className="text-xs text-white/30 font-sans">{plan.sub}</span>
                  </div>
                </div>

                <ul className="space-y-3.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="w-4 h-4 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[10px] text-primary">check</span>
                      </span>
                      <span className="text-white/55 font-sans leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(plan.ctaPath)}
                  className={`text-[11px] tracking-[0.2em] uppercase font-bold font-sans py-3.5 transition-all duration-300 ${plan.featured
                      ? 'bg-primary hover:bg-primary-hover text-white hover:shadow-[0_4px_14px_rgba(240,122,58,0.3)]'
                      : 'border border-border-strong text-white/60 hover:text-white hover:border-white/30'
                    }`}
                >
                  {plan.cta}
                </button>

                {/* Coming Soon overlay for all plans */}
                <div className={`absolute inset-0 ${plan.featured ? 'bg-surface' : 'bg-[#0E0E0E]'} z-20 flex flex-col items-center justify-center p-6 text-center`}>
                  <span className="bg-primary/20 text-primary border border-primary/30 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-3">
                    Coming Soon
                  </span>
                  <p className="text-xs text-text-secondary max-w-[220px] leading-relaxed font-sans">
                    {plan.tier === 'Studio Pro'
                      ? 'Mentorship cohorts and GPU cloud renders are currently in closed preview.'
                      : 'Free public AI teaser tools and conceptual sketch planning are launching soon.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── JOURNAL / INSIGHTS ── */}
      <section className="bg-[#0E0E0E] border-t border-border-ui" id="journal">
        <div className="px-8 md:px-14 lg:px-20 py-24 max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <SectionLabel>Journal</SectionLabel>
              <SectionHeading dim="& Perspectives">
                Insights
              </SectionHeading>
            </div>
            <button onClick={() => navigate('/insights')} className="group flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-primary font-semibold border-b border-primary/30 pb-1 hover:border-primary transition-colors">
              All Articles
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-ui">
            {INSIGHTS.map((post, i) => (
              <article
                key={i}
                className="group bg-background cursor-pointer"
                onClick={() => {
                  const slug = post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  navigate(`/insights?read=${slug}`);
                }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] tracking-[0.22em] uppercase text-primary font-sans font-semibold">{post.category}</span>
                    <span className="w-px h-3 bg-border-ui" />
                    <span className="text-[10px] text-white/30 font-sans">{post.date}</span>
                    <span className="w-px h-3 bg-border-ui" />
                    <span className="text-[10px] text-white/30 font-sans">{post.readTime}</span>
                  </div>
                  <h3 className="font-sans text-base font-semibold text-white leading-snug group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/40 leading-relaxed font-sans">{post.excerpt}</p>
                  <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary/60 font-semibold font-sans pt-2 group-hover:gap-3 transition-all">
                    Read Article
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden" id="cta">
        <div
          className="relative px-8 md:px-14 lg:px-20 py-36"
          style={{ background: 'linear-gradient(135deg, #0A0805 0%, #0F0B07 50%, #121008 100%)' }}
        >
          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, rgba(240,122,58,0.14) 0%, transparent 65%)', filter: 'blur(80px)' }}
          />

          <div className="relative z-10 max-w-[1600px] mx-auto text-center space-y-8">
            <SectionLabel>Ready to Begin?</SectionLabel>
            <h2
              className="font-display font-light text-white"
              style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', lineHeight: 0.98, letterSpacing: '-0.025em' }}
            >
              Bring Your Vision<br />
              <span style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundImage: 'linear-gradient(135deg, #F07A3A 0%, #FF9A5C 60%, #F07A3A 100%)' }}>
                To Life.
              </span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto leading-relaxed text-base font-sans">
              Join 200+ architects and developers who trust Figment Studio for their most ambitious projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => navigate('/contact')}
                className="bg-primary hover:bg-primary-hover text-white text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-4 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(240,122,58,0.4)]"
              >
                Contact the Studio
              </button>
              <button
                onClick={() => navigate('/estimator')}
                className="border border-white/15 hover:border-white/35 text-white/60 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] px-10 py-4 transition-all duration-300"
              >
                Instant Estimate
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingPage;
