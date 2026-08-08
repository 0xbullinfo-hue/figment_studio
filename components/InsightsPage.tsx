import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { INSIGHT_ARTICLES, getInsightBySlug } from '../data/insights.ts';

const SITE_ORIGIN = ((import.meta as any).env.VITE_SITE_URL as string | undefined) || 'https://figmentstudio.ng';

const InsightCard: React.FC<{
  title: string;
  date: string;
  category: string;
  img: string;
  excerpt: string;
  readTime: string;
  slug: string;
}> = ({ title, date, category, img, excerpt, readTime, slug }) => (
  <Link to={`/insights/${slug}`} className="group cursor-pointer space-y-6 text-left block">
    <div className="aspect-[16/10] overflow-hidden rounded-3xl bg-gray-100 relative shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${img})` }}></div>
      <div className="absolute top-6 left-6">
        <span className="px-4 py-1.5 bg-white/95 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20 rounded-full shadow-sm">{category}</span>
      </div>
    </div>
    <div className="space-y-3 px-2">
      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{date} - {readTime.toUpperCase()}</p>
      <h3 className="text-2xl font-black tracking-tight leading-tight text-slate-900 group-hover:text-primary transition-colors uppercase font-display">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-sans font-medium line-clamp-2">{excerpt}</p>
      <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-primary font-black pt-2 group-hover:gap-3 transition-all">
        Read Article
        <span className="material-symbols-outlined text-sm">arrow_forward</span>
      </div>
    </div>
  </Link>
);

const InsightsPage: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug?: string }>();
  const article = getInsightBySlug(slug);

  const articleUrl = article ? `${SITE_ORIGIN.replace(/\/$/, '')}/insights/${article.slug}` : `${SITE_ORIGIN.replace(/\/$/, '')}/insights`;

  return (
    <div className="bg-white py-20 px-6 lg:px-40 min-h-screen text-slate-800">
      <Helmet>
        {article ? (
          <>
            <title>{article.title} | Figment Studio Insights</title>
            <meta name="description" content={article.excerpt} />
            <meta property="og:type" content="article" />
            <meta property="og:title" content={`${article.title} | Figment Studio`} />
            <meta property="og:description" content={article.excerpt} />
            <meta property="og:url" content={articleUrl} />
            <meta property="og:image" content={`${SITE_ORIGIN.replace(/\/$/, '')}${article.img}`} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={`${article.title} | Figment Studio`} />
            <meta name="twitter:description" content={article.excerpt} />
            <meta name="twitter:image" content={`${SITE_ORIGIN.replace(/\/$/, '')}${article.img}`} />
            <script type="application/ld+json">
              {JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: article.title,
                description: article.excerpt,
                image: [`${SITE_ORIGIN.replace(/\/$/, '')}${article.img}`],
                author: {
                  '@type': 'Organization',
                  name: 'Figment Studio',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'Figment Studio',
                  logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_ORIGIN.replace(/\/$/, '')}/logo.png`,
                  },
                },
                mainEntityOfPage: articleUrl,
                datePublished: article.date,
                dateModified: article.date,
              })}
            </script>
          </>
        ) : (
          <>
            <title>Insights & News | Figment Studio</title>
            <meta name="description" content="Read industry insights, trends, and technology updates on architectural visualization, 3D printing, and design in West Africa from Figment Studio." />
          </>
        )}
      </Helmet>

      {!slug && (
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="max-w-2xl text-left">
            <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8 text-slate-900 font-display">News & <br /><span className="text-primary italic">Insights</span></h1>
            <p className="text-xl text-gray-500 font-medium font-sans">Expert perspectives on architectural visualization, real estate technology, and Nigerian design trends.</p>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:grid-cols-3">
            {INSIGHT_ARTICLES.map((entry) => (
              <InsightCard
                key={entry.slug}
                category={entry.category}
                date={entry.date}
                title={entry.title}
                img={entry.img}
                excerpt={entry.excerpt}
                readTime={entry.readTime}
                slug={entry.slug}
              />
            ))}
          </section>
        </div>
      )}

      {slug && article && (
        <div className="max-w-4xl mx-auto space-y-8 text-left">
          <button
            onClick={() => navigate('/insights')}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-primary font-bold hover:gap-3 transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to Insights
          </button>

          <div className="w-full h-64 md:h-96 relative overflow-hidden rounded-3xl">
            <img src={article.img} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-8">
              <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
                {article.category}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              {article.date} - {article.readTime.toUpperCase()}
            </p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 uppercase leading-tight font-display">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 font-medium">{article.excerpt}</p>
          </div>

          <div className="w-16 h-1 bg-primary rounded-full"></div>

          <div className="space-y-6 text-slate-700 font-sans text-base md:text-lg leading-relaxed font-medium">
            {article.paragraphs.map((paragraph, index) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h2 key={index} className="text-2xl font-black text-slate-900 uppercase tracking-tight pt-4 font-display">
                    {paragraph.replace('### ', '')}
                  </h2>
                );
              }
              return <p key={index}>{paragraph}</p>;
            })}
          </div>
        </div>
      )}

      {slug && !article && (
        <div className="max-w-2xl mx-auto text-left space-y-6">
          <h1 className="text-4xl font-black text-slate-900 uppercase">Article Not Found</h1>
          <p className="text-slate-600">The insight you requested does not exist or may have moved.</p>
          <button
            onClick={() => navigate('/insights')}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-primary font-bold hover:gap-3 transition-all"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Insights
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightsPage;


