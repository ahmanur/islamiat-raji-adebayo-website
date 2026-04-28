import React from 'react';
import { motion } from 'framer-motion';

const projects = [
  {
    status: 'Current Project',
    title: 'Urban Campus Soundscape Project',
    location: 'Cornell University, Ithaca NY',
    image: '/images/spectrogram-art.png',
    description:
      'Using autonomous acoustic recorders deployed across university campuses and cities in multiple countries, this project investigates bird diversity in rapidly changing urban landscapes. I collaborate with local experts and students to record bird songs—identifying which species persist, which do not, and why—helping us understand the factors that shape urban bird populations and guide conservation planning.',
    methods: ['Autonomous acoustic recorders', 'Community science', 'Bird song identification', 'Multi-country comparison'],
  },
  {
    status: 'Past Project',
    title: 'Multi-country Urban Bird Monitoring',
    location: "Queen's University, Canada",
    image: '/images/hero-bird.png',
    description:
      'As a Postdoctoral Research Fellow at Queen\'s University, I coordinated a global urban bird survey project spanning five countries — Brazil, Canada, France, Kenya, and Senegal. The project used passive acoustic recorders and an innovative Community Science approach, actively involving local experts and the public in data collection to promote human–wildlife coexistence and address geographic bias in urban ecology research.',
    methods: ['Passive acoustic recorders', 'Community Science', 'Five-country comparison', 'GIS land-use analysis'],
  },
  {
    status: 'Doctoral Research',
    title: 'Frugivory & Seed Dispersal in Urban Mosaics',
    location: 'University of KwaZulu-Natal, South Africa',
    image: '/images/field-fruit.png',
    description:
      'My doctoral research focused on frugivory and seed dispersal by birds, bats, and monkeys in urban mosaic landscapes, with particular attention to the ecological role of Ficus species. The work demonstrated how habitat fragmentation disrupts mutualistic plant–animal interactions, with significant implications for forest regeneration in heavily modified environments.',
    methods: ['Focal plant observations', 'Bat and bird surveys', 'Seed germination trials', 'Landscape fragmentation metrics'],
  },
];

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export function FieldWorkPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="max-w-3xl mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Field Work</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            <p className="text-xl text-foreground/80 font-light leading-relaxed">
              My research is deeply grounded in fieldwork — in the quiet patience of listening to forest edges at dawn,
              in the careful documentation of birds foraging on fruiting trees, and in the collaborative effort of training
              communities to listen and record alongside me. Below are the major field campaigns that have defined my career.
            </p>
          </motion.div>

          <div className="space-y-24">
            {projects.map((project, i) => (
              <motion.div
                key={project.title}
                className={`flex flex-col gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
              >
                <div className="w-full lg:w-1/2">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg relative group">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-6 uppercase w-fit">
                    {project.status}
                  </div>
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{project.title}</h2>
                  <div className="flex items-center gap-2 text-foreground/60 text-sm mb-6 uppercase tracking-wider font-medium">
                    <MapPinIcon className="w-4 h-4" />
                    {project.location}
                  </div>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-8">{project.description}</p>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">Methods</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.methods.map((m) => (
                        <span key={m} className="text-xs px-3 py-1 rounded-full bg-secondary border border-secondary/80 text-foreground/70">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
