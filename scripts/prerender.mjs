#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer, loadEnv } from 'vite';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TEMPLATE_PATH = path.join(DIST, 'index.html');

// Setup DOM shims so component module imports don't fail in Node
const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'https://figmentstudio.ng/',
  pretendToBeVisual: true,
});
global.window = dom.window;
global.document = dom.window.document;
global.location = dom.window.location;
global.localStorage = dom.window.localStorage;
global.sessionStorage = dom.window.sessionStorage;
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;

async function main() {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error('✖ dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  const fileEnv = loadEnv('production', ROOT, 'VITE_');
  const pick = (k, fb) => fileEnv[k] || process.env[k] || fb;

  const define = {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(pick('VITE_SITE_URL', 'https://figmentstudio.ng')),
  };

  const vite = await createServer({
    root: ROOT,
    mode: 'production',
    define,
    resolve: {
      alias: {
        'react-router-dom': path.resolve(ROOT, 'node_modules/react-router-dom/dist/index.mjs'),
        'react-router': path.resolve(ROOT, 'node_modules/react-router/dist/development/index.mjs'),
      },
    },
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true },
    appType: 'custom',
    logLevel: 'warn',
  });

  try {
    const { prerenderRoutes } = await vite.ssrLoadModule('/prerender/routes.tsx');
    const { renderRoute, injectIntoTemplate, DEFAULT_HEAD_PATTERNS } = await vite.ssrLoadModule('/prerender/render.tsx');

    // Create a pristine base template by stripping any pre-existing head tags or root body
    let cleanTemplate = template;
    for (const re of DEFAULT_HEAD_PATTERNS) {
      cleanTemplate = cleanTemplate.replace(re, '');
    }
    cleanTemplate = cleanTemplate.replace(/<div id="root">[\s\S]*?<\/div>/, '<div id="root"></div>');

    let written = 0;
    for (const route of prerenderRoutes) {
      try {
        console.log(`Prerendering ${route.path}...`);
        const { bodyHtml, headHtml } = await renderRoute({
          path: route.path,
          Component: route.Component,
          props: route.props,
        });
        const finalHtml = injectIntoTemplate(cleanTemplate, { headHtml, bodyHtml });
        writeRoute(finalHtml, route.path);
        written++;
      } catch (err) {
        console.warn(`⚠ prerender skipped ${route.path}: ${err.message}`);
      }
    }
    console.log(`✔ prerendered ${written} routes`);
  } finally {
    await vite.close();
  }
}

function writeRoute(html, routePath) {
  const rel = routePath === '/' ? 'index.html' : path.join(routePath.replace(/^\//, ''), 'index.html');
  const outPath = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('✖ prerender failed:', err);
    process.exit(1);
  });
