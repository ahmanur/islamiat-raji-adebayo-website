import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';


const navLinks = [
  { name: 'Home',         href: '/' },
  { name: 'About',        href: '/about' },
  { name: 'Research',     href: '/research' },
  { name: 'Publications', href: '/publications' },
  { name: 'Teachings',    href: '/mentorship' },
  { name: 'Outreach',     href: '/outreach' },
  { name: 'Field Work',   href: '/field-work' },
  { name: 'Opportunities',href: '/opportunities', accent: true },
];

function isActive(href: string, location: string): boolean {
  if (href === '/') return location === '/';
  return location.startsWith(href);
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

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
        <Link
          href="/"
          className="flex items-center gap-2.5 group shrink-0"
          aria-label="Dr. Islamiat Raji-Adebayo — home"
        >
          <img
            src="/images/portrait.jpg"
            alt="Dr. Islamiat Raji-Adebayo"
            className="hidden sm:block w-8 h-8 rounded-full object-cover object-top border-2 border-primary/20 group-hover:border-primary/50 transition-colors"
          />
          <span className="hidden sm:block font-serif font-semibold text-base tracking-tight text-foreground group-hover:text-primary transition-colors whitespace-nowrap">Islamiat Abidemi Raji. Ph.D.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center" aria-label="Site navigation">
          <ul className="flex items-center gap-0.5">
            {navLinks.map((link) => {
              const active = isActive(link.href, location);
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`
                      relative px-3.5 py-1.5 text-sm font-medium rounded-sm
                      transition-colors duration-200
                      ${link.accent
                        ? active
                          ? 'text-[hsl(var(--primary))] bg-primary/10'
                          : 'text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))] hover:bg-primary/8'
                        : active
                          ? 'text-foreground bg-foreground/8'
                          : 'text-foreground/75 hover:text-foreground hover:bg-foreground/6'
                      }
                    `}
                  >
                    {link.name}
                    {active && !link.accent && (
                      <span className="absolute bottom-0 left-3.5 right-3.5 h-[2px] rounded-full bg-primary" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

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
            {navLinks.map((link) => {
              const active = isActive(link.href, location);
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`block px-2 py-2.5 text-sm font-medium rounded-sm transition-colors duration-150 ${
                      link.accent
                        ? active
                          ? 'text-[hsl(var(--primary))] bg-primary/10'
                          : 'text-[hsl(var(--primary))] hover:bg-primary/8'
                        : active
                          ? 'text-foreground bg-foreground/8'
                          : 'text-foreground/75 hover:text-foreground hover:bg-foreground/6'
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.div>
      )}
    </motion.header>
  );
}
