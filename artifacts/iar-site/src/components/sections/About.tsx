import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.about;
type EducationItem = { degree: string; institution: string };
type AwardItem = { title: string; year: string };
type AffiliationItem = { name: string };

export function About() {
  const [c, setC] = useState(DC);
  const [education, setEducation] = useState<EducationItem[]>(LIST_DEFAULTS.education as EducationItem[]);
  const [awards, setAwards] = useState<AwardItem[]>(LIST_DEFAULTS.awards as AwardItem[]);
  const [affiliations, setAffiliations] = useState<AffiliationItem[]>(LIST_DEFAULTS.affiliations as AffiliationItem[]);

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
    getList('affiliations').then(rows => {
      if (rows.length > 0) setAffiliations(rows.map(r => r.data as AffiliationItem));
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

              {affiliations.length > 0 && (
                <div className="my-12 p-8 bg-background border border-primary/10 rounded-2xl shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 text-primary/5">
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-2xl text-foreground mt-0 mb-4 relative z-10">Affiliations & Memberships</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 m-0 p-0 list-none relative z-10">
                    {affiliations.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-foreground/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                        {a.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
