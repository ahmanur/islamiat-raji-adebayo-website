import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, PenLine, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.outreach_page;

type EngagementItem = {
  image?: string;
  title: string;
  date: string;
  venue: string;
  description: string;
  url?: string;
};

type WritingItem = {
  image?: string;
  title: string;
  publication: string;
  date: string;
  description: string;
  url?: string;
};

function EngagementCard({ item, index }: { item: EngagementItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8 border-b border-secondary/60 last:border-0"
    >
      <div className="w-full md:w-[200px] aspect-[4/3] overflow-hidden rounded-lg border border-secondary/60 bg-secondary/30">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30">
            <Mic className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground text-lg leading-snug mb-2">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-foreground/60 text-sm mb-3">
          {item.date && (
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{item.date}</span>
          )}
          {item.venue && (
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{item.venue}</span>
          )}
        </div>
        {item.description && (
          <p className="text-foreground/70 text-sm leading-relaxed mb-3">{item.description}</p>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/70 text-sm font-medium transition-colors"
          >
            Learn more <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

function WritingCard({ item, index }: { item: WritingItem; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-8 border-b border-secondary/60 last:border-0"
    >
      <div className="w-full md:w-[200px] aspect-[4/3] overflow-hidden rounded-lg border border-secondary/60 bg-secondary/30">
        {item.image ? (
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30">
            <PenLine className="w-10 h-10" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-foreground text-lg leading-snug mb-2">{item.title}</h3>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-foreground/60 text-sm mb-3">
          {item.publication && <span className="italic">{item.publication}</span>}
          {item.date && (
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{item.date}</span>
          )}
        </div>
        {item.description && (
          <p className="text-foreground/70 text-sm leading-relaxed mb-3">{item.description}</p>
        )}
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:text-primary/70 text-sm font-medium transition-colors"
          >
            Read article <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}

export function Outreach() {
  const [c, setC] = useState(DC);
  const [engagement, setEngagement] = useState<EngagementItem[]>(
    LIST_DEFAULTS.outreach_engagement as EngagementItem[]
  );
  const [writing, setWriting] = useState<WritingItem[]>(
    LIST_DEFAULTS.science_writing as WritingItem[]
  );

  useEffect(() => {
    getContent('outreach_page').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('outreach_engagement').then(rows => {
      if (rows.length > 0) setEngagement(rows.map(r => r.data as EngagementItem));
    });
    getList('science_writing').then(rows => {
      if (rows.length > 0) setWriting(rows.map(r => r.data as WritingItem));
    });
  }, []);

  return (
    <>
      {/* Header / intro */}
      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Outreach</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            <p className="text-xl font-serif leading-relaxed text-foreground/85 mb-4">
              {c.intro}
            </p>
            {c.subintro && (
              <p className="text-foreground/70 leading-relaxed">{c.subintro}</p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Public engagement */}
      <section id="public-engagement" className="py-20 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Mic className="w-6 h-6 text-primary" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Public Engagement</h2>
            </div>
            <div className="w-8 h-[2px] bg-primary mb-4" />
            {c.engagement_text && (
              <p className="text-foreground/70 leading-relaxed max-w-2xl">{c.engagement_text}</p>
            )}
          </motion.div>
          {engagement.length === 0 ? (
            <p className="text-foreground/50 italic">No public engagement entries yet.</p>
          ) : (
            <div className="flex flex-col">
              {engagement.map((item, i) => (
                <EngagementCard key={item.title + i} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Science writing */}
      <section id="science-writing" className="py-20 md:py-24 bg-background">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <PenLine className="w-6 h-6 text-primary" />
              <h2 className="font-serif text-3xl md:text-4xl text-foreground">Science Writing</h2>
            </div>
            <div className="w-8 h-[2px] bg-primary mb-4" />
            {c.writing_text && (
              <p className="text-foreground/70 leading-relaxed max-w-2xl">{c.writing_text}</p>
            )}
          </motion.div>
          {writing.length === 0 ? (
            <p className="text-foreground/50 italic">No science writing entries yet.</p>
          ) : (
            <div className="flex flex-col">
              {writing.map((item, i) => (
                <WritingCard key={item.title + i} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
