import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

type ProjectItem = {
  status: string;
  title: string;
  location: string;
  description: string;
  methods: string;
  image?: string;
};

type ProjectEntry = { id: string; data: ProjectItem };

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
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
  const [entries, setEntries] = useState<ProjectEntry[]>(
    () => LIST_DEFAULTS.research_projects.map((d, i) => ({ id: String(i), data: d as ProjectItem }))
  );

  useEffect(() => {
    getList('research_projects').then(rows => {
      if (rows.length > 0) setEntries(rows.map(r => ({ id: r.id, data: r.data as ProjectItem })));
    });
  }, []);

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
              communities to listen and record alongside me.
            </p>
          </motion.div>

          <div className="space-y-24">
            {entries.map((entry, i) => {
              const project = entry.data;
              const imgSrc = project.image || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length];
              return (
                <motion.div
                  key={entry.id}
                  className={`flex flex-col gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8 }}
                >
                  <Link href={`/research/${entry.id}`} className="w-full lg:w-1/2 block group cursor-pointer">
                    <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg relative">
                      <img
                        src={imgSrc}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/90 text-foreground text-sm font-medium px-5 py-2 rounded-full flex items-center gap-2">
                          View Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
                    </div>
                  </Link>

                  <div className="w-full lg:w-1/2 flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-6 uppercase w-fit">
                      {project.status}
                    </div>
                    <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{project.title}</h2>
                    <div className="flex items-center gap-2 text-foreground/60 text-sm mb-6 uppercase tracking-wider font-medium">
                      <MapPinIcon className="w-4 h-4" />
                      {project.location}
                    </div>
                    <p className="text-lg text-foreground/80 leading-relaxed mb-8 line-clamp-4">{project.description}</p>
                    {project.methods && (
                      <div className="mb-8">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-3">Methods</h3>
                        <div className="flex flex-wrap gap-2">
                          {project.methods.split(',').map(m => m.trim()).filter(Boolean).map(m => (
                            <span key={m} className="text-xs px-3 py-1 rounded-full bg-secondary border border-secondary/80 text-foreground/70">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <Link
                      href={`/research/${entry.id}`}
                      className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors w-fit"
                    >
                      Read more <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
