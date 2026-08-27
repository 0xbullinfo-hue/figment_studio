import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const root = process.cwd();
const dataPath = resolve(root, 'data/insights.ts');
const outPath = resolve(root, 'public/sitemap.xml');
const SITE_URL = 'https://figmentstudio.ng';
const mode = process.argv[2] || '--write';
const lastmod = new Date().toISOString().slice(0, 10);

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/works',
  '/works/process',
  '/portfolio',
  '/insights',
  '/academy',
  '/estimator',
];

function readInsightSlugs() {
  const source = readFileSync(dataPath, 'utf8');
  const regex = /slug:\s*'([^']+)'/g;
  const slugs = [];
  let match;
  while ((match = regex.exec(source)) !== null) {
    slugs.push(match[1]);
  }
  return Array.from(new Set(slugs));
}

function toUrlNode(path, changefreq, priority) {
  return `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function buildSitemap() {
  const slugs = readInsightSlugs();
  const staticNodes = staticRoutes.map((path) => {
    if (path === '/') return toUrlNode(path, 'weekly', '1.0');
    if (path === '/works' || path === '/portfolio') return toUrlNode(path, 'weekly', '0.9');
    if (path === '/insights') return toUrlNode(path, 'weekly', '0.8');
    return toUrlNode(path, 'monthly', '0.7');
  });

  const articleNodes = slugs.map((slug) => toUrlNode(`/insights/${slug}`, 'monthly', '0.7'));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticNodes,
    ...articleNodes,
    '</urlset>',
    '',
  ].join('\n');
}

const nextSitemap = buildSitemap();

if (mode === '--check') {
  const currentSitemap = readFileSync(outPath, 'utf8');
  if (currentSitemap !== nextSitemap) {
    console.error('Sitemap is out of date. Run: npm run generate:sitemap');
    process.exit(1);
  }
  console.log('Sitemap is up to date.');
  process.exit(0);
}

writeFileSync(outPath, nextSitemap, 'utf8');
console.log('Sitemap generated at public/sitemap.xml');
