import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Soft accent spotlight trailing the pointer. Mouse-only: it is skipped on
 * touch devices and when the OS asks for reduced motion.
 */
export function CursorGlow() {
  const prefersReduced = usePrefersReducedMotion();
  const [hasFinePointer, setHasFinePointer] = useState(false);

  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    const mql = window.matchMedia('(pointer: fine)');
    const onChange = (event) => setHasFinePointer(event.matches);
    setHasFinePointer(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!hasFinePointer || prefersReduced) return undefined;
    const onMove = (event) => {
      x.set(event.clientX - 210);
      y.set(event.clientY - 210);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [hasFinePointer, prefersReduced, x, y]);

  if (!hasFinePointer || prefersReduced) return null;

  return (
    <motion.div className="cursor-glow" style={{ x: springX, y: springY }} aria-hidden="true" />
  );
}
