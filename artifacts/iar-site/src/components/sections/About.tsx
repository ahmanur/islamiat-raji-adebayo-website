import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { Lightbox } from '@/components/Lightbox';

const DC = CONTENT_DEFAULTS.about;
type EducationItem = { degree: string; institution: string };
type AwardItem = { title: string; year: string };
type GalleryItem = { image: string; caption?: string };

export function About() {
  const [c, setC] = useState(DC);
  const [education, setEducation] = useState<EducationItem[]>(LIST_DEFAULTS.education as EducationItem[]);
  const [awards, setAwards] = useState<AwardItem[]>(LIST_DEFAULTS.awards as AwardItem[]);
  const [gallery, setGallery] = useState<GalleryItem[]>(LIST_DEFAULTS.about_gallery as GalleryItem[]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    getContent('about').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('education').then(rows => {
      if (rows.length > 0) setEducation(rows.map(r => r.data as EducationItem));
    });
    getList('awards').then(rows => {
      if (rows.length > 0) setAwards(rows.map(r => r.data as AwardItem));
    });
    getList('about_gallery').then(rows => {
      if (rows.length > 0) {
        setGallery(rows.map(r => r.data as GalleryItem).filter(g => g.image));
      }
    });
  }, []);

  const lightboxImages = gallery.map(g => ({ url: g.image, caption: g.caption ?? '' }));

  return (
    <>
      <section id="about" className="pt-24 md:pt-32 pb-12 md:pb-16 bg-secondary/30 relative">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="sticky top-32"
              >
                <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">About</h2>
                <div className="w-12 h-[2px] bg-primary mb-8"></div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Education</h3>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      {education.map((e, i) => (
                        <li key={i} className="pl-3 border-l-2 border-primary/30">
                          <strong>{e.degree}</strong><br />
                          <span className="text-foreground/60">{e.institution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Awards & Honours</h3>
                    <ul className="space-y-3 text-sm text-foreground/80">
                      {awards.map((a, i) => (
                        <li key={i} className="pl-3 border-l-2 border-primary/30">
                          <strong>{a.title}</strong>
                          {a.year && <><br /><span className="text-foreground/60">{a.year}</span></>}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="prose prose-lg prose-headings:font-serif prose-p:text-foreground/80 prose-p:leading-relaxed max-w-none"
              >
                <p className="text-xl md:text-2xl text-foreground font-serif leading-relaxed mb-8">
                  {c.tagline}
                </p>
                <p>{c.para1}</p>
                <p>{c.para2}</p>
                <p dangerouslySetInnerHTML={{ __html: c.para3.replace(/Ficus/g, '<em>Ficus</em>') }} />
                <p>{c.para4}</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section id="about-gallery" className="pt-12 md:pt-16 pb-20 md:pb-28 bg-background">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mb-12"
            >
              <p className="text-xs font-semibold text-primary tracking-[0.2em] uppercase mb-3">Gallery</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">In the Field & Beyond</h2>
              <div className="w-12 h-[2px] bg-primary" />
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {gallery.map((g, i) => (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
                  className="group relative aspect-square overflow-hidden rounded-xl bg-secondary/40 cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <img
                    src={g.image}
                    alt={g.caption || `Photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-xl pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {g.caption && (
                      <p className="text-white text-xs leading-snug line-clamp-2">{g.caption}</p>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(prev => (prev !== null && prev > 0 ? prev - 1 : prev))}
          onNext={() => setLightboxIndex(prev => (prev !== null && prev < lightboxImages.length - 1 ? prev + 1 : prev))}
        />
      )}
    </>
  );
}
