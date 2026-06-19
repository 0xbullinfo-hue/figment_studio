import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import VisionAssistant from './components/VisionAssistant.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { useStudioStore } from './store.ts';
import CustomCursor from './components/CustomCursor.tsx';

/**
 * Scrolls to the top of the page on every route change.
 * Placed inside BrowserRouter so useLocation() works.
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
};

// Lazy loaded components
const LandingPage = lazy(() => import('./components/LandingPage.tsx'));
const Estimator = lazy(() => import('./components/Estimator.tsx'));
const PortfolioGallery = lazy(() => import('./components/PortfolioGallery.tsx'));
const AboutPage = lazy(() => import('./components/AboutPage.tsx'));
const ContactPage = lazy(() => import('./components/ContactPage.tsx'));
const ArcVizPage = lazy(() => import('./components/ArcVizPage.tsx'));
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

const AppOutlet = () => (
  <div className="flex-1 flex flex-col w-full h-full">
    <Suspense fallback={<div className="h-[50vh] flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
      <Outlet />
    </Suspense>
  </div>
);

const Layout = ({ onOpenVision }: { onOpenVision: () => void }) => {
  return (
    <div className="relative flex flex-col min-h-screen overflow-x-hidden bg-background">
      <Header onOpenVision={onOpenVision} />
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
  const [isVisionAssistantOpen, setIsVisionAssistantOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { addProposal } = useStudioStore();

  useEffect(() => {
    setIsVisionAssistantOpen(false);
  }, [location.pathname]);

  const handleNewProjectSubmit = (data: { projectName: string; type: string; total: number; details: string }) => {
    const id = `FIG-${Math.floor(Math.random() * 10000) + 10000}`;
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
        <Route path="/" element={<Layout onOpenVision={() => setIsVisionAssistantOpen(true)} />}>
          <Route index element={<LandingPage />} />
          <Route path="estimator" element={<Estimator onBack={() => navigate(-1)} onFinish={() => navigate('/success')} />} />
          <Route path="portfolio" element={<PortfolioGallery />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="arcviz" element={<ArcVizPage />} />
          <Route path="insights" element={<InsightsPage />} />
          <Route path="feedback" element={<FeedbackForm onFinish={() => navigate(-1)} />} />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="auth" element={<AuthPage onLogin={(role) => navigate(role === 'admin' ? '/admin' : '/dashboard')} onBack={() => navigate(-1)} />} />
          <Route path="dashboard" element={<ClientDashboard onOpenVision={() => setIsVisionAssistantOpen(true)} />} />
          <Route path="admin" element={<AdminDashboard />} />
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

      {isVisionAssistantOpen && (
        <VisionAssistant onClose={() => setIsVisionAssistantOpen(false)} />
      )}
    </>
  );
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop />
          <CustomCursor />
          <AppRoutes />
        </BrowserRouter>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
