import React from 'react';
import { motion } from 'framer-motion';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-secondary/30 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="sticky top-32"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-foreground mb-6">About</h2>
              <div className="w-12 h-[2px] bg-primary mb-8"></div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-2">Education</h3>
                  <ul className="space-y-3 text-sm text-foreground/80">
                    <li className="pl-3 border-l-2 border-primary/30">
                      <strong>PhD Ecological Sciences</strong><br/>
                      <span className="text-foreground/60">University of KwaZulu-Natal, 2021</span>
                    </li>
                    <li className="pl-3 border-l-2 border-primary/30">
                      <strong>MSc Conservation Biology</strong><br/>
                      <span className="text-foreground/60">A.P. Leventis Ornithological Research Institute / University of Jos, 2018</span>
                    </li>
                    <li className="pl-3 border-l-2 border-primary/30">
                      <strong>BSc Forestry and Wildlife Management</strong><br/>
                      <span className="text-foreground/60">University of Ilorin, 2015</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg prose-headings:font-serif prose-p:text-foreground/80 prose-p:leading-relaxed max-w-none"
            >
              <p className="text-xl md:text-2xl text-foreground font-serif leading-relaxed mb-8">
                My research spans landscape and urban ecology, with broad interests in plant–animal interactions and the ecological and social impacts of urbanization and land-use change on bird communities in relation to human well-being.
              </p>
              
              <p>
                My trajectory from Nigeria to South Africa, to Canada, and now to Cornell has been shaped by a deep curiosity about how species adapt—or fail to adapt—to rapid environmental change. I use an interdisciplinary approach that integrates bioacoustics and community engagement to monitor biodiversity in rapidly changing urban landscapes.
              </p>
              
              <p>
                As a Rose Postdoctoral Fellow at the K. Lisa Yang Center for Conservation Bioacoustics at the Cornell Lab of Ornithology, my current research investigates bird diversity on university campuses and in cities across multiple countries using autonomous acoustic recorders. I collaborate with local experts and students to record bird songs, identifying which species persist, which do not, and why—helping us understand the factors that shape urban bird populations and guiding conservation planning.
              </p>
              
              <p>
                One of the most rewarding aspects of my work is the connection between nature and human well-being. I aim to develop conservation frameworks that support both ecological resilience and social well-being in urban settings. Before joining Cornell, I was a Postdoctoral Research Associate in the Department of Biology at Queen's University in Canada, where I led a multi-country urban bird monitoring project across five cities using passive acoustic recorders and community science methods. My doctoral research at the University of KwaZulu-Natal in South Africa focused on frugivory and seed dispersal by birds, bats, and monkeys in urban mosaic landscapes, with particular attention to the ecological role of <em>Ficus</em> species.
              </p>
              
              <p>
                I enjoy working with students and community and local scientists to co-design participatory monitoring methods that are scalable, community-driven, and relevant to both science and society. I am passionate about mentorship, outreach, and interdisciplinary collaboration.
              </p>
              
              <div className="my-12 p-8 bg-background border border-primary/10 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-primary/5">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                  </svg>
                </div>
                <h4 className="font-serif text-2xl text-foreground mt-0 mb-4 relative z-10">Affiliations & Memberships</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 m-0 p-0 list-none relative z-10">
                  <li className="flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    American Scientific Affiliation
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    Society for Conservation Biology (Global & Nigeria)
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    British Ecological Society
                  </li>
                  <li className="flex items-center gap-2 text-foreground/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                    Stable Planet Alliance
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
