
import { Project } from './types.ts';

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop",

  services: {
    rendering: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop",
    animation: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop",
    interior: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=800&auto=format&fit=crop",
    printing: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop"
  },

  staff: [
    { name: 'Ikechukwu Onuegbu', role: 'Managing Director', url: '/ikechukwu-onuegbu.jpg' },
    { name: 'Loveth', role: 'Admin', url: '/avatar-silhouette.svg' },
    { name: 'Chinedu', role: 'Developer', url: '/avatar-silhouette.svg' },
    { name: 'Amara', role: 'Media Manager', url: '/avatar-silhouette.svg' },
  ],

  about: {
    story1: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
    story2: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800"
  },

  delivery: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000",

  portfolio: [
    { id: 'P1', title: 'The Obsidian Retreat', category: 'Residential', location: 'Maitama', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', type: 'Still Image' },
    { id: 'P2', title: 'Nexus Hub District', category: 'Commercial', location: 'Wuse II', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', type: 'Animation', hasPlay: true }
  ],

  gallery: [
    { id: 1, type: 'Interior', title: 'Maitama Luxury Suite', url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1974&auto=format&fit=crop', class: 'aspect-[4/5]' },
    { id: 2, type: 'Exterior', title: 'The Abuja Nexus Tower', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', class: 'aspect-[2/3]' },
    { id: 3, type: 'Animation', title: 'CBD Flyover', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=2070&auto=format&fit=crop', class: 'aspect-video', hasPlay: true },
    { id: 4, type: 'Scale Models', title: 'Lekki Masterplan', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2069&auto=format&fit=crop', class: 'aspect-square' },
    { id: 5, type: 'Exterior', title: 'Maitama Hillside Villas', url: '/maitama-hillside-villas.jpg', class: 'aspect-[4/3]' },
    { id: 6, type: 'Exterior', title: 'Asokoro Villa - Front View', url: '/asokoro-villa-front.jpg', class: 'aspect-[4/3]' },
    { id: 7, type: 'Exterior', title: 'Asokoro Villa - Perspective', url: '/asokoro-villa-angle.jpg', class: 'aspect-[4/3]' },
    { id: 8, type: 'Interior', title: 'Jabi Lakefront Dining', url: '/jabi-lakefront-dining.jpg', class: 'aspect-[4/3]' },
    { id: 9, type: 'Interior', title: 'Jabi Penthouse Living', url: '/jabi-penthouse-living.jpg', class: 'aspect-[4/3]' },
    { id: 10, type: 'Exterior', title: 'Maitama Luxury Villa - Dusk', url: '/maitama-villa-dusk.jpg', class: 'aspect-[3/2]' },
    { id: 11, type: 'Exterior', title: 'Maitama Luxury Villa - Day', url: '/maitama-villa-day.jpg', class: 'aspect-[3/2]' },
    { id: 12, type: 'Exterior', title: 'Asokoro Villa - Low Angle', url: '/asokoro-villa-low-angle.jpg', class: 'aspect-[4/3]' },
  ]
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'FS-082',
    title: 'Skyline Penthouse',
    category: 'Interior',
    location: 'Maitama',
    status: 'In Progress',
    progress: 85,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
    description: "Ultra-luxury penthouse rendering with dusk lighting focus.",
    revLimit: 3,
    revUsed: 2,
    notes: "Dusk lighting variations added to the latest package.",
    assets: [
      { name: 'Penthouse Main View - 4K', format: 'PNG', size: '12.5 MB', url: '#' },
      { name: 'Living Room Panorama', format: 'JPG', size: '8.2 MB', url: '#' }
    ]
  },
  {
    id: 'FS-079',
    title: 'Waterfront Hub',
    category: 'Commercial',
    location: 'Eko Atlantic',
    status: 'Completed',
    progress: 100,
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200",
    description: "Iconic commercial tower with high-performance glass facade.",
    revLimit: 5,
    revUsed: 4,
    assets: [
      { name: 'Tower Master Render', format: 'TIF', size: '85.0 MB', url: '#' },
      { name: 'Site Animation - 1080p', format: 'MP4', size: '150.0 MB', url: '#' }
    ]
  },
  {
    id: 'FS-085',
    title: 'Afro-centric Villa',
    category: 'Residential',
    location: 'Asokoro',
    status: 'Pending Approval',
    progress: 15,
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200",
    description: "Contemporary villa blending modernism with Nigerian materials.",
    revLimit: 3,
    revUsed: 0
  }
];
