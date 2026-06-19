
import React from 'react';
import { Helmet } from 'react-helmet-async';

const FeedbackForm: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  return (
    <div className="bg-white py-20 px-6 max-w-3xl mx-auto">
      <Helmet>
        <title>Client Feedback | Figment Studio</title>
        <meta name="description" content="Share your experience working with Figment Studio. Your feedback helps us shape future architectural visual experiences." />
      </Helmet>
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Your Feedback Matters</h1>
        <p className="text-gray-500 text-lg">Thank you for choosing Figment Studio. Your insights help us refine our craft.</p>
      </div>

      <div className="space-y-12">
        <section className="space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-widest">Overall Satisfaction</h3>
          <div className="p-12 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center gap-6">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className="material-symbols-outlined text-5xl text-primary cursor-pointer hover:scale-110 transition-transform">{s < 5 ? 'star' : 'star_outline'}</span>
              ))}
            </div>
            <p className="text-primary text-sm font-bold uppercase tracking-widest">Click to rate</p>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-bold uppercase tracking-widest">Write your review</h3>
          <textarea rows={5} className="w-full rounded-2xl border-gray-100 bg-gray-50 p-6 focus:ring-primary focus:border-primary outline-none transition-all resize-none" placeholder="How was your experience working with us?"></textarea>
        </section>

        <button onClick={onFinish} className="w-full bg-primary text-white h-16 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-105 active:scale-95 transition-all">Submit Review</button>
      </div>
    </div>
  );
};

export default FeedbackForm;
