
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
    { name: 'Amara Okafor', role: 'Lead 3D Artist', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600' },
    { name: 'Ibrahim Bello', role: 'Arch Consultant', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600' },
    { name: 'Fatima Yusuf', role: 'VR Developer', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600' },
  ],

  about: {
    story1: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
    story2: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=800"
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
