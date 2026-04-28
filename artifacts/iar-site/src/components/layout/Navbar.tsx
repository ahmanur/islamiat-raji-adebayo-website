import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { SpectrogramWave } from '@/components/ui/SpectrogramWave';

const navLinks = [
  { name: 'Home',         href: '#hero' },
  { name: 'About',        href: '#about' },
  { name: 'Research',     href: '#research' },
  { name: 'Publications', href: '#publications' },
  { name: 'Mentorship',   href: '#mentorship' },
  { name: 'Outreach',     href: '#contact' },
  { name: 'Field Work',   href: '#fieldwork' },
  { name: 'Opportunities',href: '#mentorship', accent: true },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm py-3'
          : 'bg-background/80 backdrop-blur-sm border-b border-border/20 py-4'
      }`}
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="container mx-auto px-6 md:px-10 flex items-center justify-between gap-6">
        {/* Logo */}
        <a
          href="#hero"
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Dr. Islamiat Raji-Adebayo — home"
        >
          <SpectrogramWave />
          <span className="hidden sm:block font-serif font-semibold text-base tracking-tight text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
            Dr. I. Raji-Adebayo
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center" aria-label="Site navigation">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`
                    relative px-3.5 py-1.5 text-sm font-medium rounded-sm
                    transition-colors duration-200
                    ${link.accent
                      ? 'text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:bg-primary/8'
                      : 'text-foreground/75 hover:text-foreground hover:bg-foreground/6'
                    }
                  `}
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CV button — desktop */}
        <a
          href="#"
          aria-label="Download CV (placeholder)"
          download
          className="hidden lg:flex items-center gap-1.5 shrink-0 text-sm font-medium text-foreground/70 hover:text-foreground border border-border/60 hover:border-border rounded-sm px-3 py-1.5 transition-colors duration-200"
        >
          <Download className="w-3.5 h-3.5" />
          CV
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-foreground/70 hover:text-foreground transition-colors"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          className="lg:hidden bg-background/98 border-t border-border/40 px-6 pb-5 pt-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`block px-2 py-2.5 text-sm font-medium rounded-sm transition-colors duration-150 ${
                    link.accent
                      ? 'text-[hsl(var(--primary))] hover:bg-primary/8'
                      : 'text-foreground/75 hover:text-foreground hover:bg-foreground/6'
                  }`}
                >
                  {link.name}
                </a>
              </li>
            ))}
            <li className="mt-3 pt-3 border-t border-border/40">
              <a
                href="#"
                download
                aria-label="Download CV (placeholder)"
                className="flex items-center gap-2 px-2 py-2.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                <Download className="w-4 h-4" />
                Download CV
              </a>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
