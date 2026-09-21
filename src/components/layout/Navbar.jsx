import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { routes } from '../../routes';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 900
  );
  const location = useLocation();
  const prefersReduced = usePrefersReducedMotion();

  useLockBodyScroll(open && isMobile);

  // Close the drawer on navigation so the menu never covers the new page.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Esc closes the drawer.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Track the breakpoint; a resize past it must dismiss the drawer, otherwise
  // the desktop nav would inherit the drawer's open state.
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 900px)');
    const onChange = (event) => {
      setIsMobile(event.matches);
      if (!event.matches) setOpen(false);
    };
    mql.addEventListener('change', onChange);
    setIsMobile(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const drawerOpen = open && isMobile;

  const listVariants = {
    closed: { x: '100%' },
    open: {
      x: 0,
      transition: prefersReduced
        ? { duration: 0 }
        : { type: 'spring', stiffness: 320, damping: 34, staggerChildren: 0.06, delayChildren: 0.12 },
    },
  };

  const itemVariants = prefersReduced
    ? {}
    : {
        closed: { opacity: 0, x: 30 },
        open: { opacity: 1, x: 0 },
      };

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <Link to="/" className="logo">
        WELCOME<span>!</span>
      </Link>

      <button
        type="button"
        className={`menu-toggle${drawerOpen ? ' active' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={drawerOpen}
        aria-controls="primary-navigation"
      >
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </button>

      <nav aria-label="Primary">
        <AnimatePresence>
          {drawerOpen && (
            <motion.div
              className="nav-backdrop"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}
        </AnimatePresence>

        {/* On desktop the list is always mounted and CSS lays it out inline. */}
        {isMobile ? (
          <AnimatePresence>
            {drawerOpen && (
              <motion.ul
                id="primary-navigation"
                className="nav-links"
                variants={listVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {routes.map((route) => (
                  <motion.li key={route.path} variants={itemVariants}>
                    <NavLink to={route.path} end={route.end}>
                      {route.label}
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        ) : (
          <ul id="primary-navigation" className="nav-links">
            {routes.map((route) => (
              <li key={route.path}>
                <NavLink to={route.path} end={route.end}>
                  {route.label}
                </NavLink>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
