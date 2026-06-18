
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
    dark: false,
    popular: false,
  },
  {
    tier: 'Studio Pro',
    price: '$149',
    sub: 'per month',
    features: ['Guided AI (camera, motion, lighting)', 'Sketch-preserving enhancement', 'Private project dashboard', 'Paystack & Flutterwave checkout', '20 AI credits / month'],
    cta: 'Upgrade to Pro',
    ctaPath: '/auth?upgrade=pro',
    dark: true,
    popular: true,
  },
  {
    tier: 'Enterprise',
    price: 'Custom',
    sub: 'Private consultation',
    features: ['Dedicated design strategist', 'SLA + priority render queue', 'Confidential delivery pipeline', 'Advanced revision governance', 'Unlimited AI credits'],
    cta: 'Book Consultation',
    ctaPath: '/contact',
    dark: false,
    popular: false,
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
            <section className="section-pad bg-background-alt border-y border-border-ui" id="pricing">
                <div className="content-lg">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
                        <div className="space-y-3">
                            <p className="label-sm text-primary">Service Plans</p>
                            <h2 className="display-md text-text-main">
                                Premium Tiers<br />
                                <em className="italic font-light text-text-muted">for Architectural Teams</em>
                            </h2>
                        </div>
                        <p className="max-w-sm text-text-muted leading-relaxed">
                            Scale from instant previews to private production workflows with studio-grade AI visualization and delivery.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                        {PLANS.map((plan) => (
                            <article
                                key={plan.tier}
                                className={`relative rounded-2xl p-8 flex flex-col gap-8 ${
                                    plan.dark
                                        ? 'price-card-featured text-white'
                                        : 'card-base card-hover text-text-main'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="badge-primary px-4 py-1 text-2xs font-bold tracking-widest shadow-sm">
                                            ★ Most Popular
                                        </span>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <p className={`label-xs ${plan.dark ? 'text-primary' : 'text-text-muted'}`}>
                                        {plan.tier}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`font-display font-light text-4xl ${plan.dark ? 'text-white' : 'text-text-main'}`}>
                                            {plan.price}
                                        </span>
                                        <span className={`text-sm ${plan.dark ? 'text-white/40' : 'text-text-faint'}`}>
                                            {plan.sub}
                                        </span>
                                    </div>
                                </div>

                                <ul className="space-y-3 flex-1">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-start gap-2.5 text-sm">
                                            <span className={`material-symbols-outlined text-[16px] mt-0.5 flex-shrink-0 ${plan.dark ? 'text-primary' : 'text-primary'}`}>
                                                check_circle
                                            </span>
                                            <span className={plan.dark ? 'text-white/70' : 'text-text-secondary'}>
                                                {f}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => navigate(plan.ctaPath)}
                                    className={plan.dark
                                        ? 'btn-primary w-full justify-center'
                                        : 'btn-secondary w-full justify-center'
                                    }
                                >
                                    {plan.cta}
                                </button>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WORKFLOW SECTION ── */}
            <section className="section-pad bg-surface" id="workflow">
                <div className="content-lg">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
                        <div className="space-y-6">
                            <p className="label-sm text-primary">Private Workflow</p>
                            <h2 className="display-md text-text-main">
                                Built For Professional<br />
                                <em className="italic font-light text-text-muted">& Confidential Jobs</em>
                            </h2>
                            <p className="text-text-muted leading-relaxed max-w-md">
                                Every premium project moves through a secure, auditable flow designed for serious developers and architects — from intake to final asset handoff.
                            </p>
                            <button
                                onClick={() => navigate('/estimator')}
                                className="btn-primary"
                            >
                                <span className="material-symbols-outlined text-[16px]">calculate</span>
                                Get Your Estimate
                            </button>
                        </div>

                        <div className="space-y-4">
                            {WORKFLOW_STEPS.map((step) => (
                                <div
                                    key={step.n}
                                    className="flex items-start gap-5 card-base p-6 card-hover"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-display font-semibold text-lg">
                                        {step.n}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-text-main">{step.title}</p>
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
                        className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center space-y-8"
                        style={{
                            background: 'linear-gradient(135deg, #100D0A 0%, #1C1712 60%, #251E18 100%)',
                            boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                        }}
                    >
                        {/* Glow orb */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] opacity-20 pointer-events-none"
                            style={{
                                background: 'radial-gradient(ellipse, rgba(240,122,58,0.8) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                            }}
                        />

                        <div className="relative z-10 space-y-5">
                            <p className="label-sm text-primary/90">Ready to Begin?</p>
                            <h2 className="font-display font-light text-white"
                                style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)', lineHeight: 1.1 }}>
                                Bring Your Vision<br />
                                <em className="italic" style={{ color: '#F07A3A' }}>To Life.</em>
                            </h2>
                            <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                                Join 200+ architects and developers who trust Figment Studio for their most ambitious projects.
                            </p>
                        </div>

                        <div className="relative z-10 flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => navigate('/contact')}
                                className="btn-primary shadow-lg shadow-primary/30"
                            >
                                Contact the Studio
                            </button>
                            <button
                                onClick={() => navigate('/estimator')}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-all duration-200"
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
