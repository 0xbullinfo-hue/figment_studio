
import React from 'react';
import { AppView } from '../types.ts';
import Logo from './Logo.tsx';

interface ProfileSettingsProps {
  onBack: () => void;
  onNavigate: (view: AppView) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="bg-[#fcfaf8] min-h-screen font-display text-left">
      <header className="sticky top-0 z-50 w-full border-b border-[#e9dace] bg-white px-6 h-16 flex items-center justify-between">
        <Logo className="size-6" />
        <nav className="flex items-center gap-8">
          <button onClick={onBack} className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-widest">Dashboard</button>
          <button onClick={() => onNavigate('billing')} className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-widest">Billing</button>
          <button className="text-sm font-bold text-primary uppercase tracking-widest">Account</button>
        </nav>
        <div className="size-8 rounded-full bg-primary/20 border border-primary/40 overflow-hidden">
          <img alt="User avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC36KF1P-lbiQX5g-UN715BXexfMBwkjh4IVYpRpiTl6ri-8Gnrs0yy5kMkk5pF0rZHA2GFK7nHQFeDq7NpETkZsE06v8nZCs4c5wlc1ruWldGIehDvaVESvy1h9s2l9DaEOqWONfgZ1VDB-NUM_PjxSnnSc38mpwFy1D3oseD8T6gPrjmlMXB5scTfNrF35G8eZ1fHbzlvUiD0WO4cA_JrC857xcO6_klmlzSCsqWZEMSI2xaUZDSsA04q-QmQmQrKNrTQFSVorA"/>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight uppercase">Account Settings</h1>
          <p className="text-gray-500">Manage your personal information and security preferences.</p>
        </div>

        <section className="bg-white rounded-2xl border border-[#e8dbce] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#f4ede7] bg-[#fcfaf8]">
            <h2 className="text-xl font-black uppercase tracking-tight">Personal Details</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <input className="w-full bg-[#fcfaf8] border-[#e8dbce] rounded-lg h-12 px-4 focus:ring-1 focus:ring-primary outline-none transition-all" defaultValue="Julian Thorne" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Work Email</label>
                <input className="w-full bg-[#fcfaf8] border-[#e8dbce] rounded-lg h-12 px-4 focus:ring-1 focus:ring-primary outline-none transition-all" defaultValue="j.thorne@maitama-arch.ng" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Company Name</label>
              <input className="w-full bg-[#fcfaf8] border-[#e8dbce] rounded-lg h-12 px-4 focus:ring-1 focus:ring-primary outline-none transition-all" defaultValue="Maitama Architectural Collective" />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-[#e8dbce] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-[#f4ede7] bg-[#fcfaf8]">
            <h2 className="text-xl font-black uppercase tracking-tight">Security</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">Password</p>
                <p className="text-sm text-gray-500">Last changed 4 months ago</p>
              </div>
              <button className="px-6 py-2 border-2 border-[#e8dbce] rounded-lg font-bold text-xs uppercase tracking-widest hover:border-primary transition-all">Change Password</button>
            </div>
            <div className="flex justify-between items-center pt-6 border-t border-[#f4ede7]">
              <div>
                <p className="font-bold">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
              </div>
              <button className="px-6 py-2 bg-primary/10 text-primary border-2 border-primary/20 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">Enable 2FA</button>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-4">
           <button onClick={onBack} className="px-8 py-3 text-sm font-bold text-gray-500 uppercase tracking-widest">Cancel</button>
           <button className="px-10 py-3 bg-primary text-white rounded-xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all">Save Changes</button>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
