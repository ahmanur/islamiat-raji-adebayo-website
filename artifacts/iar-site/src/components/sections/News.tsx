import React from 'react';
import { motion } from 'framer-motion';

export function News() {
  const news = [
    {
      date: "2025",
      title: "Joined Cornell Lab as Rose Postdoctoral Fellow",
      description: "Excited to begin my fellowship at the K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology, advancing interdisciplinary research on urban bird diversity and soundscapes."
    },
    {
      date: "2024",
      title: "Multi-country urban bird monitoring project complete",
      description: "Wrapped up the global urban bird survey project across five countries — Brazil, Canada, France, Kenya, and Senegal — at Queen's University, with data analysis and manuscript preparation now underway."
    },
    {
      date: "2024",
      title: "Fieldwork season completed in South Africa",
      description: "Concluded field data collection on frugivory and seed dispersal networks by birds, bats, and monkeys in urban mosaic landscapes, focusing on the ecological role of Ficus species."
    },
    {
      date: "2021",
      title: "PhD conferred — University of KwaZulu-Natal",
      description: "Completed doctoral research in Ecological Sciences, focusing on plant–animal interactions and seed dispersal in fragmented urban landscapes in South Africa."
    }
  ];

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
                {/* Timeline dot */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 rounded-full bg-secondary border-2 border-primary"></div>
                
                <span className="inline-block text-sm font-medium text-primary mb-2 uppercase tracking-wider">
                  {item.date}
                </span>
                <h3 className="text-xl font-medium text-foreground mb-3 leading-snug">
                  {item.title}
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
