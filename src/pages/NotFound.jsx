import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="notfound" aria-labelledby="notfound-title">
      <div>
        <p className="eyebrow">404</p>
        <h1 id="notfound-title">Page Not Found</h1>
        <p className="page-subtitle">
          The page you requested does not exist. Use the portfolio navigation to continue exploring.
        </p>
        <Link to="/" className="btn">
          <span>Back Home</span>
        </Link>
      </div>
    </section>
  );
}
