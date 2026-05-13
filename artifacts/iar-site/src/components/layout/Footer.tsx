import React, { useEffect, useState } from 'react';
import { FaLinkedin, FaResearchgate, FaGoogle } from 'react-icons/fa';
import { getList, getContent } from '@/lib/cms';
import { LIST_DEFAULTS, CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

const DF = CONTENT_DEFAULTS.footer;

export function Footer() {
  const [affiliations, setAffiliations] = useState(
    LIST_DEFAULTS.affiliations.map(a => a.name)
  );
  const [contact, setContact] = useState({
    email: CONTENT_DEFAULTS.outreach.email,
    location: CONTENT_DEFAULTS.outreach.location,
    linkedin: CONTENT_DEFAULTS.outreach.linkedin,
    researchgate: CONTENT_DEFAULTS.outreach.researchgate ?? '',
    google_scholar: CONTENT_DEFAULTS.outreach.google_scholar ?? '',
  });
  const [footer, setFooter] = useState({
    name: DF.name,
    bio: DF.bio,
    copyright: DF.copyright,
    credit: DF.credit,
  });

  useEffect(() => {
    getList('affiliations').then(rows => {
      if (rows.length > 0) setAffiliations(rows.map(r => r.data.name).filter(Boolean));
    });
    getContent('outreach').then(data => {
      if (Object.keys(data).length > 0) {
        setContact(prev => ({
          email: data.email ?? prev.email,
          location: data.location ?? prev.location,
          linkedin: data.linkedin ?? prev.linkedin,
          researchgate: data.researchgate ?? prev.researchgate,
          google_scholar: data.google_scholar ?? prev.google_scholar,
        }));
      }
    });
    getContent('footer').then(data => {
      if (Object.keys(data).length > 0) {
        setFooter(prev => ({
          name: data.name ?? prev.name,
          bio: data.bio ?? prev.bio,
          copyright: data.copyright ?? prev.copyright,
          credit: data.credit ?? prev.credit,
        }));
      }
    });
  }, []);

  return (
    <footer className="bg-foreground text-background py-16 md:py-24 border-t border-primary/20">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl mb-4">{footer.name}</h3>
            <p className="text-background/70 max-w-md text-sm leading-relaxed mb-8">
              {footer.bio}
            </p>
            <div className="flex gap-4">
              {contact.linkedin && (
                <a href={contact.linkedin} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="LinkedIn">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {contact.researchgate && (
                <a href={contact.researchgate} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="ResearchGate">
                  <FaResearchgate className="w-5 h-5" />
                </a>
              )}
              {contact.google_scholar && (
                <a href={contact.google_scholar} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300" aria-label="Google Scholar">
                  <FaGoogle className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-primary tracking-wide uppercase text-xs">Affiliations</h4>
            <ul className="space-y-3 text-sm text-background/70">
              {affiliations.map((name, i) => (
                <li key={i}>{name}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-6 text-primary tracking-wide uppercase text-xs">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.location && <li>{contact.location}</li>}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-background/50">
          <p>© {new Date().getFullYear()} {footer.copyright}</p>
          {footer.credit && <p>{footer.credit}</p>}
        </div>
      </div>
    </footer>
  );
}
