import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const DIRECTIONS = {
  up: { x: 0, y: 42 },
  down: { x: 0, y: -42 },
  left: { x: 60, y: 0 },
  right: { x: -60, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Slides its children in the first time they scroll into view.
 * `index` staggers siblings so a grid cascades instead of popping at once.
 */
export function Reveal({
  children,
  direction = 'up',
  index = 0,
  delay = 0,
  duration = 0.65,
  className,
  as = 'div',
  ...rest
}) {
  const prefersReduced = usePrefersReducedMotion();
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  const MotionTag = motion[as] ?? motion.div;

  if (prefersReduced) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay: delay + index * 0.09,
        ease: [0.25, 1, 0.5, 1],
      }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
