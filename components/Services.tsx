
import React from 'react';
import { Service } from '../types';

const services: Service[] = [
  {
    id: '1',
    title: '3D Rendering',
    description: 'High-fidelity photo-real stills at 4K+ resolution for marketing campaigns, investor decks, and stakeholder presentations.',
    icon: 'deployed_code',
  },
  {
    id: '2',
    title: 'Cinematic Animation',
    description: 'Immersive architectural walkthroughs and fly-through films with cinematic lighting, camera choreography, and sound design.',
    icon: 'videocam',
  },
  {
    id: '3',
    title: 'Interior Design',
    description: 'Detailed interior styling and spatial planning rendered with tactile material accuracy and mood-specific lighting.',
    icon: 'layers',
  },
  {
    id: '4',
    title: '3D Printing',
    description: 'Physical scale models with micro-detail precision — ideal for urban master-planning and property launch events.',
    icon: 'print',
  },
];

const Services: React.FC = () => {
  return (
    <section className="section-pad bg-background-alt" id="services">
      <div className="content-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="space-y-4 text-left">
            <p className="label-sm text-primary font-sans">Our Expertise</p>
            <h2 className="text-3xl md:text-5xl font-display font-light text-white leading-tight">
              Tailored Visualization<br />
              <em className="italic font-light text-text-muted">for Every Scale</em>
            </h2>
          </div>
          <p className="max-w-sm text-text-secondary leading-relaxed text-sm font-sans text-left">
            We combine technical precision with artistic flair to produce results that captivate decision-makers and close deals.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, idx) => (
            <article
              key={service.id}
              className="group card p-7 space-y-5 rounded-2xl cursor-default text-left"
            >
              {/* Number + icon */}
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(240,122,58,0.12)',
                    color: '#F07A3A',
                  }}
                >
                  <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </span>
                </div>
                <span className="font-display text-4xl font-light" style={{ color: 'rgba(255,255,255,0.07)' }}>
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-white font-sans tracking-wide">
                  {service.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed font-sans">{service.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                <span>Learn more</span>
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
