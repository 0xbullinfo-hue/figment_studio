
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const faqs = [
  { q: "What is the typical timeline for a project?", a: "Typical timelines range from 2 to 4 weeks depending on the complexity of the design and lighting iterations required." },
  { q: "What files do you need to start?", a: "We prefer Revit (RVT), Rhino (3DM), or SketchUp (SKP) files, but can also work from 2D DWG blueprints." },
  { q: "Do you offer VR experiences?", a: "Yes, we create fully immersive 360-degree VR walkthroughs compatible with all major headsets." }
];

const ContactPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Contact Our Abuja Office | Figment Studio</title>
        <meta name="description" content="Get in touch with Figment Studio in Central Business District, Abuja. Submit your design brief, ask about timelines, or inquire about cinematic 3D walkthroughs." />
      </Helmet>
      <div className="flex flex-col lg:flex-row w-full border-b border-gray-100">
        <section className="w-full lg:w-1/2 p-10 md:p-20 flex flex-col justify-center border-r border-gray-100">
          <div className="max-w-[520px] mx-auto w-full">
            <h1 className="text-4xl font-black leading-tight tracking-tighter mb-6 uppercase">Contact Our Abuja Studio</h1>
            <p className="text-gray-500 text-lg mb-10">Reach out to our Abuja office for your next architectural visualization project. We respond within 24 hours.</p>
            {isSubmitted ? (
              <div className="bg-green-50/50 border border-green-100 rounded-2xl p-10 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="size-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/20">
                  <span className="material-symbols-outlined text-3xl font-bold">check</span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Message Sent</h3>
                <p className="text-gray-500 font-medium max-w-sm mx-auto mb-8">
                  Your inquiry has been routed to our project management team. We will be in touch shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs font-bold uppercase tracking-widest text-primary hover:text-primary-hover transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }}>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                  <input required type="text" className="w-full rounded-xl border-gray-100 bg-gray-50 h-14 px-4 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Enter your name" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                  <input required type="email" className="w-full rounded-xl border-gray-100 bg-gray-50 h-14 px-4 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="name@company.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Message</label>
                  <textarea required rows={4} className="w-full rounded-xl border-gray-100 bg-gray-50 p-4 focus:ring-primary focus:border-primary transition-all outline-none resize-none" placeholder="Tell us about your project..."></textarea>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">How did you hear about us?</label>
                  <select required className="w-full rounded-xl border-gray-100 bg-gray-50 h-14 px-4 focus:ring-primary focus:border-primary transition-all outline-none text-slate-800 text-sm">
                    <option value="">Select an option...</option>
                    <option value="referral">Referral / Word of Mouth</option>
                    <option value="internet">Search Engine / Internet</option>
                    <option value="social">Social Media (Instagram/LinkedIn)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Referrer Name / Website / Details (Optional)</label>
                  <input type="text" className="w-full rounded-xl border-gray-100 bg-gray-50 h-14 px-4 focus:ring-primary focus:border-primary transition-all outline-none text-sm" placeholder="Who referred you or where did you find us?" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 rounded-xl h-14 bg-primary text-white text-lg font-bold tracking-wide hover:shadow-xl active:scale-95 transition-all">
                  Send Message <span className="material-symbols-outlined">send</span>
                </button>
              </form>
            )}
          </div>
        </section>
        <section className="w-full lg:w-1/2 relative bg-gray-100 min-h-[500px]">
          <div className="absolute inset-0 abuja-map-overlay opacity-20"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="w-12 h-12 bg-primary/30 rounded-full animate-ping absolute -top-2 -left-2"></div>
              <div className="bg-primary size-8 rounded-full flex items-center justify-center text-white shadow-xl relative z-10 ring-4 ring-white">
                <span className="material-symbols-outlined text-sm font-bold">location_on</span>
              </div>
              <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl whitespace-nowrap border border-gray-100">
                <p className="text-xs font-black uppercase tracking-widest">Abuja, FCT, Nigeria</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-xs font-bold uppercase tracking-widest mb-4 block">Information Desk</span>
          <h2 className="text-3xl font-black tracking-tight uppercase">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 text-left transition-colors"
              >
                <span className="text-lg font-bold">{faq.q}</span>
                <span className={`material-symbols-outlined transition-transform ${openFaq === idx ? 'rotate-180 text-primary' : ''}`}>expand_more</span>
              </button>
              {openFaq === idx && (
                <div className="p-6 pt-0 text-gray-500 leading-relaxed bg-white">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
