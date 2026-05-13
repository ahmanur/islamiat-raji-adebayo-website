import React from 'react';
import { motion } from 'framer-motion';

interface SpectrogramWaveProps {
  active?: boolean;
  bars?: number;
  className?: string;
}

// Deterministic "random" peak heights so bars look organic but are stable across renders
function peakFor(i: number, total: number) {
  // Mix of sine waves to create a natural-looking envelope
  const t = i / total;
  const base = Math.sin(t * Math.PI) * 55; // bell shape across full width
  const wobble = Math.sin(t * Math.PI * 5 + i * 1.3) * 20;
  return Math.max(15, Math.min(95, 30 + base + wobble));
}

export function SpectrogramWave({ active = true, bars = 36, className = '' }: SpectrogramWaveProps) {
  return (
    <div
      className={`flex items-end gap-[2px] w-full h-full ${className}`}
      aria-hidden="true"
      style={{ alignItems: 'flex-end' }}
    >
      {Array.from({ length: bars }).map((_, i) => {
        const peak = peakFor(i, bars);
        const mid = peakFor(i, bars) * 0.55;
        const low = peakFor(i, bars) * 0.2;

        return (
          <motion.div
            key={i}
            className="flex-1 rounded-t bg-primary"
            style={{ minWidth: 3, opacity: active ? 0.7 : 0.25 }}
            animate={
              active
                ? {
                    height: [
                      `${low}%`,
                      `${peak}%`,
                      `${mid}%`,
                      `${peak * 0.8}%`,
                      `${low}%`,
                    ],
                  }
                : { height: '6%' }
            }
            transition={
              active
                ? {
                    duration: 1.0 + (i % 6) * 0.15,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut',
                    delay: (i % 9) * 0.08,
                  }
                : { duration: 0.5, ease: 'easeOut' }
            }
          />
        );
      })}
    </div>
  );
}
