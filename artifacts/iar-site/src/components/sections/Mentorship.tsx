import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, HeartHandshake, Mail, ExternalLink } from 'lucide-react';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.mentorship;
type RoleItem = { title: string; description: string };
type PersonItem = {
  image: string;
  name: string;
  role: string;
  institution: string;
  description: string;
  email: string;
  links: string; // "Label|URL, Label|URL, ..."
};

const ROLE_ICONS = [Users, BookOpen];

function parseLinks(raw: string): { label: string; url: string }[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .map(pair => {
      const idx = pair.indexOf('|');
      if (idx === -1) return null;
      return { label: pair.slice(0, idx).trim(), url: pair.slice(idx + 1).trim() };
    })
    .filter(Boolean) as { label: string; url: string }[];
}

function PersonCard({ person, index }: { person: PersonItem; index: number }) {
  const links = parseLinks(person.links);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="flex gap-7 items-start py-8 border-b border-secondary/60 last:border-0"
    >
      {/* Photo */}
      <div className="w-52 h-52 flex-shrink-0 overflow-hidden rounded-lg border border-secondary/60 bg-secondary/30 shadow-sm">
        {person.image ? (
          <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary/30">
            <Users className="w-10 h-10" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-base leading-snug mb-0.5">
          {person.name}
          {person.role && <span className="font-normal text-foreground/80"> – {person.role}</span>}
        </h3>
        {person.institution && (
          <p className="text-foreground/60 text-sm mb-3">{person.institution}</p>
        )}
        {person.description && (
          <p className="text-foreground/70 text-sm leading-relaxed mb-3">{person.description}</p>
        )}
        {person.email && (
          <p className="text-foreground/55 text-sm mb-2 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <a href={`mailto:${person.email}`} className="hover:text-primary transition-colors">{person.email}</a>
          </p>
        )}
        {links.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 text-sm">
            {links.map((link, i) => (
              <React.Fragment key={link.label + i}>
                {i > 0 && <span className="text-foreground/30">|</span>}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/70 transition-colors flex items-center gap-0.5"
                >
                  {link.label}
                </a>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SubSection({ title, items }: { title: string; items: PersonItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-20">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">{title}</h3>
        <div className="w-8 h-[2px] bg-primary" />
      </motion.div>
      <div className="flex flex-col">
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
          <div className="container mx-auto px-6 md:px-12 max-w-4xl">
            <SubSection title="Collaborators" items={collaborators} />
            <SubSection title="Mentees" items={mentees} />
            <SubSection title="Funding" items={funding} />
          </div>
        </section>
      )}
    </>
  );
}
