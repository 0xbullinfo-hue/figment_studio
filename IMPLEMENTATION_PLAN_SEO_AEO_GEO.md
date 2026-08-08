# Implementation Plan: SEO + AEO + GEO Visibility

## Scope
- Improve crawlability, index quality, and structured discoverability.
- Improve answer engine retrievability for search assistants and LLMs.
- Keep private dashboard and admin surfaces non-indexed.

## Completed in this pass
- Added route-aware canonical + robots directives at app shell level.
- Added `robots.txt` and `sitemap.xml` in public assets.
- Added `llms.txt` for machine-readable brand and content entry points.
- Added Organization/LocalBusiness JSON-LD in root HTML.
- Updated Netlify and redirect rules to avoid blanket SPA soft-404 behavior.
- Removed frontend build-time API key injection in Vite config.
- Added backend AI chat service and ArcViz chat endpoints.
- Switched ArcViz frontend to backend chat endpoint usage.

## Backlog Tickets

### P0: Crawl and indexing quality
1. Migrate public marketing pages to prerender/SSR for stronger indexing consistency.
- Acceptance: home/about/contact/works/portfolio/insights are returned as render-complete HTML for bots.

2. Add 404 status parity for all hosts.
- Acceptance: unknown URLs return HTTP 404 on Netlify and Apache/static hosts.

3. Add route-level canonical QA checks.
- Acceptance: one canonical tag on every public route, no private route canonicals indexed.

### P0: AI and security hardening
4. Move VisionAssistant calls to backend endpoint (same as ArcViz model).
- Acceptance: no browser-origin Gemini calls remain.

5. Add role/rate controls for AI endpoints.
- Acceptance: authenticated access policy and limiter thresholds are enforced and logged.

6. Add audit logging for AI usage.
- Acceptance: request id, user id, endpoint, latency, and status are persisted in logs.

### P1: AEO and GEO content architecture
7. Convert insights modal experience into dedicated article routes `/insights/:slug`.
- Acceptance: each article has stable route + unique metadata + shareable URL.

8. Add `Article` JSON-LD for each insight page.
- Acceptance: schema includes headline, image, author, datePublished, dateModified, description.

9. Add FAQPage + Service schema where relevant.
- Acceptance: landing and services sections include validated FAQ/Service schema markup.

10. Build geo-intent service pages.
- Acceptance: publish city/service intent pages with internal links and clear conversion CTAs.

### P1: Landing quality and performance
11. Replace CDN Tailwind runtime with build-time CSS.
- Acceptance: no `cdn.tailwindcss.com` in production HTML and improved CWV baselines.

12. Add image/loading optimization for hero and portfolio previews.
- Acceptance: reduced LCP and lower transfer size for first viewport assets.

### P2: Measurement and governance
13. Add SEO/AEO observability dashboard.
- Acceptance: index counts, rich result coverage, CWV, and citation trend checks tracked weekly.

14. Add automated metadata/schema smoke checks in CI.
- Acceptance: CI fails on missing title/description/canonical/schema for designated public routes.

## Suggested Execution Order
1. P0 crawl/index and key security work.
2. P1 article route refactor and schema enrichment.
3. P1 performance and landing optimization.
4. P2 monitoring and CI governance.
