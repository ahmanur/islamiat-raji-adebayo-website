import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, HeartHandshake } from 'lucide-react';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.mentorship;
type RoleItem = { title: string; description: string };
type PersonItem = { image: string; name: string; role: string; institution: string; description: string };

const ROLE_ICONS = [Users, BookOpen];

function PersonCard({ person, index }: { person: PersonItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex flex-col items-center text-center group"
    >
      <div className="w-36 h-36 rounded-full overflow-hidden mb-5 border-2 border-secondary/80 group-hover:border-primary/50 transition-colors duration-300 shadow-md bg-secondary/30 flex-shrink-0">
        {person.image ? (
          <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/40">
            <Users className="w-12 h-12" />
          </div>
        )}
      </div>
      <h3 className="font-serif text-lg text-foreground mb-1 leading-snug">{person.name}</h3>
      <p className="text-primary text-xs font-medium uppercase tracking-wider mb-0.5">{person.role}</p>
      {person.institution && (
        <p className="text-foreground/50 text-xs mb-3">{person.institution}</p>
      )}
      {person.description && (
        <p className="text-foreground/65 text-sm leading-relaxed max-w-xs">{person.description}</p>
      )}
    </motion.div>
  );
}

function SubSection({ title, items }: { title: string; items: PersonItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-20">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{title}</h3>
        <div className="w-8 h-[2px] bg-primary" />
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
        {items.map((person, i) => (
          <PersonCard key={person.name + i} person={person} index={i} />
        ))}
      </div>
    </div>
  );
}

export function Mentorship() {
  const [c, setC] = useState(DC);
  const [roles, setRoles] = useState<RoleItem[]>(LIST_DEFAULTS.mentorship_roles as RoleItem[]);
  const [collaborators, setCollaborators] = useState<PersonItem[]>(LIST_DEFAULTS.collaborators as PersonItem[]);
  const [mentees, setMentees] = useState<PersonItem[]>(LIST_DEFAULTS.mentees as PersonItem[]);
  const [funding, setFunding] = useState<PersonItem[]>(LIST_DEFAULTS.funding as PersonItem[]);

  useEffect(() => {
    getContent('mentorship').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
    getList('mentorship_roles').then(rows => {
      if (rows.length > 0) setRoles(rows.map(r => r.data as RoleItem));
    });
    getList('collaborators').then(rows => {
      if (rows.length > 0) setCollaborators(rows.map(r => r.data as PersonItem));
    });
    getList('mentees').then(rows => {
      if (rows.length > 0) setMentees(rows.map(r => r.data as PersonItem));
    });
    getList('funding').then(rows => {
      if (rows.length > 0) setFunding(rows.map(r => r.data as PersonItem));
    });
  }, []);

  return (
    <>
      {/* ── Upper section (untouched) ── */}
      <section id="mentorship" className="py-24 md:py-32 bg-foreground text-background">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl mb-6">People </h2>
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

      {/* ── People sub-sections ── */}
      {(collaborators.length > 0 || mentees.length > 0 || funding.length > 0) && (
        <section className="py-24 md:py-32 bg-background">
          <div className="container mx-auto px-6 md:px-12">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-4">Our People</h2>
              <div className="w-12 h-[2px] bg-primary" />
            </motion.div>

            <SubSection title="Collaborators" items={collaborators} />
            <SubSection title="Mentees" items={mentees} />
            <SubSection title="Funding" items={funding} />
          </div>
        </section>
      )}
    </>
  );
}
