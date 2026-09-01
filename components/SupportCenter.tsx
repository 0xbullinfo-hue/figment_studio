import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardShell from './DashboardShell.tsx';
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const SupportCenter: React.FC = () => {
  const [activeTicket, setActiveTicket] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 'TKT-001',
      subject: 'Revision on Terrace Render',
      status: 'in_progress',
      lastUpdate: 'Oct 24',
      messages: [
        { sender: 'client', text: 'Can we adjust the sunset lighting on the terrace angle?', time: 'Oct 23, 4:15 PM' },
        { sender: 'support', text: 'Our lighting artist is adjusting the HDRI environment. Updated render coming today.', time: 'Oct 24, 10:30 AM' },
      ],
    },
    {
      id: 'TKT-002',
      subject: 'Payment Confirmation Issue',
      status: 'open',
      lastUpdate: '2 hours ago',
      messages: [
        { sender: 'client', text: 'I sent the payment but it is not reflecting.', time: 'Yesterday' },
        { sender: 'support', text: 'We are verifying with the bank. Please hold.', time: '2 hours ago' },
      ],
    },
  ]);

  const handleSendMessage = (ticketId: string) => {
    if (!newMessage.trim()) return;
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            messages: [
              ...t.messages,
              { sender: 'client', text: newMessage.trim(), time: 'Just now' },
            ],
          };
        }
        return t;
      })
    );
    setNewMessage('');
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'in_progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'closed':
        return 'bg-white/5 text-white/40 border-white/10';
      default:
        return 'bg-white/5 text-white/60 border-white/10';
    }
  };

  return (
    <DashboardShell title="Support" subtitle="Get help with your projects">
      <Helmet>
        <title>Support Center | Figment Studio</title>
        <meta name="description" content="Get support for your Figment Studio projects. Open tickets, track issues, and communicate with our team." />
      </Helmet>

      <div className="p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-light tracking-tight text-white font-display">
                Client <span className="font-bold text-primary">Support</span>
              </h1>
              <p className="text-white/40 text-sm mt-1 font-sans">Track your requests and communicate directly with the studio.</p>
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center">
              <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Live Chat</h3>
              <p className="text-xs text-white/40 font-sans">Response within 2 hours</p>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center">
              <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Phone Support</h3>
              <p className="text-xs text-white/40 font-sans">+234 816 829 9111</p>
            </div>
            <div className="bg-[#121212] border border-white/5 rounded-2xl p-8 text-center">
              <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Email</h3>
              <p className="text-xs text-white/40 font-sans">hello@figmentstudio.ng</p>
            </div>
          </div>

          {/* Tickets */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 border-b border-white/5">
              <h2 className="text-sm font-bold uppercase tracking-widest text-white/80">Active Tickets</h2>
            </div>
            <div className="divide-y divide-white/5">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="p-6 md:p-8">
                  <button
                    onClick={() => setActiveTicket(activeTicket === ticket.id ? null : ticket.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-white">{ticket.subject}</h3>
                        <p className="text-xs text-white/40 mt-0.5 font-sans">{ticket.id} — Last update: {ticket.lastUpdate}</p>
                      </div>
                    </div>
                    {activeTicket === ticket.id ? (
                      <ChevronUp className="w-4 h-4 text-white/30" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-white/30" />
                    )}
                  </button>

                  {activeTicket === ticket.id && (
                    <div className="mt-6 space-y-4 pl-4 border-l-2 border-white/5">
                      {ticket.messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.sender === 'client' ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div
                            className={`max-w-[80%] rounded-xl p-4 ${
                              msg.sender === 'client'
                                ? 'bg-white/5 text-white'
                                : 'bg-primary/10 text-primary border border-primary/20'
                            }`}
                          >
                            <p className="text-xs font-sans">{msg.text}</p>
                            <p className="text-[9px] text-white/30 mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-3 pt-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(ticket.id)}
                          placeholder="Type your message..."
                          className="flex-1 bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 outline-none focus:border-primary transition-all"
                        />
                        <button
                          onClick={() => handleSendMessage(ticket.id)}
                          className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl transition-all active:scale-95"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default SupportCenter;
