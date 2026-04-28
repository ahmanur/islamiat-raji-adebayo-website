import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Microscope, Mail, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';

const opportunities = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Graduate Students',
    description:
      'I welcome inquiries from motivated MSc and PhD applicants with interests in bioacoustics, urban ecology, plant–animal interactions, or conservation science. Strong candidates are curious, collaborative, and committed to rigorous fieldwork.',
    cta: 'Email to express interest',
  },
  {
    icon: <Microscope className="w-6 h-6" />,
    title: 'Undergraduate Researchers',
    description:
      'Undergraduate students looking for hands-on research experience in ecology or acoustic monitoring are encouraged to reach out. Opportunities may include field data collection, acoustic annotation, and data analysis.',
    cta: 'Email to enquire',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: 'Collaborators',
    description:
      'I am always open to interdisciplinary collaborations — particularly with urban planners, social scientists, Indigenous community organizations, and NGOs working at the intersection of urban development and biodiversity.',
    cta: 'Get in touch',
  },
];

export function OpportunitiesPage() {
  return (
    <div className="pt-20 min-h-screen">
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <motion.div
            className="max-w-3xl mb-16 md:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Opportunities</h1>
            <div className="w-12 h-[2px] bg-primary mb-8" />
            <p className="text-xl text-foreground/80 font-light leading-relaxed">
              Science thrives on diverse perspectives. I actively seek to train and collaborate with scholars from
              all backgrounds who are passionate about understanding how cities can better support biodiversity and
              human well-being.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {opportunities.map((opp, i) => (
              <motion.div
                key={opp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col p-8 rounded-2xl bg-secondary/50 border border-secondary/80 hover:bg-secondary transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-6 shadow-sm">
                  {opp.icon}
                </div>
                <h2 className="font-serif text-2xl text-foreground mb-4">{opp.title}</h2>
                <p className="text-foreground/70 leading-relaxed flex-1 mb-8">{opp.description}</p>
                <Button variant="outline" className="rounded-full gap-2 w-fit" asChild>
                  <a href="mailto:iar32@cornell.edu" aria-label={opp.cta}>
                    <Mail className="w-4 h-4" />
                    {opp.cta}
                  </a>
                </Button>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <div className="p-10 md:p-14 rounded-2xl bg-foreground text-background relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <img src="/images/spectrogram-art.png" alt="" className="w-full h-full object-cover mix-blend-screen" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                <HeartHandshake className="w-12 h-12 text-primary shrink-0" />
                <div>
                  <h2 className="font-serif text-2xl md:text-3xl mb-4">Mentorship Philosophy</h2>
                  <p className="text-background/80 leading-relaxed text-lg">
                    I believe the best science happens when everyone has a seat at the table. My approach to
                    mentorship is grounded in patience, honest feedback, and a commitment to equity. I strive to
                    create an environment where emerging scientists feel seen, supported, and challenged to do their
                    best work.
                  </p>
                  <div className="mt-8">
                    <Button className="rounded-full gap-2" asChild>
                      <a href="mailto:iar32@cornell.edu">
                        <Mail className="w-4 h-4" />
                        Reach out at iar32@cornell.edu
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
