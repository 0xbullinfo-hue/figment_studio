
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';

interface AuthPageProps {
  onLogin: (role: 'client' | 'admin') => void;
  onBack: () => void;
}

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
      <div className="bg-white dark:bg-[#181a1b] text-[#1c140d] dark:text-gray-100 min-h-screen selection:bg-primary/30 font-display">
        <header className="flex items-center justify-between border-b border-solid border-[#f4ede7] dark:border-gray-800 px-10 py-5 bg-white/80 dark:bg-[#181a1b]/80 backdrop-blur-md sticky top-0 z-50">
          <button onClick={onBack} className="hover:opacity-80 transition-opacity">
            <Logo />
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setIsRegister(false)}
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-transparent text-[#1c140d] dark:text-white text-sm font-bold border border-[#e8dbce] dark:border-gray-700 hover:bg-[#fcfaf8] transition-colors"
            >
              LOGIN
            </button>
            <button className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-[#f4ede7] dark:bg-gray-800 text-[#1c140d] dark:text-white text-sm font-bold transition-colors">
              SUPPORT
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center py-12 px-6">
          <div className="w-full max-w-[640px] mb-12">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end">
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Step 01 / 03</span>
                  <h3 className="text-xl font-bold dark:text-white">PERSONAL DETAILS</h3>
                </div>
                <p className="text-[#9c7349] dark:text-gray-400 text-sm font-medium">NEXT: SECURITY</p>
              </div>
              <div className="h-1.5 w-full bg-[#e8dbce] dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all duration-700" style={{ width: '33.33%' }}></div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[640px] bg-white dark:bg-[#212425] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-10 border border-[#f4ede7] dark:border-gray-800">
            <h1 className="text-[#1c140d] dark:text-white text-3xl font-bold leading-tight mb-8 uppercase tracking-tight text-left">Join the Studio</h1>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-[#1c140d] dark:text-gray-300 uppercase tracking-widest">Full Name</label>
                <input required className="block w-full rounded-lg border-[#e8dbce] dark:border-gray-700 bg-[#fcfaf8] dark:bg-gray-900/50 h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[#9c7349]/50" placeholder="Alexander Figment" type="text" />
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-[#1c140d] dark:text-gray-300 uppercase tracking-widest">Company Name</label>
                <input required className="block w-full rounded-lg border-[#e8dbce] dark:border-gray-700 bg-[#fcfaf8] dark:bg-gray-900/50 h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[#9c7349]/50" placeholder="Architectural Collective Ltd." type="text" />
              </div>
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold text-[#1c140d] dark:text-gray-300 uppercase tracking-widest">Work Email</label>
                <input required className="block w-full rounded-lg border-[#e8dbce] dark:border-gray-700 bg-[#fcfaf8] dark:bg-gray-900/50 h-14 px-4 text-base focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-[#9c7349]/50" placeholder="hello@company.com" type="email" />
              </div>

              <div className="pt-8 mt-8 border-t border-[#f4ede7] dark:border-gray-800 space-y-6">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-[#1c140d] dark:text-gray-300 uppercase tracking-widest">Password</label>
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 tracking-tighter uppercase">Strong</span>
                </div>
                <div className="space-y-3 relative">
                  <div className="relative">
                    <input required className="block w-full rounded-lg border-[#e8dbce] dark:border-gray-700 bg-[#fcfaf8] dark:bg-gray-900/50 h-14 px-4 pr-12 text-base focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" type={showPassword ? 'text' : 'password'} defaultValue="hardpassword123" />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9c7349] hover:text-[#1c140d] dark:hover:text-white transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  <div className="flex gap-1.5 h-1">
                    <div className="flex-1 bg-primary rounded-full"></div>
                    <div className="flex-1 bg-primary rounded-full"></div>
                    <div className="flex-1 bg-primary rounded-full"></div>
                    <div className="flex-1 bg-primary rounded-full"></div>
                    <div className="flex-1 bg-[#e8dbce] dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button
                  type="submit"
                  className="w-full h-16 bg-primary text-white text-sm font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                  CREATE ACCOUNT & START PROJECT
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </form>
          </div>
          <p className="mt-12 text-[#9c7349] dark:text-gray-500 text-xs font-medium uppercase tracking-[0.2em] text-center max-w-xs leading-relaxed">
            Trusted by global architects & design collectives since 2018.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 architectural-bg relative overflow-x-hidden font-display">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-md"></div>

      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <button onClick={onBack} className="hover:scale-105 transition-transform mb-4 flex flex-col items-center gap-2">
            <Logo className="h-14" />
            <p className="label-xs text-primary" style={{ letterSpacing: '0.14em' }}>CREATIVE STUDIO</p>
          </button>
        </div>

        <div className="w-full bg-white rounded-[2rem] p-10 md:p-12 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.1),0_18px_36px_-18px_rgba(0,0,0,0.15)] border border-white">
          <div className="flex p-1 bg-gray-100 rounded-2xl mb-10 w-full">
            <button
              onClick={() => setPortalType('client')}
              className={`flex-1 text-center py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${portalType === 'client' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Client
            </button>
            <button
              onClick={() => setPortalType('admin')}
              className={`flex-1 text-center py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest cursor-pointer transition-all ${portalType === 'admin' ? 'bg-white text-brand-dark shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Admin
            </button>
          </div>

          <div className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-brand-dark text-3xl font-black tracking-tight">
                {portalType === 'client' ? 'Client Portal' : 'Admin Control'}
              </h3>
              <p className="text-gray-400 text-sm font-medium text-center">Secure access to your architectural ecosystem</p>
              {portalType === 'client' && upgradeIntent && (
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary font-semibold">Pro upgrade flow active</p>
              )}
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 text-left">
                <label className="text-brand-dark text-[10px] font-bold uppercase tracking-widest px-1">Email Address</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">alternate_email</span>
                  <input required className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-100 bg-gray-50/50 text-brand-dark focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300" placeholder="name@company.com" type="email" />
                </div>
              </div>

              <div className="flex flex-col gap-2 text-left">
                <div className="flex justify-between items-center px-1">
                  <label className="text-brand-dark text-[10px] font-bold uppercase tracking-widest">Password</label>
                  <button type="button" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:text-primary/80 transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors">lock</span>
                  <input required className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-100 bg-gray-50/50 text-brand-dark focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all placeholder:text-gray-300" placeholder="••••••••" type={showPassword ? 'text' : 'password'} />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-dark transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              <button className="w-full bg-primary hover:bg-[#e37d1a] text-white py-4 rounded-xl text-sm font-bold tracking-[0.15em] uppercase shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-4" type="submit">
                Enter Portal
              </button>
            </form>

            {portalType === 'client' && (
              <p className="text-center text-sm font-semibold tracking-wide">
                <span className="text-gray-400">New client?</span>
                <button onClick={() => setIsRegister(true)} className="text-primary hover:text-primary/80 transition-colors ml-1">Create an Account</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
