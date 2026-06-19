
import React from 'react';
import { Helmet } from 'react-helmet-async';

const InsightCard: React.FC<{ title: string; date: string; category: string; img: string }> = ({ title, date, category, img }) => (
  <div className="group cursor-pointer space-y-6">
    <div className="aspect-video overflow-hidden rounded-2xl bg-gray-100 relative shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${img})` }}></div>
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-primary border border-primary/20 rounded">{category}</span>
      </div>
    </div>
    <div className="space-y-2">
      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{date} • 5 MIN READ</p>
      <h3 className="text-2xl font-black tracking-tight leading-tight group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-gray-500 line-clamp-2 leading-relaxed">Exploring how high-end 3D rendering and VR are reshaping the architectural landscape in West Africa.</p>
    </div>
  </div>
);

const InsightsPage: React.FC = () => {
  return (
    <div className="bg-white py-20 px-6 lg:px-40">
      <Helmet>
        <title>Insights & News | Figment Studio</title>
        <meta name="description" content="Read industry insights, trends, and technology updates on architectural visualization, 3D printing, and design in West Africa from Figment Studio." />
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="max-w-2xl">
          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8">News & <br /><span className="text-primary italic">Insights</span></h1>
          <p className="text-xl text-gray-500 font-medium">Expert perspectives on architectural visualization, real estate technology, and Nigerian design trends.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <InsightCard
            category="Trends"
            date="Oct 12, 2024"
            title="Defining the Horizon: ArchViz Trends in Nigeria 2024"
            img="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          />
          <InsightCard
            category="Technology"
            date="Sep 28, 2024"
            title="The Future of 3D Printing in West African Construction"
            img="https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=2069&auto=format&fit=crop"
          />
        </section>
      </div>
    </div>
  );
};

export default InsightsPage;
