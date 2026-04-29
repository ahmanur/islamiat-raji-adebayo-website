import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, HeartHandshake } from 'lucide-react';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.mentorship;
type RoleItem = { title: string; description: string };

const ROLE_ICONS = [Users, BookOpen];

export function Mentorship() {
  const [c, setC] = useState(DC);
  const [roles, setRoles] = useState<RoleItem[]>(LIST_DEFAULTS.mentorship_roles as RoleItem[]);

  useEffect(() => {
    getContent('mentorship').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('mentorship_roles').then(rows => {
      if (rows.length > 0) setRoles(rows.map(r => r.data as RoleItem));
    });
  }, []);

  return (
    <section id="mentorship" className="py-24 md:py-32 bg-foreground text-background">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl mb-6">People & Mentorship</h2>
            <div className="w-12 h-[2px] bg-primary mb-8"></div>

            <div className="prose prose-lg prose-p:text-background/80 prose-p:leading-relaxed max-w-none mb-10">
              <p className="text-xl font-serif leading-relaxed text-background/90">{c.intro}</p>
              {c.para2 && <p>{c.para2}</p>}
            </div>

            {roles.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-6">
                {roles.map((role, i) => {
                  const Icon = ROLE_ICONS[i % ROLE_ICONS.length];
                  return (
                    <div key={i} className="p-6 rounded-xl bg-background/5 border border-background/10">
                      <Icon className="w-6 h-6 text-primary mb-4" />
                      <h3 className="text-lg font-medium mb-2">{role.title}</h3>
                      <p className="text-background/60 text-sm">{role.description}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <img
                src="/images/spectrogram-art.png"
                alt="Abstract spectrogram art representing diverse voices in science"
                className="w-full h-full object-cover opacity-80 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="backdrop-blur-md bg-background/10 p-6 rounded-xl border border-background/20">
                  <HeartHandshake className="w-8 h-8 text-primary mb-4" />
                  <p className="font-serif text-xl italic text-background/90 leading-snug">
                    "{c.quote}"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
