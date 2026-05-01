import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin } from 'lucide-react';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

type ProjectItem = { status: string; title: string; location: string; description: string; methods: string; image?: string };
type ProjectEntry = { id: string; data: ProjectItem };

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
];

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [entries, setEntries] = useState<ProjectEntry[]>(
    () => LIST_DEFAULTS.research_projects.map((d, i) => ({ id: String(i), data: d as ProjectItem }))
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getList('research_projects').then(rows => {
      if (rows.length > 0) {
        setEntries(rows.map(r => ({ id: r.id, data: r.data as ProjectItem })));
      }
      setLoaded(true);
    });
  }, []);

  const entry = entries.find(e => e.id === id);
  const entryIndex = entries.findIndex(e => e.id === id);
  const project = entry?.data;

  if (!loaded) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-foreground/40 text-sm">Loading…</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center gap-6">
        <p className="text-foreground/60">Project not found.</p>
        <Link href="/research" className="text-primary text-sm hover:underline">← Back to Research</Link>
      </div>
    );
  }

  const imgSrc = project.image || DEFAULT_IMAGES[entryIndex % DEFAULT_IMAGES.length];

  return (
    <div className="pt-20 min-h-screen">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <img
          src={imgSrc}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/80 text-white text-xs font-medium tracking-wide mb-4 uppercase">
              {project.status}
            </div>
            <h1 className="font-serif text-3xl md:text-5xl text-white leading-tight max-w-3xl">
              {project.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16">
        <div className="max-w-3xl">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-2 text-foreground/50 text-sm uppercase tracking-wider font-medium">
              <MapPin className="w-4 h-4 text-primary" />
              {project.location}
            </div>

            <div className="prose prose-lg prose-headings:font-serif prose-p:text-foreground/80 prose-p:leading-relaxed max-w-none">
              {project.description.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {project.methods && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-4">Methods</h3>
                <div className="flex flex-wrap gap-2">
                  {project.methods.split(',').map(m => m.trim()).filter(Boolean).map(m => (
                    <span key={m} className="px-4 py-1.5 rounded-full bg-secondary border border-secondary/80 text-foreground/70 text-sm font-medium">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {entries.length > 1 && (
              <div className="pt-12 border-t border-secondary">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-6">Other Projects</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {entries.filter(e => e.id !== id).slice(0, 2).map((e, i) => (
                    <Link key={e.id} href={`/research/${e.id}`}>
                      <div className="group flex gap-4 p-4 rounded-xl border border-secondary/80 hover:bg-secondary/40 transition-colors cursor-pointer">
                        <img
                          src={e.data.image || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length]}
                          alt={e.data.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs text-primary uppercase tracking-wide font-medium mb-1">{e.data.status}</div>
                          <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">{e.data.title}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
