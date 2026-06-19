
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';

interface AuthPageProps {
  onLogin: (role: 'client' | 'admin') => void;
  onBack: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '0.625rem',
  border: '1px solid #272018',
  background: '#0A0805',
  padding: '0.875rem 1rem 0.875rem 3rem',
  fontSize: '0.875rem',
  color: '#F2EDE6',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'all 0.2s ease',
};

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onBack }) => {
  const [searchParams] = useSearchParams();
  const { login } = useStudioStore();
  const [isRegister, setIsRegister] = useState(false);
  const [portalType, setPortalType] = useState<'client' | 'admin'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const upgradeIntent = searchParams.get('upgrade') === 'pro';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (portalType === 'admin') {
      login('admin', 'pro', 'Studio Admin');
    } else {
      login('client', upgradeIntent ? 'pro' : 'trial', 'Client User');
    }
    onLogin(portalType);
  };

  if (isRegister) {
    return (
      <div className="min-h-screen bg-background text-text-main font-body">
        {/* Header */}
        <header
          className="flex items-center justify-between px-10 py-5 sticky top-0 z-50"
          style={{
            background: 'rgba(10,8,5,0.92)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <button onClick={onBack}>
            <Logo size={30} showWordmark color="#F07A3A" />
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

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    className="input-base"
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
                    defaultValue="hardpassword123"
                    className="input-base pr-12"
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
        <button onClick={onBack} className="flex flex-col items-center gap-2 group">
          <Logo size={52} iconOnly color="#F07A3A" />
          <p className="label-xs text-primary group-hover:text-primary-hover transition-colors" style={{ letterSpacing: '0.18em' }}>
            CREATIVE STUDIO
          </p>
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
          {/* Toggle tab */}
          <div className="flex p-1 rounded-xl mb-8" style={{ background: '#0A0805' }}>
            {(['client', 'admin'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setPortalType(tab)}
                className="flex-1 py-2.5 rounded-lg text-2xs font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  background: portalType === tab ? '#272018' : 'transparent',
                  color: portalType === tab ? '#F2EDE6' : '#4E4540',
                }}
              >
                {tab === 'client' ? 'Client' : 'Admin'}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <h1 className="font-display font-light text-3xl text-text-main">
                {portalType === 'client' ? 'Client Portal' : 'Admin Control'}
              </h1>
              <p className="text-sm text-text-muted">Secure access to your architectural ecosystem</p>
              {portalType === 'client' && upgradeIntent && (
                <p className="label-xs text-primary" style={{ letterSpacing: '0.14em' }}>Pro upgrade flow active</p>
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
                    style={{ ...inputStyle, paddingLeft: '2.75rem' }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(240,122,58,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,122,58,0.07)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#272018';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
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
                    style={{ ...inputStyle, paddingLeft: '2.75rem', paddingRight: '2.75rem' }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = 'rgba(240,122,58,0.4)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(240,122,58,0.07)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#272018';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
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

              <button type="submit" className="btn-primary w-full justify-center py-3.5 mt-2">
                Enter Portal
              </button>
            </form>

            {portalType === 'client' && (
              <p className="text-center text-sm text-text-muted">
                New client?{' '}
                <button onClick={() => setIsRegister(true)} className="text-primary hover:text-primary-hover transition-colors font-semibold">
                  Create an Account
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
