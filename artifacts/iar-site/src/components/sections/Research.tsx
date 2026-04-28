import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mic, Trees, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Research() {
  const themes = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Bioacoustics",
      description: "Using sound as a non-invasive lens to monitor biodiversity, revealing hidden ecological patterns in urban environments."
    },
    {
      icon: <Trees className="w-6 h-6" />,
      title: "Urban Ecology",
      description: "Investigating how rapid urbanization shapes bird communities and alters fundamental plant-animal interactions."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Human-Nature Dynamics",
      description: "Exploring the relationship between people and nature, emphasizing community engagement for sustainable cities."
    }
  ];

  const projects = [
    {
      status: "Current Project",
      title: "Urban Campus Soundscape Project",
      location: "Cornell University",
      description: "A comprehensive acoustic monitoring study across the Cornell campus, integrating bioacoustics with community engagement to understand how the soundscape influences both local biodiversity and student well-being. This project involves deploying acoustic sensors in varying urban gradients and collaborating with students to annotate and analyze the acoustic data.",
      image: "/images/spectrogram-art.png"
    },
    {
      status: "Past Project",
      title: "Multi-country Urban Bird Monitoring",
      location: "Queen's University",
      description: "A large-scale collaborative effort monitoring avian responses to urbanization across several countries. We analyzed acoustic data and point counts to identify which species thrive in urban environments and which are excluded, providing critical insights for urban planners and conservationists.",
      image: "/images/hero-bird.png"
    },
    {
      status: "Doctoral Research",
      title: "Frugivory in Urban Mosaics",
      location: "University of KwaZulu-Natal",
      description: "Investigated frugivory and seed dispersal within complex urban mosaic landscapes in South Africa. The research highlighted how habitat fragmentation disrupts mutualistic interactions, with significant implications for the regeneration of native flora in heavily modified environments.",
      image: "/images/field-fruit.png"
    }
  ];

  return (
    <section id="research" className="py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div 
          className="max-w-3xl mb-16 md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Research</h2>
          <div className="w-12 h-[2px] bg-primary mb-8"></div>
          <p className="text-xl text-foreground/80 font-light leading-relaxed">
            My research program asks fundamental questions about ecological resilience in the Anthropocene. I focus on understanding how we can build cities that act as refuges rather than barriers to biodiversity.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="p-8 rounded-2xl bg-secondary/50 border border-secondary/80 hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary mb-6 shadow-sm">
                {theme.icon}
              </div>
              <h3 className="font-serif text-2xl text-foreground mb-4">{theme.title}</h3>
              <p className="text-foreground/70 leading-relaxed">
                {theme.description}
              </p>
            </motion.div>
          ))}
        </div>

        <span id="fieldwork" className="sr-only" aria-hidden="true" />
        <div className="space-y-24">
          {projects.map((project, i) => (
            <motion.div 
              key={project.title}
              className={`flex flex-col gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-full lg:w-1/2">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg relative group">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
              
              <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium tracking-wide mb-6 uppercase w-fit">
                  {project.status}
                </div>
                <h3 className="font-serif text-3xl md:text-4xl text-foreground mb-3">{project.title}</h3>
                <div className="flex items-center gap-2 text-foreground/60 text-sm mb-6 uppercase tracking-wider font-medium">
                  <MapPinIcon className="w-4 h-4" />
                  {project.location}
                </div>
                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
