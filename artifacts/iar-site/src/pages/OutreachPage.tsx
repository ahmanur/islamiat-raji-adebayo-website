import React from 'react';
import { Contact } from '@/components/sections/Contact';
import { News } from '@/components/sections/News';

export function OutreachPage() {
  return (
    <div className="pt-20 min-h-screen">
      <News />
      <Contact />
    </div>
  );
}
