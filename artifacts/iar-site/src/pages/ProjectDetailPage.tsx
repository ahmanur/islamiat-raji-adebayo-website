import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, ExternalLink, Image, Globe, Building2 } from 'lucide-react';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { Lightbox } from '@/components/Lightbox';
import { slugifyTheme } from '@/pages/ResearchThemePage';

type ProjectItem = {
  status: string;
  title: string;
  location: string;
  description: string;
  methods: string;
  image?: string;
  gallery?: string;
  map_image?: string;
  map_link?: string;
  map_embed?: string;
  collaborators?: string;
  network?: string;
  theme?: string;
};
type ProjectEntry = { id: string; data: ProjectItem };

function extractMapEmbedSrc(embed: string): string | null {
  const trimmed = embed.trim();
  if (trimmed.startsWith('http')) return trimmed;
  const match = trimmed.match(/src=["']([^"']+)["']/);
  return match ? match[1] : null;
}

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
];

interface GalleryEntry { url: string; caption: string }

function parseGallery(raw?: string): GalleryEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(item =>
      typeof item === 'string'
        ? { url: item, caption: '' }
        : { url: String(item.url ?? ''), caption: String(item.caption ?? '') }
    );
  } catch { return []; }
}

interface NetworkData {
  stats: { institutions: number; countries: number; expanding: boolean };
  current_countries: string[];
  previous_countries: string[];
  network_url?: string;
  network_name?: string;
}

function parseNetwork(raw?: string): NetworkData | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NetworkData;
  } catch { return null; }
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [location] = useLocation();
  const isFieldWork = location.startsWith('/field-work');
  const listKey = isFieldWork ? 'field_work_projects' : 'research_projects';

  const defaults = isFieldWork ? LIST_DEFAULTS.field_work_projects : LIST_DEFAULTS.research_projects;

  const [entries, setEntries] = useState<ProjectEntry[]>(
    () => defaults.map((d, i) => ({ id: String(i), data: d as ProjectItem }))
  );
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    setEntries(defaults.map((d, i) => ({ id: String(i), data: d as ProjectItem })));
    setLoaded(false);
    getList(listKey).then(rows => {
      if (rows.length > 0) {
        setEntries(rows.map(r => ({ id: r.id, data: r.data as ProjectItem })));
      }
      setLoaded(true);
    });
  }, [listKey]);

  const entry = entries.find(e => e.id === id);
  const entryIndex = entries.findIndex(e => e.id === id);
  const project = entry?.data;

  const backHref = isFieldWork
    ? '/field-work'
    : project?.theme
      ? `/research/theme/${slugifyTheme(project.theme)}`
      : '/research';
  const backLabel = isFieldWork
    ? 'Back to Field Work'
    : project?.theme
      ? `Back to ${project.theme}`
      : 'Back to Research';

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
        <Link href={backHref} className="text-primary text-sm hover:underline">← {backLabel}</Link>
      </div>
    );
  }

  const imgSrc = project.image || DEFAULT_IMAGES[entryIndex % DEFAULT_IMAGES.length];
  const gallery = parseGallery(project.gallery);
  const network = parseNetwork(project.network);
  const collaborators = (project.collaborators ?? '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  return (
    <>
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
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-10"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
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

              {network && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Globe className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                      {network.network_name ?? 'Partner Network'}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[
                      { value: network.stats.institutions, label: 'Institutions', icon: <Building2 className="w-4 h-4" /> },
                      { value: network.stats.countries, label: 'Countries', icon: <Globe className="w-4 h-4" /> },
                      { value: network.previous_countries.length, label: 'Previous Phase', icon: <MapPin className="w-4 h-4" /> },
                    ].map(stat => (
                      <div key={stat.label} className="rounded-xl bg-secondary/40 border border-secondary/60 p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-primary mb-1">{stat.icon}</div>
                        <div className="font-serif text-3xl font-semibold text-foreground">{stat.value}</div>
                        <div className="text-xs text-foreground/50 mt-0.5">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {network.previous_countries.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-3">Previous Phase Countries</p>
                      <div className="flex flex-wrap gap-2">
                        {network.previous_countries.map(c => (
                          <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-secondary/70 text-foreground/60 text-sm">
                            <MapPin className="w-3 h-3 text-primary/60" /> {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {network.current_countries.length > 0 && (
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-3">Current Network Countries</p>
                      <div className="flex flex-wrap gap-2">
                        {network.current_countries.map(c => (
                          <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-foreground/70 text-sm">
                            <Globe className="w-3 h-3 text-primary" /> {c}
                          </span>
                        ))}
                        {network.stats.expanding && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary border border-dashed border-primary/30 text-foreground/40 text-sm italic">
                            + expanding
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {network.network_url && (
                    <a
                      href={network.network_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View all institutions in the network
                    </a>
                  )}
                </div>
              )}

              {gallery.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Image className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Photo Gallery</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {gallery.map((gEntry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        className="group"
                      >
                        <button
                          onClick={() => setLightboxIndex(i)}
                          className="block w-full aspect-[4/3] rounded-xl overflow-hidden bg-secondary cursor-zoom-in"
                        >
                          <img
                            src={gEntry.url}
                            alt={gEntry.caption || `Photo ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </button>
                        {gEntry.caption && (
                          <p className="mt-2 text-xs text-foreground/50 leading-relaxed px-0.5">
                            {gEntry.caption}
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {(project.map_embed || project.map_image) && (() => {
                const embedSrc = project.map_embed ? extractMapEmbedSrc(project.map_embed) : null;
                return (
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Study Site</h3>
                    </div>
                    <div className="rounded-2xl overflow-hidden border border-secondary/80 shadow-sm">
                      {embedSrc ? (
                        <iframe
                          src={embedSrc}
                          className="w-full h-72"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Study site map"
                        />
                      ) : project.map_link ? (
                        <a href={project.map_link} target="_blank" rel="noopener noreferrer" className="block group relative">
                          <img src={project.map_image} alt="Study site map" className="w-full max-h-80 object-cover" />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-foreground text-xs font-medium px-4 py-2 rounded-full flex items-center gap-2 transition-opacity">
                              <ExternalLink className="w-3.5 h-3.5" /> Open in Maps
                            </span>
                          </div>
                        </a>
                      ) : (
                        <img src={project.map_image} alt="Study site map" className="w-full max-h-80 object-cover" />
                      )}
                    </div>
                    {project.map_link && !embedSrc && (
                      <a href={project.map_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-primary mt-2 transition-colors">
                        <ExternalLink className="w-3 h-3" /> View on Google Maps
                      </a>
                    )}
                  </div>
                );
              })()}

              {collaborators.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Users className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Collaborators</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {collaborators.map((c, i) => {
                      const [name, ...rest] = c.split('—').map(s => s.trim());
                      const institution = rest.join('—').trim();
                      return (
                        <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-secondary/60">
                          <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-primary text-xs font-semibold">{name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{name}</div>
                            {institution && <div className="text-xs text-foreground/50 mt-0.5">{institution}</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {entries.length > 1 && (
                <div className="pt-12 border-t border-secondary">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-6">Other Projects</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {entries.filter(e => e.id !== id).slice(0, 2).map((e, i) => (
                      <Link key={e.id} href={`${backHref}/${e.id}`}>
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

      {lightboxIndex !== null && (
        <Lightbox
          images={gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() => setLightboxIndex(prev => (prev !== null && prev < gallery.length - 1 ? prev + 1 : prev))}
        />
      )}
    </>
  );
}
