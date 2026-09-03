import React from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

export interface RenderInput {
  path: string;
  Component: React.ComponentType<any>;
  props?: Record<string, unknown>;
}

export interface RenderOutput {
  headHtml: string;
  bodyHtml: string;
}

export async function renderRoute(input: RenderInput): Promise<RenderOutput> {
  const helmetContext: { helmet?: any } = {};

  try {
    const routePattern = input.path.includes('/insights/') ? '/insights/:slug' : input.path;

    const bodyHtml = renderToString(
      <HelmetProvider context={helmetContext}>
        <MemoryRouter initialEntries={[input.path]}>
          <Routes>
            <Route
              path={routePattern}
              element={<input.Component {...(input.props ?? {})} />}
            />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    const h = helmetContext.helmet;
    const headHtml = h
      ? [
          h.title ? h.title.toString() : '',
          h.meta ? h.meta.toString() : '',
          h.link ? h.link.toString() : '',
          h.script ? h.script.toString() : '',
        ]
          .filter(Boolean)
          .join('\n')
      : '';

    return { headHtml, bodyHtml };
  } catch (err: any) {
    console.error(`Error during renderRoute for ${input.path}:`, err);
    throw err;
  }
}

export const DEFAULT_HEAD_PATTERNS: RegExp[] = [
  /<title[^>]*>[\s\S]*?<\/title>/gi,
  /<meta\s+[^>]*name=["']description["'][^>]*>/gi,
  /<meta\s+[^>]*name=["']keywords["'][^>]*>/gi,
  /<link\s+[^>]*rel=["']canonical["'][^>]*>/gi,
  /<meta\s+[^>]*name=["']robots["'][^>]*>/gi,
  /<meta\s+[^>]*property=["']og:[^"']*["'][^>]*>/gi,
  /<meta\s+[^>]*name=["']twitter:[^"']*["'][^>]*>/gi,
  /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,
];

export function injectIntoTemplate(
  template: string,
  parts: { headHtml: string; bodyHtml: string }
): string {
  let html = template;
  for (const re of DEFAULT_HEAD_PATTERNS) {
    html = html.replace(re, '');
  }
  html = html.replace('</head>', `${parts.headHtml}\n</head>`);
  html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root">${parts.bodyHtml}</div>`);
  return html;
}
