import { motion } from 'framer-motion';
import { about } from '../data/about';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/effects/Reveal';
import { SocialIcon } from '../components/ui/SocialIcon';
import { useCountUp } from '../hooks/useCountUp';
import profilePic from '../assets/home_logo.webp';
import { RelatedLinks } from '../components/RelatedLinks';

function Stat({ value, suffix, label }) {
  const [ref, current] = useCountUp(value);

  return (
    <div ref={ref}>
      <div className="stat-value">
        {current}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function About() {
  return (
    <div className="container">
      <SectionHeader title={about.title} />

      <div className="about-layout">
        <motion.div
          className="about-visual"
          initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
        >
          <img
            src={profilePic}
            alt="Darren John L. Bardelas"
            className="profile-pic"
            width="220"
            height="220"
            decoding="async"
            fetchPriority="high"
          />
        </motion.div>

        <div className="about-body">
          <Reveal as="p" className="bio" direction="up">
            {about.bio}
          </Reveal>

          <div className="skills">
            {about.skills.map((skill, i) => (
              <Reveal key={skill} as="span" className="tag" index={i} direction="up" duration={0.45}>
                {skill}
              </Reveal>
            ))}
          </div>

          <div className="stats-row">
            {about.stats.map((stat) => (
              <Stat key={stat.label} {...stat} />
            ))}
          </div>

          <div className="social-links">
            {about.socials.map((social, i) => (
              <Reveal key={social.name} index={i} direction="up" duration={0.45}>
                <a
                  className="social-btn"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <SocialIcon name={social.icon} />
                </a>
              </Reveal>
            ))}
          </div>
          <RelatedLinks links={[
            { to: '/projects', label: 'Projects' },
            { to: '/photography', label: 'Photography' },
            { to: '/contact', label: 'Contact' },
          ]} />
        </div>
      </div>
    </div>
  );
}
