import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

/**
 * Wraps a route so it fades/slides in and out between navigations.
 *
 * NOTE: this applies a transform to its subtree, so anything `position: fixed`
 * (navbar, modals, orbs) must live outside it — see App.jsx and Modal.jsx.
 */
export function PageTransition({ children }) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return <div className="page">{children}</div>;

  return (
    <motion.div
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}
