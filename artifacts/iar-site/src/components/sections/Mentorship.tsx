import React from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, HeartHandshake } from 'lucide-react';

export function Mentorship() {
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
              <p className="text-xl font-serif leading-relaxed text-background/90">
                Science is deeply collaborative. My mentorship philosophy is rooted in creating inclusive spaces where diverse voices can shape ecological research.
              </p>
              <p>
                I actively seek to support emerging scholars, particularly from underrepresented backgrounds in ecology. Whether through formal supervision, field training, or collaborative analysis, I believe in empowering the next generation of conservation scientists to lead with rigor and empathy.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-background/5 border border-background/10">
                <Users className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Collaborators</h3>
                <p className="text-background/60 text-sm">Always open to interdisciplinary collaborations crossing ecology, urban planning, and community science.</p>
              </div>
              <div className="p-6 rounded-xl bg-background/5 border border-background/10">
                <BookOpen className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">Prospective Students</h3>
                <p className="text-background/60 text-sm">Please reach out if you are interested in urban bioacoustics or plant-animal interactions.</p>
              </div>
            </div>
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
                    "Ecology needs diverse perspectives to solve complex environmental challenges. The best science happens when everyone has a seat at the table."
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
