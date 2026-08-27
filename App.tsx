import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import VisionAssistant from './components/VisionAssistant.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { useStudioStore } from './store.ts';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { meRequest } from './services/apiClient.ts';

/**
 * Scrolls to the top of the page on every route change.
 * Placed inside BrowserRouter so useLocation() works.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const scrollableContainers = document.querySelectorAll('.overflow-y-auto, main, .custom-scrollbar, [class*="overflow-y-scroll"]');
    scrollableContainers.forEach(container => {
      container.scrollTop = 0;
    });
  }, [pathname]);
  return null;
};

const APP_CANONICAL_ORIGIN = ((import.meta as any).env.VITE_SITE_URL as string | undefined) || 'https://figmentstudio.ng';

type RouteMeta = {
  title: string;
  description: string;
  keywords: string;
  ogType?: 'website' | 'article';
};

const DEFAULT_ROUTE_META: RouteMeta = {
  title: 'Figment Studio | Premium Architectural Visualization',
  description:
    'Figment Studio delivers cinematic architectural rendering, 3D walkthrough animation, and interior visualization from Abuja for projects across Nigeria and globally.',
  keywords:
    'Figment Studio, architectural visualization Nigeria, 3D rendering Abuja, architectural animation Lagos, archviz studio Nigeria, real estate visualization',
  ogType: 'website',
};

const PUBLIC_ROUTE_META: Record<string, RouteMeta> = {
  '/': DEFAULT_ROUTE_META,
  '/about': {
    title: 'About Figment Studio | Architectural Visualization Team in Abuja',
    description:
      'Meet the Figment Studio team in Abuja and learn how we produce premium architectural visualization for developers, architects, and real estate brands.',
    keywords:
      'about Figment Studio, architectural visualization company Abuja, archviz team Nigeria, 3D rendering studio profile',
    ogType: 'website',
  },
  '/contact': {
    title: 'Contact Figment Studio | Abuja Architectural Visualization Studio',
    description:
      'Contact Figment Studio for architectural rendering, cinematic walkthroughs, and project delivery timelines. Based in Abuja, serving Nigeria and international clients.',
    keywords:
      'contact Figment Studio, architectural rendering quote Nigeria, archviz studio Abuja contact, 3D visualization inquiry',
    ogType: 'website',
  },
  '/portfolio': {
    title: 'Portfolio | Figment Studio Architectural Renders and Walkthroughs',
    description:
      'Explore Figment Studio portfolio projects including residential, interior, and commercial architectural visualization work from Abuja, Lagos, and beyond.',
    keywords:
      'Figment Studio portfolio, architectural rendering portfolio Nigeria, 3D walkthrough examples, archviz project gallery',
    ogType: 'website',
  },
  '/works': {
    title: 'Our Works | Figment Studio Premium Architectural Visualization',
    description:
      'Browse Figment Studio works in cinematic architectural rendering, interior visualization, and animation for real estate marketing and design communication.',
    keywords:
      'Figment Studio works, architectural visualization projects, 3D render studio Nigeria, real estate visual marketing',
    ogType: 'website',
  },
  '/works/process': {
    title: 'Workflow Process | Figment Studio Delivery Pipeline',
    description:
      'See how Figment Studio manages project briefs, scene direction, approvals, and secure private delivery for high-end architectural visualization.',
    keywords:
      'architectural rendering process, archviz workflow Nigeria, project delivery pipeline, Figment Studio process',
    ogType: 'website',
  },
  '/insights': {
    title: 'Insights | Figment Studio on Architectural Visualization Trends',
    description:
      'Read Figment Studio insights on architectural visualization trends, cinematic walkthrough impact, and digital design communication in Africa.',
    keywords:
      'architectural visualization insights, archviz trends Nigeria, real estate rendering articles, Figment Studio news',
    ogType: 'website',
  },
  '/academy': {
    title: 'Academy | Figment Studio Learning and Industry Resources',
    description:
      'Access Figment Studio academy resources on rendering standards, design storytelling, and production-ready visualization practice.',
    keywords:
      'archviz academy, rendering tutorials Nigeria, architectural visualization training, Figment Studio learning',
    ogType: 'website',
  },
  '/estimator': {
    title: 'Project Estimator | Figment Studio Architectural Visualization Pricing',
    description:
      'Use the Figment Studio estimator to scope architectural rendering and animation projects with transparent timelines and pricing guidance.',
    keywords:
      'architectural rendering cost Nigeria, archviz pricing estimator, 3D visualization quote tool, Figment Studio estimator',
    ogType: 'website',
  },
};

const RouteSeo: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const canonical = `${APP_CANONICAL_ORIGIN.replace(/\/$/, '')}${pathname === '/' ? '' : pathname}`;
  const origin = APP_CANONICAL_ORIGIN.replace(/\/$/, '');

  const privateRoutePrefixes = [
    '/auth',
    '/dashboard',
    '/admin',
    '/billing',
    '/payment',
    '/assets',
    '/support',
    '/profile',
    '/new-project',
    '/project/',
    '/success',
  ];

  const isPrivateRoute = privateRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
  const robots = isPrivateRoute ? 'noindex, nofollow' : 'index, follow';

  const routeMeta = pathname.startsWith('/insights/')
    ? {
        title: 'Insight Article | Figment Studio',
        description: 'Read expert insight articles from Figment Studio on architectural visualization, rendering workflows, and digital property storytelling.',
        keywords: 'Figment Studio insights, architectural visualization article, archviz knowledge, rendering workflow insights',
        ogType: 'article' as const,
      }
    : (PUBLIC_ROUTE_META[pathname] || DEFAULT_ROUTE_META);

  return (
    <Helmet>
      <title>{routeMeta.title}</title>
      <meta name="description" content={routeMeta.description} />
      <meta name="keywords" content={routeMeta.keywords} />
      <meta name="author" content="Figment Studio" />
      <meta name="geo.region" content="NG-FC" />
      <meta name="geo.placename" content="Abuja" />
      <meta name="geo.position" content="9.0765;7.3986" />
      <meta name="ICBM" content="9.0765, 7.3986" />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={robots} />
      <meta property="og:type" content={routeMeta.ogType || 'website'} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Figment Studio" />
      <meta property="og:title" content={routeMeta.title} />
      <meta property="og:description" content={routeMeta.description} />
      <meta property="og:locale" content="en_NG" />
      <meta property="og:image" content={`${origin}/og-image.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={routeMeta.title} />
      <meta name="twitter:description" content={routeMeta.description} />
      <meta name="twitter:image" content={`${origin}/og-image.png`} />
      <meta name="twitter:site" content="@figment_cs" />
    </Helmet>
  );
};

// Lazy loaded components
const LandingPage = lazy(() => import('./components/LandingPage.tsx'));
const Estimator = lazy(() => import('./components/Estimator.tsx'));
const PortfolioGallery = lazy(() => import('./components/PortfolioGallery.tsx'));
const AboutPage = lazy(() => import('./components/AboutPage.tsx'));
const ContactPage = lazy(() => import('./components/ContactPage.tsx'));
const ClientDashboard = lazy(() => import('./components/ClientDashboard.tsx'));
const AuthPage = lazy(() => import('./components/AuthPage.tsx'));
const MarkupTool = lazy(() => import('./components/MarkupTool.tsx'));
const InsightsPage = lazy(() => import('./components/InsightsPage.tsx'));
const FeedbackForm = lazy(() => import('./components/FeedbackForm.tsx'));
const SuccessInvoice = lazy(() => import('./components/SuccessInvoice.tsx'));
const ProjectDetails = lazy(() => import('./components/ProjectDetails.tsx'));
const DeliveryPage = lazy(() => import('./components/DeliveryPage.tsx'));
const BillingManager = lazy(() => import('./components/BillingManager.tsx'));
const PaymentPortal = lazy(() => import('./components/PaymentPortal.tsx'));
const AssetManager = lazy(() => import('./components/AssetManager.tsx'));
const SupportCenter = lazy(() => import('./components/SupportCenter.tsx'));
const NewProjectRequest = lazy(() => import('./components/NewProjectRequest.tsx'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard.tsx'));
const ProfileSettings = lazy(() => import('./components/ProfileSettings.tsx'));
const NotFound = lazy(() => import('./components/NotFound.tsx'));
const AcademyPage = lazy(() => import('./components/AcademyPage.tsx'));
const WorkProcessPage = lazy(() => import('./components/WorkProcessPage.tsx'));

const AppOutlet = () => {
  const location = useLocation();
  return (
    <div className="flex-1 flex flex-col w-full h-full" key={location.pathname}>
      <Suspense fallback={<div className="h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
        <Outlet />
      </Suspense>
    </div>
  );
};

const Layout = () => {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-background">
      <Header />
      <main className="flex-1 flex flex-col">
        <AppOutlet />
      </main>
      <Footer />
    </div>
  );
};

// Layout for dashboard pages (no header/footer)
const DashboardLayout = () => {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      <main className="flex-1 h-screen flex flex-col">
        <AppOutlet />
      </main>
    </div>
  );
};

const AppRoutes = () => {
  const navigate = useNavigate();
  const { auth, addProposal, setAuthSession, logout } = useStudioStore();

  useEffect(() => {
    if (!auth.isAuthenticated || !auth.accessToken) {
      return;
    }

    let cancelled = false;

    meRequest(auth.accessToken)
      .then((response) => {
        if (cancelled) {
          return;
        }

        setAuthSession({
          id: response.user.id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          plan: response.user.plan,
          accessToken: auth.accessToken || '',
          refreshToken: auth.refreshToken || '',
        });
      })
      .catch(() => {
        if (!cancelled) {
          logout();
        }
      });

    return () => {
      cancelled = true;
    };
  }, [auth.accessToken]);

  const handleNewProjectSubmit = (data: { projectName: string; type: string; total: number; details: string }) => {
    const uniqueSuffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().slice(0, 6).toUpperCase() : `${Math.floor(Math.random() * 10000) + 10000}`;
    const id = `FIG-${uniqueSuffix}`;
    addProposal({
      id,
      clientName: 'Julian Traore', // Current simulated logged-in client
      projectName: data.projectName,
      type: data.type,
      total: data.total,
      status: 'Received',
      date: new Date().toISOString().split('T')[0],
      details: data.details,
    });
    navigate('/success', { state: { invoiceId: id, amount: data.total, project: data.projectName } });
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="estimator" element={<Estimator onBack={() => navigate(-1)} onFinish={(data) => navigate('/success', { state: { invoiceId: data.id, amount: data.total, project: data.projectName } })} />} />
          <Route path="portfolio" element={<PortfolioGallery />} />
          <Route path="works" element={<PortfolioGallery />} />
          <Route path="works/process" element={<WorkProcessPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="insights/:slug" element={<InsightsPage />} />
          <Route path="feedback" element={<FeedbackForm onFinish={() => navigate(-1)} />} />
          <Route path="academy" element={<AcademyPage />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="auth" element={<AuthPage onLogin={(role) => navigate(role === 'admin' ? '/admin' : '/dashboard')} onBack={() => navigate(-1)} />} />
          <Route path="dashboard" element={<ProtectedRoute requiredRole="client"><ClientDashboard /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="billing" element={<BillingManager onBack={() => navigate(-1)} onNavigate={(path, state) => navigate(path, state ? { state } : undefined)} />} />
          <Route path="payment" element={<PaymentPortal onBack={() => navigate(-1)} />} />
          <Route path="assets" element={<AssetManager onBack={() => navigate(-1)} onNavigate={(path) => navigate(path)} />} />
          <Route path="support" element={<SupportCenter onBack={() => navigate(-1)} />} />
          <Route path="profile" element={<ProfileSettings onBack={() => navigate(-1)} onNavigate={(path) => navigate(path)} />} />
          <Route path="new-project" element={<NewProjectRequest onBack={() => navigate(-1)} onSubmit={handleNewProjectSubmit} />} />
          <Route path="project/:id" element={<ProjectDetails />} />
          <Route path="project/:id/delivery" element={<DeliveryPage />} />
          <Route path="project/:id/markup" element={<MarkupTool />} />
          <Route path="success" element={<SuccessInvoice onGoHome={() => navigate('/')} onBack={() => navigate(-1)} />} />
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <VisionAssistant />
    </>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <RouteSeo />
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
