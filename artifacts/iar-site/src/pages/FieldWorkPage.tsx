import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.field_work_page;

type GalleryItem = {
  region: string;
  image: string;
  caption: string;
};

type RegionItem = {
  title: string;
  description: string;
};

type GalleryEntry = { id: string; data: GalleryItem };
type RegionEntry = { id: string; data: RegionItem };

export function FieldWorkPage() {
  const [c, setC] = useState(DC);
  const [regions, setRegions] = useState<RegionEntry[]>(
    () => LIST_DEFAULTS.field_work_regions.map((d, i) => ({ id: 'r' + i, data: d as RegionItem }))
  );
  const [photos, setPhotos] = useState<GalleryEntry[]>(
    () => LIST_DEFAULTS.field_work_gallery.map((d, i) => ({ id: 'p' + i, data: d as GalleryItem }))
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    getContent('field_work_page').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('field_work_regions').then(rows => {
      if (rows.length > 0) setRegions(rows.map(r => ({ id: r.id, data: r.data as RegionItem })));
    });
    getList('field_work_gallery').then(rows => {
      if (rows.length > 0) setPhotos(rows.map(r => ({ id: r.id, data: r.data as GalleryItem })));
    });
  }, []);

  // Build the flat ordered list of photos used for the lightbox (matches render order).
  const orderedPhotos = useMemo(() => {
    const grouped: GalleryEntry[] = [];
    const seenRegions = new Set<string>();
    regions.forEach(r => {
      seenRegions.add(r.data.title);
      photos.filter(p => p.data.region === r.data.title).forEach(p => grouped.push(p));
    });
    // Photos whose region doesn't match any region row — show under "Other" at the end.
    photos.filter(p => !seenRegions.has(p.data.region)).forEach(p => grouped.push(p));
    return grouped;
  }, [regions, photos]);

  const otherPhotos = useMemo(
    () => photos.filter(p => !regions.some(r => r.data.title === p.data.region)),
    [regions, photos]
  );

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i - 1 + orderedPhotos.length) % orderedPhotos.length)),
    [orderedPhotos.length]
  );
  const showNext = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i + 1) % orderedPhotos.length)),
    [orderedPhotos.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
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
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  const active = activeIndex !== null ? orderedPhotos[activeIndex] : null;

  // Helper to find index of a photo entry in orderedPhotos
  const indexOf = (entry: GalleryEntry) => orderedPhotos.findIndex(p => p.id === entry.id);

  const renderRegionPhotos = (regionTitle: string) => {
    const items = photos.filter(p => p.data.region === regionTitle);
    if (items.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {items.map((entry) => (
          <button
            key={entry.id}
            type="button"
            onClick={() => setActiveIndex(indexOf(entry))}
            className="group block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-lg overflow-hidden"
            aria-label={`Open photo: ${entry.data.caption || 'field work photo'}`}
          >
            <div className="overflow-hidden rounded-lg bg-secondary/30 border border-secondary/60">
              <img
                src={entry.data.image}
                alt={entry.data.caption || 'Field work photo'}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            {entry.data.caption && (
              <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                {entry.data.caption}
              </p>
            )}
          </button>
        ))}
      </div>
    );
  };

  const bgImage = c.bg_image;

  return (
    <div className="pt-20 min-h-screen">
      {/* Header band — optional background image, otherwise plain title + intro */}
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

      {/* Regions */}
      <section className="pt-12 md:pt-16 pb-16 md:pb-24 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl space-y-20 md:space-y-24">
          {regions.length === 0 && otherPhotos.length === 0 ? (
            <p className="text-foreground/50 italic text-center">No field work photos yet.</p>
          ) : (
            <>
              {regions.map((region, i) => (
                <motion.div
                  key={region.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55, delay: i === 0 ? 0 : 0.05 }}
                >
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">
                    {region.data.title}
                  </h2>
                  {region.data.description && (
                    <p className="text-foreground/75 text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
                      {region.data.description}
                    </p>
                  )}
                  {renderRegionPhotos(region.data.title)}
                </motion.div>
              ))}

              {otherPhotos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.55 }}
                >
                  <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-8">
                    More from the Field
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {otherPhotos.map(entry => (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setActiveIndex(indexOf(entry))}
                        className="group block w-full text-left focus:outline-none focus:ring-2 focus:ring-primary/60 rounded-lg overflow-hidden"
                      >
                        <div className="overflow-hidden rounded-lg bg-secondary/30 border border-secondary/60">
                          <img
                            src={entry.data.image}
                            alt={entry.data.caption || 'Field work photo'}
                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                            loading="lazy"
                          />
                        </div>
                        {entry.data.caption && (
                          <p className="mt-3 text-sm text-foreground/70 leading-relaxed">
                            {entry.data.caption}
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {active && (
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

            {orderedPhotos.length > 1 && (
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
              key={active.id}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-6xl w-full max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={active.data.image}
                alt={active.data.caption || 'Field work photo'}
                className="max-w-full max-h-[78vh] object-contain rounded-lg shadow-2xl"
              />
              <div className="mt-4 max-w-3xl text-center">
                {active.data.region && (
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                    {active.data.region}
                  </p>
                )}
                {active.data.caption && (
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {active.data.caption}
                  </p>
                )}
                {orderedPhotos.length > 1 && (
                  <p className="text-white/50 text-xs mt-2">
                    {(activeIndex ?? 0) + 1} / {orderedPhotos.length}
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
