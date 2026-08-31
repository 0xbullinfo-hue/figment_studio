
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
    { name: 'Ikechukwu Onuegbu', role: 'Creative Team Lead (Architect)', url: '/team/ikechukwu-onuegbu.jpg' },
    { name: 'John Noah', role: 'Creative Model specialist (Architect)', url: '/team/john-noah.jpg' },
    { name: 'Chinedu Onuegbu', role: 'Creative Developer (IT)', url: '/team/chinedu-onuegbu.png' },
  ],

  about: {
    story1: "/figment_media/3D-Rendering-B2B-Abuja 2.png",
    story2: "/figment_media/3D-Rendering-B2B-Abuja 3.png"
  },

  delivery: "/figment_media/3D-Apartment-Rendering-Lagos-state 2.png",

  portfolio: [
    { 
      id: 'P1', 
      title: 'Abuja Luxury Villa Walkthrough', 
      category: 'Cinematic Animation', 
      location: 'Maitama, Abuja', 
      url: '/figment_media/3D-Villa-Animation-Abuja-Cover.jpg',
      type: 'Animation',
      description: 'Cinematic 3D animation exploring the expansive daylit volumes, infinity pool, and seamless indoor-outdoor flow of an ultra-luxury villa.',
      hasPlay: true,
      videoUrl: '/figment_media/3D-Villa-Animation-Abuja.mp4'
    },
    { 
      id: 'P2', 
      title: 'Abuja Contemporary Duplex', 
      category: 'Residential Architecture', 
      location: 'Guzape, Abuja', 
      url: '/figment_media/3D-Duplex-Rendering-Abuja.png', 
      description: 'Modern double-story duplex rendering with clean geometric lines, accent spotlights, and custom perimeter design.',
      type: 'Still Image'
    },
    { 
      id: 'P3', 
      title: 'Anambra Villa Living Lounge', 
      category: 'Interior Visualization', 
      location: 'Awka, Anambra', 
      url: '/figment_media/3D-Rendering-interior-Anambra 2.png',
      description: 'Ultra-modern interior styling featuring minimalist bedside globes, warm sheer drapery, and curated abstract art.',
      type: 'Interior'
    },
    { 
      id: 'P4', 
      title: 'Abuja Modern Residence', 
      category: 'Private Estate', 
      location: 'Central District, Abuja', 
      url: '/figment_media/3D-Rendering-Abuja.png', 
      description: 'Striking private residence visualization highlighting warm sunset ambiance, curtain-wall reflections, and minimalist landscaping.',
      type: 'Still Image'
    },
    { 
      id: 'P5', 
      title: 'Abuja Urban Villa', 
      category: 'Contemporary Living', 
      location: 'Asokoro, Abuja', 
      url: '/figment_media/3D-Rendering-Abuja 2.png', 
      description: 'Signature 4K exterior rendering showcasing dramatic cantilevered overhangs, natural stone finishes, and lush tropical greenery.',
      type: 'Still Image'
    },
    { 
      id: 'P6', 
      title: 'Asokoro Contemporary Villa', 
      category: 'Residential Architecture', 
      location: 'Asokoro, Abuja', 
      url: '/asokoro-villa-angle.jpg', 
      description: 'Striking contemporary villa with double-height curtain-wall glazing, stone-clad accent columns, and manicured tropical gardens set against a clear sky.',
      type: 'Still Image'
    },
    { 
      id: 'P7', 
      title: 'Jabi Lakefront Penthouse', 
      category: 'Interior Visualization', 
      location: 'Jabi, Abuja', 
      url: '/jabi-penthouse-living.jpg', 
      description: 'Open-plan penthouse interior with double-height ceilings, grand piano, marble dining, and warm natural light flooding through full-length drapes.',
      type: 'Interior'
    },
    { 
      id: 'P8', 
      title: 'Maitama Luxury Villa', 
      category: 'Private Estate', 
      location: 'Maitama, Abuja', 
      url: '/maitama-villa-dusk.jpg', 
      description: 'Dramatic dusk visualization of a multi-level luxury villa with concealed LED strip accents, vertical timber screening, and layered rooftop terraces.',
      type: 'Still Image'
    }
  ],

  gallery: [
    { id: 3, type: 'Animation', title: 'Lagos Apartment Walkthrough', url: '/figment_media/3D-Apartment-Rendering-Lagos-state.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Apartment-Animation-Lagos-state.mp4' },
    { id: 4, type: 'Scale Models', title: 'Precision Maquette Printing', url: '/figment_media/3D-Printing.png', class: 'aspect-square' },
    { id: 5, type: 'Scale Models', title: 'Residential Development Scale Model', url: '/figment_media/3D-Printing-2.png', class: 'aspect-[4/3]' },
    { id: 6, type: 'Exterior', title: 'Edo Country Manor', url: '/figment_media/3D-Country-home-Rendering-Edo-state 1.png', class: 'aspect-[4/3]' },
    { id: 7, type: 'Exterior', title: 'Edo Country Manor - Side View', url: '/figment_media/3D-Country-home-Rendering-Edo-state 2.png', class: 'aspect-[4/3]' },
    { id: 8, type: 'Exterior', title: 'Edo Country Manor - Aerial View', url: '/figment_media/3D-Country-home-Rendering-Edo-state-Roof.png', class: 'aspect-[4/3]' },
    { id: 9, type: 'Exterior', title: 'Abuja Contemporary Duplex', url: '/figment_media/3D-Duplex-Rendering-Abuja.png', class: 'aspect-[4/3]' },
    { id: 10, type: 'Exterior', title: 'Abuja Modern Residence', url: '/figment_media/3D-Rendering-Abuja.png', class: 'aspect-[3/2]' },
    { id: 11, type: 'Exterior', title: 'Abuja B2B Corporate Tower', url: '/figment_media/3D-Rendering-B2B-Abuja.png', class: 'aspect-[3/2]' },
    { id: 12, type: 'Interior', title: 'Abuja Serviced Apartment', url: '/figment_media/3D-Rendering-B2B-Abuja 2.png', class: 'aspect-[4/3]' },
    { id: 13, type: 'Interior', title: 'Abuja B2B Residential Suite', url: '/figment_media/3D-Rendering-B2B-Abuja 3.png', class: 'aspect-[4/3]' },
    { id: 14, type: 'Exterior', title: 'Bus Transit Terminal', url: '/figment_media/Ai-Render-Bus-terminal.png', class: 'aspect-[3/2]' },
    { id: 15, type: 'Animation', title: 'Edo Suburban Estate Walkthrough', url: '/figment_media/3D-Country-home-Rendering-Edo-state 1.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Villa-Animation-Edo-state.mp4' },
    { id: 16, type: 'Animation', title: 'Abuja Luxury Villa Walkthrough', url: '/figment_media/3D-Rendering-Abuja 2.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Villa-Animation-Abuja.mp4' },
    { id: 17, type: 'Exterior', title: 'Ondo Modern Residence', url: '/figment_media/3D-B2B-Rendering-Ondo-state.png', class: 'aspect-[3/2]' },
    { id: 18, type: 'Animation', title: 'Abuja B2B Residential Walkthrough', url: '/figment_media/3D-Rendering-B2B-Abuja 3.png', class: 'aspect-video', hasPlay: true, videoUrl: '/figment_media/3D-Office-Interior -Animation-Abuja.mp4' },
    { id: 19, type: 'Exterior', title: 'Abuja Apartment', url: '/figment_media/3D-Rendering-Abuja 2.png', class: 'aspect-[4/3]' },
    { id: 20, type: 'Exterior', title: 'Anambra Contemporary Villa', url: '/figment_media/3D-Rendering-Anambra 1.png', class: 'aspect-[4/3]' },
    { id: 21, type: 'Exterior', title: 'Anambra Villa Cantilever View', url: '/figment_media/3D-Rendering-Anambra 2.png', class: 'aspect-[4/3]' },
    { id: 22, type: 'Exterior', title: 'Anambra Villa Architecture Detail', url: '/figment_media/3D-Rendering-Anambra 3.png', class: 'aspect-[4/3]' },
    { id: 23, type: 'Exterior', title: 'Anambra Villa Garden Perspective', url: '/figment_media/3D-Rendering-Anambra 4.png', class: 'aspect-[4/3]' },
    { id: 24, type: 'Interior', title: 'Anambra Villa Dining & Grand Piano', url: '/figment_media/3D-Rendering-interior-Anambra 1.png', class: 'aspect-[4/3]' },
    { id: 25, type: 'Interior', title: 'Anambra Villa Living Lounge', url: '/figment_media/3D-Rendering-interior-Anambra 2.png', class: 'aspect-[4/3]' },
    { id: 26, type: 'Interior', title: 'Anambra Villa Master Suite', url: '/figment_media/3D-Rendering-interior-Anambra 3.png', class: 'aspect-[4/3]' },
    { id: 27, type: 'Exterior', title: 'Asokoro Villa - Front Elevation', url: '/asokoro-villa-front.jpg', class: 'aspect-[4/3]' },
    { id: 28, type: 'Exterior', title: 'Asokoro Villa - Angle View', url: '/asokoro-villa-angle.jpg', class: 'aspect-[4/3]' },
    { id: 29, type: 'Exterior', title: 'Asokoro Villa - Garden Perspective', url: '/asokoro-villa-low-angle.jpg', class: 'aspect-[4/3]' },
    { id: 30, type: 'Interior', title: 'Jabi Lakefront Dining', url: '/jabi-lakefront-dining.jpg', class: 'aspect-[4/3]' },
    { id: 31, type: 'Interior', title: 'Jabi Penthouse Living Room', url: '/jabi-penthouse-living.jpg', class: 'aspect-[4/3]' },
    { id: 32, type: 'Exterior', title: 'Maitama Hillside Villas', url: '/maitama-hillside-villas.jpg', class: 'aspect-[3/2]' },
    { id: 33, type: 'Exterior', title: 'Maitama Villa - Day View', url: '/maitama-villa-day.jpg', class: 'aspect-[3/2]' },
    { id: 34, type: 'Exterior', title: 'Maitama Villa - Dusk Lighting', url: '/maitama-villa-dusk.jpg', class: 'aspect-[3/2]' }
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
