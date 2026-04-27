import React from 'react';
import { motion } from 'framer-motion';

export function SpectrogramWave() {
  return (
    <div className="flex items-center gap-[2px] h-6" aria-hidden="true">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] bg-primary rounded-full origin-bottom"
          initial={{ height: "20%" }}
          animate={{ 
            height: ["20%", "100%", "40%", "80%", "20%"] 
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
