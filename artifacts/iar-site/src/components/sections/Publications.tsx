import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getList, getContent } from '@/lib/cms';
import { LIST_DEFAULTS, CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

type PubItem = { title: string; authors: string; journal: string; year: string; category: string; url: string };

export function Publications() {
  const [pubs, setPubs] = useState<PubItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [scholarUrl, setScholarUrl] = useState(CONTENT_DEFAULTS.outreach.google_scholar || '');
  const [bannerImage, setBannerImage] = useState('');

  useEffect(() => {
    Promise.all([
      getList('publications').then(rows => { setPubs(rows.map(r => r.data as PubItem)); }),
      getContent('outreach').then(data => { if (data.google_scholar) setScholarUrl(data.google_scholar); }),
      getContent('publications').then(data => { if (data.banner_image) setBannerImage(data.banner_image); }),
    ]).finally(() => setLoading(false));
  }, []);

  const byCategory = pubs.reduce<Record<string, PubItem[]>>((acc, p) => {
    const cat = p.category || 'Journal Article';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  if (loading) return null;

  const categories = Object.keys(byCategory);

  return (
    <section id="publications" className="py-24 md:py-32 bg-background relative border-t border-border/50">
      {bannerImage && (
        <div className="relative h-48 md:h-64 mb-16 overflow-hidden">
          <img src={bannerImage} alt="Publications banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>
      )}
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Publications</h2>
            <div className="w-12 h-[2px] bg-primary"></div>
          </div>
          {scholarUrl && (
            <Button variant="outline" className="gap-2 shrink-0 rounded-full" asChild>
              <a href={scholarUrl} target="_blank" rel="noopener noreferrer">
                View Google Scholar
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </motion.div>

        <div className="max-w-4xl space-y-16">
          {categories.map(cat => (
            <div key={cat}>
              {categories.length > 1 && (
                <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/50 mb-6 pb-2 border-b border-border/50">{cat}s</h3>
              )}
              <ul className="space-y-8">
                {byCategory[cat].map((pub, i) => (
                  <motion.li
                    key={i}
                    className="group border-b border-border/50 pb-8 last:border-0"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                      <div className="text-primary font-medium w-16 shrink-0 pt-1">{pub.year}</div>
                      <div className="flex-1">
                        <h3 className="text-lg md:text-xl font-medium text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                          {pub.title}
                        </h3>
                        <p className="text-foreground/70 mb-3 font-light">{pub.authors}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <span className="italic text-foreground/90">{pub.journal}</span>
                          {pub.url && pub.url !== '#' && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                              View Article <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
