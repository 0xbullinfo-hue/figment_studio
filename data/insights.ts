export interface InsightArticle {
  slug: string;
  category: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  img: string;
  paragraphs: string[];
}

export const INSIGHT_ARTICLES: InsightArticle[] = [
  {
    slug: 'the-future-of-architectural-rendering-in-sub-saharan-africa',
    category: 'Industry',
    date: 'June 2025',
    readTime: '5 min read',
    title: 'The Future of Architectural Rendering in Sub-Saharan Africa',
    excerpt: 'How AI tools are democratizing photorealistic visualization for architecture firms across Nigeria and beyond.',
    img: '/figment_media/3D-Rendering-B2B-Abuja 2.png',
    paragraphs: [
      'The architectural sector in Sub-Saharan Africa is experiencing a technology-driven renaissance. For decades, rendering high-fidelity photorealistic images required massive local server stacks or expensive outsource contracts to studios in Europe or Asia. Today, real-time engines and custom AI co-pilots are changing the game.',
      '### Democratizing Quality',
      'By leveraging cloud-based GPU clustering and local fine-tuned models, small boutique firms in Lagos and Nairobi can now access tools that produce cinematic results in a fraction of the time. This leveling of the playing field allows local designers to present concepts that compete directly with international heavyweights, securing domestic and foreign investment.',
      '### Preserving Heritage in Virtual Spaces',
      'Importantly, these tools are being used to catalog and conceptualize structures that incorporate traditional African design language-from earthen walls to natural ventilation patterns-combining historic architecture with contemporary engineering.'
    ]
  },
  {
    slug: 'why-cinematic-walkthroughs-close-more-property-deals',
    category: 'Technology',
    date: 'May 2025',
    readTime: '4 min read',
    title: 'Why Cinematic Walkthroughs Close More Property Deals',
    excerpt: 'Data from 200+ projects reveals the compelling correlation between animation quality and investor conversion rates.',
    img: '/figment_media/3D-Apartment-Rendering-Lagos-state 2.png',
    paragraphs: [
      'Why do static renders sometimes fail to capture the imagination of real estate investors? The answer lies in the human brain\'s response to spatial dynamics. A study of over 200 developments across Nigeria shows a clear trend: projects backed by high-fidelity cinematic walkthroughs close deals 40% faster.',
      '### The Psychology of Motion',
      'Animation provides a sense of scale, perspective, and transition that static images cannot replicate. As the virtual camera moves through a lobby, tracking sunrays cutting through the atrium, the viewer builds a spatial memory of the building.',
      '### Tangible Conversion Impact',
      'Cinematic storytelling allows developers to outline the journey of a future tenant. By highlighting building amenities, flow, and material finishes dynamically, animations translate abstract plans into a concrete lifestyle, accelerating pre-sales and securing structural financing.'
    ]
  },
  {
    slug: 'inside-figment-our-4k-rendering-pipeline-explained',
    category: 'Studio',
    date: 'April 2025',
    readTime: '6 min read',
    title: 'Inside Figment: Our 4K Rendering Pipeline Explained',
    excerpt: 'A behind-the-scenes look at the hardware, software, and creative workflow that produces our signature renders.',
    img: '/figment_media/3D-Rendering-Abuja 2.png',
    paragraphs: [
      'Achieving the signature Figment Studio look is a meticulous process combining artistic design with bleeding-edge rendering hardware. We pull back the curtain on the pipeline that processes our client\'s Revit and D5 assets.',
      '### Hardware Infrastructure',
      'Every project is rendered using our proprietary cloud network equipped with NVIDIA RTX 4090 servers. This allows us to run path-tracing algorithms at 4K resolution with real-time global illumination, soft shadows, and physically-accurate glass refraction.',
      '### The Creative Eye',
      'Technology is only half the equation. Our visual artists manually set up camera lenses, depth of field, and lighting temperatures to match the specific atmosphere of West African light-known for its brilliant contrast, dust refraction, and warm sunset glow.'
    ]
  },
  {
    slug: 'defining-the-horizon-archviz-trends-in-nigeria-2024',
    category: 'Trends',
    date: 'Oct 12, 2024',
    readTime: '5 min read',
    title: 'Defining the Horizon: ArchViz Trends in Nigeria 2024',
    excerpt: 'Exploring how high-end 3D rendering and VR are reshaping the architectural landscape in West Africa.',
    img: '/figment_media/3D-Rendering-B2B-Abuja.png',
    paragraphs: [
      'The Nigerian real estate landscape is undergoing a massive shift. As developers compete for high-value investors in Lagos, Abuja, and Port Harcourt, standard 2D blueprints and simple static renders are no longer sufficient.',
      '### Off-Plan Sales Revolution',
      'With interest rates rising, developers rely heavily on off-plan sales to finance major residential towers. To secure commitments before groundbreaking, they require emotional engagement. Photorealistic 3D visualization creates a window into the future, showing prospective buyers the exact view from their 20th-floor balcony or the reflection of the sunset on their Italian marble countertops.',
      '### Real-Time Interactivity',
      'Unreal Engine 5 is democratizing real-time walkthroughs. Prospective buyers can now wear VR headsets to walk through a virtual duplex, change interior finishes in real time, and experience the space at different times of day. Figment Studio is pioneering this pipeline, merging architectural precision with cinema-grade light simulation to redefine how Nigerian spaces are envisioned and sold.'
    ]
  },
  {
    slug: 'the-future-of-3d-printing-in-west-african-construction',
    category: 'Technology',
    date: 'Sep 28, 2024',
    readTime: '5 min read',
    title: 'The Future of 3D Printing in West African Construction',
    excerpt: 'An analysis of how additive manufacturing and concrete 3D printing are beginning to emerge in urban centers like Lagos and Accra.',
    img: '/figment_media/3D-Printing.png',
    paragraphs: [
      'Additive manufacturing is transitioning from a high-tech novelty to a viable solution for the housing deficit in West Africa. Concrete 3D printing represents a paradigm shift in material efficiency and build speed.',
      '### Redefining Speed and Logistics',
      'By utilizing local materials and automated gantry systems, developers can print structural walls for a standard bungalow in less than 48 hours. This drastically reduces on-site labor requirements and waste, which accounts for up to 30% of materials in traditional concrete pouring.',
      '### Regulatory and Design Challenges',
      'While the potential is enormous, local building codes and structural approvals must evolve. Figment Studio is collaborating with structural consultants to create pre-optimized digital scale models that align with regulatory frameworks, laying the foundation for a sustainable, high-speed construction sector in Nigeria.'
    ]
  }
];

export function getInsightBySlug(slug?: string) {
  if (!slug) {
    return null;
  }
  return INSIGHT_ARTICLES.find((article) => article.slug === slug) || null;
}
