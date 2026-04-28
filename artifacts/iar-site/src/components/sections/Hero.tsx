import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export function Hero() {
  return (
    <section id="hero" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-background">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-40 mix-blend-multiply pointer-events-none">
        <img 
          src="/images/spectrogram-art.png" 
          alt="" 
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background"></div>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-6 uppercase">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                Rose Postdoctoral Fellow
              </div>
              
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] text-foreground mb-6">
                Listening to the<br />
                <span className="text-primary italic">urban forest.</span>
              </h1>
              
              <p className="text-lg md:text-xl text-foreground/80 max-w-2xl leading-relaxed mb-10 font-light">
                Advancing conservation through bioacoustics and urban ecology. Studying how urbanization shapes bird communities and the relationship between people and nature.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Button size="lg" className="rounded-full px-8" asChild>
                  <Link href="/research">Explore Research</Link>
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 bg-transparent" asChild>
                  <Link href="/outreach">Get in Touch</Link>
                </Button>
              </div>

              <div className="mt-16 flex items-center gap-4 text-sm text-foreground/60">
                <MapPin className="w-4 h-4 text-primary" />
                <span>K. Lisa Yang Center for Conservation Bioacoustics, Cornell Lab of Ornithology</span>
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
              
              {/* Offset decorative image */}
              <div className="absolute -bottom-10 -left-10 w-2/3 aspect-square rounded-2xl overflow-hidden shadow-xl z-20 border-4 border-background hidden md:block">
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
        <Link href="/about" className="flex flex-col items-center gap-2 text-foreground/50 hover:text-primary transition-colors" aria-label="Go to About page">
          <span className="text-xs uppercase tracking-widest font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </Link>
      </motion.div>
    </section>
  );
}
