
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Logo from './Logo.tsx';
import { useStudioStore } from '../store.ts';

interface BillingManagerProps {
  onBack: () => void;
  onNavigate: (view: string, state?: unknown) => void;
}

const BillingManager: React.FC<BillingManagerProps> = ({ onBack, onNavigate }) => {
  const { proposals } = useStudioStore();
  const [invoices, setInvoices] = useState(
    proposals.map(p => ({
      id: p.id,
      project: p.projectName,
      company: p.clientName,
      date: p.date,
      amount: p.total,
      status: p.status === 'Approved' ? 'Paid' : 'Pending'
    }))
  );

  useEffect(() => {
    setInvoices(
      proposals.map(p => ({
        id: p.id,
        project: p.projectName,
        company: p.clientName,
        date: p.date,
        amount: p.total,
        status: p.status === 'Approved' ? 'Paid' : 'Pending'
      }))
    );
  }, [proposals]);

  const handleUploadPOP = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'Verifying' } : inv));
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'pending': return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'verifying': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'overdue': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-[#fcfaf8] text-[#1c140d] min-h-screen font-display text-left">
      <Helmet>
        <title>Billing & Invoices | Figment Studio</title>
        <meta name="description" content="Manage your Figment Studio project billing, download invoices, or submit proof of payment." />
      </Helmet>
      <header className="border-b border-[#e8dbce] bg-white px-10 h-16 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary group-hover:translate-x-[-2px] transition-transform">arrow_back</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Return to Portal</span>
          </button>
        </div>
        <Logo size={30} iconOnly />
        <div className="size-8 rounded-full border-2 border-primary/20 bg-primary/10 flex items-center justify-center font-black text-primary text-[10px]">JT</div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-20 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tight uppercase">Settlements & Billing</h1>
            <p className="text-[#9c7349] font-medium">Review and settle your project investment balances.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-2xl border border-[#e8dbce] shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Current Balance</p>
            <p className="text-4xl font-black text-primary">$4,250.00</p>
          </div>
          <div className="bg-[#1c140d] p-8 rounded-2xl border border-white/10 shadow-sm text-white md:col-span-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Default Payment Method</p>
                <p className="text-xl font-bold">STANBIC IBTC BANK</p>
                <p className="text-sm text-primary font-black tracking-widest mt-1">Acct: 1111111111</p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg"><span className="material-symbols-outlined text-primary">account_balance</span></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8dbce] overflow-hidden shadow-sm">
          <div className="p-8 border-b border-[#f4ede7] bg-[#fcfaf8]">
            <h2 className="text-xl font-black uppercase tracking-tight">Active Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-[#f4ede7]">
                  <th className="px-8 py-4">Reference</th>
                  <th className="px-8 py-4">Project</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4ede7]">
                {invoices.map((inv, i) => (
                  <tr key={i} className="hover:bg-[#fcfaf8] transition-colors group">
                    <td className="px-8 py-6 font-bold text-sm text-gray-400">{inv.id}</td>
                    <td className="px-8 py-6 font-bold text-sm">{inv.project}</td>
                    <td className="px-8 py-6 font-black text-sm">${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${getStatusClass(inv.status)}`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right space-x-2">
                      {inv.status === 'Pending' && (
                        <button
                          onClick={() => onNavigate('/payment', { invoiceId: inv.id, amount: inv.amount, project: inv.project })}
                          className="px-4 py-2 border border-emerald-500 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                        >
                          Pay Now
                        </button>
                      )}
                      {inv.status === 'Pending' && (
                        <button
                          onClick={() => handleUploadPOP(inv.id)}
                          className="px-4 py-2 border border-primary text-primary text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary hover:text-white transition-all"
                        >
                          Upload Proof
                        </button>
                      )}
                      <button className="size-8 text-gray-300 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingManager;
