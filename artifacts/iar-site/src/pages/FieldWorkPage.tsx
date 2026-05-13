import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Video, Music } from 'lucide-react';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.field_work_page;

type Photo = { image: string; caption: string };

type FieldworkEntry = {
  region: string;
  caption: string;
  photos: Photo[];
  video_url?: string;
  audio_url?: string;
};

function getVideoEmbed(url: string): string | null {
  if (!url?.trim()) return null;
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vi = url.match(/vimeo\.com\/(\d+)/);
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`;
  return null;
}

type EntryRecord = { id: string; data: FieldworkEntry };

type LightboxRef = { entryId: string; photoIndex: number };

export function FieldWorkPage() {
  const [c, setC] = useState(DC);
  const [entries, setEntries] = useState<EntryRecord[]>(
    () => LIST_DEFAULTS.field_work_entries.map((d, i) => ({ id: 'e' + i, data: d as FieldworkEntry }))
  );
  const [active, setActive] = useState<LightboxRef | null>(null);

  useEffect(() => {
    getContent('field_work_page').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('field_work_entries').then(rows => {
      if (rows.length > 0) {
        setEntries(rows.map(r => ({
          id: r.id,
          data: {
            region: (r.data?.region as string) ?? '',
            caption: (r.data?.caption as string) ?? '',
            photos: Array.isArray(r.data?.photos) ? (r.data.photos as Photo[]) : [],
            video_url: (r.data?.video_url as string) ?? '',
            audio_url: (r.data?.audio_url as string) ?? '',
          },
        })));
      }
    });
  }, []);

  // Flat ordered photo list across all entries (for lightbox prev/next).
  const allPhotos = useMemo(() => {
    const out: Array<{ entryId: string; photoIndex: number; photo: Photo; region: string }> = [];
    entries.forEach(e => {
      e.data.photos.forEach((p, i) => {
        out.push({ entryId: e.id, photoIndex: i, photo: p, region: e.data.region });
      });
    });
    return out;
  }, [entries]);

  const activeFlatIndex = useMemo(() => {
    if (!active) return -1;
    return allPhotos.findIndex(p => p.entryId === active.entryId && p.photoIndex === active.photoIndex);
  }, [active, allPhotos]);

  const closeLightbox = useCallback(() => setActive(null), []);
  const showPrev = useCallback(() => {
    if (allPhotos.length === 0) return;
    setActive(curr => {
      if (!curr) return curr;
      const idx = allPhotos.findIndex(p => p.entryId === curr.entryId && p.photoIndex === curr.photoIndex);
      const next = (idx - 1 + allPhotos.length) % allPhotos.length;
      const ref = allPhotos[next];
      return { entryId: ref.entryId, photoIndex: ref.photoIndex };
    });
  }, [allPhotos]);
  const showNext = useCallback(() => {
    if (allPhotos.length === 0) return;
    setActive(curr => {
      if (!curr) return curr;
      const idx = allPhotos.findIndex(p => p.entryId === curr.entryId && p.photoIndex === curr.photoIndex);
      const next = (idx + 1) % allPhotos.length;
      const ref = allPhotos[next];
      return { entryId: ref.entryId, photoIndex: ref.photoIndex };
    });
  }, [allPhotos]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [active, closeLightbox, showPrev, showNext]);

  const activePhoto = activeFlatIndex >= 0 ? allPhotos[activeFlatIndex] : null;

  const bgImage = c.bg_image;

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div
        className="relative"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {bgImage && <div className="absolute inset-0 bg-background/65 pointer-events-none" aria-hidden="true" />}
        <div className={`container mx-auto px-6 md:px-12 relative z-10 ${bgImage ? 'py-20 md:py-28' : 'pt-12 md:pt-16 pb-4'}`}>
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Field Work</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            {c.intro && (
              <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
                {c.intro}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Fieldwork entries */}
      <section className="pt-12 md:pt-16 pb-16 md:pb-24 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-20 md:space-y-24">
          {entries.length === 0 ? (
            <p className="text-foreground/50 italic text-center">No fieldwork entries yet.</p>
          ) : (
            entries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.55, delay: i === 0 ? 0 : 0.05 }}
              >
                {entry.data.region && (
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
                    {entry.data.region}
                  </h2>
                )}
                {entry.data.caption && (
                  <p className="text-foreground/75 text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
                    {entry.data.caption}
                  </p>
                )}

                {/* Video embed */}
                {entry.data.video_url?.trim() && (() => {
                  const embedUrl = getVideoEmbed(entry.data.video_url!);
                  return embedUrl ? (
                    <div className="mb-8 max-w-3xl">
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                        <Video className="w-3.5 h-3.5" />
                        <span>Video</span>
                      </div>
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-secondary/60 shadow-sm">
                        <iframe
                          src={embedUrl}
                          title="Fieldwork video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mb-8">
                      <a href={entry.data.video_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                        <Video className="w-4 h-4" />
                        Watch video
                      </a>
                    </div>
                  );
                })()}

                {/* Audio player */}
                {entry.data.audio_url?.trim() && (
                  <div className="mb-8 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground/50 uppercase tracking-wider mb-3">
                      <Music className="w-3.5 h-3.5" />
                      <span>Bird Sound Recording</span>
                    </div>
                    <audio
                      controls
                      src={entry.data.audio_url}
                      className="w-full rounded-lg"
                      preload="metadata"
                    />
                  </div>
                )}

                {entry.data.photos.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {entry.data.photos.map((photo, pi) => (
                      <button
                        key={pi}
                        type="button"
                        onClick={() => setActive({ entryId: entry.id, photoIndex: pi })}
                        className="group block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-lg overflow-hidden"
                        aria-label={`Open photo: ${photo.caption || 'field work photo'}`}
                      >
                        <div className="overflow-hidden rounded-lg bg-secondary/30 border border-secondary/60 aspect-[4/3]">
                          <img
                            src={photo.image}
                            alt={photo.caption || 'Field work photo'}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                        {photo.caption && (
                          <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                            {photo.caption}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
            aria-label="Photo viewer"
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close"
              className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {allPhotos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  aria-label="Previous photo"
                  className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  aria-label="Next photo"
                  className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            <motion.div
              key={`${activePhoto.entryId}-${activePhoto.photoIndex}`}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-6xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={activePhoto.photo.image}
                alt={activePhoto.photo.caption || 'Field work photo'}
                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 max-w-3xl text-center">
                {activePhoto.region && (
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                    {activePhoto.region}
                  </p>
                )}
                {activePhoto.photo.caption && (
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {activePhoto.photo.caption}
                  </p>
                )}
                {allPhotos.length > 1 && (
                  <p className="text-white/50 text-xs mt-2">
                    {activeFlatIndex + 1} / {allPhotos.length}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
