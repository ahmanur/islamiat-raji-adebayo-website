import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Research } from '@/components/sections/Research';
import { Publications } from '@/components/sections/Publications';
import { Mentorship } from '@/components/sections/Mentorship';
import { News } from '@/components/sections/News';
import { Contact } from '@/components/sections/Contact';

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <Research />
        <Publications />
        <Mentorship />
        <News />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return <Home />;
}

export default App;
