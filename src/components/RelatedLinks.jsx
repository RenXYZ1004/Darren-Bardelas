import { Link } from 'react-router-dom';

export function RelatedLinks({ links }) {
  if (!links?.length) return null;

  return (
    <nav className="page-links" aria-label="Related pages">
      <span className="page-links-label">Continue exploring</span>
      <ul>
        {links.map((link) => (
          <li key={link.to}>
            <Link to={link.to}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
