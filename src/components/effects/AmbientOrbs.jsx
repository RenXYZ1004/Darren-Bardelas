import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/** Blurred colour fields that drift against the pointer for a parallax feel. */
export function AmbientOrbs() {
  const prefersReduced = usePrefersReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const smoothX = useSpring(px, { stiffness: 40, damping: 20 });
  const smoothY = useSpring(py, { stiffness: 40, damping: 20 });

  // The two orbs move in opposite directions and at different rates.
  const orb1X = useTransform(smoothX, (value) => value * 40);
  const orb1Y = useTransform(smoothY, (value) => value * 40);
  const orb2X = useTransform(smoothX, (value) => value * -55);
  const orb2Y = useTransform(smoothY, (value) => value * -55);

  useEffect(() => {
    if (prefersReduced) return undefined;
    const onMove = (event) => {
      px.set(event.clientX / window.innerWidth - 0.5);
      py.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [prefersReduced, px, py]);

  return (
    <div aria-hidden="true">
      <motion.div className="bg-orb orb-1" style={prefersReduced ? undefined : { x: orb1X, y: orb1Y }} />
      <motion.div className="bg-orb orb-2" style={prefersReduced ? undefined : { x: orb2X, y: orb2Y }} />
    </div>
  );
}
