import { Link } from 'react-router-dom';
import { routes } from '../../routes';

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
        </nav>
      </footer>
    </>
  );
}
