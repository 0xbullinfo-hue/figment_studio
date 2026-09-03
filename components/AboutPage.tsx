import { buildBreadcrumbs } from '../lib/structuredData.ts';

import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { IMAGES } from '../constants.ts';
import { getPublicStudioContent } from '../services/apiClient.ts';

const AboutPage: React.FC = () => {
  const [aboutContent, setAboutContent] = useState({
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
    <div className="bg-background text-text-secondary min-h-screen">
      <Helmet>
        <title>About Our Studio | Figment Studio</title>
        <meta name="description" content="Discover Figment Studio, Abuja's premier architectural visualization firm. We combine design precision, cinematic animation, and local inspiration to tell architectural stories globally." />
        <link rel="canonical" href="https://figmentstudio.ng/about" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <script type="application/ld+json">
            {JSON.stringify({
              '@context': 'https://schema.org',
              ...buildBreadcrumbs([{ name: 'Home', item: '/' }, { name: 'About', item: '/about' }])
            })}
          </script>
        </Helmet>

      {/* Hero Section */}
      <section className="px-6 lg:px-20 py-24 bg-background-alt border-b border-border-ui overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <h1 className="text-4xl md:text-7xl font-display font-bold leading-[1.08] tracking-tight mb-8 text-white uppercase">
            {aboutContent.headline.split('Future').length > 1 ? (
              <>Visualizing the <br /><span className="text-primary italic font-light">Future</span> of African Design.</>
            ) : (
              aboutContent.headline
            )}
          </h1>
          <p className="text-text-secondary text-lg md:text-xl font-light leading-relaxed max-w-2xl">
            {aboutContent.lead}
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-[2px] bg-primary"></div>
            <span className="text-primary text-xs uppercase font-bold tracking-[0.2em]">Our Heritage</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight mb-8 uppercase">Our Story</h2>
          <div className="space-y-6 text-base md:text-lg text-text-secondary font-light leading-relaxed">
            {aboutContent.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-cover bg-center" style={{ backgroundImage: `url("${aboutContent.storyImages[0] || IMAGES.about.story1}")` }}></div>
          <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl mt-12 bg-cover bg-center" style={{ backgroundImage: `url("${aboutContent.storyImages[1] || IMAGES.about.story2}")` }}></div>
        </div>
      </section>

      {/* Meet The Team Section */}
      <section className="py-24 bg-background-alt border-t border-border-ui">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold uppercase tracking-[0.25em] text-xs mb-3">Core Collective</h2>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight uppercase">Meet The Team</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
            {IMAGES.staff.map(member => (
              <div key={member.name} className="bg-surface rounded-3xl p-6 border border-border-ui hover:border-primary/40 transition-all duration-300 shadow-lg shadow-black/40 flex flex-col">
                <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 bg-surface-alt border border-white/5 relative">
                  <img src={member.url} alt={member.name} className="w-full h-full object-cover" />
                </div>
                {/* Clearly visible names without needing hover */}
                <h3 className="text-2xl font-bold text-white tracking-tight mb-1.5">{member.name}</h3>
                <p className="text-primary text-xs uppercase font-bold tracking-wider">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;


