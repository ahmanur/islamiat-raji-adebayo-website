import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpectrogramWave } from '@/components/ui/SpectrogramWave';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Research', href: '#research' },
    { name: 'Publications', href: '#publications' },
    { name: 'Mentorship', href: '#mentorship' },
    { name: 'News', href: '#news' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-border/50 py-3 shadow-sm' : 'bg-transparent py-5'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 group">
          <SpectrogramWave />
          <span className="font-serif font-semibold text-lg tracking-tight text-foreground group-hover:text-primary transition-colors">
            Dr. Islamiat Raji-Adebayo
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a 
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300 pb-1"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
          <Button variant="default" className="gap-2 font-medium" asChild>
            <a href="#" aria-label="Download CV placeholder" download>
              <Download className="w-4 h-4" />
              <span>CV</span>
            </a>
          </Button>
        </nav>
      </div>
    </motion.header>
  );
}
