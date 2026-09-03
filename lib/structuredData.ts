const SITE_URL = 'https://figmentstudio.ng';

export function buildWebsiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Figment Studio',
    description: 'Premium architectural visualization studio in Abuja, Nigeria delivering cinematic 3D rendering, animation, and project delivery.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-NG',
  };
}

export function buildOrganizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'Figment Studio',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Premium architectural visualization studio in Abuja, Nigeria delivering cinematic 3D rendering, animation, and project delivery.',
    email: 'figmentstudio7@gmail.com',
    telephone: '+2348168299111',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressRegion: 'FCT',
      addressCountry: 'NG',
    },
    sameAs: [
      'https://www.instagram.com/figment_cs',
      'https://www.facebook.com/figmentCstudio',
      'https://x.com/figment_cs',
      'https://www.tiktok.com/@figment_cs',
    ],
  };
}

export function buildProfessionalServiceSchema() {
  return {
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#service`,
    name: 'Figment Studio Architectural Visualization',
    url: SITE_URL,
    image: `${SITE_URL}/og-image.png`,
    telephone: '+2348168299111',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Abuja',
      addressRegion: 'FCT',
      addressCountry: 'NG',
    },
    serviceType: [
      'Architectural Rendering',
      'Cinematic 3D Walkthrough Animation',
      'Interior and Exterior Visualization',
      'Scale Physical Models',
      'Design Communication Support',
    ],
    areaServed: [
      { '@type': 'Country', name: 'Nigeria' },
      { '@type': 'Place', name: 'Global' },
    ],
  };
}

export function buildBreadcrumbs(items: Array<{ name: string; item: string }>) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `${SITE_URL}${crumb.item}`,
    })),
  };
}

export function buildArticleSchema(article: {
  title: string;
  description: string;
  slug: string;
  datePublished?: string;
  image?: string;
  authorName?: string;
}) {
  return {
    '@type': 'Article',
    '@id': `${SITE_URL}/insights/${article.slug}/#article`,
    headline: article.title,
    description: article.description,
    url: `${SITE_URL}/insights/${article.slug}`,
    image: article.image || `${SITE_URL}/og-image.png`,
    datePublished: article.datePublished || '2026-01-01',
    dateModified: new Date().toISOString().slice(0, 10),
    author: {
      '@type': 'Organization',
      name: article.authorName || 'Figment Studio Editorial Team',
      url: SITE_URL,
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/insights/${article.slug}`,
    },
  };
}
