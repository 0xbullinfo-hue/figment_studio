
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';

interface SuccessInvoiceProps {
  onBack: () => void;
  onGoHome: () => void;
}

const SuccessInvoice: React.FC<SuccessInvoiceProps> = ({ onBack, onGoHome }) => {
  const [popUploaded, setPopUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { invoiceId = '#FIG-2024-0892', amount = 3700, project = 'Project Estimate' } = location.state || {};

  const handleUploadPOP = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        setPopUploaded(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 font-display text-left">
      <Helmet>
        <title>Invoice Generated Successfully | Figment Studio</title>
        <meta name="description" content="Your project quote has been successfully generated. Follow the Stanbic bank transfer instructions to lock in your production timeline." />
      </Helmet>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center size-20 rounded-full bg-primary/10 text-primary ring-8 ring-primary/5">
            <span className="material-symbols-outlined text-5xl">check_circle</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-primary">Quote Generated!</h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto font-medium text-center">Your project estimate is ready. Please proceed with payment to initiate the studio production.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Invoice Summary */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col">
            <div className="h-2 bg-primary"></div>
            <div className="p-8 space-y-8 flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-black uppercase tracking-widest">Quote Summary</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{invoiceId}</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-50">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Design / Production Bundle</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{project}</p>
                  </div>
                  <p className="font-black text-slate-900 text-sm">${amount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="font-black uppercase text-xs tracking-widest text-slate-400">Total Due</span>
                <span className="text-3xl font-black text-primary">${amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-[#1c140d] text-white rounded-3xl p-8 shadow-xl space-y-8 flex flex-col">
            <div className="space-y-2">
              <h2 className="text-xl font-black uppercase tracking-widest text-primary">Payment Instructions</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Electronic Bank Transfer Only</p>
            </div>

            <div className="space-y-6 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Account Name</p>
                <p className="font-bold text-lg uppercase tracking-tight">FIGMENT STUDIO</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Bank</p>
                  <p className="font-bold uppercase tracking-tight">STANBIC IBTC BANK</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Account Number</p>
                  <p className="font-bold text-primary text-xl tracking-widest">1111111111</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
                * Please include your Quote ID ({invoiceId}) in the transfer narration.
              </p>

              <button
                onClick={() => navigate('/payment', { state: { invoiceId, amount, project } })}
                className="w-full py-4 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Pay with Paystack / Flutterwave
              </button>

              {!popUploaded ? (
                <div className="relative group">
                  <input
                    type="file"
                    onChange={handleUploadPOP}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept="image/*,.pdf"
                  />
                  <div className={`w-full py-4 border-2 border-dashed rounded-xl flex items-center justify-center gap-3 transition-all ${isUploading ? 'bg-white/5 border-primary animate-pulse' : 'border-white/20 hover:border-primary hover:bg-white/5'}`}>
                    <span className="material-symbols-outlined text-primary">{isUploading ? 'sync' : 'upload_file'}</span>
                    <span className="text-xs font-black uppercase tracking-widest">
                      {isUploading ? 'Uploading Receipt...' : 'Upload Proof of Payment'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-500">verified</span>
                  <div>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status: Pending Verification</p>
                    <p className="text-xs text-emerald-100 font-bold">POP successfully sent to Admin.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button onClick={onBack} className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Go to Dashboard</button>
          <button onClick={onGoHome} className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-colors">Return to Site</button>
        </div>
      </div>
    </div>
  );
};

export default SuccessInvoice;
