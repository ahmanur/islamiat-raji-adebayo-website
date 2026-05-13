import React from 'react';
import { motion } from 'framer-motion';

interface SpectrogramWaveProps {
  /** When true bars animate, when false bars rest at a low height */
  active?: boolean;
  /** Number of bars to render */
  bars?: number;
  /** Extra className on the container */
  className?: string;
}

export function SpectrogramWave({ active = true, bars = 32, className = '' }: SpectrogramWaveProps) {
  return (
    <div className={`flex items-end gap-[3px] w-full h-full ${className}`} aria-hidden="true">
      {[...Array(bars)].map((_, i) => {
        // Give each bar a different random-ish peak height so it looks organic
        const peak = 30 + ((i * 7 + i * i * 3) % 60); // 30–90% range, deterministic
        return (
          <motion.div
            key={i}
            className="flex-1 rounded-t-sm bg-primary/40"
            style={{ transformOrigin: 'bottom', minWidth: 2 }}
            animate={
              active
                ? { scaleY: [0.15, peak / 100, 0.2, (peak * 0.7) / 100, 0.15] }
                : { scaleY: 0.08 }
            }
            transition={
              active
                ? {
                    duration: 1.2 + (i % 5) * 0.18,
                    repeat: Infinity,
                    repeatType: 'mirror',
                    ease: 'easeInOut',
                    delay: (i % 8) * 0.09,
                  }
                : { duration: 0.4, ease: 'easeOut' }
            }
          />
        );
      })}
    </div>
  );
}
