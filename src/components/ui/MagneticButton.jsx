import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const MotionLink = motion(Link);

/**
 * A button that leans toward the cursor and emits a ripple on click.
 * Renders as <Link>, <a> or <button> depending on the props it receives.
 */
export function MagneticButton({
  children,
  to,
  href,
  className = 'btn',
  strength = 0.32,
  onClick,
  ...rest
}) {
  const prefersReduced = usePrefersReducedMotion();
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);

  const handleMove = useCallback(
    (event) => {
      if (prefersReduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      setOffset({ x: x * strength, y: y * strength });
    },
    [prefersReduced, strength]
  );

  const handleLeave = useCallback(() => setOffset({ x: 0, y: 0 }), []);

  const handleClick = useCallback(
    (event) => {
      if (!prefersReduced && ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const ripple = {
          id: Date.now() + Math.random(),
          size,
          left: event.clientX - rect.left - size / 2,
          top: event.clientY - rect.top - size / 2,
        };
        setRipples((current) => [...current, ripple]);
        setTimeout(
          () => setRipples((current) => current.filter((r) => r.id !== ripple.id)),
          600
        );
      }
      onClick?.(event);
    },
    [prefersReduced, onClick]
  );

  const motionProps = {
    ref,
    className,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    onClick: handleClick,
    animate: { x: offset.x, y: offset.y },
    transition: { type: 'spring', stiffness: 260, damping: 18, mass: 0.4 },
    ...rest,
  };

  const content = (
    <>
      <span>{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.left,
            top: ripple.top,
          }}
        />
      ))}
    </>
  );

  if (to) {
    return (
      <MotionLink to={to} {...motionProps}>
        {content}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a href={href} target="_blank" rel="noopener noreferrer" {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return <motion.button type="button" {...motionProps}>{content}</motion.button>;
}
