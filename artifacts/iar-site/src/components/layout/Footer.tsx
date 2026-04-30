import React from 'react';
import { motion } from 'framer-motion';
import { FaLinkedin, FaResearchgate, FaGoogle } from 'react-icons/fa';
import { SpectrogramWave } from '@/components/ui/SpectrogramWave';

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-24 border-t border-primary/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6 opacity-80">
              <SpectrogramWave />
            </div>
            <h3 className="font-serif text-2xl mb-4">Dr. Islamiat Raji-Adebayo</h3>
            <p className="text-background/70 max-w-md text-sm leading-relaxed mb-8">
              Advancing conservation through bioacoustics, urban ecology, and community engagement. Exploring the intersections of sound, biodiversity, and human well-being.
            </p>
            <div className="flex gap-4">
              <a href="https://www.linkedin.com/in/islamiat-raji-adebayo-ph-d-21931387/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="LinkedIn">
                <FaLinkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="ResearchGate">
                <FaResearchgate className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Google Scholar">
                <FaGoogle className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-primary tracking-wide uppercase text-xs">Affiliations</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li>K. Lisa Yang Center for Conservation Bioacoustics</li>
              <li>Cornell Lab of Ornithology</li>
              <li>Society for Conservation Biology</li>
              <li>British Ecological Society</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-6 text-primary tracking-wide uppercase text-xs">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li><a href="mailto:iar32@cornell.edu" className="hover:text-primary transition-colors">iar32@cornell.edu</a></li>
              <li>Ithaca, New York</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} Dr. Islamiat Raji-Abidemi. All rights reserved.</p>
          <p>Designed by IBK Technologies</p>
        </div>
      </div>
    </footer>
  );
}
