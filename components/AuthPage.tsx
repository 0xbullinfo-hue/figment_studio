
import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';
import { googleLoginRequest, loginRequest } from '../services/apiClient.ts';

declare global {
  interface Window {
    google?: any;
  }
}

interface AuthPageProps {
  onLogin: (role: 'client' | 'admin') => void;
  onBack: () => void;
}

const INPUT_CLASS = "w-full rounded-xl border border-border-ui bg-background px-4 py-3.5 text-sm text-text-main placeholder:text-text-faint focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all";

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onBack }) => {
  const [searchParams] = useSearchParams();
  const { setAuthSession } = useStudioStore();
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const googleClientId = ((import.meta as any).env.VITE_GOOGLE_CLIENT_ID as string | undefined) || '';
  const allowAdminPortal = import.meta.env.DEV;
  const upgradeIntent = searchParams.get('upgrade') === 'pro';

  useEffect(() => {
    if (!googleClientId || isRegister) {
      return;
    }

    const initGoogle = () => {
      if (!window.google || !googleButtonRef.current) {
        return;
      }

      googleButtonRef.current.innerHTML = '';

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response: { credential?: string }) => {
          const credential = response?.credential;
          if (!credential) {
            setAuthError('Google did not return a credential token.');
            return;
          }

          setAuthError(null);
          setIsSubmitting(true);

          try {
            const session = await googleLoginRequest(credential);
            setAuthSession({
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              role: session.user.role,
              plan: session.user.plan,
              accessToken: session.accessToken,
              refreshToken: session.refreshToken,
            });
            onLogin(session.user.role);
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Google sign-in failed.';
            setAuthError(message);
          } finally {
            setIsSubmitting(false);
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: 'standard',
        theme: 'filled_black',
        text: 'continue_with',
        shape: 'pill',
        size: 'large',
        width: 360,
      });
    };

    const existingScript = document.getElementById('google-identity-script');
    if (existingScript) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    script.onerror = () => {
      setAuthError('Unable to load Google sign-in. Please use email and password.');
    };
    document.head.appendChild(script);
  }, [googleClientId, isRegister]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsSubmitting(true);

    try {
      const response = await loginRequest(email, password);
      setAuthSession({
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role,
        plan: response.user.plan,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });
      onLogin(response.user.role);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to authenticate right now.';
      setAuthError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegister(false);
    setAuthError('Registration flow will be enabled in the next phase. Please sign in with a provisioned account.');
  };

  if (isRegister) {
    return (
      <div className="min-h-screen bg-background text-text-main font-body">
        <Helmet>
          <title>Join the Studio | Figment Studio</title>
          <meta name="description" content="Create a private account at Figment Studio to collaborate, receive custom quotes, and review architectural deliverables." />
        </Helmet>
        {/* Header */}
        <header
          className="flex items-center justify-between px-10 py-5 sticky top-0 z-50"
          style={{
            background: 'rgba(10,8,5,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button onClick={onBack} className="hover:opacity-80 transition-opacity focus:outline-none">
            <Logo size={30} iconOnly />
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => setIsRegister(false)}
              className="btn-secondary px-5 py-2 text-sm"
            >
              Login
            </button>
            <button className="btn-ghost px-5 py-2 text-sm">
              Support
            </button>
          </div>
        </header>

        <main className="flex flex-col items-center py-12 px-6">
          {/* Progress */}
          <div className="w-full max-w-xl mb-10">
            <div className="flex justify-between items-end mb-3">
              <div>
                <p className="label-sm text-primary">Step 01 / 03</p>
                <p className="text-lg font-semibold text-text-main mt-1">Personal Details</p>
              </div>
              <p className="text-xs text-text-muted uppercase tracking-widest">Next: Security</p>
            </div>
            <div className="h-1 w-full rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: '33.33%' }} />
            </div>
          </div>

          {/* Form card */}
          <div className="w-full max-w-xl card-base p-10 space-y-6">
            <h1 className="font-display font-light text-3xl text-text-main">Join the Studio</h1>

            <form className="space-y-5" onSubmit={handleRegisterSubmit}>
              {[
                { label: 'Full Name', placeholder: 'Alexander Figment', type: 'text' },
                { label: 'Company Name', placeholder: 'Architectural Collective Ltd.', type: 'text' },
                { label: 'Work Email', placeholder: 'hello@company.com', type: 'email' },
              ].map((field) => (
                <div key={field.label} className="space-y-2">
                  <label className="label-xs text-text-muted block">{field.label}</label>
                  <input
                    required
                    type={field.type}
                    placeholder={field.placeholder}
                    className={INPUT_CLASS}
                  />
                </div>
              ))}

              <div className="pt-6 border-t border-border-ui space-y-3">
                <div className="flex items-center justify-between">
                  <label className="label-xs text-text-muted">Password</label>
                  <span className="text-2xs font-semibold text-emerald-400 uppercase tracking-wide">Strong</span>
                </div>
                <div className="relative">
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`${INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {/* Strength bar */}
                <div className="flex gap-1.5 h-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full ${i < 4 ? 'bg-primary' : 'bg-border-ui'}`} />
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-3.5 mt-2">
                Create Account & Start Project
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
          </div>

          <p className="mt-10 text-text-faint text-xs text-center uppercase tracking-widest max-w-xs leading-relaxed">
            Trusted by global architects & design collectives since 2018.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 font-body"
      style={{ background: '#0A0805' }}
    >
      <Helmet>
        <title>Studio Portal Login | Figment Studio</title>
        <meta name="description" content="Access your private client dashboard or administrative controls at Figment Studio." />
      </Helmet>
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(240,122,58,0.08) 0%, transparent 60%)',
        }}
      />

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        {/* Logo */}
        <button onClick={onBack} className="flex flex-col items-center gap-3 group focus:outline-none">
          <Logo size={56} iconOnly />
        </button>

        {/* Card */}
        <div
          className="w-full rounded-2xl p-10"
          style={{
            background: '#151009',
            border: '1px solid #272018',
            boxShadow: '0 32px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {allowAdminPortal && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 mb-8 text-xs text-text-secondary uppercase tracking-[0.18em]">
              Development mode admin access remains available through /auth?portal=admin.
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="font-display font-light text-3xl text-text-main">
                Client Portal
              </h1>
              <p className="text-sm text-text-muted">Secure access to your architectural ecosystem</p>
              {upgradeIntent && (
                <p className="label-xs text-primary" style={{ letterSpacing: '0.14em' }}>Upgrade request captured. Plan activation follows verified payment.</p>
              )}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-1.5">
                <label className="label-xs text-text-muted block">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-text-faint">
                    alternate_email
                  </span>
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className={`${INPUT_CLASS} pl-11`}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="label-xs text-text-muted">Password</label>
                  <button type="button" className="text-2xs font-semibold text-primary hover:text-primary-hover transition-colors uppercase tracking-wide">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-text-faint">lock</span>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`${INPUT_CLASS} pl-11 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint hover:text-text-muted transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>

              {authError && (
                <p className="text-xs text-red-400 uppercase tracking-[0.12em]">{authError}</p>
              )}

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {isSubmitting ? 'Authenticating...' : 'Enter Portal'}
              </button>

              {googleClientId && (
                <>
                  <div className="flex items-center gap-3 py-1">
                    <div className="h-px bg-border-ui flex-1" />
                    <span className="text-[10px] uppercase tracking-[0.22em] text-text-faint">or</span>
                    <div className="h-px bg-border-ui flex-1" />
                  </div>
                  <div className="flex justify-center">
                    <div ref={googleButtonRef} />
                  </div>
                </>
              )}
            </form>

            <p className="text-center text-sm text-text-muted">
              New client?{' '}
              <button onClick={() => setIsRegister(true)} className="text-primary hover:text-primary-hover transition-colors font-semibold">
                Create an account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
