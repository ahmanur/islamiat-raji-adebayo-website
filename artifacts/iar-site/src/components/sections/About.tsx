import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.about;
type EducationItem = { degree: string; institution: string };
type AwardItem = { title: string; year: string };
export function About() {
  const [c, setC] = useState(DC);
  const [education, setEducation] = useState<EducationItem[]>(LIST_DEFAULTS.education as EducationItem[]);
  const [awards, setAwards] = useState<AwardItem[]>(LIST_DEFAULTS.awards as AwardItem[]);

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
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/30 relative">
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
  );
}
