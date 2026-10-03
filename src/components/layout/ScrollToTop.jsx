import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * A client-side route change keeps the previous scroll offset, which drops you
 * mid-page on the new route. Reset it on every navigation.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
