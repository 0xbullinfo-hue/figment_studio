import React from 'react';
import LandingPage from '../components/LandingPage.tsx';
import AboutPage from '../components/AboutPage.tsx';
import ContactPage from '../components/ContactPage.tsx';
import PortfolioGallery from '../components/PortfolioGallery.tsx';
import InsightsPage from '../components/InsightsPage.tsx';
import AcademyPage from '../components/AcademyPage.tsx';
import Estimator from '../components/Estimator.tsx';
import { INSIGHT_ARTICLES } from '../data/insights.ts';
import staticRoutes from './staticRoutes.json';

export interface PrerenderRoute {
  path: string;
  Component: React.ComponentType<any>;
  props?: Record<string, unknown>;
}

const COMPONENT_BY_PATH: Record<string, React.ComponentType<any>> = {
  '/': LandingPage,
  '/about': AboutPage,
  '/contact': ContactPage,
  '/works': PortfolioGallery,
  '/portfolio': PortfolioGallery,
  '/insights': InsightsPage,
  '/academy': AcademyPage,
  '/estimator': Estimator,
};

const baseRoutes: PrerenderRoute[] = (
  staticRoutes as Array<{ path: string }>
).map((r) => ({
  path: r.path,
  Component: COMPONENT_BY_PATH[r.path] || LandingPage,
  props: r.path === '/estimator' ? { onBack: () => {}, onFinish: () => {} } : {},
}));

const insightRoutes: PrerenderRoute[] = INSIGHT_ARTICLES.map((article) => ({
  path: `/insights/${article.slug}`,
  Component: InsightsPage,
  props: {},
}));

export const prerenderRoutes: PrerenderRoute[] = [
  ...baseRoutes,
  ...insightRoutes,
];
