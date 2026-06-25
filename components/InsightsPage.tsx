import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';

interface Article {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  img: string;
  paragraphs: string[];
}

const ARTICLES: Article[] = [
  {
    slug: 'the-future-of-architectural-rendering-in-sub-saharan-africa',
    category: 'Industry',
    date: 'June 2025',
    readTime: '5 min read',
    title: 'The Future of Architectural Rendering in Sub-Saharan Africa',
    excerpt: 'How AI tools are democratizing photorealistic visualization for architecture firms across Nigeria and beyond.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    paragraphs: [
      'The architectural sector in Sub-Saharan Africa is experiencing a technology-driven renaissance. For decades, rendering high-fidelity photorealistic images required massive local server stacks or expensive outsource contracts to studios in Europe or Asia. Today, real-time engines and custom AI co-pilots are changing the game.',
      '### Democratizing Quality',
      'By leveraging cloud-based GPU clustering and local fine-tuned models, small boutique firms in Lagos and Nairobi can now access tools that produce cinematic results in a fraction of the time. This leveling of the playing field allows local designers to present concepts that compete directly with international heavyweights, securing domestic and foreign investment.',
      '### Preserving Heritage in Virtual Spaces',
      'Importantly, these tools are being used to catalog and conceptualize structures that incorporate traditional African design language—from earthen walls to natural ventilation patterns—combining historic architecture with contemporary engineering.'
    ]
  },
  {
    slug: 'why-cinematic-walkthroughs-close-more-property-deals',
    category: 'Technology',
    date: 'May 2025',
    readTime: '4 min read',
    title: 'Why Cinematic Walkthroughs Close More Property Deals',
    excerpt: 'Data from 200+ projects reveals the compelling correlation between animation quality and investor conversion rates.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
    paragraphs: [
      'Why do static renders sometimes fail to capture the imagination of real estate investors? The answer lies in the human brain\'s response to spatial dynamics. A study of over 200 developments across Nigeria shows a clear trend: projects backed by high-fidelity cinematic walkthroughs close deals 40% faster.',
      '### The Psychology of Motion',
      'Animation provides a sense of scale, perspective, and transition that static images cannot replicate. As the virtual camera moves through a lobby, tracking sunrays cutting through the atrium, the viewer builds a spatial memory of the building.',
      '### Tangible Conversion Impact',
      'Cinematic storytelling allows developers to outline the journey of a future tenant. By highlighting building amenities, flow, and material finishes dynamically, animations translate abstract plans into a concrete lifestyle, accelerating pre-sales and securing structural financing.'
    ]
  },
  {
    slug: 'inside-figment-our-4k-rendering-pipeline-explained',
    category: 'Studio',
    date: 'April 2025',
    readTime: '6 min read',
    title: 'Inside Figment: Our 4K Rendering Pipeline Explained',
    excerpt: 'A behind-the-scenes look at the hardware, software, and creative workflow that produces our signature renders.',
    img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop',
    paragraphs: [
      'Achieving the signature Figment Studio look is a meticulous process combining artistic design with bleeding-edge rendering hardware. We pull back the curtain on the pipeline that processes our client\'s Revit and D5 assets.',
      '### Hardware Infrastructure',
      'Every project is rendered using our proprietary cloud network equipped with NVIDIA RTX 4090 servers. This allows us to run path-tracing algorithms at 4K resolution with real-time global illumination, soft shadows, and physically-accurate glass refraction.',
      '### The Creative Eye',
      'Technology is only half the equation. Our visual artists manually set up camera lenses, depth of field, and lighting temperatures to match the specific atmosphere of West African light—known for its brilliant contrast, dust refraction, and warm sunset glow.'
    ]
  },
  {
    slug: 'defining-the-horizon-archviz-trends-in-nigeria-2024',
    category: 'Trends',
    date: 'Oct 12, 2024',
    readTime: '5 min read',
    title: 'Defining the Horizon: ArchViz Trends in Nigeria 2024',
    excerpt: 'Exploring how high-end 3D rendering and VR are reshaping the architectural landscape in West Africa.',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
    paragraphs: [
      'The Nigerian real estate landscape is undergoing a massive shift. As developers compete for high-value investors in Lagos, Abuja, and Port Harcourt, standard 2D blueprints and simple static renders are no longer sufficient.',
      '### Off-Plan Sales Revolution',
      'With interest rates rising, developers rely heavily on off-plan sales to finance major residential towers. To secure commitments before groundbreaking, they require emotional engagement. Photorealistic 3D visualization creates a window into the future, showing prospective buyers the exact view from their 20th-floor balcony or the reflection of the sunset on their Italian marble countertops.',
      '### Real-Time Interactivity',
      'Unreal Engine 5 is democratizing real-time walkthroughs. Prospective buyers can now wear VR headsets to walk through a virtual duplex, change interior finishes in real time, and experience the space at different times of day. Figment Studio is pioneering this pipeline, merging architectural precision with cinema-grade light simulation to redefine how Nigerian spaces are envisioned and sold.'
    ]
  },
  {
    slug: 'the-future-of-3d-printing-in-west-african-construction',
    category: 'Technology',
    date: 'Sep 28, 2024',
    readTime: '5 min read',
    title: 'The Future of 3D Printing in West African Construction',
    excerpt: 'An analysis of how additive manufacturing and concrete 3D printing are beginning to emerge in urban centers like Lagos and Accra.',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2069&auto=format&fit=crop',
    paragraphs: [
      'Additive manufacturing is transitioning from a high-tech novelty to a viable solution for the housing deficit in West Africa. Concrete 3D printing represents a paradigm shift in material efficiency and build speed.',
      '### Redefining Speed and Logistics',
      'By utilizing local materials and automated gantry systems, developers can print structural walls for a standard bungalow in less than 48 hours. This drastically reduces on-site labor requirements and waste, which accounts for up to 30% of materials in traditional concrete pouring.',
      '### Regulatory and Design Challenges',
      'While the potential is enormous, local building codes and structural approvals must evolve. Figment Studio is collaborating with structural consultants to create pre-optimized digital scale models that align with regulatory frameworks, laying the foundation for a sustainable, high-speed construction sector in Nigeria.'
    ]
  }
];

const InsightCard: React.FC<{
  title: string;
  date: string;
  category: string;
  img: string;
  excerpt: string;
  readTime: string;
  onClick: () => void;
}> = ({ title, date, category, img, excerpt, readTime, onClick }) => (
  <div className="group cursor-pointer space-y-6 text-left" onClick={onClick}>
    <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-gray-100 relative shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${img})` }}></div>
      <div className="absolute top-6 left-6">
        <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20 rounded-full shadow-sm">{category}</span>
      </div>
    </div>
    <div className="space-y-3 px-2">
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{date} • {readTime.toUpperCase()}</p>
      <h3 className="text-2xl font-black tracking-tight leading-tight text-slate-900 group-hover:text-primary transition-colors uppercase font-display">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-sans font-medium line-clamp-2">{excerpt}</p>
      <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary font-black pt-2 group-hover:gap-3 transition-all">
        Read Article
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  </div>
);

const InsightsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const readSlug = searchParams.get('read');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    if (readSlug) {
      const article = ARTICLES.find(a => a.slug === readSlug);
      if (article) {
        setSelectedArticle(article);
      } else {
        setSelectedArticle(null);
      }
    } else {
      setSelectedArticle(null);
    }
  }, [readSlug]);

  const openArticle = (article: Article) => {
    setSearchParams({ read: article.slug });
  };

  const closeArticle = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-white py-20 px-6 lg:px-40 min-h-screen text-slate-800">
      <Helmet>
        <title>Insights & News | Figment Studio</title>
        <meta name="description" content="Read industry insights, trends, and technology updates on architectural visualization, 3D printing, and design in West Africa from Figment Studio." />
      </Helmet>
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="max-w-2xl text-left">
          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-slate-900 font-display">News & <br /><span className="text-primary italic">Insights</span></h1>
          <p className="text-xl text-gray-500 font-medium font-sans">Expert perspectives on architectural visualization, real estate technology, and Nigerian design trends.</p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:grid-cols-3">
          {ARTICLES.map((article) => (
            <InsightCard
              key={article.slug}
              category={article.category}
              date={article.date}
              title={article.title}
              img={article.img}
              excerpt={article.excerpt}
              readTime={article.readTime}
              onClick={() => openArticle(article)}
            />
          ))}
        </section>
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
          onClick={closeArticle}
        >
          <div
            className="bg-white rounded-[2rem] overflow-hidden shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col relative animate-in zoom-in-95 fade-in duration-300 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeArticle}
              className="absolute top-6 right-6 z-10 size-10 rounded-full bg-white/90 hover:bg-white text-slate-900 border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl font-bold">close</span>
            </button>

            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {/* Featured Image */}
              <div className="w-full h-64 md:h-80 relative overflow-hidden">
                <img
                  src={selectedArticle.img}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-8">
                  <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                    {selectedArticle.category}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 md:p-10 space-y-6 text-left">
                <div className="space-y-2">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {selectedArticle.date} • {selectedArticle.readTime.toUpperCase()}
                  </p>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 uppercase leading-tight font-display">
                    {selectedArticle.title}
                  </h2>
                </div>

                <div className="w-12 h-1 bg-primary rounded-full animate-pulse"></div>

                <div className="space-y-6 text-slate-700 font-sans text-base md:text-lg leading-relaxed font-medium">
                  {selectedArticle.paragraphs.map((p, index) => {
                    if (p.startsWith('### ')) {
                      return (
                        <h4 key={index} className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight pt-4 font-display">
                          {p.replace('### ', '')}
                        </h4>
                      );
                    }
                    return (
                      <p key={index}>
                        {p}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;
