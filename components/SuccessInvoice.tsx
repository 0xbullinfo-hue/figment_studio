
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStudioStore } from '../store.ts';
import { createReceiptRequest } from '../services/apiClient.ts';

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(value);

const buildReceiptWhatsAppText = (invoiceId: string, amount: number, project: string, isPaymentConfirmed: boolean) => {
  const statusText = isPaymentConfirmed ? 'Payment confirmed' : 'Estimate ready for payment';
  return `Hello Figment Studio,\n\nI would like to share my invoice receipt details.\n\nInvoice ID: ${invoiceId}\nProject: ${project}\nAmount: ${formatCurrency(amount)}\nStatus: ${statusText}\n\nPlease confirm receipt and next steps.`;
};

interface SuccessInvoiceProps {
  onBack: () => void;
  onGoHome: () => void;
}

const SuccessInvoice: React.FC<SuccessInvoiceProps> = ({ onBack, onGoHome }) => {
  const [popUploaded, setPopUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const { addReceipt, auth } = useStudioStore();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const paymentReference = searchParams.get('paymentReference');
  const { invoiceId = paymentReference || '#FIG-2024-0892', amount = 3700, project = 'Project Estimate' } = location.state || {};
  const isPaymentConfirmation = Boolean(paymentReference);

  useEffect(() => {
    if (isPaymentConfirmation && !hasAutoDownloaded) {
      setHasAutoDownloaded(true);
      handleDownloadPdf(true);
    }
  }, [isPaymentConfirmation, hasAutoDownloaded]);

  const handleDownloadPdf = async (silent = false) => {
    try {
      setIsDownloadingPdf(true);
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 42;
      const safeInvoiceId = String(invoiceId || 'FIG-0000').replace(/[^a-zA-Z0-9_-]/g, '');
      const safeProject = String(project || 'Project Estimate').replace(/[\\/]/g, ' ').slice(0, 40);

      pdf.setFillColor(240, 122, 58);
      pdf.rect(0, 0, pageWidth, 64, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text('FIGMENT STUDIO', margin, 32);
      pdf.setFontSize(10);
      pdf.text('RECEIPT / INVOICE', pageWidth - margin - 90, 32);

      pdf.setTextColor(20, 20, 20);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      let y = 94;
      pdf.text(`Invoice ID: ${invoiceId}`, margin, y);
      y += 20;
      pdf.text(`Project: ${project}`, margin, y);
      y += 20;
      pdf.text(`Status: ${isPaymentConfirmation ? 'Payment Confirmed' : 'Estimate Ready'}`, margin, y);
      y += 20;
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, margin, y);

      y += 36;
      pdf.setDrawColor(211, 211, 211);
      pdf.line(margin, y, pageWidth - margin, y);
      y += 22;

      pdf.setFont('helvetica', 'bold');
      pdf.text('Total Due', margin, y);
      pdf.text(formatCurrency(Number(amount || 0)), pageWidth - margin - 100, y);
      y += 24;
      pdf.setFont('helvetica', 'normal');
      pdf.text('Bank: STANBIC IBTC BANK', margin, y);
      y += 18;
      pdf.text('Account Name: FIGMENT STUDIO', margin, y);
      y += 18;
      pdf.text('Account Number: 1111111111', margin, y);
      y += 24;
      pdf.text(`Narration: ${invoiceId}`, margin, y);

      y += 46;
      pdf.setFillColor(248, 248, 248);
      pdf.roundedRect(margin, y, pageWidth - margin * 2, 90, 12, 12, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Terms', margin + 18, y + 24);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Please include your invoice ID in the transfer narration.', margin + 18, y + 46);
      pdf.text('Submit proof of payment for verification when required.', margin + 18, y + 66);

      pdf.save(`Figment_Receipt_${safeInvoiceId || safeProject}.pdf`);

      const receipt = {
        id: `RCPT-${safeInvoiceId || Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        invoiceId: String(invoiceId || safeInvoiceId || 'FIG-0000'),
        project: String(project || safeProject || 'Project Estimate'),
        clientName: 'Client User',
        amount: Number(amount || 0),
        status: isPaymentConfirmation ? 'Paid' : 'Pending',
        createdAt: new Date().toISOString(),
        source: isPaymentConfirmation ? 'payment' : 'estimate',
      } as const;
      addReceipt(receipt);
      if (auth.accessToken) {
        await createReceiptRequest(auth.accessToken, receipt).catch((error) => {
          console.warn('Receipt saved locally but backend persistence failed', error);
        });
      }

      if (silent) {
        return;
      }
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Failed to generate receipt PDF', error);
      window.alert('Unable to generate the PDF at the moment. Please try again.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleShareViaWhatsApp = () => {
    const message = buildReceiptWhatsAppText(String(invoiceId), Number(amount || 0), String(project), isPaymentConfirmation);
    const whatsappUrl = `https://wa.me/2348168299111?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

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
          <p className="text-gray-500 text-lg max-w-lg mx-auto font-medium text-center">
            {isPaymentConfirmation
              ? 'Payment confirmed. Your Pro entitlement is now active in this browser session.'
              : 'Your project estimate is ready. Please proceed with payment to initiate the studio production.'}
          </p>
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
          <button
            onClick={() => handleDownloadPdf(false)}
            disabled={isDownloadingPdf}
            className="bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-60"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">download</span>
              {isDownloadingPdf ? 'Generating PDF...' : 'Download Receipt PDF'}
            </span>
          </button>
          <button
            onClick={handleShareViaWhatsApp}
            className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-emerald-900/10 hover:scale-105 active:scale-95 transition-all"
          >
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">chat</span>
              Send via WhatsApp
            </span>
          </button>
          <button onClick={onBack} className="bg-primary text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Go to Dashboard</button>
          <button onClick={onGoHome} className="bg-white text-slate-900 border border-slate-200 px-10 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-50 transition-colors">Return to Site</button>
        </div>
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Receipt Preview</p>
                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{invoiceId}</h3>
              </div>
              <button onClick={() => setIsPreviewOpen(false)} className="text-slate-500 hover:text-slate-900">
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="space-y-6 py-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Project</span>
                <span className="font-black text-slate-900 text-right">{project}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Amount</span>
                <span className="font-black text-primary">{formatCurrency(Number(amount || 0))}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <span className="text-sm font-bold uppercase tracking-widest text-slate-500">Status</span>
                <span className="font-black text-emerald-600">{isPaymentConfirmation ? 'Payment confirmed' : 'Estimate ready'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleDownloadPdf(false)}
                className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em]"
              >
                Download PDF
              </button>
              <button
                onClick={handleShareViaWhatsApp}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black uppercase text-xs tracking-[0.2em]"
              >
                Share on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuccessInvoice;


