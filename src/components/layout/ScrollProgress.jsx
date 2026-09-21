import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin accent bar across the top that tracks how far down the page you are. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}
