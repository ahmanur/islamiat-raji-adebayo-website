import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getList } from '@/lib/cms';
import { LIST_DEFAULTS } from '@/lib/cmsDefaults';

type NewsItem = { date: string; title: string; description: string; image?: string };

export function News() {
  const [news, setNews] = useState<NewsItem[]>(LIST_DEFAULTS.news_items as NewsItem[]);

  useEffect(() => {
    getList('news_items').then(rows => {
      if (rows.length > 0) setNews(rows.map(r => r.data as NewsItem));
    });
  }, []);

  return (
    <section id="news" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">News & Updates</h2>
          <div className="w-12 h-[2px] bg-primary"></div>
        </motion.div>

        <div className="max-w-3xl">
          <div className="relative border-l border-primary/20 ml-3 md:ml-0 pl-8 md:pl-12 space-y-12 py-4">
            {news.map((item, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 rounded-full bg-secondary border-2 border-primary"></div>
                <span className="inline-block text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                  {item.date}
                </span>
                <h3 className="text-xl font-medium text-foreground mb-3 leading-snug">{item.title}</h3>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="mb-4 rounded-lg w-full max-w-md object-cover border border-border/40"
                  />
                )}
                <p className="text-foreground/70 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
