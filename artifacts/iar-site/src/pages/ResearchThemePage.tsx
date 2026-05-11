import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, ExternalLink, Image as ImageIcon, Globe, Building2 } from 'lucide-react';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { Lightbox } from '@/components/Lightbox';

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
  collaborators?: string;
  network?: string;
  theme?: string;
};
type ProjectEntry = { id: string; data: ProjectItem };
type ThemeItem = { icon: string; title: string; description: string; intro?: string; image?: string };

interface GalleryEntry { url: string; caption: string }
interface NetworkData {
  stats: { institutions: number; countries: number; expanding: boolean };
  current_countries: string[];
  previous_countries: string[];
  network_url?: string;
  network_name?: string;
}

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

function parseNetwork(raw?: string): NetworkData | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as NetworkData; } catch { return null; }
}

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
];

export function slugifyTheme(title: string): string {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function ResearchThemePage() {
  const { slug } = useParams<{ slug: string }>();
  const [themes, setThemes] = useState<ThemeItem[]>(LIST_DEFAULTS.research_themes as ThemeItem[]);
  const [entries, setEntries] = useState<ProjectEntry[]>(
    () => LIST_DEFAULTS.research_projects.map((d, i) => ({ id: String(i), data: d as ProjectItem }))
  );
  const [loaded, setLoaded] = useState(false);
  const [lightbox, setLightbox] = useState<{ images: GalleryEntry[]; index: number } | null>(null);

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
    <>
      <div className="pt-20 min-h-screen">
        {/* Theme hero */}
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

        <div className="container mx-auto px-6 md:px-12 py-12">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Research
          </Link>

          {theme.intro && (
            <div className="max-w-3xl mb-14 pl-5 border-l-2 border-primary/40">
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
            <div className="space-y-0">
              {filteredProjects.map((entry, i) => {
                const project = entry.data;
                const imgSrc = project.image || DEFAULT_IMAGES[i % DEFAULT_IMAGES.length];
                const gallery = parseGallery(project.gallery);
                const network = parseNetwork(project.network);
                const collaborators = (project.collaborators ?? '')
                  .split('\n').map(s => s.trim()).filter(Boolean);

                return (
                  <motion.article
                    key={entry.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6 }}
                    className="rounded-2xl border border-secondary/70 bg-secondary/10 overflow-hidden mb-10"
                  >
                    {/* Project separator header */}
                    <div className="flex items-center gap-4 px-6 py-4 border-b border-secondary/60 bg-secondary/30">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/15 text-primary text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide uppercase">
                        {project.status}
                      </div>
                    </div>

                    {/* Image LEFT + title/location/description RIGHT */}
                    <div className="flex flex-col md:flex-row gap-0">
                      <div className="md:w-2/5 flex-shrink-0">
                        <div className="h-64 md:h-full min-h-[280px] overflow-hidden">
                          <img
                            src={imgSrc}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center space-y-5">
                        <h2 className="font-serif text-2xl md:text-3xl text-foreground leading-tight">
                          {project.title}
                        </h2>
                        {project.location && (
                          <div className="flex items-center gap-2 text-foreground/50 text-sm uppercase tracking-wider font-medium">
                            <MapPin className="w-4 h-4 text-primary" />
                            {project.location}
                          </div>
                        )}
                        <div className="prose prose-base prose-p:text-foreground/80 prose-p:leading-relaxed max-w-none">
                          {project.description.split('\n').filter(Boolean).map((para, pi) => (
                            <p key={pi}>{para}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Remaining details below */}
                    <div className="px-6 md:px-8 pb-8 pt-6 border-t border-secondary/50 space-y-10">

                      {/* Methods */}
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

                      {/* Network */}
                      {network && (
                        <div>
                          <div className="flex items-center gap-2 mb-5">
                            <Globe className="w-4 h-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">
                              {network.network_name ?? 'Partner Network'}
                            </h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            {[
                              { value: network.stats.institutions, label: 'Institutions', icon: <Building2 className="w-4 h-4" /> },
                              { value: network.stats.countries, label: 'Countries', icon: <Globe className="w-4 h-4" /> },
                            ].map(stat => (
                              <div key={stat.label} className="rounded-xl bg-secondary/40 border border-secondary/60 p-4 text-center">
                                <div className="flex items-center justify-center gap-1.5 text-primary mb-1">{stat.icon}</div>
                                <div className="font-serif text-3xl font-semibold text-foreground">{stat.value}</div>
                                <div className="text-xs text-foreground/50 mt-0.5">{stat.label}</div>
                              </div>
                            ))}
                          </div>
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
                            <a href={network.network_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                              <ExternalLink className="w-3.5 h-3.5" />
                              View all institutions in the network
                            </a>
                          )}
                        </div>
                      )}

                      {/* Photo gallery */}
                      {gallery.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-5">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Photo Gallery</h3>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {gallery.map((gEntry, gi) => (
                              <motion.div
                                key={gi}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: gi * 0.06 }}
                                className="group"
                              >
                                <button
                                  onClick={() => setLightbox({ images: gallery, index: gi })}
                                  className="block w-full aspect-[4/3] rounded-xl overflow-hidden bg-secondary cursor-zoom-in"
                                >
                                  <img
                                    src={gEntry.url}
                                    alt={gEntry.caption || `Photo ${gi + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                  />
                                </button>
                                {gEntry.caption && (
                                  <p className="mt-2 text-xs text-foreground/50 leading-relaxed px-0.5">{gEntry.caption}</p>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Map */}
                      {project.map_image && (
                        <div>
                          <div className="flex items-center gap-2 mb-5">
                            <MapPin className="w-4 h-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Study Site</h3>
                          </div>
                          <div className="rounded-2xl overflow-hidden border border-secondary/80 shadow-sm">
                            {project.map_link ? (
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
                          {project.map_link && (
                            <a href={project.map_link} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-foreground/50 hover:text-primary mt-2 transition-colors">
                              <ExternalLink className="w-3 h-3" /> View on Google Maps
                            </a>
                          )}
                        </div>
                      )}

                      {/* Collaborators */}
                      {collaborators.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-5">
                            <Users className="w-4 h-4 text-primary" />
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-foreground/40">Collaborators</h3>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            {collaborators.map((c, ci) => {
                              const [name, ...rest] = c.split('—').map(s => s.trim());
                              const institution = rest.join('—').trim();
                              return (
                                <div key={ci} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-secondary/60">
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
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {lightbox !== null && (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={() => setLightbox(prev => prev && prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev)}
          onNext={() => setLightbox(prev => prev && prev.index < prev.images.length - 1 ? { ...prev, index: prev.index + 1 } : prev)}
        />
      )}
    </>
  );
}
