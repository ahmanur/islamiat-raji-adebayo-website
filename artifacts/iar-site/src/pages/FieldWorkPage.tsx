import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

type GalleryItem = {
  image: string;
  caption: string;
};

type GalleryEntry = { id: string; data: GalleryItem };

export function FieldWorkPage() {
  const [entries, setEntries] = useState<GalleryEntry[]>(
    () => LIST_DEFAULTS.field_work_gallery.map((d, i) => ({ id: String(i), data: d as GalleryItem }))
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    getList('field_work_gallery').then(rows => {
      if (rows.length > 0) {
        setEntries(rows.map(r => ({ id: r.id, data: r.data as GalleryItem })));
      }
    });
  }, []);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i - 1 + entries.length) % entries.length)),
    [entries.length]
  );
  const showNext = useCallback(
    () => setActiveIndex(i => (i === null ? null : (i + 1) % entries.length)),
    [entries.length]
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

  const active = activeIndex !== null ? entries[activeIndex] : null;

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="max-w-3xl mb-14 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Field Work</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed">
              A visual record of fieldwork — from dawn surveys at fruiting trees to acoustic
              monitoring across cities and forest edges. Click any photo to view it larger.
            </p>
          </motion.div>

          {entries.length === 0 ? (
            <p className="text-foreground/50 italic">No field work photos yet.</p>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {entries.map((entry, i) => (
                <motion.button
                  key={entry.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
                  className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-xl border border-secondary/60 bg-secondary/30 text-left shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary/60"
                  aria-label={`Open photo: ${entry.data.caption || 'field work photo'}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={entry.data.image}
                      alt={entry.data.caption || 'Field work photo'}
                      className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />
                  </div>
                  {entry.data.caption && (
                    <div className="px-4 py-3">
                      <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3">
                        {entry.data.caption}
                      </p>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
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

            {entries.length > 1 && (
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
              {active.data.caption && (
                <div className="mt-4 max-w-3xl text-center">
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {active.data.caption}
                  </p>
                  {entries.length > 1 && (
                    <p className="text-white/50 text-xs mt-2">
                      {(activeIndex ?? 0) + 1} / {entries.length}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
