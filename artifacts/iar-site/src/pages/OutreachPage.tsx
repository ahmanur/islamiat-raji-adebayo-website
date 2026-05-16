import React from 'react';
import { Contact } from '@/components/sections/Contact';
import { News } from '@/components/sections/News';
import { Helmet } from 'react-helmet-async';

export function OutreachPage() {
  return (
    <div className="pt-20 min-h-screen">
      <Helmet>
        <title>News & Outreach - Dr. Islamiat Raji-Adebayo</title>
        <meta name="description" content="Latest news, announcements, and contact information." />
      </Helmet>
      <News />
      <Contact />
    </div>
  );
}
