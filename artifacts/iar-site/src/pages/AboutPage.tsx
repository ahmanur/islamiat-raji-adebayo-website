import React from 'react';
import { About } from '@/components/sections/About';
import { Helmet } from 'react-helmet-async';

export function AboutPage() {
  return (
    <div className="pt-20 min-h-screen">
      <Helmet>
        <title>About - Dr. Islamiat Raji-Adebayo</title>
        <meta name="description" content="Learn more about Dr. Islamiat Raji-Adebayo's background, vision, and academic journey." />
      </Helmet>
      <About />
    </div>
  );
}
