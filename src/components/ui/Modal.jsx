import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Portalled overlay shell. Rendering into document.body keeps it out of the
 * route wrapper, whose transform would otherwise become the containing block
 * for `position: fixed` and pin the overlay to the page instead of the screen.
 *
 * Handles Esc, backdrop clicks, focus trapping and restoring focus on close.
 */
export function Modal({ onClose, labelledBy, children, className = 'modal-content' }) {
  const contentRef = useRef(null);
  const previouslyFocused = useRef(null);

  useLockBodyScroll(true);

  useEffect(() => {
    previouslyFocused.current = document.activeElement;
    // Move focus into the dialog so screen readers and the keyboard follow it.
    const timer = setTimeout(() => {
      const first = contentRef.current?.querySelector(FOCUSABLE);
      (first ?? contentRef.current)?.focus();
    }, 30);

    return () => {
      clearTimeout(timer);
      previouslyFocused.current?.focus?.();
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !contentRef.current) return;

      const focusable = Array.from(contentRef.current.querySelectorAll(FOCUSABLE)).filter(
        (node) => node.offsetParent !== null
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  return createPortal(
    <motion.div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <motion.div
        ref={contentRef}
        className={className}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>,
    document.body
  );
}
