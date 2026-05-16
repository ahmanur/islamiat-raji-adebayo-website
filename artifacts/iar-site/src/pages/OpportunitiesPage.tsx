import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  BookOpen,
  Microscope,
  Mail,
  HeartHandshake,
  GraduationCap,
  Award,
  Briefcase,
  Coins,
  ExternalLink,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getContent, getList } from '@/lib/cms';
import { CONTENT_DEFAULTS, LIST_DEFAULTS } from '@/lib/cmsDefaults';

type Resource = {
  audience: string;
  category: string;
  title: string;
  organization: string;
  description: string;
  deadline: string;
  url: string;
};

const AUDIENCE_TABS = ['All', 'Undergraduate', 'Graduate', 'Postgraduate', 'Collaborators'] as const;
type AudienceTab = (typeof AUDIENCE_TABS)[number];

const audienceMeta: Record<string, { icon: React.ReactNode; label: string }> = {
  Undergraduate: { icon: <GraduationCap className="w-4 h-4" />, label: 'Undergraduate' },
  Graduate: { icon: <BookOpen className="w-4 h-4" />, label: 'Graduate' },
  Postgraduate: { icon: <Microscope className="w-4 h-4" />, label: 'Postgraduate' },
  Collaborators: { icon: <Users className="w-4 h-4" />, label: 'Collaborators' },
};

const categoryMeta: Record<string, { icon: React.ReactNode; tone: string }> = {
  Scholarship: { icon: <Award className="w-3.5 h-3.5" />, tone: 'bg-amber-500/10 text-amber-700 border-amber-500/30' },
  Fellowship: { icon: <Award className="w-3.5 h-3.5" />, tone: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30' },
  Internship: { icon: <Briefcase className="w-3.5 h-3.5" />, tone: 'bg-sky-500/10 text-sky-700 border-sky-500/30' },
  'Research Grant': { icon: <Coins className="w-3.5 h-3.5" />, tone: 'bg-violet-500/10 text-violet-700 border-violet-500/30' },
  Recruitment: { icon: <Users className="w-3.5 h-3.5" />, tone: 'bg-rose-500/10 text-rose-700 border-rose-500/30' },
  Other: { icon: <BookOpen className="w-3.5 h-3.5" />, tone: 'bg-slate-500/10 text-slate-700 border-slate-500/30' },
};

const iconMap: Record<string, React.ReactNode> = {
  microscope: <Microscope className="w-6 h-6" />,
  book: <BookOpen className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
};

function ResourcesSection() {
  const [resourcesContent, setResourcesContent] = useState(CONTENT_DEFAULTS.resources_section);
  const [resources, setResources] = useState<Resource[]>(
    () => (LIST_DEFAULTS.resources ?? []) as Resource[]
  );
  const [activeTab, setActiveTab] = useState<AudienceTab>('All');

  useEffect(() => {
    getContent('resources_section' as any).then(data => {
      if (Object.keys(data).length > 0) {
        setResourcesContent({ ...CONTENT_DEFAULTS.resources_section, ...data });
      }
    });
    getList('resources').then(rows => {
      if (rows.length > 0) {
        setResources(rows.map(r => ({
          audience: (r.data?.audience as string) ?? 'Other',
          category: (r.data?.category as string) ?? 'Other',
          title: (r.data?.title as string) ?? '',
          organization: (r.data?.organization as string) ?? '',
          description: (r.data?.description as string) ?? '',
          deadline: (r.data?.deadline as string) ?? '',
          url: (r.data?.url as string) ?? '',
        })));
      }
    });
  }, []);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return resources;
    return resources.filter(r => r.audience === activeTab);
  }, [resources, activeTab]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: resources.length };
    for (const r of resources) {
      map[r.audience] = (map[r.audience] ?? 0) + 1;
    }
    return map;
  }, [resources]);

  return (
    <section id="resources" className="pt-10 md:pt-14 pb-20 md:pb-24 bg-secondary/30 border-t border-secondary/60">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          className="max-w-3xl mb-10 md:mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-5">
            {resourcesContent.title || 'Resources'}
          </h2>
          <div className="w-12 h-[2px] bg-primary mb-6" />
          {resourcesContent.intro && (
            <p className="text-base md:text-lg text-foreground/75 leading-relaxed">
              {resourcesContent.intro}
            </p>
          )}
        </motion.div>

        {/* Audience filter tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {AUDIENCE_TABS.map(tab => {
            const active = activeTab === tab;
            const count = counts[tab] ?? 0;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-foreground text-background border-foreground'
                    : 'bg-background text-foreground/70 border-secondary hover:border-foreground/30 hover:text-foreground'
                }`}
              >
                {tab !== 'All' && audienceMeta[tab]?.icon}
                <span>{tab}</span>
                <span className={`text-xs ${active ? 'text-background/70' : 'text-foreground/40'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-foreground/50 italic">
            No resources in this category yet.
          </div>
        ) : (
          <div className="max-w-4xl">
            <ul className="space-y-8">
              {filtered.map((r, i) => {
                const cat = categoryMeta[r.category] ?? categoryMeta.Other;
                return (
                  <motion.li
                    key={`${r.title}-${i}`}
                    className="group border-b border-border/50 pb-8 last:border-0"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05 }}
                  >
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
                      <div className="md:w-40 shrink-0 md:pt-1">
                        <div className="flex md:flex-col gap-2 flex-wrap">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border w-fit ${cat.tone}`}>
                            {cat.icon}
                            {r.category}
                          </span>
                          {r.audience && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-secondary/70 text-foreground/70 border border-secondary w-fit">
                              {audienceMeta[r.audience]?.icon}
                              {r.audience}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-medium text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                          {r.title}
                        </h3>
                        {r.organization && (
                          <p className="text-foreground/70 mb-3 font-light italic">{r.organization}</p>
                        )}
                        {r.description && (
                          <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-4">
                            {r.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          {r.deadline && (
                            <span className="inline-flex items-center gap-1.5 text-foreground/60">
                              <Calendar className="w-3.5 h-3.5 shrink-0" />
                              Deadline: {r.deadline}
                            </span>
                          )}
                          {r.url && (
                            <a
                              href={r.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:text-primary/80 transition-colors font-medium"
                            >
                              Visit resource <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function OpportunitiesPage() {
  const [opportunitiesContent, setOpportunitiesContent] = useState(CONTENT_DEFAULTS.opportunities);
  const [opportunityCards, setOpportunityCards] = useState(() => LIST_DEFAULTS.opportunities_list);

  useEffect(() => {
    getContent('opportunities' as any).then(data => {
      if (Object.keys(data).length > 0) {
        setOpportunitiesContent({ ...CONTENT_DEFAULTS.opportunities, ...data });
      }
    });
    getList('opportunities_list').then(rows => {
      if (rows.length > 0) {
        setOpportunityCards(rows.map(r => r.data as any));
      }
    });
  }, []);

  return (
    <div className="pt-20 min-h-screen">
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 relative">
        {opportunitiesContent.bg_image && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={opportunitiesContent.bg_image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <motion.div
            className="max-w-3xl mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Opportunities</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            <p className="text-xl text-foreground/80 font-light leading-relaxed">
              {opportunitiesContent.intro}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {opportunityCards.map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col p-8 rounded-2xl bg-secondary/50 border border-secondary/80 hover:bg-secondary transition-colors relative overflow-hidden group"
              >
                {opp.image && (
                  <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                    <img src={opp.image} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-6 shadow-sm">
                    {iconMap[opp.icon] || <Microscope className="w-6 h-6" />}
                  </div>
                  <h2 className="font-serif text-2xl text-foreground mb-4">{opp.title}</h2>
                  <p className="text-foreground/70 leading-relaxed flex-1 mb-8">{opp.description}</p>
                  <Button variant="outline" className="rounded-full gap-2 w-fit bg-background" asChild>
                    <a href={`mailto:${opportunitiesContent.contact_cta?.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)?.[0] || 'iar32@cornell.edu'}`} aria-label={opp.cta}>
                      <Mail className="w-4 h-4" />
                      {opp.cta}
                    </a>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          {opportunitiesContent.mentorship_title && (
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
            >
              <div className="p-10 md:p-14 rounded-2xl bg-foreground text-background relative overflow-hidden">
                {opportunitiesContent.mentorship_bg && (
                  <div className="absolute inset-0 opacity-10">
                    <img src={opportunitiesContent.mentorship_bg} alt="" className="w-full h-full object-cover mix-blend-screen" />
                  </div>
                )}
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                  <HeartHandshake className="w-12 h-12 text-primary shrink-0" />
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl mb-4">{opportunitiesContent.mentorship_title}</h2>
                    <p className="text-background/80 leading-relaxed text-lg whitespace-pre-wrap">
                      {opportunitiesContent.mentorship_text}
                    </p>
                    {opportunitiesContent.mentorship_cta && (
                      <div className="mt-8">
                        <Button className="rounded-full gap-2" asChild>
                          <a href={`mailto:${opportunitiesContent.mentorship_cta?.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi)?.[0] || 'iar32@cornell.edu'}`}>
                            <Mail className="w-4 h-4" />
                            {opportunitiesContent.mentorship_cta}
                          </a>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <ResourcesSection />
    </div>
  );
}
