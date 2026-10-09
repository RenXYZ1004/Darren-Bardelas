import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  deleteTestimonial,
  getAllTestimonialsForAdmin,
  isSupabaseConfigured,
  restoreTestimonialAdmin,
  signInTestimonialAdmin,
  signOutTestimonialAdmin,
  updateTestimonialStatus,
} from '../lib/testimonialApi';

const filters = [
  { value: 'all', label: 'All reviews' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Published' },
  { value: 'rejected', label: 'Rejected' },
];

function prettyDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown date';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function Rating({ value }) {
  return <span className="admin-rating" aria-label={`${value} out of 5 stars`}>{'★'.repeat(value)}<span>{'★'.repeat(5 - value)}</span></span>;
}

export default function TestimonialAdmin() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [workingId, setWorkingId] = useState('');
  const [authError, setAuthError] = useState('');
  const [dashboardError, setDashboardError] = useState('');
  const [notice, setNotice] = useState('');

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true);
    setDashboardError('');
    try {
      const result = await getAllTestimonialsForAdmin();
      setReviews(Array.isArray(result) ? result : []);
    } catch (error) {
      setDashboardError(error?.message || 'Could not load reviews.');
    } finally {
      setLoadingReviews(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    restoreTestimonialAdmin()
      .then((restoredUser) => {
        if (!active) return;
        if (restoredUser) {
          setUser(restoredUser);
          return loadReviews();
        }
        return undefined;
      })
      .catch(() => {})
      .finally(() => {
        if (active) setCheckingAuth(false);
      });
    return () => { active = false; };
  }, [loadReviews]);

  const counts = useMemo(() => ({
    all: reviews.length,
    pending: reviews.filter((item) => item.status === 'pending').length,
    approved: reviews.filter((item) => item.status === 'approved').length,
    rejected: reviews.filter((item) => item.status === 'rejected').length,
  }), [reviews]);

  const visibleReviews = useMemo(() => (
    filter === 'all' ? reviews : reviews.filter((item) => item.status === filter)
  ), [filter, reviews]);

  async function handleLogin(event) {
    event.preventDefault();
    setAuthError('');
    setNotice('');
    setCheckingAuth(true);
    try {
      const signedInUser = await signInTestimonialAdmin(email, password);
      setUser(signedInUser);
      setPassword('');
      await loadReviews();
    } catch (error) {
      setAuthError(error?.message || 'Unable to sign in. Check your credentials and admin access.');
    } finally {
      setCheckingAuth(false);
    }
  }

  async function handleStatusChange(review, status) {
    setWorkingId(review.id);
    setDashboardError('');
    setNotice('');
    try {
      await updateTestimonialStatus(review.id, status);
      setReviews((current) => current.map((item) => item.id === review.id ? { ...item, status } : item));
      setNotice(status === 'approved' ? 'Testimonial published on the homepage.' : status === 'rejected' ? 'Testimonial rejected and hidden.' : 'Testimonial moved back to pending.');
    } catch (error) {
      setDashboardError(error?.message || 'Could not update this review.');
    } finally {
      setWorkingId('');
    }
  }

  async function handleDelete(review) {
    const confirmed = window.confirm(`Permanently delete the testimonial from ${review.name}? This cannot be undone.`);
    if (!confirmed) return;

    setWorkingId(review.id);
    setDashboardError('');
    setNotice('');
    try {
      await deleteTestimonial(review.id);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      setNotice('Testimonial permanently deleted.');
    } catch (error) {
      setDashboardError(error?.message || 'Could not delete this review.');
    } finally {
      setWorkingId('');
    }
  }

  async function handleLogout() {
    await signOutTestimonialAdmin();
    setUser(null);
    setReviews([]);
    setNotice('');
    setDashboardError('');
  }

  return (
    <section className="testimonial-admin-page">
      <div className="admin-shell">
        <header className="admin-topbar">
          <a href="/" className="feedback-brand" aria-label="Portfolio home">DJB<span>.</span></a>
          <span className="admin-topbar-label"><span className="admin-live-dot" /> TESTIMONIAL CONTROL ROOM</span>
        </header>

        {!isSupabaseConfigured ? (
          <section className="admin-login-panel">
            <p className="admin-eyebrow">Setup required</p>
            <h1>Connect Supabase<span>.</span></h1>
            <p>Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to your local and deployment environment variables, then run the SQL setup included with this project.</p>
          </section>
        ) : checkingAuth ? (
          <section className="admin-login-panel" aria-live="polite"><p className="admin-eyebrow">Secure access</p><h1>Checking session<span>.</span></h1><p>Verifying dashboard access…</p></section>
        ) : !user ? (
          <section className="admin-login-panel">
            <p className="admin-eyebrow">Private area · Authorized accounts only</p>
            <h1>Review management<span>.</span></h1>
            <p>Sign in with the Supabase account granted testimonial administrator access. The URL alone does not grant access.</p>
            <form className="admin-login-form" onSubmit={handleLogin}>
              <div className="feedback-field">
                <label htmlFor="admin-email">Admin email</label>
                <input id="admin-email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" />
              </div>
              <div className="feedback-field">
                <label htmlFor="admin-password">Password</label>
                <input id="admin-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="Your Supabase account password" />
              </div>
              {authError ? <div className="feedback-alert feedback-alert-error" role="alert">{authError}</div> : null}
              <button className="feedback-submit" type="submit" disabled={checkingAuth}>{checkingAuth ? 'Signing in…' : 'Sign in securely'} <span aria-hidden="true">↗</span></button>
            </form>
          </section>
        ) : (
          <section className="admin-dashboard">
            <div className="admin-heading-row">
              <div>
                <p className="admin-eyebrow">Signed in as {user.email}</p>
                <h1>Testimonials<span>.</span></h1>
                <p className="admin-subtitle">Review every submission. Only published testimonials appear on the public homepage.</p>
              </div>
              <div className="admin-header-actions">
                <button type="button" className="admin-refresh-button" onClick={loadReviews} disabled={loadingReviews}>{loadingReviews ? 'Refreshing…' : '↻ Refresh'}</button>
                <button type="button" className="admin-logout-button" onClick={handleLogout}>Sign out</button>
              </div>
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat"><span>Total submissions</span><strong>{counts.all}</strong></div>
              <div className="admin-stat"><span>Awaiting review</span><strong>{counts.pending}</strong></div>
              <div className="admin-stat"><span>Published</span><strong>{counts.approved}</strong></div>
              <div className="admin-stat"><span>Rejected</span><strong>{counts.rejected}</strong></div>
            </div>

            <div className="admin-list-heading">
              <h2>Submission inbox</h2>
              <div className="admin-filter-tabs" role="tablist" aria-label="Filter testimonials">
                {filters.map((item) => (
                  <button key={item.value} type="button" role="tab" aria-selected={filter === item.value} className={filter === item.value ? 'active' : ''} onClick={() => setFilter(item.value)}>
                    {item.label}<span>{counts[item.value]}</span>
                  </button>
                ))}
              </div>
            </div>

            {notice ? <div className="feedback-alert feedback-alert-success" role="status">{notice}</div> : null}
            {dashboardError ? <div className="feedback-alert feedback-alert-error" role="alert">{dashboardError}</div> : null}

            {loadingReviews ? (
              <div className="admin-empty-state">Loading submissions…</div>
            ) : visibleReviews.length === 0 ? (
              <div className="admin-empty-state"><span aria-hidden="true">✳</span><h3>No {filter === 'all' ? '' : filter} reviews yet</h3><p>New submissions will appear here as soon as they arrive.</p></div>
            ) : (
              <div className="admin-review-list">
                {visibleReviews.map((review) => (
                  <article className="admin-review-card" key={review.id}>
                    <div className="admin-review-card-top">
                      <div className="admin-review-person">
                        <span className="testimonial-avatar" aria-hidden="true">{(review.name || '?').trim().charAt(0).toUpperCase()}</span>
                        <div><strong>{review.name}</strong><span>{review.affiliation || 'No project or relationship provided'}</span></div>
                      </div>
                      <span className={`admin-status status-${review.status}`}>{review.status}</span>
                    </div>
                    <div className="admin-review-meta"><Rating value={review.rating} /><time dateTime={review.created_at}>{prettyDate(review.created_at)}</time></div>
                    <blockquote className="admin-review-message">“{review.message}”</blockquote>
                    <div className="admin-review-actions">
                      {review.status !== 'approved' ? <button type="button" className="admin-action-button approve" onClick={() => handleStatusChange(review, 'approved')} disabled={workingId === review.id}>{workingId === review.id ? 'Saving…' : 'Approve & publish'}</button> : <button type="button" className="admin-action-button neutral" onClick={() => handleStatusChange(review, 'pending')} disabled={workingId === review.id}>Unpublish</button>}
                      {review.status !== 'rejected' ? <button type="button" className="admin-action-button neutral" onClick={() => handleStatusChange(review, 'rejected')} disabled={workingId === review.id}>Reject</button> : <button type="button" className="admin-action-button neutral" onClick={() => handleStatusChange(review, 'pending')} disabled={workingId === review.id}>Restore to pending</button>}
                      <button type="button" className="admin-action-button delete" onClick={() => handleDelete(review)} disabled={workingId === review.id}>Delete</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
        <footer className="admin-footer">PRIVATE ADMIN AREA <span>•</span> Portfolio testimonials</footer>
      </div>
    </section>
  );
}
