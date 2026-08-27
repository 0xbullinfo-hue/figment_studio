const INITIAL_PROJECTS = [
  {
    id: 'FS-082',
    title: 'Skyline Penthouse',
    category: 'Interior',
    location: 'Maitama',
    status: 'In Progress',
    progress: 85,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    description: 'Ultra-luxury penthouse rendering with dusk lighting focus.',
    revLimit: 3,
    revUsed: 2,
    notes: 'Dusk lighting variations added to the latest package.',
    assets: [
      { name: 'Penthouse Main View - 4K', format: 'PNG', size: '12.5 MB', url: '#' },
      { name: 'Living Room Panorama', format: 'JPG', size: '8.2 MB', url: '#' },
    ],
  },
  {
    id: 'FS-079',
    title: 'Waterfront Hub',
    category: 'Commercial',
    location: 'Eko Atlantic',
    status: 'Completed',
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
    description: 'Iconic commercial tower with high-performance glass facade.',
    revLimit: 5,
    revUsed: 4,
    assets: [
      { name: 'Tower Master Render', format: 'TIF', size: '85.0 MB', url: '#' },
      { name: 'Site Animation - 1080p', format: 'MP4', size: '150.0 MB', url: '#' },
    ],
  },
  {
    id: 'FS-085',
    title: 'Afro-centric Villa',
    category: 'Residential',
    location: 'Asokoro',
    status: 'Pending Approval',
    progress: 15,
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200',
    description: 'Contemporary villa blending modernism with Nigerian materials.',
    revLimit: 3,
    revUsed: 0,
  },
];

const INITIAL_PORTFOLIO = [
  { id: 3, type: 'Animation', title: 'Lagos Apartment Walkthrough', url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Apartment-Animation-Lagos-state.mp4' },
  { id: 4, type: 'Scale Models', title: 'Precision Maquette Printing', url: '/figment_media/3D-Printing.png', class: 'aspect-square' },
  { id: 5, type: 'Scale Models', title: 'Residential Development Scale Model', url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg', class: 'aspect-[4/3]' },
  { id: 6, type: 'Exterior', title: 'Edo Country Manor', url: '/figment_media/3D-Country-home-Rendering-Edo-state 1.png', class: 'aspect-[4/3]' },
  { id: 7, type: 'Exterior', title: 'Edo Country Manor - Side View', url: '/figment_media/3D-Country-home-Rendering-Edo-state 2.png', class: 'aspect-[4/3]' },
  { id: 8, type: 'Exterior', title: 'Edo Country Manor - Aerial View', url: '/figment_media/3D-Country-home-Rendering-Edo-state-Roof.png', class: 'aspect-[4/3]' },
  { id: 9, type: 'Exterior', title: 'Abuja Contemporary Duplex', url: '/figment_media/3D-Duplex-Rendering-Abuja.png', class: 'aspect-[4/3]' },
  { id: 10, type: 'Exterior', title: 'Abuja Modern Residence', url: '/figment_media/3D-Rendering-Abuja.png', class: 'aspect-[3/2]' },
  { id: 11, type: 'Exterior', title: 'Abuja B2B Corporate Tower', url: '/figment_media/3D-Rendering-B2B-Abuja.png', class: 'aspect-[3/2]' },
  { id: 12, type: 'Interior', title: 'Abuja Serviced Apartment', url: '/figment_media/3D-Rendering-B2B-Abuja 2.png', class: 'aspect-[4/3]' },
  { id: 13, type: 'Interior', title: 'Abuja B2B Residential Suite', url: '/figment_media/3D-Rendering-B2B-Abuja 3.png', class: 'aspect-[4/3]' },
  { id: 14, type: 'Exterior', title: 'Bus Transit Terminal', url: '/figment_media/Ai-Render-Bus-terminal.png', class: 'aspect-[3/2]' },
  { id: 15, type: 'Animation', title: 'Edo Suburban Estate Walkthrough', url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Villa-Animation-Edo-state.mp4' },
  { id: 16, type: 'Animation', title: 'Abuja Luxury Villa Walkthrough', url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Villa-Animation-Abuja.mp4' },
  { id: 17, type: 'Exterior', title: 'Ondo Modern Residence', url: '/figment_media/3D-B2B-Rendering-Ondo-state.png', class: 'aspect-[3/2]' },
  { id: 18, type: 'Animation', title: 'Abuja B2B Residential Walkthrough', url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Office-Interior -Animation-Abuja.mp4' },
  { id: 19, type: 'Exterior', title: 'Abuja Apartment', url: '/figment_media/3D-Rendering-Abuja 2.png', class: 'aspect-[4/3]' },
];

const INITIAL_SERVICES = [
  {
    id: '01',
    title: '3D Architectural Rendering',
    short: '3D Rendering',
    description: 'High-fidelity photo-real stills at 4K+ resolution for marketing campaigns, investor decks, and stakeholder presentations. Every pixel tuned for maximum impact.',
    image: '/figment_media/3D-Rendering-Abuja 2.png',
    tags: ['Still Image', '4K+', 'Marketing'],
  },
  {
    id: '02',
    title: 'Cinematic Animation',
    short: 'Animation',
    description: 'Immersive architectural walkthroughs and fly-through films with cinematic lighting, camera choreography, and spatial audio design.',
    image: '/figment_media/3D-Apartment-Rendering-Lagos-state 2.png',
    tags: ['Film', 'Fly-Through', 'Sound'],
  },
  {
    id: '03',
    title: 'Interior Design Visualization',
    short: 'Interiors',
    description: 'Detailed interior styling and spatial planning rendered with tactile material accuracy, mood-specific lighting, and furniture placement precision.',
    image: '/figment_media/3D-Rendering-B2B-Abuja.png',
    tags: ['Materials', 'Lighting', 'Spatial'],
  },
  {
    id: '04',
    title: '3D Scale Models & Printing',
    short: 'Scale Models',
    description: 'Physical scale models with micro-detail precision — ideal for urban master-planning, property launch events, and client showrooms.',
    image: '/figment_media/3D-Printing.png',
    tags: ['Physical', 'Master-Planning', 'Events'],
  },
];

const INITIAL_ABOUT = {
  badge: 'Est. 2015 — Abuja, Nigeria',
  headline: 'Visualizing the Future of African Design.',
  lead: 'Abuja\'s premier architectural visualization firm, where precision meets artistry in every pixel.',
  story: [
    'Founded in the heart of Abuja, Figment Studio began with a single vision: to redefine how architecture is experienced before it\'s even built.',
    'What started as a small team of passionate designers has grown into Abuja\'s leading studio for high-stakes visual communication.',
  ],
  storyImages: ['/figment_media/3D-Rendering-B2B-Abuja 2.png', '/figment_media/3D-Rendering-B2B-Abuja 3.png'],
};

const INITIAL_REVIEWS = [
  {
    id: 'REV-001',
    name: 'Chukwuma Eze',
    role: 'Principal Architect',
    company: 'Eze & Associates, Lagos',
    rating: 5,
    comment: 'Figment Studio completely transformed how we present projects to investors. The renders look so real our clients often ask if they are photographs.',
    date: '2026-05-14',
    approved: true,
  },
  {
    id: 'REV-002',
    name: 'Ngozi Adeyemi',
    role: 'Real Estate Developer',
    company: 'Pinnacle Homes, Abuja',
    rating: 5,
    comment: 'The AI-guided scene planning tool saved us weeks of back-and-forth. The team understood our vision from the first brief.',
    date: '2026-05-28',
    approved: true,
  },
  {
    id: 'REV-003',
    name: 'Emeka Okonkwo',
    role: 'Director of Projects',
    company: 'Landmark Group, Victoria Island',
    rating: 5,
    comment: 'Working with Figment is the closest thing I have found to having a world-class visualization studio in-house — without the overhead.',
    date: '2026-06-02',
    approved: true,
  },
];

const state = {
  projects: structuredClone(INITIAL_PROJECTS),
  portfolioItems: structuredClone(INITIAL_PORTFOLIO),
  services: structuredClone(INITIAL_SERVICES),
  about: structuredClone(INITIAL_ABOUT),
  reviews: structuredClone(INITIAL_REVIEWS),
};

const clone = (value) => structuredClone(value);

const upsertById = (items, item) => {
  const index = items.findIndex((candidate) => candidate.id === item.id);
  if (index === -1) {
    return [item, ...items];
  }

  const next = items.slice();
  next[index] = item;
  return next;
};

export function getPublicStudioContent() {
  return clone({
    services: state.services,
    about: state.about,
    reviews: state.reviews.filter((review) => review.approved !== false),
    portfolioItems: state.portfolioItems,
  });
}

export function getAdminStudioSnapshot() {
  return clone(state);
}

export function updateAboutContent(nextAbout) {
  state.about = { ...state.about, ...clone(nextAbout) };
  return clone(state.about);
}

export function addService(service) {
  state.services = [{ ...clone(service) }, ...state.services];
  return clone(state.services);
}

export function updateService(service) {
  state.services = state.services.map((candidate) => (candidate.id === service.id ? { ...clone(service) } : candidate));
  return clone(state.services);
}

export function deleteService(id) {
  state.services = state.services.filter((service) => service.id !== id);
  return clone(state.services);
}

export function addProject(project) {
  state.projects = [{ ...clone(project) }, ...state.projects];
  return clone(state.projects);
}

export function updateProject(project) {
  state.projects = state.projects.map((candidate) => (candidate.id === project.id ? { ...clone(project) } : candidate));
  return clone(state.projects);
}

export function deleteProject(id) {
  state.projects = state.projects.filter((project) => project.id !== id);
  return clone(state.projects);
}

export function addPortfolioItem(item) {
  state.portfolioItems = [{ ...clone(item) }, ...state.portfolioItems];
  return clone(state.portfolioItems);
}

export function updatePortfolioItem(item) {
  state.portfolioItems = state.portfolioItems.map((candidate) => (candidate.id === item.id ? { ...clone(item) } : candidate));
  return clone(state.portfolioItems);
}

export function deletePortfolioItem(id) {
  state.portfolioItems = state.portfolioItems.filter((item) => item.id !== id);
  return clone(state.portfolioItems);
}

export function addReview(review) {
  state.reviews = [{ ...clone(review) }, ...state.reviews];
  return clone(state.reviews);
}

export function updateReview(review) {
  state.reviews = state.reviews.map((candidate) => (candidate.id === review.id ? { ...clone(review) } : candidate));
  return clone(state.reviews);
}

export function deleteReview(id) {
  state.reviews = state.reviews.filter((review) => review.id !== id);
  return clone(state.reviews);
}

export function restoreReview(review) {
  state.reviews = upsertById(state.reviews, clone(review));
  return clone(state.reviews);
}

export function restoreProject(project) {
  state.projects = upsertById(state.projects, clone(project));
  return clone(state.projects);
}

export function restorePortfolioItem(item) {
  state.portfolioItems = upsertById(state.portfolioItems, clone(item));
  return clone(state.portfolioItems);
}
