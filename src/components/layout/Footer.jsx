import { Link } from 'react-router-dom';
import { routes } from '../../routes';
import { BUY_ME_A_COFFEE_URL } from '../../lib/support';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="checker-strip" aria-hidden="true" />
      <footer className="footer">
        <div>
          <div className="footer-brand">
            Darren John L. Bardelas<span>.</span>
          </div>
          <div style={{ marginTop: '0.4rem' }}>
            &copy; {year} — Libarrium
          </div>
        </div>

        <nav className="footer-links" aria-label="Footer">
          {routes.map((route) => (
            <Link key={route.path} to={route.path}>
              {route.label}
            </Link>
          ))}
          <a
            className="footer-support-link"
            href={BUY_ME_A_COFFEE_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span aria-hidden="true">☕</span>
            <span>Buy me a coffee</span>
          </a>
        </nav>
      </footer>
    </>
  );
}
