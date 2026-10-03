
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/effects/Reveal';
import { RelatedLinks } from '../components/RelatedLinks';

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xzepajka';

const EMPTY = {
  name: '',
  email: '',
  message: '',
};

function validate(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Please enter your name.';
  }

  if (!values.email.trim()) {
    errors.email = 'Please enter your email address.';
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
  ) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Please write a message.';
  }

  return errors;
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
    }));

    if (status === 'error') {
      setStatus('idle');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setStatus('sending');

    try {
      const formData = new FormData(event.currentTarget);

      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Form submission failed');
      }

      setValues(EMPTY);
      setErrors({});
      setStatus('sent');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="container">
      <SectionHeader
        title="Get In Touch"
        subtitle="Have a project in mind, a question, or just want to say hello? Send a message and I will get back to you."
      />

      <div className="contact-layout">
        <Reveal direction="up">
          <motion.form
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Name */}
            <div className="field">
              <label htmlFor="name">Your Name</label>

              <input
                id="name"
                name="name"
                type="text"
                value={values.name}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                aria-invalid={Boolean(errors.name)}
              />

              {errors.name && (
                <span className="field-error">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="field">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="DarrenJohnLibarraBardelas@Gmail.Com"
                aria-invalid={Boolean(errors.email)}
              />

              {errors.email && (
                <span className="field-error">
                  {errors.email}
                </span>
              )}
            </div>

            {/* Message */}
            <div className="field">
              <label htmlFor="message">Message</label>

              <textarea
                id="message"
                name="message"
                rows={6}
                value={values.message}
                onChange={handleChange}
                placeholder="How can I help you?"
                aria-invalid={Boolean(errors.message)}
              />

              <div className="message-meta">
                {errors.message ? (
                  <span className="field-error">
                    {errors.message}
                  </span>
                ) : (
                  <span>
                    Tell me a little about your project.
                  </span>
                )}

                <span>
                  {values.message.length} characters
                </span>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              className="contact-submit"
              disabled={status === 'sending'}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {status === 'sending'
                ? 'Sending...'
                : 'Send Message'}
            </motion.button>

            {/* Status */}
            <AnimatePresence mode="wait">
              {status === 'sent' && (
                <motion.div
                  key="sent"
                  className="form-status success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <strong>Message sent.</strong>
                  <span>
                    Thanks for reaching out. I will get back to
                    you soon.
                  </span>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  key="error"
                  className="form-status error"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                >
                  <strong>Unable to send.</strong>
                  <span>
                    Please try again in a moment.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </Reveal>

        {/* Contact information */}
        <Reveal direction="up" delay={0.15}>
          <motion.section
            className="contact-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <span className="eyebrow">CONTACT</span>

            <h2>Let's work together.</h2>

            <p>
              Have an idea, project, or opportunity? Send me a
              message and let's start a conversation.
            </p>

            <div className="contact-details">
              <a
                href="mailto:DarrenJohnLibarraBardelas@Gmail.Com"
                className="contact-detail"
              >
                <span>Email</span>
                <strong>DarrenJohnLibarraBaedelas@Gmail.Com</strong>
              </a>

              <div className="contact-detail">
                <span>Availability</span>
                <strong>Open to selected projects</strong>
              </div>
            </div>
          </motion.section>
        </Reveal>
      </div>
      <RelatedLinks links={[
        { to: '/projects', label: 'Projects' },
        { to: '/about', label: 'About' },
        { to: '/photography', label: 'Photography' },
      ]} />
    </div>
  );
}

