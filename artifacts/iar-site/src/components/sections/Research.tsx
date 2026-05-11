import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';
import { slugifyTheme } from '@/pages/ResearchThemePage';

const DC = CONTENT_DEFAULTS.research;

type ThemeItem = { icon: string; title: string; description: string; image?: string };

export function Research() {
  const [c, setC] = useState(DC);
  const [themes, setThemes] = useState<ThemeItem[]>(LIST_DEFAULTS.research_themes as ThemeItem[]);

  useEffect(() => {
    getContent('research').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('research_themes').then(rows => {
      if (rows.length > 0) setThemes(rows.map(r => r.data as ThemeItem));
    });
  }, []);

  const bgImage = c.bg_image;

  return (
    <section id="research" className="pb-24 md:pb-32">

      {/* Header band — optional background image */}
      <div
        className="relative mb-16 md:mb-20"
        style={bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
      >
        {bgImage && <div className="absolute inset-0 bg-background/55 pointer-events-none" />}
        <div className={`container mx-auto px-6 md:px-12 relative z-10 ${bgImage ? 'py-20 md:py-28' : 'pt-20 md:pt-28'}`}>
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Research</h2>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            <p className="text-xl text-foreground/80 font-light leading-relaxed">{c.intro}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12">

        {/* Theme selector cards — each card links to its dedicated theme page */}
        <p className="text-foreground/60 text-sm mb-6 italic">Click any theme below to view all the research projects under it.</p>
        <div className="flex flex-col gap-5">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.title + i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/research/theme/${slugifyTheme(theme.title)}`}
                className="text-left rounded-2xl overflow-hidden border-2 border-secondary/80 hover:border-primary/50 hover:shadow-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer w-full flex flex-col sm:flex-row group"
              >
                {/* Text — left */}
                <div className="p-6 md:p-8 flex-1 flex flex-col justify-center bg-secondary/30 group-hover:bg-primary/5 transition-colors duration-300">
                  <h3 className="font-serif text-xl md:text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">{theme.title}</h3>
                  <p className="text-foreground/65 text-sm md:text-base leading-relaxed">{theme.description}</p>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-primary text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    <span>View projects</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Image — right */}
                <div className={`relative overflow-hidden shrink-0 w-full sm:w-64 md:w-80 h-48 sm:h-auto ${!theme.image ? 'bg-secondary/50' : ''}`}>
                  {theme.image && (
                    <>
                      <img
                        src={theme.image}
                        alt={theme.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
