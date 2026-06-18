
import React from 'react';
import { Service } from '../types';

const services: Service[] = [
  {
    id: '1',
    title: '3D Rendering',
    description: 'High-fidelity photo-real stills at 4K+ resolution designed for marketing campaigns, investor decks, and stakeholder presentations.',
    icon: 'deployed_code',
  },
  {
    id: '2',
    title: 'Cinematic Animation',
    description: 'Immersive architectural walkthroughs and fly-through films with cinematic lighting and sound design.',
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
    <section className="section-pad bg-surface" id="services">
      <div className="content-lg">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
          <div className="space-y-4">
            <p className="label-sm text-primary">Our Expertise</p>
            <h2 className="display-md text-text-main">
              Tailored Visualization<br />
              <em className="italic text-text-muted font-light">for Every Scale</em>
            </h2>
          </div>
          <p className="max-w-sm text-text-muted leading-relaxed">
            We combine technical precision with artistic flair to produce results that captivate decision-makers and close deals.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, idx) => (
            <article
              key={service.id}
              className="group accent-card p-7 space-y-5 card-hover cursor-default"
            >
              {/* Number + Icon row */}
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-[22px]">{service.icon}</span>
                </div>
                <span className="font-display text-4xl font-light text-border-strong group-hover:text-primary/30 transition-colors duration-300">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-base font-semibold text-text-main font-body tracking-tight">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">{service.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
