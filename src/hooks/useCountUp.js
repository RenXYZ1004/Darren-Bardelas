import { useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Counts 0 -> target once the element scrolls into view, easing out so the
 * number decelerates instead of ticking linearly.
 */
export function useCountUp(target, { duration = 1400 } = {}) {
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(prefersReduced ? target : 0);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (prefersReduced) {
      setValue(target);
      return undefined;
    }

    let frame;
    let start = null;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target, duration, prefersReduced]);

  return [ref, value];
}
