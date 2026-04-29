import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { getContent } from '@/lib/cms';
import { CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

const D = CONTENT_DEFAULTS.hero;

export function Hero() {
  const [c, setC] = useState(D);

  useEffect(() => {
    getContent('hero').then(data => {
      if (Object.keys(data).length > 0) setC({ ...D, ...data });
    });
  }, []);

  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-background">
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 14, ease: 'easeOut' }}
      >
        <img
          src="/images/forest-bg.png"
          alt=""
          className="w-full h-full object-cover object-center brightness-125 saturate-150 hue-rotate-[15deg]"
          style={{ filter: 'brightness(1.35) saturate(1.6) hue-rotate(15deg)' }}
        />
      </motion.div>
      <div className="absolute inset-0 z-0 pointer-events-none bg-black/35" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-black/30 via-black/5 to-transparent" />
      <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-widest mb-6 uppercase border border-white/20">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                {c.badge}
              </div>

              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-white mb-6">
                {c.headline}<br />
                <span className="text-primary italic">{c.headline_accent}</span>
              </h1>

              <p className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed mb-10 font-light">
                {c.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full px-8" asChild>
                  <Link href="/research">{c.btn_primary}</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 bg-transparent border-white/40 text-white hover:bg-white/10 hover:border-white/70" asChild>
                  <Link href="/outreach">{c.btn_secondary}</Link>
                </Button>
              </div>

              <div className="mt-16 flex items-center gap-4 text-sm text-white/50">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{c.institution}</span>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="relative"
            >
              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img
                  src="/images/portrait.jpg"
                  alt="Portrait of Dr. Islamiat Raji-Adebayo"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"></div>
              </div>
              <div className="absolute -bottom-10 -left-10 w-2/5 aspect-square rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-background hidden md:block">
                <img
                  src="/images/hero-bird.png"
                  alt="Small bird in urban park at dawn"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        <Link href="/about" className="flex flex-col items-center gap-2 text-white/50 hover:text-primary transition-colors" aria-label="Go to About page">
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  );
}
