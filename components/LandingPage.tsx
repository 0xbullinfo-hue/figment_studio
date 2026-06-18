
import React from 'react';
import Hero from './Hero';
import Services from './Services';
import Studio from './Studio';
import Portfolio from './Portfolio';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface LandingPageProps {
  onOpenVision: () => void;
}

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
  {
    tier: 'Enterprise',
    price: 'Custom',
    sub: 'Private consultation',
    features: ['Dedicated design strategist', 'SLA + priority render queue', 'Confidential delivery pipeline', 'Advanced revision governance', 'Unlimited AI credits'],
    cta: 'Book Consultation',
    ctaPath: '/contact',
    featured: false,
  },
];

const WORKFLOW_STEPS = [
  { n: '01', title: 'Brief & Sketch Upload', desc: 'Submit your brief and reference images with geometry lock constraints.' },
  { n: '02', title: 'AI Scene Planning', desc: 'Use guided camera, motion, and context tools to direct the output.' },
  { n: '03', title: 'Payment Settlement', desc: 'Pay in USD or NGN via Paystack or Flutterwave — securely.' },
  { n: '04', title: 'Private Delivery', desc: 'Access assets, revisions, and handoff via your secure dashboard.' },
];

const LandingPage: React.FC<LandingPageProps> = ({ onOpenVision }) => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Figment Studio | Premium Architectural Visualization</title>
        <meta name="description" content="Figment Studio provides world-class architectural rendering, cinematic 3D animation, and real estate visualization across Nigeria and globally." />
      </Helmet>

      <Hero
        onOpenVision={onOpenVision}
        onStartProject={() => navigate('/estimator')}
        onOpenArcViz={() => navigate('/arcviz')}
      />
      <Services />
      <Studio />
      <Portfolio onViewAll={() => navigate('/portfolio')} />

      {/* ── PRICING SECTION ── */}
      <section className="section-pad bg-background" id="pricing">
        <div className="content-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div className="space-y-3">
              <p className="label-sm text-primary">Service Plans</p>
              <h2 className="display-md text-text-main">
                Premium Tiers<br />
                <em className="italic font-light text-text-muted">for Architectural Teams</em>
              </h2>
            </div>
            <p className="max-w-sm text-text-muted leading-relaxed text-sm">
              Scale from instant previews to private production workflows with studio-grade AI visualization and delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {PLANS.map((plan) => (
              <article
                key={plan.tier}
                className={`relative flex flex-col gap-8 p-8 ${plan.featured ? 'price-card-featured' : 'card-base card-hover'}`}
              >
                {plan.featured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="badge-primary font-bold px-4 py-1 text-2xs tracking-widest shadow-lg">
                      ★ Most Popular
                    </span>
                  </div>
                )}

                <div className="space-y-2">
                  <p className="label-xs text-primary">{plan.tier}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-light text-4xl text-text-main">{plan.price}</span>
                    <span className="text-sm text-text-faint">{plan.sub}</span>
                  </div>
                </div>

                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="material-symbols-outlined text-[15px] mt-0.5 flex-shrink-0 text-primary">check_circle</span>
                      <span className="text-text-secondary">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(plan.ctaPath)}
                  className={plan.featured ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── WORKFLOW SECTION ── */}
      <section className="section-pad bg-background-alt" id="workflow">
        <div className="content-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div className="space-y-6">
              <p className="label-sm text-primary">Private Workflow</p>
              <h2 className="display-md text-text-main">
                Built For Professional<br />
                <em className="italic font-light text-text-muted">&amp; Confidential Jobs</em>
              </h2>
              <p className="text-text-muted leading-relaxed text-sm max-w-md">
                Every premium project moves through a secure, auditable flow designed for serious developers and architects — from intake to final asset handoff.
              </p>
              <button onClick={() => navigate('/estimator')} className="btn-primary">
                <span className="material-symbols-outlined text-[16px]">calculate</span>
                Get Your Estimate
              </button>
            </div>

            <div className="space-y-3">
              {WORKFLOW_STEPS.map((step) => (
                <div key={step.n} className="flex items-start gap-5 card-base card-hover p-6">
                  <div className="step-number">{step.n}</div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-text-main font-body">{step.title}</p>
                    <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="section-pad-sm px-6 md:px-10 lg:px-16 bg-background">
        <div className="content-lg">
          <div
            className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center"
            style={{
              background: 'linear-gradient(135deg, #0F0B07 0%, #14100A 50%, #1A1410 100%)',
              border: '1px solid rgba(240,122,58,0.12)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(240,122,58,0.06)',
            }}
          >
            {/* Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse, rgba(240,122,58,0.22) 0%, transparent 65%)',
                filter: 'blur(70px)',
              }}
            />

            <div className="relative z-10 space-y-5 mb-8">
              <p className="label-sm text-primary" style={{ letterSpacing: '0.18em' }}>Ready to Begin?</p>
              <h2
                className="font-display font-light text-text-main"
                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', lineHeight: 1.1 }}
              >
                Bring Your Vision<br />
                <span className="gradient-text">To Life.</span>
              </h2>
              <p className="text-text-muted max-w-sm mx-auto leading-relaxed text-sm">
                Join 200+ architects and developers who trust Figment Studio for their most ambitious projects.
              </p>
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => navigate('/contact')} className="btn-primary">
                Contact the Studio
              </button>
              <button
                onClick={() => navigate('/estimator')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#C4BAB0',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.color = '#F2EDE6';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.color = '#C4BAB0';
                }}
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
