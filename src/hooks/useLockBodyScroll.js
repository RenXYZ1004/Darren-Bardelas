import { useLayoutEffect } from 'react';

/**
 * Freezes background scrolling while a drawer/modal is open, compensating for
 * the scrollbar width so the layout does not jump sideways on open.
 */
export function useLockBodyScroll(locked) {
  useLayoutEffect(() => {
    if (!locked) return undefined;

    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [locked]);
}
