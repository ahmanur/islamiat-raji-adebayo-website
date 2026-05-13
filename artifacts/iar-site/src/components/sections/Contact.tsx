import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getContent } from '@/lib/cms';
import { CONTENT_DEFAULTS } from '@/lib/cmsDefaults';

const DC = CONTENT_DEFAULTS.outreach;

export function Contact() {
  const [c, setC] = useState(DC);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    getContent('outreach').then(data => {
      if (Object.keys(data).length > 0) setC({ ...DC, ...data });
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
      setStatus('success');
      formRef.current?.reset();
      setTimeout(() => setStatus('idle'), 6000);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to send. Please try again.');
      setStatus('error');
    }
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

            {c.intro && (
              <p className="text-lg text-foreground/80 leading-relaxed mb-12 max-w-md">{c.intro}</p>
            )}

            <div className="space-y-6">
              {c.email && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-primary shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Email</h3>
                    <a href={`mailto:${c.email}`} className="text-foreground/70 hover:text-primary transition-colors">
                      {c.email}
                    </a>
                  </div>
                </div>
              )}

              {(c.institution || c.location) && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary/50 rounded-full text-primary shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Location</h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {c.institution && <>{c.institution}<br /></>}
                      {c.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="p-8 md:p-10 bg-secondary/20 border border-secondary rounded-2xl">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center h-full min-h-[300px] animate-in fade-in zoom-in duration-500">
                  <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl text-foreground mb-2">Message Sent</h3>
                  <p className="text-foreground/70">Thank you for reaching out. I will get back to you soon.</p>
                </div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && (
                    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                      <p className="text-red-700 text-sm">{errorMsg}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                      <Input id="name" name="name" required placeholder="Your name" className="bg-background" />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                      <Input id="email" name="email" type="email" required placeholder="your.email@example.com" className="bg-background" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject</label>
                    <Input id="subject" name="subject" required placeholder="What is this regarding?" className="bg-background" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                    <Textarea id="message" name="message" required placeholder="Your message..." rows={5} className="bg-background resize-none" />
                  </div>
                  <Button type="submit" disabled={status === 'sending'} className="w-full sm:w-auto px-8 rounded-full">
                    {status === 'sending' ? 'Sending…' : 'Send Message'}
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
