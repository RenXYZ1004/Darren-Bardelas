import { Fragment } from 'react';
import { motion } from 'framer-motion';
import { home } from '../data/home';
import { MagneticButton } from '../components/ui/MagneticButton';
import { useTypewriter } from '../hooks/useTypewriter';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import avatar from '../assets/home_logo.webp';
import TestimonialsSection from '../components/features/TestimonialsSection';

/** Splits the name so each character can be revealed on its own beat. */
function AnimatedTitle({ text }) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) return <h1 className="hero-title">{text}</h1>;

  let charIndex = 0;
  const words = text.split(' ');

  return (
    <h1 className="hero-title" aria-label={text}>
      {words.map((word, wordIndex) => (
        <Fragment key={`${word}-${wordIndex}`}>
          <span className="title-word">
            {word.split('').map((char) => {
              const index = charIndex++;
              return (
                <motion.span
                  key={`${char}-${index}`}
                  className="char"
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 40, rotateX: -70 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 0.25 + index * 0.028,
                    duration: 0.5,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </h1>
  );
}

export default function Home() {
  const typed = useTypewriter(home.roles);

  return (
    <>
    <section className="hero">
      <div className="hero-text">
        <motion.p
          className="hero-eyebrow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Portfolio 2026
        </motion.p>

        <AnimatedTitle text={home.name} />

        <h2 className="typewriter-subtitle">
          I am a <span className="typed">{typed}</span>
          <span className="cursor" aria-hidden="true">
            |
          </span>
        </h2>

        <motion.p
          className="hero-bio"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {home.bio}
        </motion.p>

        <motion.div
          className="cta-group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <MagneticButton to="/projects" className="btn">
            {home.primaryButton}
          </MagneticButton>
          <MagneticButton to="/contact" className="btn secondary">
            {home.secondaryButton}
          </MagneticButton>
        </motion.div>
      </div>

      <motion.div
        className="hero-visual"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
      >
        <img src={avatar} alt="Darren John L. Bardelas portfolio graphic" className="floating-avatar" width="440" height="440" decoding="async" fetchPriority="high" />
      </motion.div>

      <motion.div
        className="scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.65 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-hidden="true"
      >
        <div className="mouse">
          <div className="wheel" />
        </div>
        <span>Scroll</span>
      </motion.div>
    </section>
    <TestimonialsSection />
    </>
  );
}
