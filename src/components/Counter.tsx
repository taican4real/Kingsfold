import React, { useEffect, useState, useRef } from 'react';
import { useInView, useMotionValue, useSpring } from 'motion/react';

interface CounterProps {
  value: string;
  duration?: number;
}

export default function Counter({ value, duration = 2 }: CounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Parse value (e.g., "98%", "1:8", "24/7", "15+")
  const match = value.match(/(\d+)/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = value.replace(/[\d]/g, '');
  const prefix = value.split(/\d+/)[0];

  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, motionValue, target]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        // Special case for ratios like 1:8 or 24/7
        if (value.includes(':') || value.includes('/')) {
           setDisplayValue(value);
        } else {
           setDisplayValue(`${prefix}${Math.round(latest)}${suffix}`);
        }
      }
    });
  }, [springValue, prefix, suffix, value]);

  return <span ref={ref}>{displayValue}</span>;
}
