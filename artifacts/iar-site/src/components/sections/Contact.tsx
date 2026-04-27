import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 500);
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">Get in Touch</h2>
            <div className="w-12 h-[2px] bg-primary mb-8"></div>
            
            <p className="text-lg text-foreground/80 leading-relaxed mb-12 max-w-md">
              Whether you're a prospective student, a potential collaborator, or just interested in urban ecology and bioacoustics, I'd love to hear from you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/50 rounded-full text-primary shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Email</h3>
                  <a href="mailto:iar32@cornell.edu" className="text-foreground/70 hover:text-primary transition-colors">
                    iar32@cornell.edu
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-secondary/50 rounded-full text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Location</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    K. Lisa Yang Center for Conservation Bioacoustics<br />
                    Cornell Lab of Ornithology<br />
                    Ithaca, NY
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 md:p-10 bg-secondary/20 border border-secondary rounded-2xl">
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">Message Sent</h3>
                  <p className="text-foreground/70">Thank you for reaching out. I will get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                      <Input id="name" required placeholder="Your name" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                      <Input id="email" type="email" required placeholder="your.email@example.com" className="bg-background" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                    <Input id="subject" required placeholder="What is this regarding?" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                    <Textarea id="message" required placeholder="Your message..." rows={5} className="bg-background resize-none" />
                  </div>
                  <Button type="submit" className="w-full sm:w-auto px-8 rounded-full">
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
