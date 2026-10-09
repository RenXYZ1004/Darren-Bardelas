import { useEffect, useState } from 'react';
import { getApprovedTestimonials, isSupabaseConfigured } from '../../lib/testimonialApi';

function Stars({ rating }) {
  return (
    <span className="testimonial-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true" className={index < rating ? 'is-filled' : ''}>★</span>
      ))}
    </span>
  );
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(undefined, { month: 'short', year: 'numeric' }).format(date);
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => { active = false; };
    }

    getApprovedTestimonials()
      .then((rows) => {
        if (active) setTestimonials(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  // Do not render a public testimonials section until at least one review has
  // been approved. This avoids an empty or misleading section on the homepage.
  if (!loading && (failed || testimonials.length === 0)) return null;
  if (!isSupabaseConfigured) return null;

  return (
    <section className="testimonials-section" aria-labelledby="testimonials-heading">
      <div className="testimonials-inner">
        <div className="testimonials-heading-row">
          <div>
            <p className="testimonials-kicker">Words from people I’ve worked with</p>
            <h2 id="testimonials-heading" className="testimonials-title">Kind words<span>.</span></h2>
            <p className="testimonials-intro">A few notes from collaborators, clients, and people who have experienced my work.</p>
          </div>
        </div>

        {loading ? (
          <div className="testimonials-loading" aria-live="polite">Loading testimonials…</div>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <article className="testimonial-card" key={item.id}>
                <div className="testimonial-card-top">
                  <Stars rating={item.rating} />
                  <span className="testimonial-quote-mark" aria-hidden="true">“</span>
                </div>
                <blockquote>{item.message}</blockquote>
                <div className="testimonial-author">
                  <span className="testimonial-avatar" aria-hidden="true">{(item.name || '?').trim().charAt(0).toUpperCase()}</span>
                  <span className="testimonial-author-copy">
                    <strong>{item.name}</strong>
                    {item.affiliation ? <span>{item.affiliation}</span> : null}
                  </span>
                  <time dateTime={item.created_at}>{formatDate(item.created_at)}</time>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
