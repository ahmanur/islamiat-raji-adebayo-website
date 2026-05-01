import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Trees, Globe, Leaf, Heart, Mountain, FlaskConical, Bird, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.research;
type ProjectItem = { status: string; title: string; location: string; description: string; methods: string; image?: string };
type ProjectEntry = { id: string; data: ProjectItem };
type ThemeItem = { icon: string; title: string; description: string };

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
];

const ICON_MAP: Record<string, React.ReactNode> = {
  mic: <Mic className="w-6 h-6" />,
  trees: <Trees className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  leaf: <Leaf className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
  mountain: <Mountain className="w-6 h-6" />,
  flask: <FlaskConical className="w-6 h-6" />,
  bird: <Bird className="w-6 h-6" />,
};

export function Research() {
  const [c, setC] = useState(DC);
  const [entries, setEntries] = useState<ProjectEntry[]>(
    () => LIST_DEFAULTS.research_projects.map((d, i) => ({ id: String(i), data: d as ProjectItem }))
  );
  const [themes, setThemes] = useState<ThemeItem[]>(LIST_DEFAULTS.research_themes as ThemeItem[]);

  useEffect(() => {
    getContent('research').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('research_projects').then(rows => {
      if (rows.length > 0) setEntries(rows.map(r => ({ id: r.id, data: r.data as ProjectItem })));
    });
    getList('research_themes').then(rows => {
      if (rows.length > 0) setThemes(rows.map(r => r.data as ThemeItem));
    });
  }, []);

  return (
    <section id="research" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="max-w-3xl mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Research</h2>
          <div className="w-12 h-[2px] bg-primary mb-8"></div>
          <p className="text-xl text-foreground/80 font-light leading-relaxed">{c.intro}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-secondary/50 border border-secondary/80 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-6 shadow-sm">
                {ICON_MAP[theme.icon] ?? <Mic className="w-6 h-6" />}
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-4">{theme.title}</h3>
              <p className="text-foreground/70 leading-relaxed">{theme.description}</p>
            </motion.div>
          ))}
        </div>

        <span id="fieldwork" className="sr-only" aria-hidden="true" />
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
                viewport={{ once: true, margin: "-100px" }}
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
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"></div>
                  </div>
                </Link>

                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-6 uppercase w-fit">
                    {project.status}
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{project.title}</h3>
                  <div className="flex items-center gap-2 text-foreground/60 text-sm mb-6 uppercase tracking-wider font-medium">
                    <MapPinIcon className="w-4 h-4" />
                    {project.location}
                  </div>
                  <p className="text-lg text-foreground/80 leading-relaxed mb-8 line-clamp-4">{project.description}</p>
                  {project.methods && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.methods.split(',').map(m => m.trim()).filter(Boolean).map(m => (
                        <span key={m} className="px-3 py-1 rounded-full bg-secondary text-foreground/70 text-xs font-medium">{m}</span>
                      ))}
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
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
