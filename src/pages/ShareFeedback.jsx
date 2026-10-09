import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isSupabaseConfigured, submitTestimonial } from '../lib/testimonialApi';

const initialForm = { name: '', affiliation: '', rating: 5, message: '', website: '' };

export default function ShareFeedback() {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ submitting: false, error: '', success: false });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setState({ submitting: true, error: '', success: false });

    // Honeypot field: quietly discard likely automated spam without exposing
    // a different response to bots. It is never sent to Supabase.
    if (form.website.trim()) {
      setForm(initialForm);
      setState({ submitting: false, error: '', success: true });
      return;
    }

    try {
      await submitTestimonial(form);
      setForm(initialForm);
      setState({ submitting: false, error: '', success: true });
    } catch (error) {
      setState({ submitting: false, error: error?.message || 'Something went wrong. Please try again.', success: false });
    }
  }

  return (
    <section className="feedback-page">
      <div className="feedback-shell">
        <Link to="/" className="feedback-brand" aria-label="Back to portfolio">DJB<span>.</span></Link>
        <div className="feedback-panel">
          <p className="feedback-kicker">A quick note means a lot</p>
          <h1>Share your experience<span>.</span></h1>
          <p className="feedback-description">Thank you for taking a moment to share your experience working with me. Your feedback helps me keep learning and improving.</p>

          {!isSupabaseConfigured ? (
            <div className="feedback-alert feedback-alert-error" role="alert">
              This form is not connected yet. Please contact the portfolio owner to finish the Supabase setup.
            </div>
          ) : state.success ? (
            <div className="feedback-success" role="status">
              <span className="feedback-success-icon" aria-hidden="true">✓</span>
              <h2>Thank you for your feedback.</h2>
              <p>Your review has been submitted for moderation. It will appear on the portfolio only if it is approved.</p>
              <button type="button" className="feedback-submit" onClick={() => setState({ submitting: false, error: '', success: false })}>Submit another review</button>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
              <div className="feedback-field">
                <label htmlFor="review-name">Your name <span aria-hidden="true">*</span></label>
                <input id="review-name" name="name" value={form.name} onChange={updateField} minLength={2} maxLength={80} autoComplete="name" required placeholder="Name you'd like displayed" />
              </div>

              <div className="feedback-field">
                <label htmlFor="review-affiliation">Project or relationship <span className="feedback-optional">Optional</span></label>
                <input id="review-affiliation" name="affiliation" value={form.affiliation} onChange={updateField} maxLength={100} placeholder="e.g. Website client, classmate, collaborator" />
              </div>

              <fieldset className="feedback-field feedback-rating-field">
                <legend>Your rating <span aria-hidden="true">*</span></legend>
                <div className="rating-picker" role="radiogroup" aria-label="Choose a rating from 1 to 5 stars">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      type="button"
                      key={rating}
                      className={`rating-choice ${rating <= Number(form.rating) ? 'selected' : ''}`}
                      role="radio"
                      aria-checked={Number(form.rating) === rating}
                      aria-label={`${rating} ${rating === 1 ? 'star' : 'stars'}`}
                      onClick={() => setForm((current) => ({ ...current, rating }))}
                    >★</button>
                  ))}
                  <span className="rating-value">{form.rating} / 5</span>
                </div>
              </fieldset>

              <div className="feedback-field">
                <div className="feedback-label-row">
                  <label htmlFor="review-message">Your testimonial <span aria-hidden="true">*</span></label>
                  <span className="feedback-optional">{form.message.length}/1200</span>
                </div>
                <textarea id="review-message" name="message" value={form.message} onChange={updateField} minLength={20} maxLength={1200} required rows={6} placeholder="What was your experience like? What stood out to you?" />
                <p className="feedback-field-hint">Please write at least 20 characters.</p>
              </div>

              <div className="feedback-honeypot" aria-hidden="true">
                <label htmlFor="review-website">Leave this field empty</label>
                <input id="review-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={updateField} />
              </div>

              {state.error ? <div className="feedback-alert feedback-alert-error" role="alert">{state.error}</div> : null}

              <button className="feedback-submit" type="submit" disabled={state.submitting || !isSupabaseConfigured}>
                {state.submitting ? 'Submitting…' : 'Submit testimonial'}
                {!state.submitting ? <span aria-hidden="true">↗</span> : null}
              </button>
              <p className="feedback-privacy-note">Your review stays private until it is reviewed and approved. Your contact details are not requested by this form.</p>
            </form>
          )}
        </div>
        <p className="feedback-footer">Darren John L. Bardelas · Portfolio</p>
      </div>
    </section>
  );
}
