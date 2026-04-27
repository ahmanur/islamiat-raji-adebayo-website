import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Publications() {
  const publications = [
    {
      title: "Urban soundscapes reveal complex patterns of avian community composition across a socioeconomic gradient",
      authors: "Raji-Adebayo, I., Smith, J.T., & Doe, E.",
      journal: "Landscape and Urban Planning",
      year: 2024,
      doi: "#"
    },
    {
      title: "Frugivory and seed dispersal networks in fragmented urban green spaces: implications for forest regeneration",
      authors: "Raji-Adebayo, I., Ndlovu, M., & Downs, C.T.",
      journal: "Oecologia",
      year: 2022,
      doi: "#"
    },
    {
      title: "Acoustic indices as proxies for biodiversity in rapidly urbanizing African cities",
      authors: "Raji-Adebayo, I., & Adeyanju, T.E.",
      journal: "Ecological Indicators",
      year: 2021,
      doi: "#"
    },
    {
      title: "Avian responses to noise pollution: evidence from a multi-city comparative study",
      authors: "Smith, J.T., Raji-Adebayo, I., & Johnson, R.",
      journal: "Global Ecology and Conservation",
      year: 2020,
      doi: "#"
    }
  ];

  return (
    <section id="publications" className="py-24 md:py-32 bg-background relative border-t border-border/50">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Selected Publications</h2>
            <div className="w-12 h-[2px] bg-primary"></div>
          </div>
          
          <Button variant="outline" className="gap-2 shrink-0 rounded-full" asChild>
            <a href="#" aria-label="Google Scholar profile placeholder">
              View Google Scholar
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </motion.div>

        <div className="max-w-4xl">
          <ul className="space-y-8">
            {publications.map((pub, i) => (
              <motion.li 
                key={i}
                className="group border-b border-border/50 pb-8 last:border-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                  <div className="text-primary font-medium w-16 shrink-0 pt-1">
                    {pub.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-medium text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                      {pub.title}
                    </h3>
                    <p className="text-foreground/70 mb-3 font-light">
                      {pub.authors}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="italic text-foreground/90">{pub.journal}</span>
                      <a 
                        href={pub.doi} 
                        className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                        aria-label={`View placeholder publication link for ${pub.title}`}
                      >
                        View Article <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
