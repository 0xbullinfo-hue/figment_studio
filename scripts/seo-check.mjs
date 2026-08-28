import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

const root = process.cwd();

function fail(message) {
  console.error(`SEO CHECK FAILED: ${message}`);
  process.exit(1);
}

function ensureFile(path) {
  const abs = resolve(root, path);
  if (!existsSync(abs)) {
    fail(`Missing required file: ${path}`);
  }
  return readFileSync(abs, 'utf8');
}

const indexHtml = ensureFile('index.html');
const appTsx = ensureFile('App.tsx');
const robotsTxt = ensureFile('public/robots.txt');
const sitemapXml = ensureFile('public/sitemap.xml');
const llmsTxt = ensureFile('public/llms.txt');
const redirects = ensureFile('public/_redirects');
const netlifyToml = ensureFile('netlify.toml');
const insightsPage = ensureFile('components/InsightsPage.tsx');

const routeMetaFiles = [
  'components/LandingPage.tsx',
  'components/AboutPage.tsx',
  'components/ContactPage.tsx',
  'components/PortfolioGallery.tsx',
  'components/AcademyPage.tsx',
  'components/Estimator.tsx',
];

if (!indexHtml.includes('<link rel="canonical"')) {
  fail('index.html is missing canonical link tag');
}

if (!indexHtml.includes('application/ld+json')) {
  fail('index.html is missing JSON-LD script');
}

if (!indexHtml.includes('meta name="robots"')) {
  fail('index.html is missing robots meta tag');
}

if (!appTsx.includes('RouteSeo')) {
  fail('App.tsx is missing route-level SEO component');
}

if (!appTsx.includes('path="insights/:slug"')) {
  fail('App.tsx is missing insights article slug route');
}

if (!appTsx.includes('noindex, nofollow')) {
  fail('App.tsx is missing private route robots guard');
}

if (!robotsTxt.includes('Sitemap: https://figmentstudio.ng/sitemap.xml')) {
  fail('robots.txt is missing sitemap declaration');
}

if (!sitemapXml.includes('<urlset')) {
  fail('sitemap.xml is malformed or empty');
}

if (!sitemapXml.includes('/insights/')) {
  fail('sitemap.xml is missing insight article URLs');
}

if (!llmsTxt.includes('Figment Studio')) {
  fail('llms.txt does not contain expected project identity content');
}

if (!redirects.includes('/insights/* /index.html 200')) {
  fail('public/_redirects is missing insights wildcard rewrite');
}

if (!netlifyToml.includes('from = "/insights/*"')) {
  fail('netlify.toml is missing insights wildcard rewrite');
}

try {
  execSync('node scripts/generate-sitemap.mjs --check', { cwd: root, stdio: 'pipe' });
} catch {
  fail('sitemap.xml is out of sync with data/insights.ts');
}

if (!insightsPage.includes('application/ld+json')) {
  fail('InsightsPage is missing Article JSON-LD output');
}

if (!insightsPage.includes('useParams')) {
  fail('InsightsPage is missing slug-based route handling');
}

for (const filePath of routeMetaFiles) {
  const file = ensureFile(filePath);
  if (!file.includes('<Helmet>')) {
    fail(`${filePath} is missing Helmet metadata block`);
  }
  if (!file.includes('<title>')) {
    fail(`${filePath} is missing page title tag`);
  }
  if (!file.includes('name="description"')) {
    fail(`${filePath} is missing page description meta tag`);
  }
}

console.log('SEO check passed.');
