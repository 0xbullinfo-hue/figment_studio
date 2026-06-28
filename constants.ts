
import { Project } from './types.ts';

export const IMAGES = {
  hero: "/figment_media/3D-Rendering-Abuja.png",

  services: {
    rendering: "/figment_media/3D-Rendering-Abuja 2.png",
    animation: "/figment_media/3D-Apartment-Rendering-Lagos-state 2.png",
    interior: "/figment_media/3D-Rendering-B2B-Abuja.png",
    printing: "/figment_media/3D-Printing.png"
  },

  staff: [
    { name: 'Ikechukwu Onuegbu', role: 'Managing Director', url: '/ikechukwu-onuegbu.jpg' },
    { name: 'Loveth', role: 'Admin', url: '/avatar-silhouette.svg' },
    { name: 'Chinedu', role: 'Developer', url: '/avatar-silhouette.svg' },
    { name: 'Amara', role: 'Media Manager', url: '/avatar-silhouette.svg' },
  ],

  about: {
    story1: "/figment_media/3D-Rendering-B2B-Abuja 2.png",
    story2: "/figment_media/3D-Rendering-B2B-Abuja 3.png"
  },

  delivery: "/figment_media/3D-Apartment-Rendering-Lagos-state.png",

  portfolio: [
    { 
      id: 'P1', 
      title: 'Abuja Luxury Villa Walkthrough', 
      category: 'Residential', 
      location: 'Maitama', 
      url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg', 
      type: 'Animation',
      hasPlay: true,
      videoUrl: '/figment_media/3D-Villa-Animation-Abuja.mp4'
    },
    { 
      id: 'P2', 
      title: 'Nexus Hub District', 
      category: 'Commercial', 
      location: 'Wuse II', 
      url: '/figment_media/3D-Rendering-B2B-Abuja 2.png', 
      type: 'Still Image'
    },
    { 
      id: 'P3', 
      title: 'Abuja B2B Residential Suite', 
      category: 'Residential (B2B)', 
      location: 'Central District', 
      url: '/figment_media/3D-Rendering-B2B-Abuja 3.png', 
      type: 'Animation', 
      hasPlay: true,
      videoUrl: '/figment_media/3D-Office-Interior -Animation-Abuja.mp4'
    },
    { 
      id: 'P4', 
      title: 'Ondo Modern Residence', 
      category: 'Residential', 
      location: 'Ondo State', 
      url: '/figment_media/3D-B2B-Rendering-Ondo-state.png', 
      type: 'Still Image'
    }
  ],

  gallery: [
    { id: 3, type: 'Animation', title: 'Lagos Apartment Walkthrough', url: '/figment_media/animation-cover-press-play.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Apartment-Animation-Lagos-state.mp4' },
    { id: 4, type: 'Scale Models', title: 'Precision Maquette Printing', url: '/figment_media/3D-Printing.png', class: 'aspect-square' },
    { id: 5, type: 'Scale Models', title: 'Residential Development Scale Model', url: '/figment_media/3D-Printing-2.png', class: 'aspect-[4/3]' },
    { id: 6, type: 'Exterior', title: 'Edo Country Manor', url: '/figment_media/3D-Country-home-Rendering-Edo-state 1.png', class: 'aspect-[4/3]' },
    { id: 7, type: 'Exterior', title: 'Edo Country Manor - Side View', url: '/figment_media/3D-Country-home-Rendering-Edo-state 2.png', class: 'aspect-[4/3]' },
    { id: 8, type: 'Exterior', title: 'Edo Country Manor - Aerial View', url: '/figment_media/3D-Country-home-Rendering-Edo-state-Roof.png', class: 'aspect-[4/3]' },
    { id: 9, type: 'Exterior', title: 'Abuja Contemporary Duplex', url: '/figment_media/3D-Duplex-Rendering-Abuja.png', class: 'aspect-[4/3]' },
    { id: 10, type: 'Exterior', title: 'Abuja Modern Residence', url: '/figment_media/3D-Rendering-Abuja.png', class: 'aspect-[3/2]' },
    { id: 11, type: 'Exterior', title: 'Abuja B2B Corporate Tower', url: '/figment_media/3D-Rendering-B2B-Abuja.png', class: 'aspect-[3/2]' },
    { id: 12, type: 'Exterior', title: 'Abuja Nexus Hub Complex', url: '/figment_media/3D-Rendering-B2B-Abuja 2.png', class: 'aspect-[4/3]' },
    { id: 13, type: 'Interior', title: 'Abuja B2B Residential Suite', url: '/figment_media/3D-Rendering-B2B-Abuja 3.png', class: 'aspect-[4/3]' },
    { id: 14, type: 'Exterior', title: 'Bus Transit Terminal', url: '/figment_media/Ai-Render-Bus-terminal.png', class: 'aspect-[3/2]' },
    { id: 15, type: 'Animation', title: 'Edo Suburban Estate Walkthrough', url: '/figment_media/animation-cover-press-play.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Villa-Animation-Edo-state.mp4' },
    { id: 16, type: 'Animation', title: 'Abuja Luxury Villa Walkthrough', url: '/figment_media/animation-cover-press-play.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Villa-Animation-Abuja.mp4' },
    { id: 17, type: 'Exterior', title: 'Ondo Modern Residence', url: '/figment_media/3D-B2B-Rendering-Ondo-state.png', class: 'aspect-[3/2]' },
    { id: 18, type: 'Animation', title: 'Abuja B2B Residential Walkthrough', url: '/figment_media/animation-cover-press-play.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Office-Interior -Animation-Abuja.mp4' },
    { id: 19, type: 'Exterior', title: 'Abuja Apartment', url: '/figment_media/3D-Rendering-Abuja 2.png', class: 'aspect-[4/3]' }
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
