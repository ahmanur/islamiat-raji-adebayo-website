import React from 'react';
import { Hero } from '@/components/sections/Hero';

import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Dr. Islamiat Raji-Adebayo - Academic Portfolio</title>
        <meta name="description" content="Academic portfolio and research showcase of Dr. Islamiat Raji-Adebayo." />
      </Helmet>
      <Hero />
    </>
  );
}
