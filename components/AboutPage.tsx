
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { IMAGES } from '../constants.ts';
import { getPublicStudioContent } from '../services/apiClient.ts';

const AboutPage: React.FC = () => {
  const [aboutContent, setAboutContent] = useState({
    badge: 'Est. 2015 — Abuja, Nigeria',
    headline: 'Visualizing the Future of African Design.',
    lead: 'Abuja\'s premier architectural visualization firm, where precision meets artistry in every pixel.',
    story: [
      'Founded in the heart of Abuja, Figment Studio began with a single vision: to redefine how architecture is experienced before it\'s even built.',
      'What started as a small team of passionate designers has grown into Abuja\'s leading studio for high-stakes visual communication.',
    ],
    storyImages: ['/figment_media/3D-Rendering-B2B-Abuja 2.png', '/figment_media/3D-Rendering-B2B-Abuja 3.png'],
  });

  useEffect(() => {
    let cancelled = false;
    getPublicStudioContent().then((content) => {
      if (cancelled || !content.about) {
        return;
      }
      setAboutContent({
        badge: content.about.badge || aboutContent.badge,
        headline: content.about.headline || aboutContent.headline,
        lead: content.about.lead || aboutContent.lead,
        story: Array.isArray(content.about.story) ? content.about.story : aboutContent.story,
        storyImages: Array.isArray(content.about.storyImages) ? content.about.storyImages : aboutContent.storyImages,
      });
    }).catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="bg-white">
      <Helmet>
        <title>About Our Studio | Figment Studio</title>
        <meta name="description" content="Discover Figment Studio, Abuja's premier architectural visualization firm. We combine design precision, cinematic animation, and local inspiration to tell architectural stories globally." />
      </Helmet>
      <section className="px-6 lg:px-20 py-20 bg-gray-50 overflow-hidden relative">
        <div className="absolute inset-0 abuja-map-overlay opacity-[0.03]"></div>
        <div className="max-w-[1200px] mx-auto relative z-10">
          <span className="text-primary font-bold tracking-[0.3em] text-xs uppercase mb-6 block border-l-2 border-primary pl-4">{aboutContent.badge}</span>
          <h1 className="text-5xl md:text-8xl font-black leading-[1] tracking-tighter mb-8 uppercase">
            {aboutContent.headline.split('Future').length > 1 ? (
              <>Visualizing the <br /><span className="text-primary italic font-light">Future</span> of African Design.</>
            ) : (
              aboutContent.headline
            )}
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed max-w-lg">
            {aboutContent.lead}
          </p>
        </div>
      </section>

      <section className="py-24 max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-primary font-bold uppercase tracking-widest text-sm">Our Narrative</span>
            <div className="w-16 h-[2px] bg-primary"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-10 uppercase">Our Story</h2>
          <div className="space-y-8 text-lg font-light leading-relaxed">
            {aboutContent.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-cover bg-center" style={{ backgroundImage: `url("${aboutContent.storyImages[0] || IMAGES.about.story1}")` }}></div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg mt-12 bg-cover bg-center" style={{ backgroundImage: `url("${aboutContent.storyImages[1] || IMAGES.about.story2}")` }}></div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-4">Core Collective</h2>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Meet The Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {IMAGES.staff.map(member => (
              <div key={member.name} className="group text-center md:text-left">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-8 shadow-sm grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={member.url} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">{member.name}</h4>
                <p className="text-primary text-[10px] uppercase font-black tracking-widest">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
