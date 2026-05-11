import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, MapPin } from 'lucide-react';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

type ProjectItem = {
  status: string;
  title: string;
  location: string;
  description: string;
  methods: string;
  image?: string;
  theme?: string;
};
type ProjectEntry = { id: string; data: ProjectItem };
type ThemeItem = { icon: string; title: string; description: string; intro?: string; image?: string };

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
];

export function slugifyTheme(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ResearchThemePage() {
  const { slug } = useParams<{ slug: string }>();
  const [themes, setThemes] = useState<ThemeItem[]>(LIST_DEFAULTS.research_themes as ThemeItem[]);
  const [entries, setEntries] = useState<ProjectEntry[]>(
    () => LIST_DEFAULTS.research_projects.map((d, i) => ({ id: String(i), data: d as ProjectItem }))
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getList('research_themes').then(rows => {
        if (rows.length > 0) setThemes(rows.map(r => r.data as ThemeItem));
      }),
      getList('research_projects').then(rows => {
        if (rows.length > 0) setEntries(rows.map(r => ({ id: r.id, data: r.data as ProjectItem })));
      }),
    ]).finally(() => setLoaded(true));
  }, []);

  const theme = themes.find(t => slugifyTheme(t.title) === slug);

  if (!loaded) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-foreground/40 text-sm">Loading…</div>
      </div>
    );
  }

  if (!theme) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-foreground/60">Research theme not found.</p>
        <Link href="/research" className="text-primary text-sm hover:underline">← Back to Research</Link>
      </div>
    );
  }

  const filteredProjects = entries.filter(
    e => e.data.theme?.trim().toLowerCase() === theme.title.trim().toLowerCase()
  );

  return (
    <div className="pt-20 min-h-screen">
      {/* Header band */}
      <div className="relative h-[42vh] md:h-[50vh] overflow-hidden">
        {theme.image ? (
          <>
            <img src={theme.image} alt={theme.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/40 to-secondary/80" />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <p className={`text-xs font-medium tracking-widest uppercase mb-3 ${theme.image ? 'text-white/80' : 'text-primary'}`}>
              Research Theme
            </p>
            <h1 className={`font-serif text-3xl md:text-5xl leading-tight max-w-3xl ${theme.image ? 'text-white' : 'text-foreground'}`}>
              {theme.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Research
        </Link>

        {theme.intro && (
          <div className="max-w-3xl mb-16 pl-5 border-l-2 border-primary/40">
            <p className="text-base md:text-lg text-foreground/80 leading-relaxed">{theme.intro}</p>
          </div>
        )}

        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-secondary rounded-2xl">
            <p className="text-foreground/40 text-base">
              No projects listed under <span className="text-foreground/60 font-medium">{theme.title}</span> yet.
            </p>
            <p className="text-foreground/30 text-sm mt-1">Assign a project to this theme in the admin panel.</p>
          </div>
        ) : (
          <div className="space-y-24">
            {filteredProjects.map((entry, i) => {
              const project = entry.data;
              const imgSrc = project.image || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length];
              return (
                <motion.div
                  key={entry.id}
                  className="flex flex-col gap-12 items-center lg:flex-row"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-6 uppercase w-fit">
                      {project.status}
                    </div>
                    <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{project.title}</h3>
                    <div className="flex items-center gap-2 text-foreground/60 text-sm mb-6 uppercase tracking-wider font-medium">
                      <MapPin className="w-4 h-4" />
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

                  <Link href={`/research/${entry.id}`} className="w-full lg:w-1/2 block group cursor-pointer order-1 lg:order-2">
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
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
