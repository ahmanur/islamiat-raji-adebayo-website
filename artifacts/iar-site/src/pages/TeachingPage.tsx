import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, BookOpen } from 'lucide-react';
import { getList, getContent } from '@/lib/cms';
import { LIST_DEFAULTS, CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

type Course = {
  image: string;
  status: string;
  title: string;
  code: string;
  institution: string;
  semester: string;
  role: string;
  description: string;
  syllabus_url: string;
};

type CourseEntry = { id: string; data: Course };

const DEFAULT_IMAGES = [
  '/images/spectrogram-art.png',
  '/images/hero-bird.png',
  '/images/field-fruit.png',
];

function CourseCard({ entry, index }: { entry: CourseEntry; index: number }) {
  const c = entry.data;
  const img = c.image || DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className="flex flex-col md:flex-row gap-0 rounded-2xl overflow-hidden border border-secondary/80 bg-secondary/10 hover:bg-secondary/20 transition-colors group"
    >
      {/* Image */}
      <div className="md:w-72 lg:w-80 flex-shrink-0 aspect-[4/3] md:aspect-auto overflow-hidden">
        <img
          src={img}
          alt={c.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex-1 p-7 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${
            c.status === 'Current'
              ? 'bg-primary/15 text-primary'
              : 'bg-secondary text-foreground/60'
          }`}>
            {c.status}
          </span>
          {c.role && (
            <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">{c.role}</span>
          )}
        </div>

        <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-1 leading-snug">
          {c.title}
          {c.code && <span className="text-foreground/40 font-sans text-lg ml-2">({c.code})</span>}
        </h3>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/55 mb-4">
          {c.institution && <span>{c.institution}</span>}
          {c.semester && <span>· {c.semester}</span>}
        </div>

        {c.description && (
          <p className="text-foreground/70 text-sm leading-relaxed mb-5">{c.description}</p>
        )}

        {c.syllabus_url && (
          <a
            href={c.syllabus_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/70 transition-colors w-fit"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Syllabus
          </a>
        )}
      </div>
    </motion.div>
  );
}

function CourseGroup({ title, entries }: { title: string; entries: CourseEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="mb-20">
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{title}</h2>
        <div className="w-8 h-[2px] bg-primary" />
      </motion.div>
      <div className="flex flex-col gap-8">
        {entries.map((entry, i) => (
          <CourseCard key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </div>
  );
}

export function TeachingPage() {
  const [entries, setEntries] = useState<CourseEntry[]>(
    LIST_DEFAULTS.teaching_courses.map((d, i) => ({ id: String(i), data: d as Course }))
  );
  const [intro, setIntro] = useState('');

  useEffect(() => {
    getList('teaching_courses').then(rows => {
      if (rows.length > 0) setEntries(rows.map(r => ({ id: r.id, data: r.data as Course })));
    });
    getContent('teaching').then(data => {
      if (data.intro) setIntro(data.intro);
    });
  }, []);

  const current = entries.filter(e => e.data.status === 'Current');
  const past = entries.filter(e => e.data.status !== 'Current');

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="max-w-3xl mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">Teaching</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            {intro ? (
              <p className="text-xl text-foreground/75 font-light leading-relaxed">{intro}</p>
            ) : (
              <p className="text-xl text-foreground/75 font-light leading-relaxed">
                I am passionate about creating engaging, inclusive learning environments that connect ecological theory with real-world practice. My teaching spans field ornithology, urban ecology, conservation biology, and bioacoustics.
              </p>
            )}
          </motion.div>

          <CourseGroup title="Current Courses" entries={current} />
          <CourseGroup title="Past Courses" entries={past} />
        </div>
      </section>
    </div>
  );
}
