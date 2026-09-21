import { Link } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Reveal } from '../components/effects/Reveal';

const items = [
  { to: '/projects', title: 'My Projects', copy: 'Explore recent web apps, IoT builds and UI prototypes.' },
  { to: '/photography', title: 'Photography', copy: 'Browse visual shots, urban captures and photo galleries.' },
  { to: '/certificates', title: 'Certificates', copy: 'View verified awards and technical credentials.' },
  { to: '/about', title: 'About Me', copy: 'Learn more about my background, skills and tools.' },
  { to: '/contact', title: 'Contact', copy: 'Send a direct message or connect on social media.' },
];

export default function MainMenu() {
  return (
    <div className="container">
      <SectionHeader
        title="Main Navigation"
        subtitle="Every corner of the portfolio, one click away."
      />

      <div className="grid-menu">
        {items.map((item, i) => (
          <Reveal key={item.to} index={i} direction="up">
            <Link to={item.to} className="card">
              <span className="card-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
              <span className="card-arrow" aria-hidden="true">
                &rarr;
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
