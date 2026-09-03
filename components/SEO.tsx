import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
  children?: React.ReactNode;
}

const DEFAULT_TITLE = 'Figment Studio | Premium Architectural Visualization';
const DEFAULT_DESC =
  'Figment Studio is a premium architectural visualization studio in Abuja, Nigeria delivering cinematic 3D rendering, animation, and private project delivery for developers and architects.';
const DEFAULT_KEYWORDS =
  'Figment Studio, architectural visualization Nigeria, 3D rendering Abuja, architectural animation Lagos, archviz studio, real estate visualization';
const DEFAULT_OG_IMAGE = 'https://figmentstudio.ng/og-image.png';
const SITE_URL = 'https://figmentstudio.ng';

export const SEO: React.FC<SEOProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl = '/',
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  twitterCard = 'summary_large_image',
  noindex = false,
  structuredData,
  children,
}) => {
  const fullCanonical = canonicalUrl.startsWith('http')
    ? canonicalUrl
    : `${SITE_URL}${canonicalUrl === '/' ? '' : canonicalUrl}`;

  const jsonLd = structuredData
    ? Array.isArray(structuredData)
      ? {
          '@context': 'https://schema.org',
          '@graph': structuredData,
        }
      : {
          '@context': 'https://schema.org',
          ...structuredData,
        }
    : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex, nofollow'
            : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
        }
      />
      <link rel="canonical" href={fullCanonical || SITE_URL} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="Figment Studio" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonical || SITE_URL} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_NG" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content="@figment_cs" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}

      {children}
    </Helmet>
  );
};

export default SEO;
