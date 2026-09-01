import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import DashboardShell from './DashboardShell.tsx';
import { useStudioStore } from '../store.ts';
import { getReceipts } from '../services/apiClient.ts';
import {
  Download,
  Landmark,
  Copy,
  Check,
  Globe,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Calculator,
} from 'lucide-react';

const FX_RATES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1500, flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 1920, flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 1630, flag: '🇪🇺' },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', rate: 408, flag: '🇦🇪' },
];

const BANK_DETAILS = {
  bank: 'Stanbic IBTC Bank',
  account: '0071963113',
  name: 'Figment Studio LTD',
  type: 'Corporate Account (NGN)',
};

const BillingManager: React.FC = () => {
  const navigate = useNavigate();
  const { invoices, proposals, receipts, auth, setReceipts, updateInvoiceStatus, addReceipt } = useStudioStore();
  const [copied, setCopied] = useState(false);
  const [activeUploadInvoiceId, setActiveUploadInvoiceId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!auth.accessToken) return;
    getReceipts(auth.accessToken)
      .then((response) => setReceipts(response.receipts))
      .catch(() => undefined);
  }, [auth.accessToken, setReceipts]);

  // Merge direct store invoices, proposals, and backend receipts
  const displayInvoices = useMemo(() => {
    const directInvoices = (invoices || []).map((inv) => ({
      id: inv.id,
      project: inv.projectName,
      company: inv.clientName,
      date: inv.date,
      amount: inv.amount,
      status: inv.status.toLowerCase() === 'paid' ? 'Paid' : inv.status.toLowerCase() === 'verifying' ? 'Verifying' : 'Pending',
      description: inv.description,
    }));

    const proposalInvoices = (proposals || []).map((p) => ({
      id: p.id,
      project: p.projectName,
      company: p.clientName,
      date: p.date,
      amount: p.total,
      status: p.status === 'Approved' ? 'Paid' : 'Pending',
      description: p.details,
    }));

    const receiptInvoices = (receipts || []).map((receipt) => ({
      id: receipt.invoiceId,
      project: receipt.project,
      company: receipt.clientName,
      date: receipt.createdAt.split('T')[0],
      amount: receipt.amount,
      status: receipt.status === 'Paid' ? 'Paid' : receipt.status === 'Verifying' ? 'Verifying' : 'Pending',
      description: '',
    }));

    const mergedMap = new Map<string, { id: string; project: string; company: string; date: string; amount: number; status: string; description?: string }>();
    [...directInvoices, ...proposalInvoices, ...receiptInvoices].forEach((inv) => {
      mergedMap.set(inv.id, {
        ...inv,
        status: inv.status.toLowerCase() === 'paid' ? 'Paid' : inv.status.toLowerCase() === 'verifying' ? 'Verifying' : 'Pending',
      });
    });

    return Array.from(mergedMap.values());
  }, [invoices, proposals, receipts]);

  const pendingInvoices = useMemo(() => {
    return displayInvoices.filter((inv) => inv.status.toLowerCase() === 'pending');
  }, [displayInvoices]);

  const totalBalance = useMemo(() => {
    return pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  }, [pendingInvoices]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(BANK_DETAILS.account);
    setCopied(true);
    showToast('Stanbic IBTC account number (0071963113) copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // User clicks "PAID" beside the account details
  const handleMarkAsPaid = () => {
    if (pendingInvoices.length === 0) {
      alert('You have no pending invoices to mark as paid.');
      return;
    }

    // Mark the latest pending invoice or all pending invoices as 'verifying'
    const target = pendingInvoices[0];
    updateInvoiceStatus(target.id, 'verifying');
    showToast(`Payment marked as sent for ${target.id}. Status updated to Verifying. Admin will confirm.`);
  };

  // Trigger file upload for an invoice proof
  const handleTriggerUpload = (invoiceId: string) => {
    setActiveUploadInvoiceId(invoiceId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeUploadInvoiceId) {
      updateInvoiceStatus(activeUploadInvoiceId, 'verifying');
      showToast(`Proof of payment "${file.name}" uploaded for ${activeUploadInvoiceId}. Admin verification in progress.`);
      setActiveUploadInvoiceId(null);
    }
    // reset input
    if (e.target) e.target.value = '';
  };

  const handleDownloadReceipt = async (invoiceId: string, project: string, amount: number) => {
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const width = pdf.internal.pageSize.getWidth();
      const margin = 42;

      pdf.setFillColor(240, 122, 58);
      pdf.rect(0, 0, width, 64, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.text('FIGMENT STUDIO', margin, 32);
      pdf.setFontSize(10);
      pdf.text('OFFICIAL RECEIPT / INVOICE', width - margin - 150, 32);

      pdf.setTextColor(20, 20, 20);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      let y = 98;
      pdf.text(`Invoice Reference: ${invoiceId}`, margin, y);
      y += 22;
      pdf.text(`Project: ${project}`, margin, y);
      y += 22;
      pdf.text(`Date: ${new Date().toLocaleDateString('en-NG')}`, margin, y);
      y += 28;
      pdf.line(margin, y, width - margin, y);
      y += 24;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Amount:', margin, y);
      pdf.setTextColor(240, 122, 58);
      pdf.setFontSize(16);
      pdf.text(`NGN ${amount.toLocaleString('en-NG')}`, margin, y + 8);

      // Bank details on receipt
      const bankY = y + 24;
      pdf.setFillColor(254, 243, 235);
      pdf.rect(margin, bankY, width - margin * 2, 45, 'F');
      pdf.setTextColor(212, 83, 22);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text('OFFICIAL BANK PAYMENT DETAILS:', margin + 6, bankY + 12);
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(8.5);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Bank: ${BANK_DETAILS.bank} | Account Number: ${BANK_DETAILS.account} | Account Name: ${BANK_DETAILS.name}`, margin + 6, bankY + 24);
      pdf.text('Send transfer proof to hello@figmentstudio.ng or WhatsApp +234 816 829 9111', margin + 6, bankY + 34);

      pdf.save(`Figment_Invoice_${String(invoiceId).replace(/[^a-zA-Z0-9_-]/g, '')}.pdf`);
    } catch (error) {
      console.error('Failed to generate billing receipt', error);
      window.alert('Unable to download this receipt at the moment.');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Paid & Verified
          </span>
        );
      case 'verifying':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock className="w-3 h-3 animate-spin" />
            Verifying Funds
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertCircle className="w-3 h-3" />
            Pending Payment
          </span>
        );
    }
  };

  const formatNaira = (amount: number) => `₦${amount.toLocaleString('en-NG')}`;

  return (
    <DashboardShell title="Invoices" subtitle="Manage billing, bank transfers & payment verifications">
      <Helmet>
        <title>Billing & Invoices | Figment Studio</title>
        <meta name="description" content="Manage your Figment Studio project billing, bank details, and proof of payment uploads." />
      </Helmet>

      {/* Hidden file input for POP upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,.pdf"
        className="hidden"
      />

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-primary text-white text-xs font-bold px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <FileCheck className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      <div className="p-6 md:p-10 space-y-10 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white font-display uppercase">
              Settlements & <span className="font-bold text-primary">Invoices</span>
            </h1>
            <p className="text-white/40 text-xs mt-1 font-sans">
              All payments are made via official Stanbic IBTC bank transfer. Upload proof after payment for admin confirmation.
            </p>
          </div>
          <button
            onClick={() => navigate('/estimate')}
            className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all flex items-center gap-2 w-fit"
          >
            <Calculator className="w-4 h-4" />
            + New Estimate
          </button>
        </div>

        {/* Stats & Bank Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Pending Balance Card */}
          <div className="md:col-span-4 bg-[#121212] border border-white/5 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Pending Balance</p>
              <p className="text-3xl md:text-4xl font-black text-primary font-display">{formatNaira(totalBalance)}</p>
              <p className="text-xs text-white/40 mt-2 font-sans">
                {pendingInvoices.length} active pending invoice{pendingInvoices.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="pt-6 border-t border-white/5 text-[11px] text-white/30 font-sans">
              Transfers reflect on your dashboard immediately once verified by our finance desk.
            </div>
          </div>

          {/* Official Bank Details Card with PAID Button Beside Account Details */}
          <div className="md:col-span-8 bg-[#121212] border border-primary/30 rounded-2xl p-8 space-y-6 relative overflow-hidden shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <Landmark className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Official Studio Bank Account</span>
                  <h3 className="text-lg font-bold text-white font-display uppercase tracking-tight">{BANK_DETAILS.bank}</h3>
                </div>
              </div>
              <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full w-fit">
                Direct Settlement
              </span>
            </div>

            {/* Account Details with COPY and PAID button */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/5 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Account Number</span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl font-mono font-bold text-white tracking-widest">{BANK_DETAILS.account}</span>
                  <button
                    onClick={handleCopyAccount}
                    className="p-2 rounded-lg bg-white/5 hover:bg-primary hover:text-white text-white/50 transition-all cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-white/40 font-sans block">{BANK_DETAILS.name}</span>
              </div>

              {/* THE PAID BUTTON BESIDE ACCOUNT DETAILS */}
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/5 flex flex-col justify-between gap-3">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30 block">Sent Funds?</span>
                  <p className="text-[11px] text-white/50 font-sans mt-0.5">Click once you have transferred to notify finance.</p>
                </div>
                <button
                  onClick={handleMarkAsPaid}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Paid (Mark as Paid)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FX Conversion Reference */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60">Live Foreign Exchange Benchmark</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FX_RATES.map((curr) => (
              <div key={curr.code} className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{curr.flag}</span>
                  <span className="text-[10px] font-bold text-primary">{curr.code}</span>
                </div>
                <p className="text-sm font-bold text-white">
                  {curr.symbol}{Math.round(totalBalance / curr.rate).toLocaleString()}
                </p>
                <p className="text-[9px] text-white/30 mt-0.5">1 {curr.code} = ₦{curr.rate.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Invoices Table */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Active Invoices & Settlements</h2>
              <p className="text-[10px] text-white/30 mt-0.5">Upload payment receipts for admin verification.</p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              {displayInvoices.length} Total Record{displayInvoices.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-white/30 uppercase tracking-widest border-b border-white/5">
                  <th className="px-6 md:px-8 py-4">Reference</th>
                  <th className="px-6 md:px-8 py-4">Project & Scope</th>
                  <th className="px-6 md:px-8 py-4">Amount (NGN)</th>
                  <th className="px-6 md:px-8 py-4">Status</th>
                  <th className="px-6 md:px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 md:px-8 py-12 text-center">
                      <div className="space-y-3">
                        <p className="text-white/30 text-sm font-sans">No invoices generated yet.</p>
                        <button
                          onClick={() => navigate('/estimate')}
                          className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                        >
                          Create Project Estimate
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayInvoices.map((inv, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 md:px-8 py-5 font-bold text-xs text-white/50">{inv.id}</td>
                      <td className="px-6 md:px-8 py-5">
                        <p className="font-bold text-xs text-white">{inv.project}</p>
                        {inv.description && (
                          <p className="text-[10px] text-white/30 font-sans truncate max-w-xs">{inv.description}</p>
                        )}
                        <p className="text-[9px] text-white/20 font-sans mt-0.5">{inv.date}</p>
                      </td>
                      <td className="px-6 md:px-8 py-5 font-black text-xs text-primary font-display">
                        {formatNaira(inv.amount)}
                      </td>
                      <td className="px-6 md:px-8 py-5">
                        {getStatusBadge(inv.status)}
                      </td>
                      <td className="px-6 md:px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Upload Proof Button */}
                          <button
                            onClick={() => handleTriggerUpload(inv.id)}
                            className="px-3 py-1.5 border border-primary/30 text-primary hover:bg-primary hover:text-white text-[9px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center gap-1.5"
                            title="Upload bank payment receipt"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Proof</span>
                          </button>

                          {/* Download PDF Receipt */}
                          <button
                            onClick={() => handleDownloadReceipt(inv.id, inv.project, inv.amount)}
                            className="p-2 text-white/30 hover:text-primary transition-colors rounded-lg hover:bg-white/5"
                            aria-label={`Download invoice receipt for ${inv.project}`}
                            title="Download PDF"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default BillingManager;
